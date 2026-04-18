# ETHGlobal outreach email — draft v0.2

**Context:** short email to a known contact at ETHGlobal to share the
current Scenius MVP and float a demo-slot ask for ETHConf NYC
(Jun 8–10). Continuation of a prior thread.

**Sources:** copy distilled from
[`demo/ethconf-2026-script.md`](ethconf-2026-script.md) v0.2.

---

## Plain text (recommended for Gmail / most clients)

**Subject:** Scenius update + ETHConf demo slot ask

Hi [Name],

Quick update — wanted to share where Scenius landed and float a demo-slot ask for ETHConf NYC.

What it is: a reputation-weighted prediction market for independent music. Tastemakers post binary calls on real SoundCloud tracks — *will this hit N plays in X weeks?* Accurate calls compound reputation via a proper scoring rule. Every resolved prediction writes an EAS attestation on Base Sepolia, so the reputation graph is portable — independent of the app.

Proof it works: DJ Booth Curator predicted "no one else prodshushy" by ki would hit 10,000 plays in a week. It hit 45,333 — 4.5× the threshold. The attestation is onchain:
https://base-sepolia.easscan.org/attestation/view/0xcdfba0efcc2e87eb0bc4835e0ccec927ae597ddde2981bdef5497a22227ec3b3

Live: https://scenius.blog
Repo: https://github.com/estmcmxci/scenius
Paper (mechanism formalization): https://github.com/estmcmxci/scenius-paper

Would love to get Scenius on stage at ETHConf — a 3-minute walkthrough of the full loop with the attestation reveal lands cleanly. Happy to send the demo script if useful. If easier, grab 15 on my calendar: https://calendly.com/oakgroup-worldwide/building-together

Thanks,
[Your name]

---

## Design choices

- **Subject line** puts the ask first so it's skim-safe.
- **Opening** is continuation-style ("Quick update") for a prior thread.
- **Proof** is one concrete sentence with a raw easscan URL.
- **Three links** in a block (Live / Repo / Paper) for clean hierarchy.
- **Paper** framed as "mechanism formalization" — substance, not academic flex.
- **Ask** offers two paths: the soft-ask framing stays open for "pointer to application process," and the Calendly link (`oakgroup-worldwide/building-together`) lets them self-book a call if that's easier. Pronunciation of *Scenius* (like *genius*) handled in conversation, not email.

## Tweaks to apply before sending

- Replace `[Name]` (likely Pascal) and `[Your name]`.
- If the paper repo isn't ready for public eyes, drop that third link — README already references it.
- For a tighter (~120 word) variant, cut the Paper link and the "demo script" line.

---

*v0.2 drafted 2026-04-18. Calendly link added, pronunciation moved to conversation. Revise to v0.3 after first response.*
