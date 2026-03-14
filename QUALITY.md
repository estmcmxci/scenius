# QUALITY.md — Domain Quality Grades

Updated: 2026-03-12 | Status: pre-build

Grades: A (solid) / B (minor debt) / C (needs work) / D (known holes) / — (not started)

## Application Domains

| Domain | Grade | Notes |
|---|---|---|
| feed | — | Not started |
| predictions | — | Not started |
| tastemakers | — | Not started |
| soundcloud | — | Credentials in .env. Integration not started. |
| resolution | — | Not started |

## Infrastructure

| Layer | Grade | Notes |
|---|---|---|
| Next.js scaffold | — | Not started |
| Supabase schema | — | Data model defined in PRD; not implemented |
| Vercel Cron | — | Not started |
| EAS integration | — | Not started |
| Memory Protocol | — | Not started |
| Para auth | — | Not started |
| CI / linting | — | Not started |
| .gitignore | ✓ | Done |
| AGENTS.md harness | ✓ | Done |

## Known Debt

- No test coverage anywhere (pre-build, expected)
- No attribution component yet (BELIEFS §2 — required before public launch)
- No privacy policy (BELIEFS §4 — required before public launch)
- Stream threshold for MVP is placeholder (500K) — needs genre benchmarking

## Review Cadence

Update this file when:
- A domain reaches first working state (grade: D)
- A known debt item is resolved
- A new debt item is identified
