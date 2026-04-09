import { and, eq, lte, or } from "drizzle-orm";
import { db } from "@/app/db/client";
import { predictions } from "@/app/domains/predictions/repo/schema";
import { artists } from "@/app/domains/soundcloud/repo/schema";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function subtractDays(now: Date, days: number): Date {
  return new Date(now.getTime() - days * DAY_IN_MS);
}

export interface DuePrediction {
  id: string;
  tastemakerId: string;
  artistId: string;
  snapshotId: string;
  streamThreshold: bigint;
  predictedOutcome: string;
  permalinkUrl: string | null;
}

export async function listDuePendingPredictions(now: Date): Promise<DuePrediction[]> {
  return db
    .select({
      id: predictions.id,
      tastemakerId: predictions.tastemakerId,
      artistId: predictions.artistId,
      snapshotId: predictions.snapshotId,
      streamThreshold: predictions.streamThreshold,
      predictedOutcome: predictions.predictedOutcome,
      permalinkUrl: artists.permalinkUrl,
    })
    .from(predictions)
    .innerJoin(artists, eq(predictions.artistId, artists.id))
    .where(
      and(
        eq(predictions.outcome, "pending"),
        or(
          and(eq(predictions.horizon, "1w"), lte(predictions.createdAt, subtractDays(now, 7))),
          and(eq(predictions.horizon, "2w"), lte(predictions.createdAt, subtractDays(now, 14))),
          and(eq(predictions.horizon, "4w"), lte(predictions.createdAt, subtractDays(now, 28))),
          and(eq(predictions.horizon, "8w"), lte(predictions.createdAt, subtractDays(now, 56)))
        )
      )
    );
}
