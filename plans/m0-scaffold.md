# Plan: M0–M2 — Scaffold + SC Integration

**Status:** Active
**Milestone:** PRD M0 (Mar 14) + M1 (Mar 21) + M2 (Mar 21)
**Owner:** Solo builder
**Updated:** 2026-03-12

## Goal

Stand up the Next.js 15 app with Supabase, implement the SC API client,
and wire the snapshot job. Result: a running app that can pull live SC
metrics and store a snapshot. No UI yet.

## Steps

- [ ] M0: Confirm SC API credentials work (client credentials flow)
- [ ] M0: Test `GET /resolve?url=` and `GET /users/{id}/tracks` against a real SC URL
- [ ] M2: `npx create-next-app@latest app` — Next.js 15, App Router, Tailwind, TypeScript
- [ ] M2: Set up Supabase project, add `DATABASE_URL` to `.env`
- [ ] M2: Install Drizzle ORM, create initial migration from PRD data model
- [ ] M2: Implement `app/config/env.ts` — Zod-validated env vars (fail fast)
- [ ] M2: Implement `app/domains/soundcloud/` — SC API client + Zod response schemas
- [ ] M2: Implement `catalog_snapshots` repo layer
- [ ] M3: Implement snapshot-on-demand service function
- [ ] M3: Wire Vercel Cron job stub for Friday resolution
- [ ] M3: Smoke test: submit a snapshot for a real SC artist URL, confirm DB write

## Decisions

- Drizzle over Prisma: lighter, better Supabase support, easier for agents to reason about
- Zod for all SC API response parsing (BELIEFS §5)
- `app/` subdirectory for Next.js app (keeps root clean alongside research/docs)

## Open

- Para early access — apply or use email auth fallback for M5?
- Memory Protocol API — stub or live for MVP?
- Stream threshold for seeded artists — 500K placeholder, needs benchmarking
