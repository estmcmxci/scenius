import {
  getTastemakerById,
  getPredictionsByTastemaker,
  type TastemakerRow,
  type PredictionWithArtist,
} from "../repo/tastemaker-repo";

export type TastemakerStats = {
  totalPredictions: number;
  resolvedPredictions: number;
  correctPredictions: number;
  /** null when no predictions have resolved yet */
  winRate: number | null;
};

export type TastemakerProfile = {
  tastemaker: TastemakerRow;
  predictions: PredictionWithArtist[];
  stats: TastemakerStats;
};

function computeStats(
  predictions: PredictionWithArtist[]
): TastemakerStats {
  const totalPredictions = predictions.length;
  const resolved = predictions.filter(
    (p) => p.prediction.outcome !== "pending"
  );
  const resolvedPredictions = resolved.length;
  const correctPredictions = resolved.filter(
    (p) => p.prediction.outcome === p.prediction.predictedOutcome
  ).length;
  const winRate =
    resolvedPredictions > 0
      ? Math.round((correctPredictions / resolvedPredictions) * 100)
      : null;

  return { totalPredictions, resolvedPredictions, correctPredictions, winRate };
}

export async function getTastemakerProfile(
  id: string
): Promise<TastemakerProfile | null> {
  const tastemaker = await getTastemakerById(id);
  if (!tastemaker) return null;

  const predictions = await getPredictionsByTastemaker(id);
  const stats = computeStats(predictions);

  return { tastemaker, predictions, stats };
}
