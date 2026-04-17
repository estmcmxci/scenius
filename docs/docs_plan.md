# Plan: Scaffold Scenius Documentation Site (Vocs)

> **Status (2026-04-17): inactive.** This Vocs site was scaffolded in Feb 2025
> but was superseded by the in-repo markdown docs (`CLAUDE.md`,
> `ARCHITECTURE.md`, `spec/`, `plans/`, `demo/`) + the top-level `README.md`.
> The project is kept on disk for potential revival post-ETHConf if a
> standalone developer docs site becomes valuable. Not currently deployed.

## Context

Pascal from ETHGlobal needs to see a working product by ETH Conf NYC (June 8). A polished docs site serves two purposes: (1) makes the project look legit for the Spotlight application, and (2) gives the hackathon MVP a home for its mechanism explanation, research, and API reference. Scenius already has ~150 KB of written content across 13 markdown files, 3 figure PDFs, a compiled paper, and simulation results. The docs site is mostly a reformatting + restructuring job, not a writing-from-scratch job.

Vocs (React + Vite static docs generator, file-based routing, MDX) is the tool. It's lightweight, web3-native, and deploys to Vercel in one command.

---

## Step 1: Initialize Vocs project

Create a `docs/` directory at the project root and scaffold with `npm init vocs`.

```
scenius/
├── docs/                    # NEW — Vocs docs site
│   ├── docs/
│   │   ├── pages/           # MDX page files (file-based routing)
│   │   ├── public/          # Static assets (images, figures, logo)
│   │   └── styles.css       # Global style overrides
│   ├── vocs.config.ts       # Site config (sidebar, nav, theme)
│   └── package.json
├── research/                # Existing
├── latex_text/              # Existing
└── EED.md                   # Existing
```

Run: `cd docs && npm init vocs` (or `pnpm create vocs`), then configure.

---

## Step 2: Configure `vocs.config.ts`

```ts
export default defineConfig({
  title: 'Scenius',
  description: 'Reputation-weighted prediction markets for cultural breakout events',
  sidebar: [
    {
      text: 'Introduction',
      items: [
        { text: 'What is Scenius', link: '/' },
        { text: 'The Problem', link: '/problem' },
        { text: 'How It Works', link: '/how-it-works' },
      ],
    },
    {
      text: 'Mechanism',
      items: [
        { text: 'Overview', link: '/mechanism/overview' },
        { text: 'Reputation Weighting', link: '/mechanism/reputation-weighting' },
        { text: 'Scoring Rules', link: '/mechanism/scoring' },
        { text: 'Simulation Results', link: '/mechanism/results' },
      ],
    },
    {
      text: 'Architecture',
      items: [
        { text: 'System Design', link: '/architecture/system-design' },
        { text: 'Onchain Attestations', link: '/architecture/attestations' },
        { text: 'Proof of Taste (zkTLS)', link: '/architecture/proof-of-taste' },
      ],
    },
    {
      text: 'Research',
      items: [
        { text: 'Paper', link: '/research/paper' },
        { text: 'Market Opportunity', link: '/research/market-opportunity' },
        { text: 'Literature', link: '/research/literature' },
      ],
    },
    {
      text: 'API Reference',
      collapsed: true,
      items: [
        { text: 'Markets', link: '/api/markets' },
        { text: 'Predictions', link: '/api/predictions' },
        { text: 'Reputation', link: '/api/reputation' },
      ],
    },
  ],
  socials: [
    { icon: 'github', link: 'https://github.com/...' },
  ],
})
```

---

## Step 3: Create pages — content mapping

Each page maps to existing source material. Pages marked **reformat** have content ready; pages marked **write** need new content.

### Introduction section

| Page | Source | Work |
|------|--------|------|
| `pages/index.mdx` — What is Scenius | `introduction_draft.md` paragraphs 1-3 + `EED.md` Section 1 | **Reformat** — distill into a punchy landing page |
| `pages/problem.mdx` — The Problem | `introduction_draft.md` (capital-weighting pathology) + `duetti_mfi_analysis.md` (3.2x vs 8.7x gap, sub-$1M deals) | **Reformat** — merge two sources into one accessible narrative |
| `pages/how-it-works.mdx` — How It Works | `Scenius_Design_Spec.md` (pipeline overview) + `EED.md` Section 6 (mechanism in code) | **Reformat** — strip math, keep intuition, add diagrams |

### Mechanism section

| Page | Source | Work |
|------|--------|------|
| `pages/mechanism/overview.mdx` | `model_methods_draft.md` Sections III-A through III-D | **Reformat** — accessible version of the model with optional math in collapsible blocks |
| `pages/mechanism/reputation-weighting.mdx` | `model_methods_draft.md` Section III-E (reputation update) + `Scenius_Design_Spec.md` (reputation section) | **Reformat** — the core innovation page, with worked examples |
| `pages/mechanism/scoring.mdx` | `Scenius_Design_Spec.md` (Brier + log loss sections) + `model_methods_draft.md` Section III-F | **Reformat** — explain proper scoring rules accessibly |
| `pages/mechanism/results.mdx` | `results_draft.md` (12 findings) + CSV data + figures | **Reformat** — key findings with embedded charts/figures, link to full paper |

### Architecture section

| Page | Source | Work |
|------|--------|------|
| `pages/architecture/system-design.mdx` | `EED.md` Sections 2-5 (architecture diagram, tech stack, DB schema) | **Reformat** — lift directly from EED |
| `pages/architecture/attestations.mdx` | `EED.md` Section 7 (EAS schemas) | **Reformat** — expand EAS schema definitions with examples |
| `pages/architecture/proof-of-taste.mdx` | `EED.md` Section 8 (Reclaim integration) + `introduction_draft.md` (Depop/Nettspend example) | **Reformat + light write** — explain the zkTLS flow, use Nettspend screenshot as motivating example |

### Research section

| Page | Source | Work |
|------|--------|------|
| `pages/research/paper.mdx` | `conclusion_draft.md` (abstract-like summary) + Figshare link | **Light write** — abstract, citation block, PDF download link, Figshare link |
| `pages/research/market-opportunity.mdx` | `duetti_mfi_analysis.md` + `walden_variant_markets_analysis.md` + `mulligan_boiling_frog_analysis.md` | **Reformat** — merge three analyses into one market context page |
| `pages/research/literature.mdx` | `theory.md` (annotated lit review, 65 KB) | **Reformat** — condense the 100-reference review into a structured summary with key citations |

### API Reference section

| Page | Source | Work |
|------|--------|------|
| `pages/api/markets.mdx` | `EED.md` Section 11 (API routes) | **Write** — stub endpoints with request/response shapes. Will be filled in as product is built |
| `pages/api/predictions.mdx` | `EED.md` Section 11 | **Write** — stub |
| `pages/api/reputation.mdx` | `EED.md` Section 11 | **Write** — stub |

---

## Step 4: Copy static assets

Copy into `docs/docs/public/`:
- `latex_text/nettspend.jpeg` → `public/nettspend.jpeg`
- `latex_text/fig_calibration.pdf` → convert to PNG → `public/fig-calibration.png`
- `latex_text/fig_inequality_sensitivity.pdf` → convert to PNG → `public/fig-inequality.png`
- `latex_text/fig_reputation_separation.pdf` → convert to PNG → `public/fig-reputation.png`
- Create or source a Scenius logo SVG → `public/logo.svg`

PDF figures need conversion to PNG for web display (use `pdftoppm` or similar).

---

## Step 5: Write the MDX pages

Work through pages in this order (most impactful first):

1. `index.mdx` — landing page (what is Scenius, one-liner, three bullet points, CTA to /problem)
2. `problem.mdx` — the capital-weighting problem + Duetti valuation gap
3. `how-it-works.mdx` — pipeline overview without math
4. `mechanism/overview.mdx` — the model, accessible
5. `mechanism/reputation-weighting.mdx` — core innovation deep dive
6. `mechanism/results.mdx` — key findings with figures
7. `architecture/system-design.mdx` — architecture diagram from EED
8. `research/paper.mdx` — abstract + Figshare link + citation
9. `mechanism/scoring.mdx` — Brier/log loss explainer
10. `architecture/attestations.mdx` — EAS schemas
11. `architecture/proof-of-taste.mdx` — Reclaim/zkTLS + Nettspend example
12. `research/market-opportunity.mdx` — merged market analysis
13. `research/literature.mdx` — condensed lit review
14. `api/markets.mdx`, `api/predictions.mdx`, `api/reputation.mdx` — stubs

---

## Step 6: Deploy

- Add to Vercel (or run `vercel` from `docs/` directory)
- Configure custom subdomain if available (e.g., `docs.scenius.xyz`)
- Add link to docs site in the Spotlight application and product repo

---

## Verification

1. `cd docs && npm run dev` — confirm all pages render, sidebar works, no broken links
2. Check that figures display correctly (PNG conversions)
3. Check math rendering (Vocs supports KaTeX via rehype plugin — may need to configure `markdown.rehypePlugins` in vocs.config.ts)
4. Test on mobile (judges check on phones)
5. Deploy to Vercel and confirm production build succeeds

---

## Effort Estimate

- **Scaffold + config**: ~30 min
- **Static assets**: ~15 min (copy + convert PDFs)
- **Pages 1-8** (core, mostly reformatting): ~3-4 hrs
- **Pages 9-14** (secondary, lighter): ~2 hrs
- **Polish + deploy**: ~30 min
- **Total**: ~6-7 hrs

Most of this is reformatting existing content into MDX, not writing from scratch.
