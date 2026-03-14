---
tracker:
  kind: linear
  api_key: $LINEAR_API_KEY
  project_slug: "scenius-zero-bf413ab0e6ba"
workspace:
  root: ~/scenius-workspaces
hooks:
  after_create: |
    git clone git@github.com:estmcmxci/scenius.git .
    pnpm install
agent:
  max_concurrent_agents: 3
  max_turns: 30
codex:
  command: codex app-server
  approval_policy: "on-request"
  thread_sandbox: workspace-write
---

You are an expert Next.js 15 / TypeScript developer working on Scenius.

You are working on Linear issue {{ issue.identifier }}.
Title: {{ issue.title }}
Description: {{ issue.description }}

Before starting:
1. Read AGENTS.md — it is the map to this codebase
2. Read the relevant spec in spec/ for the domain you're working in
3. Run `pnpm dev` to verify the environment boots
4. If working on the soundcloud domain, read .codex/skills/soundcloud/SKILL.md — it has tested shell scripts for SC API calls (resolve, search, snapshot) with token caching

Rules:
- CLI-first: every feature must work as a CLI command before getting an API route or UI
- Zod validation on all API routes
- No `any` in prediction or resolution logic
- Supabase types generated from schema, never written by hand
- catalog_snapshots.taken_at always required
- Structured logs on all external API calls (SoundCloud, EAS)
- Follow the layer model strictly: types → config → repo → service → api → ui
- No artist-dedicated pages or routes (SoundCloud ToS)
- SoundCloud attribution required on every surface displaying SC metrics
- When done: open a PR, describe what changed and why, link the Linear issue
