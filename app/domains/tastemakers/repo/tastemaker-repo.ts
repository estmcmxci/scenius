import { eq, desc } from "drizzle-orm";
import { db } from "@/app/db/client";
import { tastemakers } from "./schema";
import { predictions } from "@/app/domains/predictions/repo/schema";
import { artists } from "@/app/domains/soundcloud/repo/schema";

export type TastemakerRow = typeof tastemakers.$inferSelect;
export type ArtistRow = typeof artists.$inferSelect;
export type PredictionRow = typeof predictions.$inferSelect;

export type PredictionWithArtist = {
  prediction: PredictionRow;
  artist: ArtistRow;
};

export async function getTastemakerById(
  id: string
): Promise<TastemakerRow | null> {
  const rows = await db
    .select()
    .from(tastemakers)
    .where(eq(tastemakers.id, id))
    .limit(1);

  return rows[0] ?? null;
}

export async function getPredictionsByTastemaker(
  tastemakerId: string
): Promise<PredictionWithArtist[]> {
  const rows = await db
    .select({
      prediction: predictions,
      artist: artists,
    })
    .from(predictions)
    .innerJoin(artists, eq(predictions.artistId, artists.id))
    .where(eq(predictions.tastemakerId, tastemakerId))
    .orderBy(desc(predictions.createdAt));

  return rows;
}
