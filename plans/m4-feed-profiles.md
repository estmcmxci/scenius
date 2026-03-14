# Plan: M4 — Discovery Feed + Tastemaker Profiles

**Status:** Ready
**Milestone:** M4 (Apr 4)
**Depends on:** M3 (snapshot pipeline live, DB populated)
**Updated:** 2026-03-14

## Goal

Build the two primary read surfaces: a discovery feed showing prediction cards, and tastemaker profile pages showing track records. Seed the DB with real data (artists, snapshots, tastemakers, predictions) so the app has content to display. By the end of M4, a visitor can browse `/` and click into `/predictions/[id]` and `/tastemakers/[id]`.

---

## Issues

### SCE-M4-1: Seed data CLI command

**Title:** Add `pnpm cli seed` command to populate DB with real predictions

**Description:**
Create `app/cli/seed.ts` — a CLI command that:
1. Snapshots 3-5 real SC artists (e.g. Kaytranada, Knxwledge, Ravyn Lenae, Noname, Saba)
2. Creates 1-2 tastemaker records with placeholder data
3. Creates 2-3 predictions linking tastemakers → artists → snapshots
4. Creates 1-2 posts linked to predictions

This gives the feed and profile pages real data to render. Use the existing `takeSnapshot()` + repo layer.

Wire up in `app/cli/index.ts` as the `seed` subcommand.

**Acceptance criteria:**
- [ ] `pnpm cli seed` populates all 5 tables with realistic data
- [ ] Running seed twice doesn't create duplicates (upsert artists, check before insert)
- [ ] At least 3 artists, 2 tastemakers, 3 predictions, 1 post created
- [ ] All predictions have valid `snapshot_id` references

**Files:** `app/cli/seed.ts`, `app/cli/index.ts`

---

### SCE-M4-2: Feed service + repo layer

**Title:** Implement feed domain service and repo for listing predictions

**Description:**
Build the data access layer for the discovery feed:
- `app/domains/feed/repo/feed-repo.ts` — query predictions joined with artists, tastemakers, and snapshots. Support filtering by outcome status and sorting by recency.
- `app/domains/feed/service/feed-service.ts` — orchestrate the query, shape the response into a `FeedItem[]` type.
- `app/domains/feed/types/feed-item.ts` — TypeScript type for a feed card (prediction title, artist name, tastemaker name, reputation score, current metrics, outcome status).

Follow the layer model: `types → repo → service`.

**Acceptance criteria:**
- [ ] `FeedItem` type defined with all fields needed for a prediction card
- [ ] `getFeedItems(filters?)` returns predictions with joined artist + tastemaker data
- [ ] Supports filtering by outcome: `pending`, `resolved`, or `all`
- [ ] Results sorted by `created_at DESC`

**Files:** `app/domains/feed/types/feed-item.ts`, `app/domains/feed/repo/feed-repo.ts`, `app/domains/feed/service/feed-service.ts`

---

### SCE-M4-3: Discovery feed page (/)

**Title:** Build the discovery feed UI at the root route

**Description:**
Replace the placeholder `app/page.tsx` with the discovery feed. This is a server component that calls the feed service and renders prediction cards.

Each card shows:
- Artist name + avatar (from SC snapshot)
- Prediction: "{tastemaker} predicts {artist} will hit {threshold} streams in {horizon}"
- Current total plays from latest snapshot
- Tastemaker reputation score
- Outcome badge (pending / yes / no)
- Link to `/predictions/[id]`

Use Tailwind for styling. Keep it simple — editorial feel, not crypto app.

**Acceptance criteria:**
- [ ] `/` renders a list of prediction cards from real DB data
- [ ] Each card links to `/predictions/[id]`
- [ ] Cards show artist name, prediction summary, tastemaker name, outcome status
- [ ] Empty state shown when no predictions exist
- [ ] Server component — no client-side data fetching

**Files:** `app/page.tsx`, `app/components/prediction-card.tsx` (if extracted)

---

### SCE-M4-4: Prediction detail page (/predictions/[id])

**Title:** Build the prediction detail page

**Description:**
Create `app/predictions/[id]/page.tsx` — a server component that shows the full prediction with artist context.

Display:
- Prediction details (threshold, horizon, outcome, created_at)
- Artist metadata (username, followers, city — from SC snapshot)
- Catalog totals from the creation snapshot (plays, likes, reposts, comments)
- Tastemaker info (name, reputation score)
- SoundCloud attribution (required by ToS — link to artist's SC page)

This page is the shareable unit. The URL `/predictions/[id]` is what gets shared on social.

**Acceptance criteria:**
- [ ] `/predictions/[id]` renders prediction with full context
- [ ] Shows artist metadata from snapshot (not live SC data)
- [ ] Shows tastemaker name + reputation score
- [ ] Includes SoundCloud attribution link
- [ ] 404 page for invalid prediction ID
- [ ] Server component with no client-side fetching

**Files:** `app/predictions/[id]/page.tsx`, `app/domains/predictions/repo/prediction-repo.ts`, `app/domains/predictions/service/prediction-service.ts`

---

### SCE-M4-5: Tastemaker profile page (/tastemakers/[id])

**Title:** Build the tastemaker profile page

**Description:**
Create `app/tastemakers/[id]/page.tsx` — shows a tastemaker's profile and prediction track record.

Display:
- Display name, reputation score
- List of their predictions (reuse prediction card component)
- Stats: total predictions, correct %, average reputation delta

Build the backing repo + service:
- `app/domains/tastemakers/repo/tastemaker-repo.ts` — get tastemaker by ID, get predictions by tastemaker
- `app/domains/tastemakers/service/tastemaker-service.ts` — compute stats, assemble profile

**Acceptance criteria:**
- [ ] `/tastemakers/[id]` renders profile with reputation score
- [ ] Shows list of their predictions with outcomes
- [ ] Shows summary stats (total predictions, win rate if any resolved)
- [ ] 404 for invalid tastemaker ID
- [ ] Links back to individual prediction pages

**Files:** `app/tastemakers/[id]/page.tsx`, `app/domains/tastemakers/repo/tastemaker-repo.ts`, `app/domains/tastemakers/service/tastemaker-service.ts`
