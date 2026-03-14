# spec/attribution.md — SoundCloud ToS Constraints

SoundCloud API ToS places hard constraints on how SC data can be displayed.
Violating these risks API access revocation. Treat them as product requirements.

---

## No Artist-Dedicated Pages

SoundCloud ToS explicitly prohibits:
> “to create a page, profile, channel or other online presence dedicated to one or
> more specific artists or set of repertoire”

**What this means for Scenius:**
- There is no `/artists/[id]` route. This route must never be created.
- Artist identity (name, art, metrics, embedded player) always appears as
  **context inside a prediction page** (`/predictions/[id]`)
- The atomic unit is the prediction, not the artist
- Artist is the subject. Prediction is the destination.

**Enforcement:** This is documented in `BELIEFS.md`, `ARCHITECTURE.md`, and here.
If you are ever tempted to create an artist-dedicated page, re-read this file.

---

## Attribution Required

Every surface displaying SoundCloud metrics must attribute to SoundCloud
and the respective artist.

**Required on:**
- Prediction cards (feed) — anywhere play count or follower count appears
- Prediction pages — all metric displays
- Submission form — the live metrics shown before submitting
- Resolution feed — the delta display

**Implementation:**
Build attribution into the shared `<MetricDisplay />` component so it is
structurally impossible to display SC metrics without attribution.

```tsx
// app/shared/components/MetricDisplay.tsx
// Attribution is not optional — it is part of the component, not a prop
export function MetricDisplay({ plays, followers, artistName }: MetricDisplayProps) {
  return (
    <div className="metric-display">
      <span>{plays.toLocaleString()} plays</span>
      <span>{followers.toLocaleString()} followers</span>
      <span className="attribution">
        via <a href="https://soundcloud.com" target="_blank">SoundCloud</a>
      </span>
    </div>
  );
}
```

---

## No AI Training Framing

SoundCloud ToS prohibits training AI on SC content.

The reputation scoring algorithm is a **proper scoring rule** (EMA of Brier score).
It is a statistical model, not an AI trained on SC data.

**Language to use:**
- ✓ “statistical model”
- ✓ “proper scoring rule”
- ✓ “reputation scoring algorithm”
- ✗ “AI trained on SoundCloud data”
- ✗ “machine learning model”
- ✗ “neural network”

This applies to: UI copy, API docs, README, investor materials, any public-facing text.

---

## Privacy Policy

Required before any public-facing launch. Standard boilerplate is sufficient for MVP.
Track as M9 deliverable. Do not launch without it.

---

## Embedded Player

SoundCloud embedded players are permitted under ToS.
Use the standard SC embed widget on prediction pages.
Do not attempt to extract audio or build a custom player using SC audio URLs.
