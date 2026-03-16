import {
  getTastemakerById,
  getPredictionsByTastemaker,
} from "../repo/tastemaker-repo";

export interface TastemakerStats {
  totalPredictions: number;
  resolved: number;
  correct: number;
  winRate: number | null;
}

export interface TastemakerPredictionRow {
  id: string;
  artistUsername: string;
  artistPermalinkUrl: string | null;
  streamThreshold: number | null;
  predictedOutcome: string;
  horizon: string;
  outcome: string | null;
  totalPlaysAtPrediction: number | null;
  createdAt: Date | null;
  resolvedAt: Date | null;
}

export interface TastemakerProfile {
  id: string;
  displayName: string | null;
  walletAddress: string | null;
  reputationScore: number | null;
  createdAt: Date | null;
  stats: TastemakerStats;
  predictions: TastemakerPredictionRow[];
}

function bigintToNumber(value: bigint | null | undefined): number | null {
  if (value == null) return null;
  return Number(value);
}

function computeStats(
  rows: Awaited<ReturnType<typeof getPredictionsByTastemaker>>
): TastemakerStats {
  const total = rows.length;
  const resolved = rows.filter(
    (r) => r.prediction.outcome !== "pending"
  ).length;
  const correct = rows.filter(
    (r) => r.prediction.outcome === "correct"
  ).length;

  return {
    totalPredictions: total,
    resolved,
    correct,
    winRate: resolved > 0 ? correct / resolved : null,
  };
}

export async function getTastemakerProfile(
  id: string
): Promise<TastemakerProfile | null> {
  const tastemaker = await getTastemakerById(id);
  if (!tastemaker) return null;

  const rows = await getPredictionsByTastemaker(id);
  const stats = computeStats(rows);

  const predictions: TastemakerPredictionRow[] = rows.map((r) => ({
    id: r.prediction.id,
    artistUsername: r.artist.username,
    artistPermalinkUrl: r.artist.permalinkUrl,
    streamThreshold: bigintToNumber(r.prediction.streamThreshold),
    predictedOutcome: r.prediction.predictedOutcome,
    horizon: r.prediction.horizon,
    outcome: r.prediction.outcome,
    totalPlaysAtPrediction: bigintToNumber(r.snapshot.totalPlays),
    createdAt: r.prediction.createdAt,
    resolvedAt: r.prediction.resolvedAt,
  }));

  return {
    id: tastemaker.id,
    displayName: tastemaker.displayName,
    walletAddress: tastemaker.walletAddress,
    reputationScore: tastemaker.reputationScore,
    createdAt: tastemaker.createdAt,
    stats,
    predictions,
  };
}
