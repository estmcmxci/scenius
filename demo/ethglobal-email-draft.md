# ETHGlobal outreach email — draft v0.3

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

What it is: a reputation-weighted prediction market for independent music. Tastemakers post binary calls on real SoundCloud tracks — *will this hit N plays in X weeks?* Accurate calls compound reputation via an EMA over the Brier score — a proper scoring rule. Every resolved prediction writes an EAS attestation on Base Sepolia, so the reputation graph is portable — independent of the app.

Proof it works: a prediction that *"no one else prodshushy"* by ki would hit 10,000 plays in a week resolved YES with +45,333 actual plays — 4.5× the threshold. Attestation onchain:
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
- **Proof** is impersonal — the prediction itself is the proof, not the tastemaker who posted it. The rehearsal-batch tastemakers are seeded fixtures with placeholder wallets (`0x1111...1111`), so naming them in the email invites a "who actually made this call?" teardown on click-through. Once SCE-60 seeds demo-day predictions with real Para-signed wallets, the proof sentence can be upgraded to name the tastemaker.
- **Mechanism** stated precisely: the proper scoring rule is the Brier score; the EMA is the aggregation on top. Conflating them ("proper scoring rule (EMA)") is sloppy.
- **Three links** in a block (Live / Repo / Paper) for clean hierarchy.
- **Paper** framed as "mechanism formalization" — substance, not academic flex.
- **Ask** offers two paths: the soft-ask framing stays open for "pointer to application process," and the Calendly link (`oakgroup-worldwide/building-together`) lets them self-book a call if that's easier. Pronunciation of *Scenius* (like *genius*) handled in conversation, not email.

## Tweaks to apply before sending

- Replace `[Name]` (likely Pascal) and `[Your name]`.
- If the paper repo isn't ready for public eyes, drop that third link — README already references it.
- For a tighter (~120 word) variant, cut the Paper link and the "demo script" line.

---

*v0.3 drafted 2026-04-18. Proof sentence depersonalized (seed-tastemaker placeholder-wallet honesty gap), "proper scoring rule (EMA)" corrected to "EMA over the Brier score — a proper scoring rule." Revise to v0.4 after SCE-60 lands real-wallet tastemakers, or after first response.*
