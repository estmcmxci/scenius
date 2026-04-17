# ETHConf 2026 Demo Script — Scenius (v0.2)

**Length:** 3 minutes
**Audience:** Crypto builders / onchain-native
**URL on screen:** `https://scenius.blog`
**Tabs open (in order):** feed → hero prediction detail → easscan.org attestation → tastemaker profile → feed (close)

> **Note:** This draft uses the Apr 17 rehearsal batch as the concrete example. On demo day, swap the hero prediction for whichever YES resolves closest to Jun 8 from the SCE-60 demo-day batch. The *structure* below is final; the *numbers* are placeholders that get updated after SCE-60.

---

## Timing at a glance

| Beat | Duration | Action |
|---|---|---|
| Hook — the problem | 0:00 – 0:15 | No screen, look at audience |
| The feed | 0:15 – 0:45 | `scenius.blog/` |
| **The climax — onchain proof** | **0:45 – 1:45** | Prediction detail → easscan.org |
| Reputation compounding | 1:45 – 2:30 | Tastemaker profile |
| Close | 2:30 – 3:00 | Back to feed |

---

## 0:00 – 0:15 — Hook

> "The people who spot great music first almost never get credit. A friend sends you a SoundCloud link; the track blows up a year later; nobody remembers they called it. We built a way to make that track record portable and verifiable."

*(Beat. Let it land. Then pivot.)*

---

## 0:15 – 0:45 — The feed

*Navigate to `scenius.blog`.*

> "This is Scenius. Every card is a binary prediction on a real SoundCloud track — *will this hit N plays in X weeks*. You can see the tastemaker's name, their reputation score, the track's play count at the moment the prediction was made."

*Point at 2–3 cards.*

> "All data pulled live from SoundCloud. No synthetic metrics. Attribution on every card — ToS requirement, also a design choice. We don't want to be the system of record — SoundCloud is."

---

## 0:45 – 1:45 — The climax: onchain proof *(the moment)*

*Click the hero prediction card.* **Current hero (rehearsal batch):** `no one else prodshushy (synthclub remix)` by **ki** — `/predictions/81838eb9-8f23-4893-83e7-80ec2c72848f`

> "This is the prediction. DJ Booth Curator called it a week before — *will hit 10,000 plays in 1 week*. Track had 10,636 plays when the call was made."

*Scroll down to the resolution section. Point at "Attested on EAS."*

> "It resolved YES. Actual delta was **+45,333 plays**. Four and a half times the threshold. Let's see the receipt."

*Click "Attested on EAS" → `base-sepolia.easscan.org/attestation/view/0xcdfba0...`*

> "This is the attestation, onchain, on Base Sepolia. Prediction ID, tastemaker wallet, resolved outcome, actual delta from the snapshot. It's an EAS attestation — portable, verifiable, independent of us. **If Scenius disappears tomorrow, this tastemaker's track record still exists in the graph.**"

*(Pause. Let the audience read the attestation for 2–3 seconds.)*

> "Anyone in this room can query this graph and build a competing app tomorrow. That's the point."

---

## 1:45 – 2:30 — Reputation compounding

*Back to scenius.blog. Click the tastemaker's name.* **Current hero profile:** `DJ Booth Curator` at `/tastemakers/229b10fd-2635-4657-83eb-f43829ed0caf`

> "Here's their profile. Five calls resolved, three right. Win rate 60 percent. Reputation sits at 0.915 — started at 1.000, ticks up on correct calls, decays on misses."

*Scroll to the track record list.*

> "The math is transparent. It's an exponential moving average of the Brier score — a proper scoring rule — over every resolved prediction. Accurate calls compound; wrong ones decay. No AI, no opaque model."

*Point at 2–3 resolved predictions with YES/NO badges.*

> "Every one of these has an EAS attestation. Reputation here is literally a function of public data."

---

## 2:30 – 3:00 — Close

*Back to the feed.*

> "That's the full loop. Real data in. Binary outcomes resolved against SoundCloud. Reputation compounds via a proper scoring rule. Writes onchain via EAS.
>
> The reputation graph is native to EAS, which means you can fork it — train your own tastemaker weighting, filter your own feed, build discovery tools on top.
>
> Live at `scenius.blog`. Come find us after."

*(End. Applause cue.)*

---

## Concrete data for rehearsal (Apr 17 batch)

Use these exact numbers when practicing; swap for the SCE-60 demo-day equivalents before Jun 8.

| Field | Value |
|---|---|
| Hero track | `no one else prodshushy (synthclub remix)` by ki |
| Prediction URL | `https://scenius.blog/predictions/81838eb9-8f23-4893-83e7-80ec2c72848f` |
| Threshold | 10,000 plays in 1 week |
| Plays at prediction | 10,636 |
| Delta on resolution | +45,333 (~4.5× threshold) |
| Outcome | YES |
| Tastemaker | DJ Booth Curator (`0x1111...1111`) |
| Tastemaker profile | `https://scenius.blog/tastemakers/229b10fd-2635-4657-83eb-f43829ed0caf` |
| Reputation (post-batch) | 0.915 (from 1.000 baseline) |
| Win rate (post-batch) | 60% (3/5 resolved correctly) |
| Prediction EAS UID | `0xcdfba0efcc2e87eb0bc4835e0ccec927ae597ddde2981bdef5497a22227ec3b3` |
| Reputation EAS UID | `0x6813c697050cece7c18a1e8360bfc781edb53712c8f9bc2539dd9c502d6c02da` |
| easscan.org link | `https://base-sepolia.easscan.org/attestation/view/0xcdfba0efcc2e87eb0bc4835e0ccec927ae597ddde2981bdef5497a22227ec3b3` |

---

## Backup & edge cases

- **SoundCloud rate-limits mid-demo** → feed still renders (data is pre-snapshotted, cron-refreshed). Don't submit a new prediction live.
- **easscan.org is slow to load** → have the attestation URL open in a pre-loaded second tab.
- **Browser tab favicon doesn't load** → who cares. Keep going.
- **"Unavailable" card visible on feed** → that's a voided prediction (track was deleted from SC). If it distracts from the story, scroll past or hide. Don't try to explain void-handling on stage.
- **Audience question about AI** → "Not AI. Proper scoring rule — exponential moving average of Brier score. Details in the paper at scenius.blog/about." *(assumes SCE-64 landing page lands; if not, just say "paper"/"research doc")*
- **Audience question about resolution mechanics** → "Cron job snapshots SoundCloud, deltas compared against threshold, winners marked. EAS write in the same transaction."
- **Audience question about Sybil / tastemaker trust** → "Reputation starts at 1.0 and only moves with real outcomes. Nothing prevents multiple identities per human, but each identity's graph is independent and the proper scoring rule punishes noise. The market filters itself."

## Open questions for v0.3

- Do we open the demo by showing the feed (current plan) or by showing the EAS attestation page first and working backwards to the prediction? The proof-first approach is more punchy but harder to pace.
- Is "Scenius" pronounced like *genius* (/ˈsiːniəs/) or *scene-e-us* (/ˈsiːniəs/ vs /ˈsiːn.i.əs/)? Pick one. Consistency over correctness.
- Slides / deck, yes or no? A plain-browser walkthrough is cleaner but loses a title card. A 1-slide cold-open ("Scenius" + tagline) then cut to browser might be the right balance.

---

*v0.2 drafted 2026-04-17 post-resolution. Revise to v0.3 after SCE-60 (demo-day seed) to replace rehearsal numbers with actual demo-day hero.*
