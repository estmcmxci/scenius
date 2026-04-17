# Scenius

**Reputation-weighted predictions on independent music.**

Live: [**scenius.blog**](https://scenius.blog) · Chain: Base Sepolia · Attestation explorer: [easscan.org](https://base-sepolia.easscan.org/)

---

The people who spot great music first rarely get credit. A friend sends you a SoundCloud link; the track blows up a year later; nobody remembers they called it. **Scenius makes that track record portable and verifiable.**

Tastemakers post binary predictions on real SoundCloud tracks — *will this hit N plays in X weeks?* Play counts are snapshotted at prediction time and resolved against live SoundCloud data when the horizon expires. Accurate calls compound reputation via a [proper scoring rule](https://en.wikipedia.org/wiki/Scoring_rule). Every resolved prediction writes an [EAS](https://attest.sh) attestation to Base Sepolia, so reputation lives onchain — independent of this app.

## Proof it works

First resolution cycle ran on **2026-04-17** with 9 predictions due. Results:

- **8 resolved + attested** (1 YES, 7 NO)
- **1 voided** (track was deleted from SoundCloud mid-horizon)
- **16 EAS attestations** written to Base Sepolia in one transaction batch

**Hero prediction:** DJ Booth Curator predicted *"no one else prodshushy (synthclub remix)"* by **ki** would hit 10,000 plays in 1 week. Actual delta: **+45,333 plays** — 4.5× the threshold.

- Prediction: [`/predictions/81838eb9...`](https://scenius.blog/predictions/81838eb9-8f23-4893-83e7-80ec2c72848f)
- Onchain attestation: [easscan.org/attestation/view/0xcdfba0...](https://base-sepolia.easscan.org/attestation/view/0xcdfba0efcc2e87eb0bc4835e0ccec927ae597ddde2981bdef5497a22227ec3b3)
- Tastemaker profile: [`/tastemakers/229b10fd...`](https://scenius.blog/tastemakers/229b10fd-2635-4657-83eb-f43829ed0caf) — reputation 0.915 after 5 resolved calls, 60% win rate

## How it works

1. **Real data in.** Every prediction anchors to a live SoundCloud track. Play counts are snapshotted at prediction time and refreshed by a weekly cron. No synthetic metrics.

2. **Proper scoring rule.** Reputation is an exponential moving average of Brier score over every resolved prediction. Accurate calls compound; wrong ones decay. No AI, no opaque model — see [`spec/resolution-logic.md`](spec/resolution-logic.md) for the math.

3. **Portable onchain.** Every resolved prediction writes an EAS attestation on Base Sepolia. The reputation graph lives onchain — fork it, weight your own feed, build discovery tools on top.

## Tech

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, server components) |
| Styling | Tailwind v4 + CSS variables |
| ORM | Drizzle |
| Database | Supabase (Postgres) |
| Validation | Zod |
| Auth + Wallet | [Para](https://getpara.com) (passkey-based embedded wallets) |
| Attestations | [Ethereum Attestation Service](https://attest.sh) on Base Sepolia |
| Data source | SoundCloud API (client credentials) |
| Deploy | Vercel |
| Cron | Vercel Cron Jobs (weekly) |
| CLI runtime | tsx |

## Running it locally

```bash
pnpm install
cp .env.local.example .env
# Fill in DATABASE_URL, SOUNDCLOUD_*, SUPABASE_*, EAS_*, NEXT_PUBLIC_PARA_API_KEY
pnpm dev
```

Seed with real data:

```bash
pnpm cli seed-demo   # adds 8 pre-selected indie tracks
pnpm cli resolve     # runs resolution against due predictions
```

See [`AGENTS.md`](AGENTS.md) for the full dev map and [`spec/sc-api.md`](spec/sc-api.md) for SoundCloud API setup.

## Repo tour

```
app/
├── domains/         ← feed, predictions, tastemakers, soundcloud, resolution
├── components/      ← shared UI
├── shared/          ← cross-domain utilities (ens, formatters)
├── providers/       ← auth, wallet, telemetry
├── cli/             ← `pnpm cli <command>` entry points
├── config/          ← Zod-validated env
├── db/              ← Drizzle client + migrations
└── api/             ← Next.js route handlers (incl. /api/cron/*)
```

Internal docs:
- [`CLAUDE.md`](CLAUDE.md) — project rules (layer model, conventions)
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — domain map, data flow
- [`BELIEFS.md`](BELIEFS.md) — golden principles and invariants
- [`QUALITY.md`](QUALITY.md) — per-domain quality grades + known debt
- [`PRD.md`](PRD.md) — product requirements
- [`EED.md`](EED.md) — engineering execution design
- [`spec/`](spec/) — data model, SC API, resolution logic, EAS schemas, attribution
- [`plans/`](plans/) — milestone plans
- [`demo/ethconf-2026-script.md`](demo/ethconf-2026-script.md) — ETHConf demo script
- [`docs/`](docs/) — WIP developer docs site (inactive)

Research paper and exploratory notebooks live in a separate repo: [`estmcmxci/scenius-paper`](https://github.com/estmcmxci/scenius-paper).

## Credits

- **SoundCloud** — data source. Attribution is inline on every surface per the SoundCloud Terms of Service.
- **Ethereum Attestation Service** — portable, verifiable reputation graph.
- **Base Sepolia** — testnet chain for MVP attestations. Mainnet only after human approval.
- **Para** — passkey-based embedded wallets, no seed phrase.

## License

MIT
