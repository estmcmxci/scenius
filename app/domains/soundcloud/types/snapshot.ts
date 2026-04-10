export interface SnapshotResult {
  artist: {
    soundcloudId: number;
    username: string;
    permalinkUrl: string;
    avatarUrl: string | null;
    city: string | null;
    countryCode: string | null;
    followersCount: number;
    trackCount: number;
  };
  totals: {
    plays: number;
    likes: number;
    reposts: number;
    comments: number;
    tracksFetched: number;
  };
  takenAt: Date;
}

export interface TrackSnapshotResult {
  artist: {
    soundcloudId: number;
    username: string;
    permalinkUrl: string;
    avatarUrl: string | null;
    city: string | null;
    countryCode: string | null;
    followersCount: number;
    trackCount: number;
  };
  track: {
    soundcloudId: number;
    title: string;
    permalinkUrl: string;
    artworkUrl: string | null;
  };
  snapshot: {
    playbackCount: number;
    likesCount: number;
    repostsCount: number;
    commentCount: number;
  };
  takenAt: Date;
}
