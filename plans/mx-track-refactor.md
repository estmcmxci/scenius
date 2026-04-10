# Plan: MX — Per-Track Prediction Refactor

**Status:** Active
**Milestone:** MX (prerequisite for M8)
**Owner:** Solo builder
**Updated:** 2026-04-10

## Problem

The current implementation predicts on an artist's total catalog plays (aggregated
from all tracks). The PRD and research spec define predictions as per-track:
"Will this track exceed τ cumulative streams within the horizon?"

This is a structural misalignment that must be fixed before real predictions can
be seeded (M8).

## Goal

Refactor the data model, services, and UI so that predictions are anchored to a
specific SoundCloud track — not an artist catalog. The tastemaker pastes a track
URL, sees that track's play count, sets a threshold, and the resolution cron
compares the track's play delta against the threshold.

## SoundCloud API Surface

```
GET /resolve?url={track_permalink}
  → Returns track object with: id, title, playback_count, likes_count,
    reposts_count, comment_count, artwork_url, permalink_url, user { id, username }

GET /tracks/{id}
  → Same track object, by ID directly
```

The `/resolve` endpoint already handles track URLs — if you paste a track URL,
it returns the track object (not the user). Our SC client already detects
`kind === 'track'` in resolve but currently extracts the user from it.

## Layers (build order)

### Layer 1 — Schema

New tables:

```sql
CREATE TABLE tracks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  soundcloud_id   BIGINT UNIQUE,
  title           TEXT NOT NULL,
  permalink_url   TEXT,
  artwork_url     TEXT,
  artist_id       UUID REFERENCES artists(id),
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE track_snapshots (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id        UUID NOT NULL REFERENCES tracks(id),
  playback_count  BIGINT,
  likes_count     BIGINT,
  reposts_count   BIGINT,
  comment_count   BIGINT,
  taken_at        TIMESTAMPTZ NOT NULL
);
```

Alter predictions:

```sql
ALTER TABLE predictions ADD COLUMN track_id UUID REFERENCES tracks(id);
ALTER TABLE predictions ADD COLUMN track_snapshot_id UUID REFERENCES track_snapshots(id);
ALTER TABLE predictions ADD COLUMN resolution_track_snapshot_id UUID REFERENCES track_snapshots(id);
```

Keep existing `artist_id`, `snapshot_id` columns for now (backward compat with
seeded data). New predictions use `track_id` + `track_snapshot_id`. Resolution
uses `resolution_track_snapshot_id`.

Files:
- `app/domains/soundcloud/repo/schema.ts` — add tracks, trackSnapshots tables
- `app/domains/predictions/repo/schema.ts` — add trackId, trackSnapshotId columns
- New Drizzle migration

### Layer 2 — SC Client + Types

Update `sc-client.ts`:
- `resolve()` already detects tracks — change to return both user and track when URL is a track
- Add `getTrack(id: number): Promise<ScTrack>` method
- Add `resolveTrackUrl(url: string): Promise<{ user: ScUser; track: ScTrack }>` method

Update types:
- `app/domains/soundcloud/types/snapshot.ts` — add `TrackSnapshotResult` interface
- `app/domains/soundcloud/types/sc-track.ts` — already has ScTrackSchema, may need `permalink_url` and `user` fields added

New service:
- `app/domains/soundcloud/service/track-snapshot.ts` — `takeTrackSnapshot(trackUrl, clientId, clientSecret)` returns track + artist + snapshot data

Files:
- `app/domains/soundcloud/service/sc-client.ts`
- `app/domains/soundcloud/service/track-snapshot.ts` (new)
- `app/domains/soundcloud/types/snapshot.ts`
- `app/domains/soundcloud/types/sc-track.ts`

### Layer 3 — Repos + Services

Track repo:
- `app/domains/soundcloud/repo/track-repo.ts` (new) — `upsertTrack()`, `insertTrackSnapshot()`

Update prediction creation:
- `app/domains/predictions/service/prediction-service.ts` — `submitPrediction()` calls `takeTrackSnapshot()` instead of `takeSnapshot()`, links to track + track snapshot
- `app/domains/predictions/types/create-prediction.ts` — `url` now accepts track URLs

Update resolution:
- `app/domains/resolution/repo/due-predictions.ts` — join with tracks table to get track permalink URL
- `app/domains/resolution/service/weekly-resolution.ts` — resolve against track's playback_count delta, not catalog totalPlays
- Snapshot cron: snapshot individual tracks with pending predictions, not entire artist catalogs

Update feed:
- `app/domains/feed/types/feed-item.ts` — add `trackName`, `trackArtworkUrl`; `snapshotPlays` now means track plays
- `app/domains/feed/repo/feed-repo.ts` — join with tracks + track_snapshots instead of catalog_snapshots
- `app/domains/feed/service/feed-service.ts` — map track fields

### Layer 4 — CLI + API

CLI:
- `preview` — accepts track URL, shows track title + play count + artist
- `predict` — accepts track URL instead of artist URL
- `seed` — seeds with specific tracks, not just artists
- `resolve` — updated to use track-level delta
- `feed` — shows track name + track plays
- `snapshot-all` — snapshots tracks with pending predictions

API:
- `POST /api/snapshots` — accepts track URL, returns track + snapshot data
- `POST /api/predictions` — links to track

### Layer 5 — UI

- `app/components/artist-preview.tsx` → refactor to `track-preview.tsx` — shows track title, artwork, play count, artist name, SC attribution
- `app/components/feed-card.tsx` — shows track name, track plays
- `app/predictions/[id]/page.tsx` — "Track at prediction time" section with track-specific metrics
- `app/submit/page.tsx` — paste track URL, see track preview
- `app/components/prediction-card.tsx` — add track name

## What stays the same

- Artist table and artist data — kept for context display
- Tastemaker system — unchanged
- Reputation scoring — unchanged (operates on prediction outcomes, not snapshot structure)
- EAS attestations — unchanged (encodes prediction outcome, not snapshot details)
- Para auth — unchanged
- Nav, layout, resolved page — unchanged (inherit from feed card updates)

## Migration strategy

- Add new tables + columns via Drizzle migration (additive, non-breaking)
- Old seeded data with catalog-level snapshots will be stale but won't break
- Re-seed after refactor with track-level data
- No need to migrate old predictions — just re-seed

## Issue breakdown (suggested)

1. Schema: add tracks + track_snapshots tables, update predictions schema
2. SC client: track resolution + track snapshot service
3. Track repo + prediction service refactor
4. Resolution service: track-level delta
5. CLI + API updates
6. UI: track preview, feed cards, prediction detail
