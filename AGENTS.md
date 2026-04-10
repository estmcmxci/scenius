# AGENTS.md — Scenius Repo

This is your entry point. Read it first. Then follow the pointers.

## What This Is

Scenius is a reputation-weighted prediction market for independent music catalogs.
Tastemakers predict binary breakout events on real SoundCloud data. Accurate
predictors compound reputation over time via a proper scoring rule. Resolved
predictions are written onchain via EAS — immutable, portable, verifiable.

Target: live demo at ETHConf NYC, June 8–10, 2026.

## Repo Layout

```
/
├── AGENTS.md          ← you are here (table of contents)
├── CLAUDE.md          ← project rules for Claude Code (loaded every conversation)
├── ARCHITECTURE.md    ← domain map, layer model, package boundaries
├── BELIEFS.md         ← golden principles, invariants, tech choices
├── QUALITY.md         ← per-domain quality grades, known debt
├── PRD.md             ← product requirements (v0.4 MVP)
├── EED.md             ← engineering execution design
├── plans/             ← execution plans (versioned, checked in)
│   ├── m0-scaffold.md
│   ├── m3-sc-integration.md
│   ├── m4-feed-profiles.md
│   ├── m5-prediction-flow.md
│   ├── m8-demo-data.md
│   └── mx-track-refactor.md
├── app/               ← Next.js 15 application
│   ├── api/           ← Route handlers
│   │   ├── cron/resolve/route.ts    ← Friday resolution cron
│   │   ├── cron/snapshot/route.ts   ← Snapshot cron
│   │   ├── predictions/route.ts     ← POST create prediction
│   │   └── snapshots/route.ts       ← POST on-demand snapshot
│   ├── cli/           ← CLI commands
│   │   ├── index.ts          ← CLI entry point (pnpm cli <command>)
│   │   ├── attest-test.ts    ← Test EAS attestation write
│   │   ├── feed.ts           ← List feed items
│   │   ├── predict.ts        ← Create a prediction
│   │   ├── prediction.ts     ← View a single prediction
│   │   ├── preview.ts        ← Preview artist/track from SC URL
│   │   ├── reputation-test.ts ← Test reputation scoring formula
│   │   ├── resolve.ts        ← Run resolution pipeline
│   │   ├── seed.ts           ← Seed DB from SC data
│   │   ├── seed-demo.ts      ← Seed demo data for presentation
│   │   ├── snapshot.ts       ← Snapshot a single artist
│   │   ├── snapshot-all.ts   ← Snapshot all active artists
│   │   └── tastemaker.ts     ← View tastemaker profile
│   ├── components/    ← Shared UI components
│   │   ├── artist-preview.tsx
│   │   ├── auth-button.tsx
│   │   ├── feed-card.tsx
│   │   ├── nav.tsx
│   │   ├── prediction-card.tsx
│   │   └── track-preview.tsx
│   ├── config/        ← Zod-validated env vars and service config
│   │   ├── env.ts
│   │   ├── eas.ts         ← EAS contract addresses, schema UIDs
│   │   ├── chains.ts      ← Chain definitions (Base Sepolia)
│   │   └── para.ts        ← Para client instance
│   ├── db/            ← Drizzle client, schema, migrations
│   │   ├── client.ts
│   │   ├── schema.ts
│   │   └── migrations/
│   ├── domains/
│   │   ├── feed/
│   │   │   ├── types/feed-item.ts
│   │   │   ├── repo/feed-repo.ts, schema.ts
│   │   │   └── service/feed-service.ts
│   │   ├── predictions/
│   │   │   ├── types/create-prediction.ts
│   │   │   ├── repo/prediction-repo.ts, schema.ts
│   │   │   └── service/prediction-service.ts
│   │   ├── resolution/
│   │   │   ├── repo/due-predictions.ts, pending-artists.ts, pending-tracks.ts
│   │   │   └── service/weekly-resolution.ts, reputation.ts, eas-service.ts, retry-unattested.ts
│   │   ├── soundcloud/
│   │   │   ├── types/sc-user.ts, sc-track.ts, snapshot.ts
│   │   │   ├── repo/snapshot-repo.ts, track-repo.ts, schema.ts
│   │   │   └── service/sc-client.ts, snapshot.ts, track-snapshot.ts
│   │   └── tastemakers/
│   │       ├── repo/tastemaker-repo.ts, schema.ts
│   │       └── service/tastemaker-service.ts
│   ├── providers/
│   │   └── para-provider.tsx   ← Para + QueryClient wrapper
│   ├── shared/
│   │   ├── components/sc-attribution.tsx  ← SoundCloud attribution (ToS)
│   │   ├── ens.ts              ← ENS name resolution
│   │   └── format-address.ts   ← Wallet address formatting
│   ├── layout.tsx         ← Root layout (dark theme, ParaProvider)
│   ├── page.tsx           ← Discovery feed (/)
│   ├── loading.tsx        ← Root loading boundary
│   ├── error.tsx          ← Root error boundary
│   ├── not-found.tsx      ← 404 page
│   ├── predictions/[id]/  ← Prediction detail page + OG tags
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   └── error.tsx
│   ├── tastemakers/[id]/  ← Tastemaker profile + ENS + prediction cards
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   └── error.tsx
│   ├── submit/            ← Prediction submission form
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   └── error.tsx
│   ├── resolved/          ← Resolution feed with EAS attestation links
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   └── error.tsx
│   └── privacy/           ← Privacy policy
│       └── page.tsx
├── spec/              ← Implementation reference
│   ├── data-model.md
│   ├── sc-api.md
│   ├── resolution-logic.md
│   ├── eas.md
│   ├── stack.md
│   └── attribution.md
├── research/          ← Simulation, theory, analysis docs
├── docs/              ← Vocs documentation site (public)
├── scenius-paper/     ← Academic paper + frontend reader (submodule)
└── .env               ← secrets (gitignored)
```

## CLI Commands

Entry point: `pnpm cli <command>` (runs `tsx --env-file=.env app/cli/index.ts`).

| Command | Description |
|---|---|
| `feed` | List discovery feed items |
| `predict` | Create a new prediction |
| `prediction` | View a single prediction by ID |
| `preview` | Preview artist or track from a SoundCloud URL |
| `resolve` | Run the weekly resolution pipeline |
| `reputation-test` | Test the reputation scoring formula |
| `seed` | Seed the database from SoundCloud data |
| `seed-demo` | Seed demo data for presentations |
| `snapshot` | Snapshot a single artist's catalog |
| `snapshot-all` | Snapshot all active artists |
| `tastemaker` | View a tastemaker's profile and stats |
| `attest-test` | Test EAS attestation write on Base Sepolia |

## Tech Stack (quick reference)

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS + CSS variables |
| Auth + Wallet | Para (passkey sign-in, embedded wallets) |
| Reputation Graph | EAS (onchain attestations) |
| Market Data | SoundCloud API (client credentials) |
| Database | Supabase (Postgres + Drizzle ORM) |
| Attestations | EAS (@ethereum-attestation-service/eas-sdk) on Base Sepolia |
| Deployment | Vercel |
| ENS | wagmi + viem (llamarpc.com) |
| Resolution Cron | Vercel Cron Jobs |

Full rationale in `EED.md` § 2 and `ARCHITECTURE.md`.

## How to Work

1. **Small change** — open a PR directly. Write a one-line plan in the PR description.
2. **Feature / milestone** — create a plan file in `plans/` first (see `plans/m0-scaffold.md` as template). Check it in before writing code.
3. **Uncertain about architecture** — read `ARCHITECTURE.md` before touching domain boundaries.
4. **Uncertain about a rule** — read `BELIEFS.md`. If it isn't there, ask.

## Hard Constraints (non-negotiable)

- **No artist-dedicated pages.** SoundCloud ToS prohibits pages dedicated to a specific artist.
  Artist is always context inside a prediction page (`/predictions/[id]`). See `BELIEFS.md`.
- **SoundCloud attribution required** on every surface displaying SC metrics.
- **No "AI trained on SoundCloud data" framing** — it's a statistical model (proper scoring rule).
- **Privacy policy required before launch** — added at `/privacy`.
- **`.env` is gitignored.** Never commit secrets.

## Key Docs

### Top-level
- Project rules for Claude → `CLAUDE.md`
- Architecture + domains → `ARCHITECTURE.md`
- Invariants + golden rules → `BELIEFS.md`
- Quality + known debt → `QUALITY.md`
- Product scope → `PRD.md`
- Engineering decisions → `EED.md`
- Plans → `plans/m3-sc-integration.md`, `plans/m4-feed-profiles.md`, `plans/m5-prediction-flow.md`, `plans/m8-demo-data.md`, `plans/mx-track-refactor.md`

### spec/ — implementation reference (read when working on a specific domain)
- `spec/data-model.md` — full Supabase schema (artists, catalog_snapshots, tracks, track_snapshots, predictions, tastemakers, posts)
- `spec/sc-api.md` — SoundCloud endpoints, auth, rate limits, snapshot job, Zod schemas
- `spec/resolution-logic.md` — delta formula, YES/NO outcome, EMA update, Friday cron schedule
- `spec/eas.md` — attestation schemas, when UIDs get written, mainnet gate (human approval required)
- `spec/stack.md` — Next.js 15 conventions, Zod at all API edges, no `any` in resolution logic
- `spec/attribution.md` — SoundCloud ToS constraints, attribution requirement, no artist-dedicated pages
