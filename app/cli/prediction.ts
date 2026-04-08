import { getPredictionDetail } from "@/app/domains/predictions/service/prediction-service";

export async function predictionCommand(id?: string): Promise<void> {
  if (!id) {
    console.error("Usage: pnpm cli prediction <prediction-id>");
    process.exit(1);
  }

  const detail = await getPredictionDetail(id);

  if (!detail) {
    console.error(`Prediction not found: ${id}`);
    process.exit(1);
  }

  const { prediction, artist, snapshot, tastemaker } = detail;
  const displayName = tastemaker.displayName ?? "Anonymous";
  const outcome = prediction.outcome ?? "pending";

  console.log(`${artist.username} — ${prediction.predictedOutcome.toUpperCase()} ${Number(prediction.streamThreshold).toLocaleString()} streams in ${prediction.horizon}`);
  console.log(`  outcome: ${outcome.toUpperCase()}`);
  console.log(`  tastemaker: ${displayName} (rep: ${tastemaker.reputationScore?.toFixed(3) ?? "—"})`);
  console.log(`  snapshot: ${Number(snapshot.totalPlays ?? 0).toLocaleString()} plays, ${Number(snapshot.followersCount ?? 0).toLocaleString()} followers`);
  console.log(`  created: ${prediction.createdAt ? new Date(prediction.createdAt).toISOString().slice(0, 10) : "unknown"}`);
  console.log(`  id: ${prediction.id}`);
}
