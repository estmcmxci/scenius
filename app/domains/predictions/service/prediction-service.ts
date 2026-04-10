import { getPredictionById, type PredictionDetail } from "../repo/prediction-repo";
import { getEnv } from "@/app/config/env";
import { takeSnapshot } from "@/app/domains/soundcloud/service/snapshot";
import { takeTrackSnapshot } from "@/app/domains/soundcloud/service/track-snapshot";
import {
  upsertArtist,
  insertSnapshot,
} from "@/app/domains/soundcloud/repo/snapshot-repo";
import {
  upsertTrack,
  insertTrackSnapshot,
} from "@/app/domains/soundcloud/repo/track-repo";
import { createPrediction } from "@/app/domains/predictions/repo/prediction-repo";
import type { CreatePredictionInput } from "@/app/domains/predictions/types/create-prediction";
import type { SnapshotResult, TrackSnapshotResult } from "@/app/domains/soundcloud/types/snapshot";

/** Input with tastemakerId guaranteed resolved (by API or CLI). */
type ResolvedPredictionInput = CreatePredictionInput & { tastemakerId: string };

export async function getPredictionDetail(id: string): Promise<PredictionDetail | null> {
  return getPredictionById(id);
}

export interface SubmitPredictionResult {
  predictionId: string;
  artistId: string;
  snapshotId: string;
  trackId?: string;
  trackSnapshotId?: string;
  artist: SnapshotResult["artist"];
  totals?: SnapshotResult["totals"];
  trackSnapshot?: TrackSnapshotResult["snapshot"];
}

/** Try track snapshot first; fall back to catalog snapshot for artist URLs. */
async function snapshotUrl(url: string, clientId: string, clientSecret: string) {
  try {
    const trackResult = await takeTrackSnapshot(url, clientId, clientSecret);
    return { kind: "track" as const, trackResult };
  } catch {
    // Not a track URL — fall back to catalog snapshot
    const catalogResult = await takeSnapshot(url, clientId, clientSecret);
    return { kind: "catalog" as const, catalogResult };
  }
}

export async function submitPrediction(
  input: ResolvedPredictionInput
): Promise<SubmitPredictionResult> {
  const env = getEnv();

  const result = await snapshotUrl(
    input.url,
    env.SOUNDCLOUD_CLIENT_ID,
    env.SOUNDCLOUD_CLIENT_SECRET
  );

  if (result.kind === "track") {
    const { trackResult } = result;
    const artistId = await upsertArtist(trackResult);
    const trackId = await upsertTrack(trackResult, artistId);
    const trackSnapshotId = await insertTrackSnapshot(trackId, trackResult);

    // Create catalog snapshot stub so snapshotId (required column) is populated
    const catalogSnapshot = await takeSnapshot(
      trackResult.artist.permalinkUrl,
      env.SOUNDCLOUD_CLIENT_ID,
      env.SOUNDCLOUD_CLIENT_SECRET
    );
    const snapshotId = await insertSnapshot(artistId, catalogSnapshot);

    const predictionId = await createPrediction({
      tastemakerId: input.tastemakerId,
      artistId,
      snapshotId,
      streamThreshold: BigInt(input.streamThreshold),
      predictedOutcome: input.predictedOutcome,
      horizon: input.horizon,
      trackId,
      trackSnapshotId,
    });

    return {
      predictionId,
      artistId,
      snapshotId,
      trackId,
      trackSnapshotId,
      artist: trackResult.artist,
      trackSnapshot: trackResult.snapshot,
    };
  }

  // Catalog-only path (artist URL — legacy behavior)
  const { catalogResult } = result;

  if (catalogResult.totals.tracksFetched === 0) {
    throw new Error(
      `No tracks returned for ${catalogResult.artist.username}. Artist may be label-distributed and unsupported by the SC API.`
    );
  }

  const artistId = await upsertArtist(catalogResult);
  const snapshotId = await insertSnapshot(artistId, catalogResult);

  const predictionId = await createPrediction({
    tastemakerId: input.tastemakerId,
    artistId,
    snapshotId,
    streamThreshold: BigInt(input.streamThreshold),
    predictedOutcome: input.predictedOutcome,
    horizon: input.horizon,
  });

  return {
    predictionId,
    artistId,
    snapshotId,
    artist: catalogResult.artist,
    totals: catalogResult.totals,
  };
}
