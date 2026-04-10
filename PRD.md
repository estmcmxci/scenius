# Scenius — Product Requirements Document
**Version:** 0.4 (MVP)
**Author:** Émile Marcel Agustín
**Date:** March 11, 2026
**Target:** ETHConf Demo Slot (June 8–10, NYC)

---

## Vision

The people who know which artists are about to break out already exist. They're in the comment sections, the Discord servers, the SoundCloud repost chains. They called Doechii before the labels did. They called PinkPantheress before the algorithm caught up. They used to have a home — Pigeons & Planes, 2DopeBoyz, Gorilla vs. Bear — blogs where being right mattered and taste had a reputation attached to it. That world collapsed under pageview incentives. The conviction didn't go anywhere. The infrastructure did.

Scenius rebuilds that infrastructure and makes the conviction legible.

scenius.blog is the front door — an editorial experience that feels like those blogs at their best: opinionated, artist-forward, byline-prominent. But every post is anchored to a prediction. Writers are rewarded for accuracy, not traffic. Over time, a track record accumulates — portable, onchain, verifiable.

The back end is a reputation-weighted prediction market. Tastemakers predict binary breakout events on real SoundCloud data. The more accurate your history, the more your signal influences the aggregate. The aggregate becomes a forward-looking price signal for any independent catalog — the thing institutional buyers don't have and can't build without the people who actually live in the music.

Over time, Scenius becomes the Bloomberg terminal for independent catalogs. The tastemakers who built the dataset own their contribution to it.

---

## Problem

Independent music catalog valuation has a structural information gap. Institutional buyers price catalogs on trailing metrics — streams, sync history, royalty decay curves — data that tells you what already happened, not what's about to. The result is a uniform discount applied to every emerging catalog, regardless of what the people closest to the music already know.

Those people exist. Tastemakers — curators, bloggers, A&R scouts, community builders — identify breakouts months before the data catches up. But they have no mechanism to make that conviction legible, portable, or valuable. There's no track record. No signal. No way to prove you called it first.

Worse — there's no mechanism to monetize that foresight at all. The A&R who called it gets a bonus maybe. The blogger gets pageviews. The community curator gets clout. None of them get a stake in being right. The value of early conviction accrues entirely to whoever had the capital to act on it — not to whoever had the insight.

Music journalism compounded the problem. Pageview incentives rewarded volume over accuracy — the loudest take, not the most correct one. Editorial credibility eroded because the incentive structure punished it.

Prediction markets should solve this. They don't — because they suffer from thin liquidity. Without a data anchor, participants are predicting against vibes. Markets attract noise instead of signal, and the mechanism fails.

Scenius closes all four gaps at once.

---

## Solution

A three-layer product where each layer makes the next one credible.

**Layer 1 — Prediction Market (Pricing Engine)**
Tastemakers predict binary breakout events — "will this artist exceed X streams within Y months?" — and stake reputation on the outcome. Reputation weighting amplifies accurate predictors and discounts noise. The aggregated signal becomes a forward-looking price for any independent catalog. The more resolved predictions in the system, the more precise the signal.

**Layer 2 — scenius.blog (Discovery Surface)**
The editorial front door. An opinionated, artist-forward experience that feels like the great music blogs — byline-prominent, taste-first. Every post is anchored to a prediction. Writers build a verifiable track record over time — portable, onchain, visible to anyone. The blog recruits the oracle.

**Layer 3 — SoundCloud Data (Liquidity Anchor)**
What makes the market work. Real engagement metrics — play counts, repost velocity, follower growth — pulled from SoundCloud's public API and snapshotted at prediction creation and resolution. Tastemakers predict against observable reality, not vibes. Resolution is automated: SoundCloud delta confirms or denies the prediction. No manual adjudication. No trust required.

---

## The Thin Liquidity Problem

The core failure of most prediction markets is that participants predict in a vacuum — no anchoring data, no reference price, no observable signal. Without an anchor, markets attract noise. Scenius solves this by making SoundCloud engagement metrics the market anchor.

At prediction time, the tastemaker sees live SoundCloud data — plays, repost velocity, follower trajectory, genre comps. At resolution, the snapshot delta confirms or denies the outcome. Over time, resolved predictions become input data for the reputation scoring model and a catalog pricing dataset that doesn't exist anywhere else.

**What SoundCloud solves:** the data problem. No price anchor → fixed. No reason to stay → fixed (the signal keeps moving). Recruiting from the right demographic → fixed (300M+ users, producers, A&Rs, bloggers already on platform).

**What SoundCloud doesn't solve:** market depth. You still need enough tastemakers making opposing predictions on the same catalog. That's a cold start problem, not a data problem. The fix is editorial — 10 catalogs, 15 tastemakers, hand-seeded. SoundCloud keeps it honest as it scales.

---

## Design Direction

**V1 — functional, editorial:**
- Reference: factory.fm (Letterboxd for music — clean, album art forward, review-first)
- Dark mode, editorial typography, byline-prominent layout
- Prediction card as the atomic unit: artist, binary prediction (YES/NO + stream threshold), horizon, writer + reputation badge
- SoundCloud metrics displayed inline on prediction cards and prediction pages

**V2 — zine layer (post-MVP):**
- Immersive, full-bleed aesthetic — feels like a digital zine, not an app
- Modular "lego" components that lift and lock into artist positions on the page
- Each artist gets an immersive canvas: custom layout, texture, color pulled from their catalog art
- Think: Dover Street Market online store meets early Pitchfork meets Fantano's basement
- Components are composable — prediction card, reputation badge, timeline, commentary thread, SoundCloud embed — each a standalone block that snaps into artist-specific layouts
- The blog reads differently for every artist. Same components, different expression.

Component architecture must support V2 from day one — no hardcoded layouts.

---

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 15 (App Router) | Fast, SEO-friendly, Vercel-native |
| Styling | Tailwind CSS + CSS variables | Speed + per-artist zine theming in V2 |
| Auth + Wallet | Para | Passkey auth, no seed phrases |
| Reputation Graph | EAS (onchain attestations) | Portable, verifiable, immutable reputation via attestations |
| Market Data | SoundCloud API | Real engagement metrics as prediction anchor |
| Database | Supabase (Postgres) | Metric snapshots, predictions, resolution history |
| Deployment | Vercel | Zero config, existing domain |
| ENS | wagmi + viem | Tastemaker ENS names on profiles |
| Attestations | EAS + eas-sdk (@ethereum-attestation-service/eas-sdk) | Every resolved prediction written onchain — immutable, portable, verifiable. Trust layer without financial settlement. |
| Resolution Cron | Vercel Cron Jobs | Scheduled job: pull SC snapshot at resolution date, compute delta, resolve prediction, write EAS attestation, update reputation score |

---

## Data Model

### `artists`
```
id               uuid
soundcloud_id    string        -- SC user or track ID
name             string
soundcloud_url   string
genre            string
created_at       timestamp
```

### `catalog_snapshots`
```
id               uuid
artist_id        uuid
taken_at         timestamp
plays            integer
likes            integer
reposts          integer
followers        integer
comment_count    integer
track_count      integer
```
> Snapshots taken at prediction creation and at resolution date. Delta = outcome.

---

## Reputation Scoring — Proper Scoring Rule with Compounding

Reputation is not a simple accuracy ratio. It is an exponential moving average of a proper scoring rule, updated after each resolved prediction.

**Update rule (from the Scenius paper):**



Where:
-  — tastemaker i's current reputation score
-  — smoothing factor (95% weight on history, slow-moving)
-  — sharpness parameter (controls how harshly wrong predictions are penalized)
-  — tastemaker i's predicted probability for event j (0–1)
-  — binary outcome (1 = breakout confirmed, 0 = not)

**Properties:**
- All tastemakers initialize at  — no prior advantage
- Exponential credit: close predictions earn near-1 credit; wrong predictions decay toward 0
- EMA smoothing: a single lucky or unlucky round cannot dominate the score
- Proper scoring rule: truthful reporting is the dominant strategy — hedging or strategic misreporting does not improve expected reputation
- Compounding: accurate tastemakers compound over time; inaccurate ones decay

**What correct means (binary resolution):**
A prediction resolves YES if the artist exceeds the defined stream threshold within the prediction horizon. SoundCloud delta (snapshot at prediction creation vs. snapshot at resolution date) is the oracle. Resolution is automated via cron job — no manual sign-off required.

**Valuation unit:** Binary. Tastemakers predict YES/NO on a defined breakout threshold (e.g., will this track exceed 500K streams in 6 months?). The continuous catalog valuation model from the paper is V2, built on top of the reputation dataset generated at MVP.

---

### `tastemakers`
```
id               uuid
name             string
ens_name         string
bio              text
memory_protocol_id  string    -- nullable stub (deprecated, EAS replaces)
reputation_score float        -- EMA proper scoring rule (see Reputation Scoring section)
created_at       timestamp
```

### `predictions`
```
id                     uuid
tastemaker_id          uuid
artist_id              uuid
stream_threshold       integer       -- e.g. 500000 (streams to exceed)
predicted_outcome      enum          -- yes | no
horizon                enum          -- 1w | 2w | 4w | 8w  (weekly cadence — fast cycles build reputation faster, aligns with weekly new music drops)
rationale              text          -- editorial commentary
snapshot_id            uuid          -- SC metrics at time of prediction
resolution_snapshot_id uuid          -- SC metrics at resolution
outcome                enum          -- pending | yes | no
reputation_delta       float         -- applied to tastemaker score on resolution
eas_attestation_uid    string        -- onchain EAS attestation UID written at resolution
created_at             timestamp
resolved_at            timestamp
```

### `posts`
```
id               uuid
tastemaker_id    uuid
prediction_id    uuid          -- nullable (editorial posts without prediction)
title            string
body             text
tags             text[]        -- genre/artist tags for feed filtering
genre            string        -- primary genre
published_at     timestamp
```

---

## SoundCloud API Integration

**Auth method:** Client Credentials (no user login required — public data only)

**Key endpoints:**
- `GET /users/{id}` — artist profile + follower count
- `GET /users/{id}/tracks` — catalog with play/like/repost counts per track
- `GET /tracks?q={artist}&genres={genre}` — discovery search
- `GET /resolve?url={soundcloud_url}` — resolve any SC permalink to structured data

**Snapshot job:**
- On prediction creation: pull and store current metrics → `catalog_snapshots`
- Every Friday (Vercel Cron): snapshot all tracked artists, trigger resolution on any predictions that have hit their horizon
- On resolution: compute delta → write EAS attestation → run EMA reputation update

**Resolution logic:**
```
delta = current_plays - snapshot_plays
outcome = YES if delta >= stream_threshold else NO
→ write EAS attestation (eas_attestation_uid stored on prediction)
→ r_i = (1 - 0.05) * r_i + 0.05 * exp(-5 * (p_ij - Y_j)^2)
```

**Rate limits:** Standard API — register app at soundcloud.com/you/apps to get credentials now (M0 — this week).

**Attribution:** All displayed SoundCloud metrics must be attributed to SoundCloud and the respective artist per API ToS. Attribute on every surface where play counts, follower counts, or other SC data appears.

---

## MVP Feature Set

### 1. Discovery Feed
- Blog-style listing of catalog predictions
- Each entry: artist name, catalog description, stream threshold, YES/NO prediction, horizon, writer + reputation score
- SoundCloud play count + follower count shown inline as context

### 2. Prediction Pages
- URL: `/predictions/[id]`
- Artist is context (name, album art, embedded SoundCloud player, live metrics) — not the destination
- Prediction is the atomic unit: binary call, stream threshold, horizon, rationale, tastemaker + reputation badge
- Live metrics: plays, likes, reposts, followers (polled from SC API) shown as context for the prediction
- Aggregated signal score across all predictions for this catalog shown as supporting context
- Modular component structure for V2 zine upgrade

### 3. Tastemaker Profiles
- Public profile: name, ENS name, bio, prediction history, accuracy score
- EAS attestation history linked (portable, onchain reputation)
- Seeded with 3–5 real tastemakers with verifiable track records

### 4. Prediction Submission
- Form: select artist → see live SC metrics → set stream threshold → select YES/NO → select horizon → write rationale
- Signed via Para (or email fallback)
- Snapshot taken on submission, stored in Supabase
- Shareable prediction URL generated immediately
- On resolution: EAS attestation URL generated and linked to prediction — permanent onchain proof

### 5. Resolution Feed
- Resolved predictions with original prediction, SC delta, outcome, reputation delta
- Each resolved prediction links to its EAS attestation onchain — public, permanent, verifiable
- Builds trust in the model over time — public audit trail that can't be edited or deleted

---

## What's Out of Scope for MVP

- On-chain staking / token mechanics
- Real money / financial settlement
- Financial settlement contracts (V2 — introduced with capital staking)
- Note: EAS and Para smart accounts ARE in scope. Contracts are present but abstracted. Trust layer = onchain attestations, not financial custody.
- Full editorial CMS / workflow
- Mobile app
- Zine layout layer (V2)
- Automated oracle for non-SC catalogs

---

## Milestones

| Milestone | Date | Description |
|---|---|---|
| M0 — Register SC App | Mar 14 | Lock in SoundCloud API credentials |
| M1 — Design | Mar 21 | Wireframes: feed, artist page, profile, prediction form |
| M2 — Scaffold | Mar 21 | Next.js 15 + Supabase + Para setup, data models |
| M3 — SC Integration | Mar 28 | API route + snapshot job live |
| M4 — Feed + Profiles | Apr 4 | Seeded data, discovery feed live |
| M5 — Prediction Flow | Apr 11 | Submission + binary prediction + shareable URL |
| M6 — EAS Integration | Apr 18 | Attestations writing on resolution |
| M7 — Para Auth + ENS | May 2 | Passkey auth + ENS tastemaker names |
| M8 — Real predictions live | May 16 | 3–5 seeded tastemakers, real artists, real predictions |
| M9 — Polish | May 30 | Design pass, edge cases, mobile-readable |
| M10 — Demo ready | Jun 6 | Stress test, demo script, one resolved prediction onchain |
| **ETHConf** | **Jun 8** | Live demo for Pascal + investors |

---

## Success Criteria for Demo

- [ ] A visitor can browse catalog predictions without signing up
- [ ] Each prediction page shows live SoundCloud metrics for the predicted artist
- [ ] A tastemaker can submit a prediction in under 60 seconds
- [ ] One real prediction with a real artist is live, shareable, and has a resolution date
- [ ] The site feels editorial — not like a crypto app
- [ ] Component structure is modular and ready for V2 zine upgrade

---

## Open Questions

1. Which 3–5 artists seed the initial catalog list? (SoundCloud-native, pre-breakout preferred)
2. Who are the seeded tastemakers? Real people with verifiable track records?
3. ~~Memory Protocol~~ — resolved: dropped. EAS attestations handle portable reputation.
4. Para — apply for early access or use email auth as fallback?
5. ~~Resolution mechanism~~ — resolved: automated via SoundCloud delta cron, EAS attestation on resolution.
6. ~~Catalog valuation unit~~ — resolved: binary YES/NO on stream threshold.
7. What is the stream threshold for MVP? 500K is a placeholder — needs a real number benchmarked against genre comps for the seeded artists.
8. Privacy policy required before launch — add to M9 polish milestone (standard boilerplate sufficient for MVP).

---

## Investor Narrative

The music industry has never had a credible forward-looking price signal for independent catalogs. It has trailing metrics, comparable transactions, and gut instinct. Scenius builds the thing that's missing: a reputation-weighted aggregation of the people who already know — tastemakers whose track records are now portable, onchain, and composable.

The business model is not speculation. Every prediction is a data point. Every resolved prediction is training data for a catalog pricing model that doesn't exist anywhere else. The dataset compounds with every Friday drop cycle. Over time, Scenius becomes the Bloomberg terminal for independent music — and the tastemakers who built it own their contribution to it.

The primitives are best-in-class: SoundCloud as the data anchor, EAS for portable onchain reputation, Para for frictionless identity. But the product is cultural. That's the moat.

---

*This document is a living spec. Update as decisions are made.*