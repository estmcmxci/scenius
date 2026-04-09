import { eq } from "drizzle-orm";
import { db } from "@/app/db/client";
import { getEnv } from "@/app/config/env";
import { listDuePendingPredictions } from "@/app/domains/resolution/repo/due-predictions";
import type { DuePrediction } from "@/app/domains/resolution/repo/due-predictions";
import { updateReputation } from "@/app/domains/resolution/service/reputation";
import { takeSnapshot } from "@/app/domains/soundcloud/service/snapshot";
import { upsertArtist, insertSnapshot } from "@/app/domains/soundcloud/repo/snapshot-repo";
import { catalogSnapshots } from "@/app/domains/soundcloud/repo/schema";
import { predictions } from "@/app/domains/predictions/repo/schema";
import { tastemakers } from "@/app/domains/tastemakers/repo/schema";

type BinaryOutcome = "yes" | "no";

interface ResolutionResult {
  resolved: number;
  skipped: number;
  errors: number;
  details: ResolutionDetail[];
}

interface ResolutionDetail {
  predictionId: string;
  outcome: BinaryOutcome;
  delta: number;
  newReputation: number;
}

async function getCreationPlays(snapshotId: string): Promise<bigint | null> {
  const rows = await db
    .select({ totalPlays: catalogSnapshots.totalPlays })
    .from(catalogSnapshots)
    .where(eq(catalogSnapshots.id, snapshotId))
    .limit(1);

  return rows[0]?.totalPlays ?? null;
}

async function getTastemakerScore(tastemakerId: string): Promise<number> {
  const rows = await db
    .select({ reputationScore: tastemakers.reputationScore })
    .from(tastemakers)
    .where(eq(tastemakers.id, tastemakerId))
    .limit(1);

  return rows[0]?.reputationScore ?? 1.0;
}

async function resolveSingle(
  pred: DuePrediction,
  clientId: string,
  clientSecret: string,
): Promise<ResolutionDetail> {
  if (!pred.permalinkUrl) {
    throw new Error(`Prediction ${pred.id}: artist has no permalinkUrl`);
  }

  const snapshot = await takeSnapshot(pred.permalinkUrl, clientId, clientSecret);
  const artistId = await upsertArtist(snapshot);
  const resolutionSnapshotId = await insertSnapshot(artistId, snapshot);

  const creationPlays = await getCreationPlays(pred.snapshotId);
  if (creationPlays === null) {
    throw new Error(`Prediction ${pred.id}: creation snapshot ${pred.snapshotId} not found`);
  }

  const currentPlays = Number(snapshot.totals.plays);
  const delta = currentPlays - Number(creationPlays);
  const threshold = Number(pred.streamThreshold);
  const actualOutcome: BinaryOutcome = delta >= threshold ? "yes" : "no";
  const predictedOutcome = pred.predictedOutcome as BinaryOutcome;

  const currentScore = await getTastemakerScore(pred.tastemakerId);
  const newReputation = updateReputation(currentScore, predictedOutcome, actualOutcome);

  await db
    .update(predictions)
    .set({
      outcome: actualOutcome,
      resolvedAt: new Date(),
      resolutionSnapshotId,
    })
    .where(eq(predictions.id, pred.id));

  await db
    .update(tastemakers)
    .set({
      reputationScore: newReputation,
      totalPredictions: (await db
        .select({ total: tastemakers.totalPredictions })
        .from(tastemakers)
        .where(eq(tastemakers.id, pred.tastemakerId))
        .limit(1)
        .then(r => (r[0]?.total ?? 0) + 1)),
    })
    .where(eq(tastemakers.id, pred.tastemakerId));

  return { predictionId: pred.id, outcome: actualOutcome, delta, newReputation };
}

export async function runWeeklyResolution(now: Date): Promise<ResolutionResult> {
  const duePredictions = await listDuePendingPredictions(now);

  console.info(JSON.stringify({
    event: "cron.resolve.start",
    duePredictionCount: duePredictions.length,
  }));

  const result: ResolutionResult = { resolved: 0, skipped: 0, errors: 0, details: [] };

  if (duePredictions.length === 0) {
    return result;
  }

  const env = getEnv();
  const clientId = env.SOUNDCLOUD_CLIENT_ID;
  const clientSecret = env.SOUNDCLOUD_CLIENT_SECRET;

  for (const pred of duePredictions) {
    try {
      const detail = await resolveSingle(pred, clientId, clientSecret);
      result.resolved++;
      result.details.push(detail);

      console.info(JSON.stringify({
        event: "cron.resolve.resolved",
        predictionId: pred.id,
        outcome: detail.outcome,
        delta: detail.delta,
        newReputation: detail.newReputation,
      }));
    } catch (err) {
      result.errors++;
      const message = err instanceof Error ? err.message : String(err);
      console.error(JSON.stringify({
        event: "cron.resolve.error",
        predictionId: pred.id,
        error: message,
      }));
    }
  }

  console.info(JSON.stringify({
    event: "cron.resolve.complete",
    resolved: result.resolved,
    skipped: result.skipped,
    errors: result.errors,
  }));

  return result;
}

export async function runWeeklyResolutionDryRun(now: Date): Promise<DuePrediction[]> {
  const duePredictions = await listDuePendingPredictions(now);

  console.info(JSON.stringify({
    event: "cron.resolve.dry_run",
    duePredictionCount: duePredictions.length,
  }));

  return duePredictions;
}
