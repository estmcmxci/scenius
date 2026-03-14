# BELIEFS.md — Golden Principles

These are the invariants that keep the codebase coherent. Encode them in lints
when possible. Treat violations as bugs, not style issues.

## Product Principles

**1. Prediction-first architecture**
The atomic unit is the prediction, not the artist. Every page, card, and URL
is anchored to a prediction. Artist identity is context inside that unit.
No page, route, or component should be *dedicated* to a single artist.
> Why: SoundCloud ToS explicitly prohibits artist-dedicated pages. Prediction-first
> is also the better product — the prediction card is already the design primitive.

**2. SoundCloud attribution is non-optional**
Every surface that displays SC data (play counts, follower counts, reposts) must
attribute to SoundCloud and the respective artist. Attribute inline, not just in
footers.
> Why: API ToS requirement. Build it into the shared metric display component
> so it's impossible to forget.

**3. Statistical model framing, not AI framing**
The reputation scoring algorithm is a proper scoring rule (EMA of Brier score).
Do not describe it as "AI trained on SoundCloud data." Use: "statistical model,"
"proper scoring rule," or "reputation scoring algorithm."
> Why: SoundCloud ToS prohibits training AI on SC content.

**4. Privacy policy before launch**
A privacy policy must exist before any public-facing launch. Boilerplate is fine
for MVP. Track as a M9 deliverable.

## Engineering Principles

**5. CLI-first development**
Every feature must work as a CLI command before it gets a UI. The service
layer is the product — the CLI proves it works, the web UI wraps it.
Build: `service` → `CLI command` → test → `api route` → `UI component`.
> Why: CLI-first means every feature is testable without a browser, agents
> can build and verify without UI tooling, and the service layer stays clean
> because it can't depend on React or Next.js concepts.

**6. Parse, don't validate at boundaries**
All external data (SC API responses, form inputs, DB reads) must be parsed
through Zod schemas at the boundary. Never assume the shape of external data.
See: https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/

**7. Prefer boring tech**
Well-understood, stable dependencies are easier for agents and humans alike.
Avoid bleeding-edge packages unless the PRD explicitly requires them.
When in doubt: fewer dependencies, more inline implementation.

**8. Centralize invariants, allow local autonomy**
Architectural boundaries are centrally enforced (layer model, no artist routes).
Within those boundaries, implementation style is free. The linter cares about
structure. It does not care about variable naming.

**9. Shared utilities over hand-rolled helpers**
Before implementing a utility, check `app/shared/`. If it exists there, use it.
If it doesn't exist, add it there — not inline in a domain.

**10. Secrets never in code**
All secrets via `.env` (gitignored). Validate env vars at startup in
`app/config/env.ts` using Zod. If the env var is missing, the app fails fast
with a clear error message.

**11. Plans before big changes**
For any change touching more than one domain or more than ~200 lines, create a
plan file in `plans/` first. Check it in. Then write code.

## Reputation Scoring (do not deviate)

The scoring rule from the Scenius paper:
```
r_i = (1 - α) * r_i + α * exp(-β * (p_ij - Y_j)^2)
```
Where α = 0.05 (EMA smoothing), β = 5 (sharpness).
All tastemakers initialize at r = 1.0. This is the canonical formula.
Do not "improve" it without reading the paper and updating `research/theory.md`.
