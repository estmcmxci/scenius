# ARCHITECTURE.md — Scenius Domain Map

## Domains

The application is divided into five business domains:

| Domain | Responsibility |
|---|---|
| `feed` | Discovery feed — listing of prediction cards, filtering by genre/tag |
| `predictions` | Prediction lifecycle: creation, snapshot, resolution, EAS attestation |
| `tastemakers` | User profiles, reputation score, EAS-attested track record |
| `soundcloud` | SC API client, snapshot jobs, metric display, attribution |
| `resolution` | Cron job: snapshot delta → outcome → EAS write → reputation update |

## Layer Model

Within each domain, code flows strictly forward through these layers:

```
types → config → repo → service → cli → api → ui
```

- `types` — pure TypeScript interfaces and Zod schemas. No imports from other layers.
- `config` — constants, env vars (validated at startup). Imports: types only.
- `repo` — Supabase/Drizzle DB access. Imports: types, config.
- `service` — business logic, orchestration. Imports: types, config, repo.
- `cli` — CLI commands that exercise the service layer directly. Every feature works here first.
- `api` — Next.js route handlers. Imports: service and below.
- `ui` — React components and pages. Imports: api (via fetch) or service (server components).

**CLI-first rule:** A feature is not done until it works as a CLI command.
The CLI is the proof that the service layer is correct. The API and UI
are thin wrappers. See `BELIEFS.md` §5.

Cross-cutting concerns (auth, telemetry, feature flags) enter through a single
explicit interface: **Providers** (Next.js layout wrappers).

**Dependency violations are a build error.** No exceptions.

## Package Boundaries

```
app/
├── domains/
│   ├── feed/
│   ├── predictions/
│   ├── tastemakers/
│   ├── soundcloud/
│   └── resolution/
├── shared/           ← shared utilities (no domain imports allowed here)
├── providers/        ← cross-cutting: auth, wallet, telemetry
├── cli/              ← CLI commands (tsx scripts exercising service layer)
└── app/              ← Next.js App Router pages + layouts
```

## Data Flow — Prediction Lifecycle

```
[tastemaker submits prediction]
  → soundcloud.service: pull live metrics → catalog_snapshot
  → predictions.repo: create prediction + snapshot_id
  → return shareable /predictions/[id] URL

[every Friday — Vercel Cron]
  → resolution.service: for each pending prediction past horizon:
    → soundcloud.service: pull current metrics → resolution_snapshot
    → compute delta (current_plays - snapshot_plays)
    → outcome = YES if delta >= stream_threshold
    → eas.service: write attestation onchain
    → tastemakers.service: run EMA reputation update
    → predictions.repo: mark resolved
```

## Routing

```
/                        → discovery feed
/predictions/[id]        → prediction page (artist as context, prediction as unit)
/tastemakers/[id]        → tastemaker profile + track record
/submit                  → prediction submission form
/resolved                → resolution feed with EAS attestation links
```

**There is no `/artists/[id]` route.** This is intentional and enforced. See `BELIEFS.md`.
