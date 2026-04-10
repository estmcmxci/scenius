# CLAUDE.md — Scenius Project Instructions

## What This Is

Scenius is a reputation-weighted prediction market for independent music catalogs.
Tastemakers predict binary breakout events on real SoundCloud data. Accurate
predictors compound reputation via a proper scoring rule. Resolved predictions
are written onchain via EAS.

Target: live demo at ETHConf NYC, June 8–10, 2026.

Read `AGENTS.md` first for the full repo map. Read the relevant `spec/` file
before working on any specific domain.

---

## Hard Rules (non-negotiable)

### CLI-first development
Every feature must work as a CLI command before it gets an API route or UI.
Build order: `types → config → repo → service → CLI → api → ui`.
The CLI proves the service layer works. The web UI wraps it.
CLI entry point: `pnpm cli <command>` (runs `tsx --env-file=.env app/cli/index.ts`).

### Layer model
Code flows strictly forward within each domain:
```
types → config → repo → service → cli → api → ui
```
- `types` — pure TS interfaces and Zod schemas. No imports from other layers.
- `config` — constants, env vars. Imports: types only.
- `repo` — Drizzle DB access. Imports: types, config.
- `service` — business logic. Imports: types, config, repo.
- `cli` — CLI commands exercising the service layer.
- `api` — Next.js route handlers. Imports: service and below.
- `ui` — React components and pages. Imports: api (via fetch) or service (server components).

Dependency violations are build errors. No layer may import from a layer above it.

### No artist-dedicated pages
SoundCloud ToS prohibits pages dedicated to a specific artist.
There is no `/artists/[id]` route. This must never be created.
Artist identity is always context inside a prediction page (`/predictions/[id]`).

### SoundCloud attribution required
Every surface displaying SC data (play counts, followers, reposts) must
attribute to SoundCloud and the respective artist inline. Build attribution
into shared components so it cannot be omitted.

### No AI framing
The reputation scoring algorithm is a proper scoring rule (EMA of Brier score).
Never describe it as "AI trained on SoundCloud data." Use: "statistical model,"
"proper scoring rule," or "reputation scoring algorithm."

---

## Engineering Rules

### Zod at all boundaries
Parse, don't validate. All external data (SC API responses, form inputs, request
bodies) must be parsed through Zod schemas. Never assume the shape of external data.

### No `any` in prediction or resolution logic
The reputation math operates on floats with specific bounds. Untyped data causes
silent incorrect scores. If TS can't infer a type, add a Zod parse — do not cast
with `as any` or `as unknown as X`.

### Secrets never in code
All secrets via `.env` (gitignored). Validate env vars at startup in
`app/config/env.ts` using Zod. Never use `process.env.X` directly outside that file.

### File size limit
No file over 300 lines. Split at ~200 lines: services in `service.ts`,
types in `types.ts`, DB access in `repo.ts`.

### No barrel files
No `index.ts` that re-exports everything — they hide dependency direction.
Use path aliases: `@/app/domains/soundcloud/...` not `../../../domains/...`.

### Plans before big changes
For any change touching more than one domain or more than ~200 lines, create
a plan file in `plans/` first. Check it in. Then write code.

### Shared utilities
Before implementing a utility, check `app/shared/`. If it exists there, use it.
If it doesn't exist, add it there — not inline in a domain.

---

## Reputation Scoring (do not deviate)

```
r_i = (1 - α) * r_i + α * exp(-β * (p_ij - Y_j)^2)
```
Where α = 0.05 (EMA smoothing), β = 5 (sharpness).
All tastemakers initialize at r = 1.0. This is the canonical formula from the
Scenius paper. Do not adjust without updating `research/theory.md`.

---

## Domains

| Domain | Responsibility |
|---|---|
| `feed` | Discovery feed — listing prediction cards, filtering |
| `predictions` | Prediction lifecycle: creation, snapshot, resolution, EAS |
| `tastemakers` | User profiles, reputation score, EAS-attested track record |
| `soundcloud` | SC API client, snapshot jobs, metric display, attribution |
| `resolution` | Cron: snapshot delta → outcome → EAS → reputation update |

Domain code lives in `app/domains/<name>/`. Each domain has `types/`, `repo/`,
`service/` subdirectories.

---

## Package Layout

```
app/
├── domains/
│   ├── feed/
│   ├── predictions/
│   ├── tastemakers/
│   ├── soundcloud/
│   └── resolution/
├── shared/           ← shared utilities (no domain imports)
├── components/       ← shared UI components
├── providers/        ← cross-cutting: auth, wallet, telemetry
├── cli/              ← CLI commands
├── config/           ← env validation
├── db/               ← Drizzle client + schema
└── api/              ← Next.js route handlers
```

---

## Routes

```
/                        → discovery feed
/predictions/[id]        → prediction page (artist as context)
/tastemakers/[id]        → tastemaker profile + track record
/submit                  → prediction submission form
/resolved                → resolution feed with EAS attestation links
```

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, server components by default) |
| Styling | Tailwind CSS + CSS variables |
| ORM | Drizzle |
| Database | Supabase (Postgres) |
| Validation | Zod |
| Auth + Wallet | Para (passkey) |
| Reputation Graph | EAS (onchain attestations) |
| Market Data | SoundCloud API (client credentials) |
| Attestations | EAS (@ethereum-attestation-service/eas-sdk) |
| Deployment | Vercel |
| Cron | Vercel Cron Jobs |
| CLI runtime | tsx |

---

## Next.js Conventions

- App Router only. No Pages Router.
- Server Components by default. Only add `'use client'` for browser APIs / hooks.
- Route handlers use `NextRequest` / `NextResponse`.
- Providers go in layouts, not leaf components.
- Env vars are server-side only unless prefixed `NEXT_PUBLIC_`.

---

## Workflow

- **Linear** is the issue tracker. Project: Scenius Zero. Team key: SCE.
- **GitHub** repo: `estmcmxci/scenius`. PRs link to Linear issues.
- Every PR describes what changed and why, and links the Linear issue.
- Small changes: PR directly. Features/milestones: plan in `plans/` first.

---

## EAS CLI (easctl)

`easctl` is installed at `~/easctl` for interacting with Ethereum Attestation Service.
Use it for schema registration and attestation testing — not for production code.

```bash
npx easctl --help
```

**When to use:**
- Registering attestation schemas on testnet (`easctl schema-register --chain base-sepolia`)
- Testing attestation writes manually before wiring into the resolution service
- Inspecting existing attestations (`easctl get-attestation --uid ... --decode`)
- Dry-run gas estimation (`--dry-run` flag)

**When NOT to use:**
- Production attestation writes — use `@ethereum-attestation-service/eas-sdk` in the resolution service
- Anything requiring programmatic control — easctl is for manual/interactive use only

**Config:** `easctl set-key` stores a private key at `~/.easctl`. Or set `EAS_PRIVATE_KEY` env var.
**Schemas:** Defined in `spec/eas.md`. Register on Base Sepolia for MVP, mainnet only after human approval.

---

## Key Reference Files

- `AGENTS.md` — repo map and entry point
- `ARCHITECTURE.md` — domain map, layer model, data flow
- `BELIEFS.md` — golden principles and invariants
- `QUALITY.md` — per-domain quality grades and known debt
- `PRD.md` — product requirements (v0.4 MVP)
- `EED.md` — engineering execution design
- `spec/data-model.md` — full Supabase schema
- `spec/sc-api.md` — SoundCloud endpoints, auth, Zod schemas
- `spec/resolution-logic.md` — delta formula, outcome, EMA update
- `spec/eas.md` — attestation schemas
- `spec/stack.md` — Next.js conventions, Zod rules, file limits
- `spec/attribution.md` — SoundCloud ToS constraints
