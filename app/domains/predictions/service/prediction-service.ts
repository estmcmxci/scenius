import { getPredictionById, type PredictionDetail } from "../repo/prediction-repo";

export async function getPredictionDetail(id: string): Promise<PredictionDetail | null> {
  return getPredictionById(id);
}
