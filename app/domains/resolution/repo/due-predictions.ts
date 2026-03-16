import { and, eq, lte, or } from "drizzle-orm";
import { db } from "@/app/db/client";
import { predictions } from "@/app/domains/predictions/repo/schema";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function subtractDays(now: Date, days: number): Date {
  return new Date(now.getTime() - days * DAY_IN_MS);
}

export async function listDuePendingPredictions(now: Date): Promise<Array<{ id: string }>> {
  return db
    .select({ id: predictions.id })
    .from(predictions)
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
