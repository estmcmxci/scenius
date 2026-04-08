import { listDuePendingPredictions } from "@/app/domains/resolution/repo/due-predictions";

export async function runWeeklyResolutionStub(now: Date): Promise<{ duePredictionCount: number }> {
  const duePredictions = await listDuePendingPredictions(now);

  console.info(
    JSON.stringify({
      event: "cron.resolve.due_predictions_count",
      duePredictionCount: duePredictions.length,
    })
  );

  return { duePredictionCount: duePredictions.length };
}
