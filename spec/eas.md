# spec/eas.md — EAS Integration

Every resolved prediction is written onchain via EAS (Ethereum Attestation Service).
Attestations are immutable, public, and linkable from the UI.

---

## When UIDs Get Written

| Event | Attestation created | UID stored on |
|---|---|---|
| Prediction resolves (cron) | Outcome attestation | `predictions.eas_attestation_uid` |
| Reputation snapshot (periodic) | Reputation attestation | n/a (standalone, linked by address) |

**Prediction attestations are NOT written at submission time** — only at resolution.
This keeps the gas cost tied to outcomes, not volume of predictions.

---

## Schema Definitions

Three schemas registered onchain. Register via EAS Schema Registry before M6.

### 1. Prediction Outcome Attestation
```
bytes32 predictionId
address tastemaker
bool    predictedYes
bool    outcomeYes
uint64  streamThreshold
uint64  scDelta
uint64  resolvedAt
```
Created by the resolution cron. One per resolved prediction.

### 2. Reputation Snapshot Attestation
```
address tastemaker
uint64  reputationScore    -- basis points (0–10000, representing 0.00–1.00)
uint32  totalPredictions
uint64  snapshotAt
```
Created periodically (after each resolution batch). Portable proof of track record.

### 3. Market Outcome Attestation (optional, V2)
```
bytes32 artistId
uint64  streamThreshold
bool    outcome
uint64  scDelta
uint64  resolvedAt
```
Aggregate market-level truth. Defer to V2 unless demo requires it.

---

## Mainnet Gate — Human Approval Required

Do NOT deploy EAS attestations to mainnet without explicit human approval.
For MVP development and demo: use a testnet (Base Sepolia or Sepolia).

Checklist before mainnet:
- [ ] Émile has reviewed and approved chain selection
- [ ] Gas cost per resolution estimated and acceptable
- [ ] Schema UIDs confirmed on target chain
- [ ] EAS explorer links verified working

---

## Implementation

```typescript
import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';

const eas = new EAS(EAS_CONTRACT_ADDRESS);
eas.connect(signer);

const encoder = new SchemaEncoder(
  'bytes32 predictionId,address tastemaker,bool predictedYes,bool outcomeYes,uint64 streamThreshold,uint64 scDelta,uint64 resolvedAt'
);

const data = encoder.encodeData([
  { name: 'predictionId',    value: pred.id,              type: 'bytes32' },
  { name: 'tastemaker',      value: pred.tastemaker_addr, type: 'address' },
  { name: 'predictedYes',    value: pred.predicted_outcome === 'yes', type: 'bool' },
  { name: 'outcomeYes',      value: outcome === 'yes',   type: 'bool' },
  { name: 'streamThreshold', value: BigInt(pred.stream_threshold), type: 'uint64' },
  { name: 'scDelta',         value: BigInt(delta),        type: 'uint64' },
  { name: 'resolvedAt',      value: BigInt(Date.now()),   type: 'uint64' },
]);

const tx = await eas.attest({ schema: SCHEMA_UID, data: { recipient: pred.tastemaker_addr, data } });
const uid = await tx.wait();
```

---

## Explorer Links

Format for linking attestations in the UI:
```
https://base-sepolia.easscan.org/attestation/view/{uid}
```
Swap domain for mainnet when approved.
