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
│   └── m5-prediction-flow.md
├── app/               ← Next.js 15 application
│   ├── api/           ← Route handlers
│   │   ├── cron/resolve/route.ts    ← Friday resolution cron stub
│   │   └── snapshots/route.ts       ← POST on-demand snapshot
│   ├── cli/           ← CLI commands (feed, resolve, snapshot, tastemaker)
│   ├── components/    ← Shared UI (prediction-card)
│   ├── config/        ← Zod-validated env vars
│   ├── db/            ← Drizzle client, schema, migrations
│   ├── domains/
│   │   ├── feed/          ← types, repo, service
│   │   ├── predictions/   ← schema
│   │   ├── resolution/    ← repo, service (cron stub)
│   │   ├── soundcloud/    ← SC client, snapshot service, repo, types
│   │   └── tastemakers/   ← repo, service
│   ├── tastemakers/[id]/  ← Profile page
│   ├── layout.tsx
│   └── page.tsx
├── spec/              ← Implementation reference (data-model, sc-api, eas, etc.)
├── research/          ← Simulation, theory, analysis docs
├── docs/              ← Vocs documentation site (public)
├── scenius-paper/     ← Academic paper + frontend reader (submodule)
└── .env               ← secrets (gitignored)
```

## Tech Stack (quick reference)

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS + CSS variables |
| Auth + Wallet | Para |
| Reputation Graph | Memory Protocol |
| Market Data | SoundCloud API (client credentials) |
| Database | Supabase (Postgres + Drizzle ORM) |
| Deployment | Vercel |
| ENS | wagmi + viem |
| Attestations | EAS (@ethereum-attestation-service/eas-sdk) |
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
- **Privacy policy required before launch** — add to M9 polish milestone.
- **`.env` is gitignored.** Never commit secrets.

## Key Docs

### Top-level
- Project rules for Claude → `CLAUDE.md`
- Architecture + domains → `ARCHITECTURE.md`
- Invariants + golden rules → `BELIEFS.md`
- Quality + known debt → `QUALITY.md`
- Product scope → `PRD.md`
- Engineering decisions → `EED.md`
- Plans → `plans/m3-sc-integration.md`, `plans/m4-feed-profiles.md`, `plans/m5-prediction-flow.md`

### spec/ — implementation reference (read when working on a specific domain)
- `spec/data-model.md` — full Supabase schema (artists, catalog_snapshots, tastemakers, predictions, posts)
- `spec/sc-api.md` — SoundCloud endpoints, auth, rate limits, snapshot job, Zod schemas
- `spec/resolution-logic.md` — delta formula, YES/NO outcome, EMA update, Friday cron schedule
- `spec/eas.md` — attestation schemas, when UIDs get written, mainnet gate (human approval required)
- `spec/stack.md` — Next.js 15 conventions, Zod at all API edges, no `any` in resolution logic
- `spec/attribution.md` — SoundCloud ToS constraints, attribution requirement, no artist-dedicated pages
