# Scenius — Engineering Execution Design (MVP)

**Author:** Émile Marcel Agustín
**Target:** ETHConf NYC demo (June 8–10, 2026)
**Status:** Pre-build
**Synced with:** PRD v0.4

---

## 1. Product Summary

Scenius is a reputation-weighted prediction market for independent music catalogs.
Tastemakers predict binary breakout events — will this artist exceed X streams within
Y months? — and stake reputation on the outcome. Accurate predictors compound reputation
over time via a proper scoring rule (EMA of Brier). Resolved predictions are written
onchain via EAS: immutable, portable, verifiable.

The editorial front door is scenius.blog — opinionated, byline-prominent, artist-forward.
Every post is anchored to a prediction. Writers build a verifiable track record over time.

**Three-layer product:**
1. **Prediction Market** — reputation-weighted aggregation engine
2. **scenius.blog** — editorial discovery surface (the oracle recruiter)
3. **SoundCloud Data** — live engagement metrics as the liquidity anchor

**What makes this not another Polymarket clone:**
1. Reputation-weighted aggregation — the paper's core mechanism, live in the product
2. SoundCloud as a real data anchor — predictions resolve against observable reality, not vibes
3. Soulbound reputation — onchain EAS attestations of forecaster accuracy that compound over time
4. Editorial layer — scenius.blog recruits tastemakers who already live in the music

---

## 2. Architecture

Hybrid: offchain computation + onchain attestations via EAS.

```
┌──────────────────────────────────────────┐
│  Next.js 15 Frontend (Vercel)            │
│  Tailwind CSS + shadcn/ui                │
├──────────────────────────────────────────┤
│  Next.js API Routes                      │
│  - Prediction CRUD                       │
│  - Reputation-weighted aggregation       │
│  - SC snapshot + resolution cron         │
│  - Reputation update (EMA proper rule)   │
├──────────────────────────────────────────┤
│  Supabase (Postgres + Drizzle ORM)       │
│  - artists                               │
│  - catalog_snapshots                     │
│  - tastemakers                           │
│  - predictions                           │
│  - posts                                 │
├──────────────────────────────────────────┤
│  Onchain — EAS                           │
│  - prediction attestations               │
│  - market outcome attestations           │
│  - reputation score snapshots            │
├──────────────────────────────────────────┤
│  External                                │
│  - SoundCloud API (data anchor)          │
│  - EAS (portable reputation attestations) │
│  - Para (passkey auth + wallet)          │
└──────────────────────────────────────────┘
```

### Why hybrid over full onchain

Full onchain (Gnosis CTF + LMSR Solidity contracts) is a post-MVP target.
The hybrid approach:
- Keeps reputation-weighted aggregation in TypeScript where it's fast to iterate
- Uses EAS for verifiable onchain proof without custom Solidity
- Can migrate to CTF + LMSR contracts post-ETHConf

---

## 3. Tech Stack

| Layer | Technology | Justification |
|---|---|---|
| Framework | Next.js 15 (App Router) | API routes + SSR + Vercel deploy in one |
| Styling | Tailwind CSS + CSS variables | Speed + per-artist zine theming in V2 |
| Auth + Wallet | Para | Passkey auth, no seed phrases, low friction onboarding |
| Reputation Graph | EAS (onchain attestations) | Portable, verifiable, immutable reputation via attestations |
| Market Data | SoundCloud API (client credentials) | Real engagement metrics as prediction anchor |
| Database | Supabase (Postgres) + Drizzle ORM | Type-safe, zero-config, Supabase free tier for MVP |
| Deployment | Vercel | Zero config, existing domain |
| ENS | wagmi + viem | Tastemaker ENS names on profiles |
| Attestations | EAS (`@ethereum-attestation-service/eas-sdk`) | Every resolved prediction written onchain — immutable, portable |
| Resolution Cron | Vercel Cron Jobs | Scheduled job: pull SC snapshot → resolve → attest → update reputation |

---

## 4. Key Architectural Decisions

| Decision | Choice | Alternatives considered |
|---|---|---|
| Data anchor | SoundCloud API | Spotify (auth complexity, no public play counts), Bandcamp (niche), manual seeding (no real oracle) |
| Auth | Para (passkey) | RainbowKit (requires external wallet, friction for non-crypto tastemakers), Privy (viable, Para preferred for passkey UX) |
| Onchain primitive | EAS attestations | Gnosis CTF (too complex for MVP), Sign Protocol (token dependency), Verax (over-engineered) |
| Resolution | Automated SoundCloud delta cron | Manual admin (trust required), UMA Optimistic Oracle (production V2) |
| Reputation storage | Supabase + periodic EAS snapshots | Full onchain (gas-heavy for frequent updates) |
| Identity | Para + ENS | ENS-only (no portability layer), custom DB (not portable) |
| No artist-dedicated pages | Prediction-first routing | Direct artist pages violate SoundCloud ToS |

---

## 5. Database Schema

```sql
-- Artists: SC-anchored artist records (context for predictions, not destinations)
CREATE TABLE artists (
  id               UUID PRIMARY KEY,
  soundcloud_id    TEXT,
  name             TEXT NOT NULL,
  soundcloud_url   TEXT,
  genre            TEXT,
  created_at       TIMESTAMP DEFAULT NOW()
);

-- Catalog snapshots: SC metrics at a point in time
CREATE TABLE catalog_snapshots (
  id               UUID PRIMARY KEY,
  artist_id        UUID REFERENCES artists(id),
  taken_at         TIMESTAMP NOT NULL,
  plays            INTEGER,
  likes            INTEGER,
  reposts          INTEGER,
  followers        INTEGER,
  comment_count    INTEGER,
  track_count      INTEGER
);

-- Tastemakers: users with reputation
CREATE TABLE tastemakers (
  id                   UUID PRIMARY KEY,
  name                 TEXT,
  ens_name             TEXT,
  bio                  TEXT,
  memory_protocol_id   TEXT,              -- nullable stub (deprecated, EAS replaces)
  reputation_score     FLOAT DEFAULT 1.0,  -- EMA proper scoring rule, init at 1.0
  created_at           TIMESTAMP DEFAULT NOW()
);

-- Predictions: binary breakout forecasts
CREATE TABLE predictions (
  id                     UUID PRIMARY KEY,
  tastemaker_id          UUID REFERENCES tastemakers(id),
  artist_id              UUID REFERENCES artists(id),
  stream_threshold       INTEGER,           -- e.g. 500000 (streams to exceed)
  predicted_outcome      TEXT,              -- yes | no
  horizon                TEXT,              -- 1w | 2w | 4w | 8w
  rationale              TEXT,
  snapshot_id            UUID REFERENCES catalog_snapshots(id),
  resolution_snapshot_id UUID REFERENCES catalog_snapshots(id),
  outcome                TEXT DEFAULT 'pending',  -- pending | yes | no
  reputation_delta       FLOAT,
  eas_attestation_uid    TEXT,
  created_at             TIMESTAMP DEFAULT NOW(),
  resolved_at            TIMESTAMP
);

-- Posts: editorial content anchored to predictions
CREATE TABLE posts (
  id               UUID PRIMARY KEY,
  tastemaker_id    UUID REFERENCES tastemakers(id),
  prediction_id    UUID REFERENCES predictions(id),  -- nullable
  title            TEXT,
  body             TEXT,
  tags             TEXT[],
  genre            TEXT,
  published_at     TIMESTAMP
);
```

---

## 6. Core Mechanism (paper → code)

### 6a. Reputation-Weighted Aggregation

For each artist, the aggregate signal is:

```typescript
// p_market = Σ(r_i * p_i) / Σ(r_i)
// (constant stakes for MVP — stake = 1 for all)
function weightedConsensus(predictions: { reputation: number; probability: number }[]) {
  const num = predictions.reduce((s, p) => s + p.reputation * p.probability, 0);
  const den = predictions.reduce((s, p) => s + p.reputation, 0);
  return den === 0 ? 0.5 : num / den;
}
```

### 6b. Reputation Update Rule

On resolution (outcome Y ∈ {0, 1}), for each tastemaker who predicted:

```typescript
const alpha = 0.05;  // EMA smoothing — 95% weight on history
const beta  = 5.0;   // sharpness — controls penalty severity

const credit = Math.exp(-beta * Math.pow(prediction - outcome, 2));
user.reputation_score = (1 - alpha) * user.reputation_score + alpha * credit;
```

Parameters are canonical from the Scenius paper. Do not adjust without updating `research/theory.md`.

All tastemakers initialize at `r_i = 1.0`. Correct predictions sustain near 1.0; wrong ones decay toward 0.

### 6c. Resolution Logic (cron)

```typescript
// Run every Friday via Vercel Cron
async function resolveExpiredPredictions() {
  const due = await db.predictions.findDue();  // horizon elapsed, outcome pending
  for (const pred of due) {
    const snap = await sc.snapshot(pred.artist_id);  // pull current SC metrics
    const delta = snap.plays - pred.snapshot.plays;
    const outcome = delta >= pred.stream_threshold ? 'yes' : 'no';
    const attestationUid = await eas.attest(pred, outcome);
    await db.predictions.resolve(pred.id, snap.id, outcome, attestationUid);
    await reputation.update(pred.tastemaker_id, pred.predicted_outcome, outcome);
  }
}
```

---

## 7. EAS Schema Definitions

Three schemas registered onchain:

### Prediction Attestation
```
bytes32 predictionId, address tastemaker, bool predictedYes, uint64 streamThreshold, uint64 createdAt
```
Created when a tastemaker submits a prediction.

### Market Outcome Attestation
```
bytes32 predictionId, bool outcome, uint64 scDelta, uint64 resolvedAt
```
Created by the resolution cron. Immutable record of the SC delta and outcome.

### Reputation Snapshot Attestation
```
address tastemaker, uint64 reputationScore, uint32 totalPredictions, uint64 snapshotAt
```
`reputationScore` stored as basis points (0–10000). Created on each resolution.

---

## 8. SoundCloud API Integration

**Auth:** Client Credentials flow (no user login required — public data only)
**Credentials:** stored in `.env` as `SOUNDCLOUD_CLIENT_ID` / `SOUNDCLOUD_CLIENT_SECRET`

**Key endpoints:**
```
GET /users/{id}              — artist profile + follower count
GET /users/{id}/tracks       — catalog with play/like/repost counts
GET /tracks?q={q}&genres={g} — discovery search
GET /resolve?url={sc_url}    — resolve any SC permalink to structured data
```

**Attribution requirement:** Every surface displaying SC metrics must attribute
to SoundCloud and the respective artist inline. Build into the shared
`<MetricDisplay />` component so it cannot be omitted.

**Snapshot job:**
- On prediction creation: pull and store current metrics → `catalog_snapshots`
- Every Friday (Vercel Cron): snapshot all tracked artists, trigger resolution
- On resolution: compute delta → write EAS attestation → run EMA update

**Rate limits:** Register app at soundcloud.com/you/apps — done (M0 ✓)

---

## 9. Pages / Routes

```
/                        → Discovery feed (prediction cards, genre filter)
/predictions/[id]        → Prediction page (artist as context, prediction as unit)
/tastemakers/[id]        → Tastemaker profile + track record + reputation history
/submit                  → Prediction submission form
/resolved                → Resolution feed + EAS attestation links
```

**There is no `/artists/[id]` route.** SoundCloud ToS prohibits artist-dedicated
pages. Artist is always context inside `/predictions/[id]`.

### Discovery Feed (`/`)
- Blog-style listing of prediction cards
- Each card: artist name, stream threshold, YES/NO call, horizon, writer + reputation badge, SC play count + follower count (attributed)
- Filter by genre/tag

### Prediction Page (`/predictions/[id]`)
- Prediction as the primary element: binary call, threshold, horizon, rationale, tastemaker + reputation badge
- Artist context: name, album art, embedded SC player, live metrics (attributed to SoundCloud)
- Aggregated signal score across all predictions for this catalog
- EAS attestation link on resolved predictions
- Modular component structure (ready for V2 zine upgrade)

### Tastemaker Profile (`/tastemakers/[id]`)
- Name, ENS name, bio
- Reputation score (prominent) + prediction history
- Accuracy over time
- EAS attestation links per resolved prediction

### Prediction Submission (`/submit`)
- Select artist (SC URL input → resolve → display live metrics)
- Set stream threshold
- Select YES/NO
- Select horizon (1w / 2w / 4w / 8w)
- Write rationale
- Sign via Para (email fallback)
- Snapshot taken on submit → shareable `/predictions/[id]` URL generated immediately

### Resolution Feed (`/resolved`)
- Resolved predictions: original call, SC delta, outcome, reputation delta
- Each links to its EAS attestation — permanent, public, uneditable

---

## 10. API Routes

```
GET    /api/predictions              → List predictions (with filters)
GET    /api/predictions/[id]         → Prediction detail
POST   /api/predictions              → Submit prediction (Para auth required)
GET    /api/tastemakers/[id]         → Tastemaker profile + history
GET    /api/feed                     → Discovery feed (paginated)
GET    /api/resolved                 → Resolution feed
POST   /api/cron/snapshot            → Friday snapshot job (Vercel Cron)
POST   /api/cron/resolve             → Friday resolution job (Vercel Cron)
```

---

## 11. Build Order (Milestones)

| Milestone | Date | Deliverable |
|---|---|---|
| M0 | Mar 14 | SC credentials confirmed, API smoke test passing |
| M1 | Mar 21 | Wireframes: feed, prediction page, profile, submit form |
| M2 | Mar 21 | Next.js 15 scaffold + Supabase + Para setup, Drizzle schema migrations |
| M3 | Mar 28 | SC API client + snapshot job live, Zod schemas for all SC responses |
| M4 | Apr 4 | Discovery feed + tastemaker profiles + seeded data live |
| M5 | Apr 11 | Prediction submission flow + binary prediction + shareable URL |
| M6 | Apr 18 | EAS attestations writing on resolution |
| M7 | May 2 | Para auth + ENS integrated |
| M8 | May 16 | 3–5 real tastemakers, real artists, real live predictions |
| M9 | May 30 | Design polish, attribution components, privacy policy, mobile-readable |
| M10 | Jun 6 | Stress test, demo script, one resolved prediction onchain |
| ETHConf | Jun 8 | Live demo |

---

## 12. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| SC API rate limits under load | Low | Medium | Cache snapshots in Supabase; only pull on prediction creation and Friday cron |
| EAS SDK issues | Low | High | EAS is battle-tested; fallback to offchain-only attestations for MVP |
| Para early access delayed | Medium | Medium | Email auth as fallback for M5; swap Para in at M7 |
| ~~Memory Protocol~~ | — | — | Dropped — EAS attestations handle portable reputation |
| DB schema changes mid-build | Medium | Low | Drizzle migrations are fast; keep schema minimal and iterate |
| Reputation math produces degenerate values | Low | High | Clamp reputation to [0.01, 0.99]; use exact parameters from paper |
| SC ToS artist-page violation | Mitigated | High | Prediction-first routing enforced — no `/artists/[id]` route exists |
| Stream threshold placeholder (500K) | Medium | Medium | Benchmark against genre comps for seeded artists before M8 |

---

## 13. Success Criteria

### ETHConf Demo (June 8)
- [ ] A visitor can browse catalog predictions without signing up
- [ ] Each prediction page shows live SoundCloud metrics for the predicted artist
- [ ] A tastemaker can submit a prediction in under 60 seconds
- [ ] One real prediction with a real artist is live, shareable, and has a resolution date
- [ ] At least one resolved prediction with an EAS attestation visible onchain
- [ ] The site feels editorial — not like a crypto app
- [ ] Component structure is modular and ready for V2 zine upgrade

---

## 14. Post-ETHConf → V2

| Feature | MVP | V2 |
|---|---|---|
| Aggregation | Offchain weighted average | Onchain LMSR via Gnosis CTF |
| Outcome tokens | None | ERC-1155 conditional tokens |
| Staking | None (reputation only) | Real or testnet token stakes |
| Resolution | Automated SC delta cron | UMA Optimistic Oracle |
| Reputation | Supabase + EAS snapshots | Fully onchain, ERC-5192 soulbound |
| Artist pages | Not allowed (SC ToS) | Partnership/licensing route with SC directly |
| Design | Editorial V1 | Full zine layer (immersive, per-artist canvas) |
| Chain | TBD (EAS-compatible) | Base mainnet |
