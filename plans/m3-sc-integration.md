# Plan: M3 — SC Integration + Snapshot Job Live

**Status:** Ready
**Milestone:** M3 (Mar 28)
**Depends on:** M2 (scaffold, Drizzle schema, SC client)
**Updated:** 2026-03-14

## Goal

Wire the SoundCloud snapshot pipeline end-to-end: CLI snapshot command writes to Supabase, API route exposes snapshot-on-demand, and a Vercel Cron stub runs the Friday resolution loop skeleton. By the end of M3, `pnpm cli snapshot <url>` succeeds against a live SC URL and writes rows to the `artists` and `catalog_snapshots` tables.

## Prerequisites

- DB schema pushed to Supabase (`pnpm db:push` — currently blocked by IPv6, needs pooler URL or network fix)
- `.env` has valid `DATABASE_URL`, `SOUNDCLOUD_CLIENT_ID`, `SOUNDCLOUD_CLIENT_SECRET`

---

## Issues

### SCE-M3-1: Fix DB connectivity and push schema to Supabase

**Title:** Fix DATABASE_URL for IPv4 connectivity and push Drizzle schema

**Description:**
The direct Supabase DB host (`db.*.supabase.co`) only resolves to IPv6, which is unreachable from most dev networks. Switch `DATABASE_URL` to use the Supabase session-mode pooler (`aws-0-us-east-1.pooler.supabase.com:5432` with user `postgres.{project-ref}`), then run `pnpm db:push` to create all 5 tables.

After push, apply CHECK constraints:
```sql
ALTER TABLE predictions ADD CONSTRAINT chk_predicted_outcome CHECK (predicted_outcome IN ('yes', 'no'));
ALTER TABLE predictions ADD CONSTRAINT chk_horizon CHECK (horizon IN ('1w', '2w', '4w', '8w'));
ALTER TABLE predictions ADD CONSTRAINT chk_outcome CHECK (outcome IN ('pending', 'yes', 'no'));
```

**Acceptance criteria:**
- [ ] `pnpm db:push` succeeds
- [ ] All 5 tables visible in Supabase dashboard with correct columns
- [ ] CHECK constraints applied
- [ ] `.env.local.example` updated with pooler URL format comment

**Files:** `drizzle.config.ts`, `.env.local.example`

---

### SCE-M3-2: Verify CLI snapshot end-to-end

**Title:** Verify `pnpm cli snapshot` writes to Supabase end-to-end

**Description:**
With the DB now reachable, run the existing CLI snapshot command against a real SoundCloud URL and verify rows are written.

```bash
pnpm cli snapshot https://soundcloud.com/kaytranada
```

Fix any runtime issues (BigInt serialization, Drizzle query errors, Zod parse failures from real SC API responses). The SC client, snapshot service, and repo layer already exist from M2 — this issue is about making the vertical slice actually work.

**Acceptance criteria:**
- [ ] `pnpm cli snapshot https://soundcloud.com/kaytranada` completes without errors
- [ ] `artists` table has a row with `soundcloud_id`, `username`, `permalink_url`
- [ ] `catalog_snapshots` table has a row with aggregated totals and `taken_at`
- [ ] Running the same command again upserts the artist (no duplicate) and inserts a new snapshot
- [ ] SC API Zod schemas handle real response shapes (nullable fields, missing fields)

**Files:** `app/cli/snapshot.ts`, `app/domains/soundcloud/repo/snapshot-repo.ts`, `app/domains/soundcloud/service/sc-client.ts`, `app/domains/soundcloud/types/sc-user.ts`, `app/domains/soundcloud/types/sc-track.ts`

---

### SCE-M3-3: Snapshot API route

**Title:** Add Next.js API route for on-demand snapshot

**Description:**
Create `app/api/snapshots/route.ts` — a POST endpoint that takes a SoundCloud URL, runs the snapshot pipeline, and returns the artist + snapshot IDs. This is the server-side entry point that the prediction submission form will call in M5.

Layer model: `api → service → repo`. The API route calls the same `takeSnapshot()` + `upsertArtist()` + `insertSnapshot()` that the CLI uses. Validate input with Zod. Return structured JSON.

```
POST /api/snapshots
Body: { "url": "https://soundcloud.com/kaytranada" }
Response: { "artistId": "uuid", "snapshotId": "uuid", "artist": {...}, "totals": {...} }
```

**Acceptance criteria:**
- [ ] `POST /api/snapshots` with a valid SC URL returns 200 with artist + snapshot data
- [ ] Invalid URL returns 400 with Zod validation error
- [ ] Missing/invalid SC URL (404 from SC API) returns 502 with error message
- [ ] Response includes `artistId`, `snapshotId`, artist metadata, and catalog totals

**Files:** `app/api/snapshots/route.ts`

---

### SCE-M3-4: Vercel Cron stub for Friday resolution

**Title:** Add Vercel Cron route stub for weekly resolution

**Description:**
Create `app/api/cron/resolve/route.ts` — a GET endpoint protected by `CRON_SECRET` that will eventually run the Friday resolution loop. For M3, it only:
1. Queries all predictions with `outcome = 'pending'` whose horizon has elapsed
2. Logs the count of due predictions
3. Returns 200

Add the cron schedule to `vercel.json`. This stub proves the cron infrastructure works and gives M6 (resolution) a place to land.

```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/resolve",
    "schedule": "0 12 * * 5"
  }]
}
```

**Acceptance criteria:**
- [ ] `GET /api/cron/resolve` with valid `CRON_SECRET` header returns 200
- [ ] Missing/invalid secret returns 401
- [ ] `vercel.json` has the cron entry
- [ ] Route queries pending predictions and logs count (even if 0)

**Files:** `app/api/cron/resolve/route.ts`, `vercel.json`

---

### SCE-M3-5: Update QUALITY.md and AGENTS.md

**Title:** Update quality grades and agent docs for M3 completion

**Description:**
After M3 is complete, update `QUALITY.md` with grades for the soundcloud domain and infrastructure layers. Update `AGENTS.md` to reflect the current repo state (app/ is no longer empty, CLI commands exist).

**Acceptance criteria:**
- [ ] `QUALITY.md` soundcloud domain grade updated (D or C based on state)
- [ ] `QUALITY.md` Next.js scaffold, Supabase schema grades updated
- [ ] `AGENTS.md` repo layout reflects actual directory structure
- [ ] `plans/m0-scaffold.md` status updated to Done

**Files:** `QUALITY.md`, `AGENTS.md`, `plans/m0-scaffold.md`
