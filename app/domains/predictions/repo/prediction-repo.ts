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

export async function getPredictionById(id: string): Promise<PredictionDetail | null> {
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
