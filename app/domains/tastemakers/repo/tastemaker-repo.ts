import { eq } from "drizzle-orm";
import { db } from "@/app/db/client";
import { tastemakers } from "./schema";
import { predictions } from "@/app/domains/predictions/repo/schema";
import { artists } from "@/app/domains/soundcloud/repo/schema";
import { catalogSnapshots } from "@/app/domains/soundcloud/repo/schema";

export async function getTastemakerById(id: string) {
  const rows = await db
    .select()
    .from(tastemakers)
    .where(eq(tastemakers.id, id))
    .limit(1);

  return rows[0] ?? null;
}

export async function getPredictionsByTastemaker(tastemakerId: string) {
  const rows = await db
    .select({
      prediction: predictions,
      artist: artists,
      snapshot: catalogSnapshots,
    })
    .from(predictions)
    .innerJoin(artists, eq(predictions.artistId, artists.id))
    .innerJoin(catalogSnapshots, eq(predictions.snapshotId, catalogSnapshots.id))
    .where(eq(predictions.tastemakerId, tastemakerId))
    .orderBy(predictions.createdAt);

  return rows;
}
