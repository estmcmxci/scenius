import { getPredictionById, type PredictionDetail } from "../repo/prediction-repo";
import { getEnv } from "@/app/config/env";
import { takeSnapshot } from "@/app/domains/soundcloud/service/snapshot";
import {
  upsertArtist,
  insertSnapshot,
} from "@/app/domains/soundcloud/repo/snapshot-repo";
import { createPrediction } from "@/app/domains/predictions/repo/prediction-repo";
import type { CreatePredictionInput } from "@/app/domains/predictions/types/create-prediction";
import type { SnapshotResult } from "@/app/domains/soundcloud/types/snapshot";

export async function getPredictionDetail(id: string): Promise<PredictionDetail | null> {
  return getPredictionById(id);
}

export interface SubmitPredictionResult {
  predictionId: string;
  artistId: string;
  snapshotId: string;
  artist: SnapshotResult["artist"];
  totals: SnapshotResult["totals"];
}

export async function submitPrediction(
  input: CreatePredictionInput
): Promise<SubmitPredictionResult> {
  const env = getEnv();

  const snapshot = await takeSnapshot(
    input.url,
    env.SOUNDCLOUD_CLIENT_ID,
    env.SOUNDCLOUD_CLIENT_SECRET
  );

  const artistId = await upsertArtist(snapshot);
  const snapshotId = await insertSnapshot(artistId, snapshot);

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
    artist: snapshot.artist,
    totals: snapshot.totals,
  };
}
