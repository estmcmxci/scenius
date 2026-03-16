export interface FeedItem {
  prediction: {
    id: string;
    predictedOutcome: string;
    horizon: string;
    outcome: string | null;
    streamThreshold: number | null;
    easAttestationUid: string | null;
    createdAt: Date | null;
    resolvedAt: Date | null;
  };
  artist: {
    id: string;
    username: string;
    permalinkUrl: string | null;
    avatarUrl: string | null;
    city: string | null;
    countryCode: string | null;
  };
  tastemaker: {
    id: string;
    displayName: string | null;
    walletAddress: string | null;
    reputationScore: number | null;
  };
  snapshot: {
    id: string;
    totalPlays: number | null;
    totalLikes: number | null;
    totalReposts: number | null;
    totalComments: number | null;
    followersCount: number | null;
    trackCount: number | null;
    takenAt: Date;
  };
  post: {
    id: string;
    title: string | null;
    body: string | null;
    published: boolean | null;
  } | null;
}

export type FeedOutcomeFilter = "pending" | "resolved" | "all";

export interface FeedFilters {
  outcome?: FeedOutcomeFilter;
}
