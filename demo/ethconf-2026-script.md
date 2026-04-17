# ETHConf 2026 Demo Script — Scenius (v0.1)

**Length:** 3 minutes
**Audience:** Crypto builders / onchain-native
**URL on screen:** `https://scenius.blog`
**Tabs open (in order):** feed → resolved prediction detail → easscan.org attestation → tastemaker profile → feed (close)

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

*Click into a resolved prediction — ideally `ki` / `no one else prodshushy`, which hit 10K in 1w.*

> "This one resolved on April 17. Threshold was 10,000 plays in a week. It hit [actual delta]. Let's see the receipt."

*Click the "Attested on EAS" link. Page loads `easscan.org`.*

> "This is the attestation, onchain, on Base Sepolia. Prediction ID, tastemaker wallet, resolved outcome, actual delta from the snapshot. It's an EAS attestation — portable, verifiable, independent of us. **If Scenius disappears tomorrow, this tastemaker's track record still exists in the graph.**"

*(Pause. Let the audience read the attestation for 2–3 seconds.)*

> "Anyone in this room can query this graph and build a competing app tomorrow. That's the point."

---

## 1:45 – 2:30 — Reputation compounding

*Back to scenius.blog. Click the tastemaker's name on the prediction detail page.*

> "Here's their profile. Before this prediction resolved, reputation was 1.000. After — it ticked up a hair."

*Scroll to the track record list.*

> "The math is transparent. It's an exponential moving average of the Brier score — a proper scoring rule — over every resolved prediction. Accurate calls compound; wrong ones decay. No AI, no opaque model."

*Point at 1–2 other predictions.*

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

## Backup & edge cases

- **SoundCloud rate-limits mid-demo** → feed still renders (cached). Don't submit a new prediction live.
- **easscan.org is slow to load** → have the attestation URL open in a pre-loaded second tab.
- **Browser tab favicon doesn't load** → who cares. Keep going.
- **Audience question about AI** → "Not AI. Proper scoring rule. Details in the paper."
- **Audience question about resolution mechanics** → "Cron job snapshots SoundCloud, deltas compared against threshold, winners marked. Atomic with EAS write."

## Open questions for v0.2

- Confirm which specific resolved prediction is the "hero" on demo day — depends on which of the 9 Apr 17 predictions resolved YES vs NO.
- Decide whether to do the climax reveal on live prod (`scenius.blog`) vs. a pre-loaded recording as fallback. Current plan: live, with recording on a second device.
- Is "Scenius" pronounced like *genius* or *scene-e-us*? Pick one. Consistency over correctness.

---

*v0.1 drafted 2026-04-17. Revise after Apr 17 resolution (to pick the hero prediction) and after SCE-61 full-loop verification.*
