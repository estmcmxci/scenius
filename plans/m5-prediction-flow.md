# Plan: M5 — Prediction Submission Flow

**Status:** Ready
**Milestone:** M5 (Apr 11)
**Depends on:** M4 (feed + profiles live, seed data)
**Updated:** 2026-03-14

## Goal

A tastemaker can submit a prediction in under 60 seconds. The flow: paste a SoundCloud URL → see artist preview with live metrics → set threshold + horizon → submit → get a shareable `/predictions/[id]` URL. No auth required for M5 (auth comes in M7 with Para). Use a temporary "pick your tastemaker" selector from seeded data.

---

## Issues

### SCE-M5-1: Prediction submission service layer

**Title:** Implement prediction creation service (types → repo → service)

**Description:**
Build the backend for prediction submission:
- `app/domains/predictions/types/create-prediction.ts` — Zod schema for submission input (`url`, `streamThreshold`, `predictedOutcome`, `horizon`, `tastemakerId`)
- `app/domains/predictions/repo/prediction-repo.ts` — extend with `createPrediction()` that inserts a prediction row with `snapshot_id` from a fresh snapshot
- `app/domains/predictions/service/prediction-service.ts` — extend with `submitPrediction()` orchestration:
  1. Call `takeSnapshot(url)` to get current metrics
  2. Upsert artist + insert snapshot
  3. Create prediction with `snapshot_id` link
  4. Return prediction ID + shareable URL

Add CLI command: `pnpm cli predict <url> --threshold 500000 --horizon 4w --outcome yes --tastemaker <id>`

**Acceptance criteria:**
- [ ] `submitPrediction()` creates artist, snapshot, and prediction in one transaction
- [ ] Prediction has valid `snapshot_id` pointing to the creation snapshot
- [ ] CLI command works: `pnpm cli predict <url> --threshold 500000 --horizon 4w --outcome yes --tastemaker <id>`
- [ ] Zod validates all inputs (threshold > 0, horizon in allowed set, outcome yes/no)
- [ ] Returns prediction ID and URL path

**Files:** `app/domains/predictions/types/create-prediction.ts`, `app/domains/predictions/repo/prediction-repo.ts`, `app/domains/predictions/service/prediction-service.ts`, `app/cli/predict.ts`, `app/cli/index.ts`

---

### SCE-M5-2: Prediction submission API route

**Title:** Add POST /api/predictions route for prediction creation

**Description:**
Create `app/api/predictions/route.ts` — POST endpoint that accepts prediction submission and returns the created prediction.

```
POST /api/predictions
Body: {
  "url": "https://soundcloud.com/kaytranada",
  "streamThreshold": 500000,
  "predictedOutcome": "yes",
  "horizon": "4w",
  "tastemakerId": "uuid"
}
Response: {
  "predictionId": "uuid",
  "url": "/predictions/{id}",
  "artist": {...},
  "snapshot": {...}
}
```

Zod validation on input. Structured error responses.

**Acceptance criteria:**
- [ ] POST creates prediction and returns ID + URL
- [ ] Invalid input returns 400 with field-level errors
- [ ] Invalid SC URL returns 502
- [ ] Invalid tastemaker ID returns 404

**Files:** `app/api/predictions/route.ts`

---

### SCE-M5-3: Artist preview component

**Title:** Build artist preview component with live SC metrics

**Description:**
Create a reusable `ArtistPreview` component that shows an artist's SC data after URL resolution. Used in the submission form to give the tastemaker confidence they're predicting on the right artist.

Shows: avatar, username, followers, track count, total plays, city. Includes SoundCloud attribution link.

This is a client component that fetches from `POST /api/snapshots` (built in M3) when given a URL.

**Acceptance criteria:**
- [ ] Component accepts a SC URL prop and fetches artist data
- [ ] Displays avatar, username, followers, total plays, track count
- [ ] Shows loading state while fetching
- [ ] Shows error state for invalid URLs
- [ ] Includes SoundCloud attribution link per ToS

**Files:** `app/components/artist-preview.tsx`

---

### SCE-M5-4: Prediction submission form page (/submit)

**Title:** Build the prediction submission form at /submit

**Description:**
Create `app/submit/page.tsx` — the prediction submission form. This is the core product interaction.

Flow:
1. Paste SoundCloud URL → triggers artist preview (SCE-M5-3)
2. See artist metrics from live snapshot
3. Set stream threshold (number input)
4. Choose predicted outcome (yes/no toggle)
5. Choose horizon (1w / 2w / 4w / 8w selector)
6. Pick tastemaker (temporary: dropdown from seeded tastemakers — replaced by auth in M7)
7. Submit → POST to `/api/predictions` → redirect to `/predictions/[id]`

Client component with form state. Use Zod for client-side validation matching the API schema.

**Acceptance criteria:**
- [ ] Form at `/submit` with all required fields
- [ ] URL input triggers artist preview on blur/enter
- [ ] Validation prevents submission with missing/invalid fields
- [ ] Successful submission redirects to `/predictions/[id]`
- [ ] Error states shown for API failures
- [ ] Temporary tastemaker picker (dropdown) — clearly marked as placeholder for M7 auth

**Files:** `app/submit/page.tsx`

---

### SCE-M5-5: Navigation and layout polish

**Title:** Add site navigation and connect all pages

**Description:**
Update `app/layout.tsx` with a minimal navigation header:
- Logo/wordmark linking to `/`
- "Submit Prediction" button linking to `/submit`
- Links in prediction cards and profile pages all work

Add a `/resolved` route that filters the feed to show only resolved predictions (reuse feed service with `outcome != 'pending'` filter). This becomes the resolution feed for M6.

**Acceptance criteria:**
- [ ] Navigation header on all pages with logo + submit button
- [ ] All internal links work (feed → prediction → tastemaker → back)
- [ ] `/resolved` shows only resolved predictions (empty for now, that's fine)
- [ ] Navigation is responsive (mobile-readable)

**Files:** `app/layout.tsx`, `app/components/nav.tsx`, `app/resolved/page.tsx`
