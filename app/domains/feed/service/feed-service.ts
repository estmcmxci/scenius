import { getFeedRows } from "../repo/feed-repo";
import type { FeedItem, FeedFilters, OutcomeStatus, PredictionHorizon, PredictedOutcome } from "../types/feed-item";

function toNumber(value: bigint | null): number | null {
  return value !== null ? Number(value) : null;
}

export async function getFeedItems(filters?: FeedFilters): Promise<FeedItem[]> {
  const rows = await getFeedRows(filters);

  return rows.map((row) => ({
    predictionId: row.predictionId,
    predictedOutcome: row.predictedOutcome as PredictedOutcome,
    streamThreshold: Number(row.streamThreshold),
    horizon: row.horizon as PredictionHorizon,
    outcome: (row.outcome ?? "pending") as OutcomeStatus,
    createdAt: row.createdAt,
    resolvedAt: row.resolvedAt,
    artistName: row.artistName,
    artistPermalinkUrl: row.artistPermalinkUrl,
    artistAvatarUrl: row.artistAvatarUrl,
    tastemakerId: row.tastemakerId,
    tastemakerName: row.tastemakerName,
    reputationScore: row.reputationScore ?? 1.0,
    snapshotPlays: toNumber(row.snapshotPlays),
    snapshotLikes: toNumber(row.snapshotLikes),
    snapshotReposts: toNumber(row.snapshotReposts),
    snapshotFollowers: toNumber(row.snapshotFollowers),
    easAttestationUid: row.easAttestationUid,
  }));
}
