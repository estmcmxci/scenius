import { runWeeklyResolutionStub } from "@/app/domains/resolution/service/weekly-resolution";

export async function resolveCommand() {
  const result = await runWeeklyResolutionStub(new Date());
  console.log(`Due pending predictions: ${result.duePredictionCount}`);
  process.exit(0);
}
