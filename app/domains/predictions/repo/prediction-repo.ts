import { eq } from "drizzle-orm";
import { db } from "@/app/db/client";
import { predictions } from "./schema";
import { artists, catalogSnapshots } from "@/app/domains/soundcloud/repo/schema";
import { tastemakers } from "@/app/domains/tastemakers/repo/schema";

export type PredictionDetail = {
  prediction: typeof predictions.$inferSelect;
  artist: typeof artists.$inferSelect;
  snapshot: typeof catalogSnapshots.$inferSelect;
  tastemaker: typeof tastemakers.$inferSelect;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getPredictionById(id: string): Promise<PredictionDetail | null> {
  if (!UUID_RE.test(id)) return null;

  const rows = await db
    .select({
      prediction: predictions,
      artist: artists,
      snapshot: catalogSnapshots,
      tastemaker: tastemakers,
    })
    .from(predictions)
    .innerJoin(artists, eq(predictions.artistId, artists.id))
    .innerJoin(catalogSnapshots, eq(predictions.snapshotId, catalogSnapshots.id))
    .innerJoin(tastemakers, eq(predictions.tastemakerId, tastemakers.id))
    .where(eq(predictions.id, id))
    .limit(1);

  return rows[0] ?? null;
}

export async function createPrediction(params: {
  tastemakerId: string;
  artistId: string;
  snapshotId: string;
  streamThreshold: bigint;
  predictedOutcome: string;
  horizon: string;
}): Promise<string> {
  const [inserted] = await db
    .insert(predictions)
    .values({
      tastemakerId: params.tastemakerId,
      artistId: params.artistId,
      snapshotId: params.snapshotId,
      streamThreshold: params.streamThreshold,
      predictedOutcome: params.predictedOutcome,
      horizon: params.horizon,
    })
    .returning({ id: predictions.id });

  return inserted.id;
}
