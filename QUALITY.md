# QUALITY.md — Domain Quality Grades

Updated: 2026-04-08 | Status: M3 complete, M4 in progress

Grades: A (solid) / B (minor debt) / C (needs work) / D (known holes) / — (not started)

## Application Domains

| Domain | Grade | Notes |
|---|---|---|
| feed | D | Types, repo, service done (SCE-11). CLI command works. No UI yet. |
| predictions | D | Schema defined, used by feed + resolution queries. No creation flow yet. |
| tastemakers | D | Repo, service, profile page done (SCE-14). CLI command works. |
| soundcloud | C | SC client, snapshot service, repo all working. CLI e2e verified (SCE-6). API route done (SCE-7). Track-level metrics returning 0 (SCE-20). |
| resolution | D | Cron stub done (SCE-8). Queries due predictions, logs count. No actual resolution yet. |

## Infrastructure

| Layer | Grade | Notes |
|---|---|---|
| Next.js scaffold | C | App Router, layouts, Tailwind configured. One page (tastemaker profile). |
| Supabase schema | C | 5 tables via Drizzle migrations. IPv4 pooler configured (SCE-5). |
| Vercel Cron | D | Resolve stub in vercel.json (Fridays noon UTC). Snapshot cron not yet wired. |
| EAS integration | — | Not started |
| Memory Protocol | — | Dropped (EAS replaces) |
| Para auth | — | Not started |
| CI / linting | — | Not started |
| .gitignore | ✓ | Done |
| CLAUDE.md | ✓ | Done — project rules loaded every conversation |

## Known Debt

- No test coverage (unit tests for reputation math, delta formula needed)
- No attribution component yet (BELIEFS §2 — required before public launch)
- No privacy policy (BELIEFS §4 — required before public launch)
- Stream threshold for MVP is placeholder (500K) — needs genre benchmarking
- Track-level metrics returning 0 in snapshots (SCE-20)
- No loading.tsx or error.tsx boundaries on any route

## Review Cadence

Update this file when:
- A domain reaches first working state (grade: D)
- A known debt item is resolved
- A new debt item is identified
