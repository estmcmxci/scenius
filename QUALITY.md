# QUALITY.md — Domain Quality Grades

Updated: 2026-04-08 | Status: M9 complete

Grades: A (solid) / B (minor debt) / C (needs work) / D (known holes) / — (not started)

## Application Domains

| Domain | Grade | Notes |
|---|---|---|
| feed | B | Types, repo, service, CLI, UI with dark theme, track support, SC attribution. |
| predictions | B | Full CRUD, per-track predictions, Zod validation, detail page with OG tags. |
| tastemakers | B | Repo, service, profile page with ENS resolution, prediction cards. |
| soundcloud | B | SC client with track resolution, snapshot service, track snapshots, attribution component. |
| resolution | B | Full pipeline: delta → outcome → reputation → EAS attestation. Cron route wired. |

## Infrastructure

| Layer | Grade | Notes |
|---|---|---|
| Next.js scaffold | B | Dark theme, loading/error boundaries on all routes, mobile responsive, not-found page. |
| Supabase schema | B | 7 tables: artists, catalog_snapshots, tracks, track_snapshots, predictions, tastemakers, posts. 3 migrations. |
| Vercel Cron | C | Routes exist (`/api/cron/resolve`, `/api/cron/snapshot`), cron configured in vercel.json. Not yet deployed. |
| EAS integration | B | Schemas registered on Base Sepolia, attestation service working, test attestations written via CLI. |
| Para auth | B | SDK integrated, passkey sign-in via ParaModal, server-side session verification. Provider in layout. |
| CI / linting | — | Not started. |
| .gitignore | ✓ | Done. |
| CLAUDE.md | ✓ | Done — project rules loaded every conversation. |

## Known Debt

- No test coverage (unit tests still needed for reputation math, resolution logic)
- No CI/CD pipeline
- Loading/error boundaries added but not design-matched to dark theme yet
- OG images are text-only (no dynamic image generation)
- ENS resolution uses third-party RPC (llamarpc.com) — may need own node for production
- Privacy policy is boilerplate — needs legal review before real launch

## Review Cadence

Update this file when:
- A domain reaches first working state (grade: D)
- A known debt item is resolved
- A new debt item is identified
