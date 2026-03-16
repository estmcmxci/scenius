import { queryFeedItems } from "../repo/feed-repo";
import type { FeedItem, FeedFilters } from "../types/feed-item";

function toBigIntOrNull(value: bigint | null | undefined): number | null {
  return value != null ? Number(value) : null;
}

function toFeedItem(row: Awaited<ReturnType<typeof queryFeedItems>>[number]): FeedItem {
  return {
    prediction: {
      id: row.prediction.id,
      predictedOutcome: row.prediction.predictedOutcome,
      horizon: row.prediction.horizon,
      outcome: row.prediction.outcome,
      streamThreshold: toBigIntOrNull(row.prediction.streamThreshold),
      easAttestationUid: row.prediction.easAttestationUid,
      createdAt: row.prediction.createdAt,
      resolvedAt: row.prediction.resolvedAt,
    },
    artist: row.artist,
    tastemaker: row.tastemaker,
    snapshot: {
      id: row.snapshot.id,
      totalPlays: toBigIntOrNull(row.snapshot.totalPlays),
      totalLikes: toBigIntOrNull(row.snapshot.totalLikes),
      totalReposts: toBigIntOrNull(row.snapshot.totalReposts),
      totalComments: toBigIntOrNull(row.snapshot.totalComments),
      followersCount: toBigIntOrNull(row.snapshot.followersCount),
      trackCount: toBigIntOrNull(row.snapshot.trackCount),
      takenAt: row.snapshot.takenAt,
    },
    post: row.post.id
      ? {
          id: row.post.id,
          title: row.post.title,
          body: row.post.body,
          published: row.post.published,
        }
      : null,
  };
}

export async function getFeedItems(filters?: FeedFilters): Promise<FeedItem[]> {
  const outcome = filters?.outcome ?? "all";
  const rows = await queryFeedItems(outcome);
  return rows.map(toFeedItem);
}
