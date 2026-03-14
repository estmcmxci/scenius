---
name: soundcloud
description:
  Read-only SoundCloud API skill for Scenius. Resolve SC URLs to metadata,
  search tracks/users, and snapshot artist catalogs with aggregated metrics.
  Use when asked to look up an artist, resolve a SoundCloud link, search for
  tracks, or take a catalog snapshot.
triggers:
  - "resolve this SoundCloud URL"
  - "get metrics for this artist"
  - "search SoundCloud for"
  - "snapshot this artist"
  - "look up track stats"
  - "SC lookup"
---

# SoundCloud Skill

## Purpose

Read-only access to SoundCloud public data via client credentials auth.
This is the data layer for Scenius predictions — all prediction resolution
is computed from SC metrics.

## Available Scripts

All scripts use bash + curl + python3 stdlib only. Credentials are read
from env vars `SOUNDCLOUD_CLIENT_ID` and `SOUNDCLOUD_CLIENT_SECRET`.

### sc-token.sh
Acquire and cache a bearer token. Cached in `/tmp/.sc_token` for ~58 minutes.
Called automatically by the other scripts.

```bash
./sc-token.sh
# outputs: bearer token string
```

### sc-resolve.sh
Resolve any SoundCloud permalink URL to structured metadata.

```bash
./sc-resolve.sh https://soundcloud.com/kaytranada
# outputs: JSON user or track object with key fields
```

### sc-search.sh
Search for tracks or users by query.

```bash
./sc-search.sh tracks "lo-fi beats" 10
./sc-search.sh users "kaytranada"
# outputs: JSON array of results
```

### sc-snapshot.sh
The core Scenius operation. Takes a user ID or SC URL and returns the full
artist profile + up to 50 tracks + aggregated catalog totals.

```bash
./sc-snapshot.sh https://soundcloud.com/travisscott-2
./sc-snapshot.sh 40174345
# outputs: JSON with artist profile, catalog_totals, and tracks array
```

Output includes `catalog_totals` with aggregated `plays`, `likes`,
`reposts`, `comments`, and `tracks_fetched` — matching the fields
needed for `catalog_snapshots` in the Scenius data model.

## Auth

Client credentials flow against `https://secure.soundcloud.com/oauth/token`.
Token limit: 50 tokens per 12h per app, 30 per hour per IP.
Scripts cache the token to avoid burning quota.

## Constraints

- Read-only. No writes to SoundCloud.
- Never log or print credentials.
- All query params URL-encoded via python3 urllib.
- Null/missing numeric fields default to 0.
- Max 50 tracks per snapshot (sufficient for MVP).
- SoundCloud attribution required on any surface displaying this data.
