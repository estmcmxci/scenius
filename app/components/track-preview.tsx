"use client";

import { useState, useEffect } from "react";

type TrackData = {
  artist: {
    username: string;
    permalinkUrl: string;
    avatarUrl: string | null;
  };
  track: {
    title: string;
    permalinkUrl: string;
    artworkUrl: string | null;
  };
  trackSnapshot: {
    playbackCount: number;
    likesCount: number;
    repostsCount: number;
    commentCount: number;
  };
};

type ArtistOnlyData = {
  artist: {
    username: string;
    permalinkUrl: string;
    avatarUrl: string | null;
  };
  totals: {
    plays: number;
    likes: number;
    reposts: number;
  };
};

type Props = {
  url: string;
};

export function TrackPreview({ url }: Props) {
  const [trackData, setTrackData] = useState<TrackData | null>(null);
  const [artistData, setArtistData] = useState<ArtistOnlyData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!url) {
      setTrackData(null);
      setArtistData(null);
      setError(null);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setTrackData(null);
    setArtistData(null);

    fetch("/api/snapshots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          const details = body?.details;
          const message =
            typeof details === "string"
              ? details
              : details && typeof details === "object"
                ? Object.values(details).flat().join(", ")
                : body?.error ?? "Failed to fetch track";
          throw new Error(message);
        }
        return res.json();
      })
      .then((json) => {
        if (controller.signal.aborted) return;
        if (json.track) {
          setTrackData(json);
        } else {
          setArtistData(json);
        }
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [url]);

  if (!url) return null;

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-bg-raised p-5 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded bg-bg-elevated" />
          <div className="space-y-2">
            <div className="h-4 w-40 rounded bg-bg-elevated" />
            <div className="h-3 w-24 rounded bg-bg-elevated" />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 rounded bg-bg-elevated" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-error-border bg-error-bg p-4 text-sm text-error-fg">
        {error}
      </div>
    );
  }

  if (trackData) {
    const { artist, track, trackSnapshot } = trackData;
    return (
      <div className="rounded-lg border border-border bg-bg-raised p-5">
        <div className="flex items-center gap-3">
          {track.artworkUrl && (
            <img
              src={track.artworkUrl}
              alt=""
              className="h-12 w-12 rounded object-cover"
            />
          )}
          <div>
            <p className="font-serif text-base font-semibold text-fg">
              {track.title}
            </p>
            <p className="text-sm text-fg-muted">{artist.username}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <Stat label="Plays" value={trackSnapshot.playbackCount} />
          <Stat label="Likes" value={trackSnapshot.likesCount} />
          <Stat label="Reposts" value={trackSnapshot.repostsCount} />
        </div>

        <p className="mt-4 text-xs text-fg-faint">
          Data from{" "}
          <a
            href={track.permalinkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-fg-muted"
          >
            {track.title} by {artist.username} on SoundCloud
          </a>
        </p>
      </div>
    );
  }

  if (artistData) {
    const { artist, totals } = artistData;
    return (
      <div className="rounded-lg border border-border bg-bg-raised p-5">
        <div className="flex items-center gap-3">
          {artist.avatarUrl && (
            <img
              src={artist.avatarUrl}
              alt=""
              className="h-12 w-12 rounded-full object-cover"
            />
          )}
          <div>
            <p className="font-serif text-base font-semibold text-fg">
              {artist.username}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <Stat label="Total plays" value={totals.plays} />
          <Stat label="Total likes" value={totals.likes} />
          <Stat label="Reposts" value={totals.reposts} />
        </div>

        <p className="mt-4 text-xs text-fg-faint">
          Data from{" "}
          <a
            href={artist.permalinkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-fg-muted"
          >
            {artist.username} on SoundCloud
          </a>
        </p>
      </div>
    );
  }

  return null;
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-bg-elevated px-3 py-2">
      <p className="text-lg font-semibold text-fg">
        {value.toLocaleString()}
      </p>
      <p className="text-xs text-fg-muted">{label}</p>
    </div>
  );
}
