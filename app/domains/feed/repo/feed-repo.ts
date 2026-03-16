import { eq, desc, and, ne } from "drizzle-orm";
import { db } from "@/app/db/client";
import { predictions } from "@/app/domains/predictions/repo/schema";
import { artists, catalogSnapshots } from "@/app/domains/soundcloud/repo/schema";
import { tastemakers } from "@/app/domains/tastemakers/repo/schema";
import { posts } from "@/app/domains/feed/repo/schema";
import type { FeedOutcomeFilter } from "../types/feed-item";

export async function queryFeedItems(outcome: FeedOutcomeFilter = "all") {
  const conditions = [];

  if (outcome === "pending") {
    conditions.push(eq(predictions.outcome, "pending"));
  } else if (outcome === "resolved") {
    conditions.push(ne(predictions.outcome, "pending"));
  }

  const rows = await db
    .select({
      prediction: {
        id: predictions.id,
        predictedOutcome: predictions.predictedOutcome,
        horizon: predictions.horizon,
        outcome: predictions.outcome,
        streamThreshold: predictions.streamThreshold,
        easAttestationUid: predictions.easAttestationUid,
        createdAt: predictions.createdAt,
        resolvedAt: predictions.resolvedAt,
      },
      artist: {
        id: artists.id,
        username: artists.username,
        permalinkUrl: artists.permalinkUrl,
        avatarUrl: artists.avatarUrl,
        city: artists.city,
        countryCode: artists.countryCode,
      },
      tastemaker: {
        id: tastemakers.id,
        displayName: tastemakers.displayName,
        walletAddress: tastemakers.walletAddress,
        reputationScore: tastemakers.reputationScore,
      },
      snapshot: {
        id: catalogSnapshots.id,
        totalPlays: catalogSnapshots.totalPlays,
        totalLikes: catalogSnapshots.totalLikes,
        totalReposts: catalogSnapshots.totalReposts,
        totalComments: catalogSnapshots.totalComments,
        followersCount: catalogSnapshots.followersCount,
        trackCount: catalogSnapshots.trackCount,
        takenAt: catalogSnapshots.takenAt,
      },
      post: {
        id: posts.id,
        title: posts.title,
        body: posts.body,
        published: posts.published,
      },
    })
    .from(predictions)
    .innerJoin(artists, eq(predictions.artistId, artists.id))
    .innerJoin(tastemakers, eq(predictions.tastemakerId, tastemakers.id))
    .innerJoin(catalogSnapshots, eq(predictions.snapshotId, catalogSnapshots.id))
    .leftJoin(posts, eq(posts.predictionId, predictions.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(predictions.createdAt));

  return rows;
}
