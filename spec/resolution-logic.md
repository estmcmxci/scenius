# spec/resolution-logic.md — Resolution Logic

How predictions resolve, how reputation updates, and how EAS attestations get written.
This is the core mechanism. Do not change parameters without updating `research/theory.md`.

---

## Friday Cron Schedule

```
# vercel.json cron
{ "path": "/api/cron/resolve", "schedule": "0 18 * * 5" }  // Fridays 18:00 UTC
{ "path": "/api/cron/snapshot", "schedule": "0 17 * * 5" } // Fridays 17:00 UTC (snapshot first)
```

Snapshot runs one hour before resolution so metrics are fresh.

---

## Delta Formula

```typescript
const delta = resolutionSnapshot.plays - creationSnapshot.plays;
const outcome: 'yes' | 'no' = delta >= prediction.stream_threshold ? 'yes' : 'no';
```

Only `plays` (total playback count across catalog) is used for binary resolution.
Followers, likes, reposts are displayed as context but do not affect outcome.

---

## Resolution Sequence

For each prediction where `outcome = 'pending'` and horizon has elapsed:

```
1. Pull current SC metrics → store as resolution_snapshot
2. Compute delta (plays delta vs stream_threshold) → outcome: yes | no
3. Write EAS attestation → store eas_attestation_uid on prediction
4. Update prediction: outcome, resolved_at, resolution_snapshot_id, eas_attestation_uid
5. Run EMA reputation update for the tastemaker
6. Compute and store reputation_delta on prediction
```

Steps 3 and 4 must be atomic — if EAS write fails, do not mark prediction resolved.
Log failures and retry on next cron run.

---

## EMA Reputation Update

Canonical formula from the Scenius paper:

```typescript
const ALPHA = 0.05;  // smoothing — 95% weight on history
const BETA  = 5.0;   // sharpness — penalty severity

function updateReputation(
  currentScore: number,
  predictedOutcome: 'yes' | 'no',
  actualOutcome: 'yes' | 'no'
): number {
  const p = predictedOutcome === 'yes' ? 1.0 : 0.0;
  const y = actualOutcome   === 'yes' ? 1.0 : 0.0;

  const credit = Math.exp(-BETA * Math.pow(p - y, 2));
  const updated = (1 - ALPHA) * currentScore + ALPHA * credit;

  // Clamp to valid range — prevents degenerate scores
  return Math.max(0.01, Math.min(0.99, updated));
}
```

All tastemakers initialize at `reputation_score = 1.0`.
Correct predictions compound toward 1.0. Wrong predictions decay toward 0.

**Do not use `any` types in this module.** Resolution logic requires strict typing.

---

## Reputation-Weighted Consensus

For display on prediction pages — the aggregate signal across all predictions for an artist:

```typescript
function weightedConsensus(
  predictions: Array<{ reputation_score: number; predicted_outcome: 'yes' | 'no' }>
): number {
  const toProb = (o: 'yes' | 'no') => o === 'yes' ? 1.0 : 0.0;
  const num = predictions.reduce((s, p) => s + p.reputation_score * toProb(p.predicted_outcome), 0);
  const den = predictions.reduce((s, p) => s + p.reputation_score, 0);
  return den === 0 ? 0.5 : num / den;
}
```

---

## Error Handling

- SC API timeout or 429: skip resolution for this artist, log, retry next cron
- EAS write failure: do not resolve prediction, log with prediction ID, alert (Vercel logs)
- Supabase write failure: rollback, log, retry
- Never partially resolve a prediction (outcome written but no EAS UID)
