import { eq } from "drizzle-orm";
import { getEnv } from "@/app/config/env";
import { takeSnapshot } from "@/app/domains/soundcloud/service/snapshot";
import { upsertArtist, insertSnapshot } from "@/app/domains/soundcloud/repo/snapshot-repo";
import { db } from "@/app/db/client";
import { tastemakers } from "@/app/domains/tastemakers/repo/schema";
import { predictions } from "@/app/domains/predictions/repo/schema";
import { posts } from "@/app/domains/feed/repo/schema";

const SEED_ARTISTS = [
  "https://soundcloud.com/knxwledge",
  "https://soundcloud.com/thankyouriz",
  "https://soundcloud.com/quietluke",
  "https://soundcloud.com/andremlina",
];

const SEED_TASTEMAKERS = [
  { displayName: "DJ Booth Curator", walletAddress: "0x1111111111111111111111111111111111111111" },
  { displayName: "Pigeons & Planes", walletAddress: "0x2222222222222222222222222222222222222222" },
];

const SEED_PREDICTIONS: Array<{
  artistIndex: number;
  tastemakerIndex: number;
  streamThreshold: number;
  predictedOutcome: "yes" | "no";
  horizon: "1w" | "2w" | "4w" | "8w";
}> = [
  { artistIndex: 0, tastemakerIndex: 0, streamThreshold: 500000, predictedOutcome: "yes", horizon: "4w" },
  { artistIndex: 1, tastemakerIndex: 1, streamThreshold: 100000, predictedOutcome: "yes", horizon: "8w" },
  { artistIndex: 2, tastemakerIndex: 0, streamThreshold: 50000, predictedOutcome: "no", horizon: "2w" },
];

async function upsertTastemaker(data: { displayName: string; walletAddress: string }): Promise<string> {
  const existing = await db
    .select({ id: tastemakers.id })
    .from(tastemakers)
    .where(eq(tastemakers.walletAddress, data.walletAddress))
    .limit(1);

  if (existing.length > 0) return existing[0].id;

  const [inserted] = await db
    .insert(tastemakers)
    .values({
      displayName: data.displayName,
      walletAddress: data.walletAddress,
      reputationScore: 1.0,
      totalPredictions: 0,
    })
    .returning({ id: tastemakers.id });

  return inserted.id;
}

export async function seedCommand(): Promise<void> {
  const env = getEnv();

  // 1. Snapshot artists
  console.log("Snapshotting artists...");
  const artistIds: string[] = [];
  const snapshotIds: string[] = [];

  for (const url of SEED_ARTISTS) {
    console.log(`  ${url}`);
    const result = await takeSnapshot(url, env.SOUNDCLOUD_CLIENT_ID, env.SOUNDCLOUD_CLIENT_SECRET);
    const artistId = await upsertArtist(result);
    const snapshotId = await insertSnapshot(artistId, result);
    artistIds.push(artistId);
    snapshotIds.push(snapshotId);
    console.log(`    ${result.artist.username} → ${result.totals.plays.toLocaleString()} plays`);
  }

  // 2. Create tastemakers
  console.log("Creating tastemakers...");
  const tastemakerIds: string[] = [];
  for (const tm of SEED_TASTEMAKERS) {
    const id = await upsertTastemaker(tm);
    tastemakerIds.push(id);
    console.log(`  ${tm.displayName} → ${id}`);
  }

  // 3. Create predictions
  console.log("Creating predictions...");
  const predictionIds: string[] = [];
  for (const p of SEED_PREDICTIONS) {
    const [inserted] = await db
      .insert(predictions)
      .values({
        tastemakerId: tastemakerIds[p.tastemakerIndex],
        artistId: artistIds[p.artistIndex],
        snapshotId: snapshotIds[p.artistIndex],
        streamThreshold: BigInt(p.streamThreshold),
        predictedOutcome: p.predictedOutcome,
        horizon: p.horizon,
        outcome: "pending",
      })
      .returning({ id: predictions.id });

    predictionIds.push(inserted.id);
    console.log(`  ${p.predictedOutcome.toUpperCase()} ${p.streamThreshold.toLocaleString()} streams in ${p.horizon} → ${inserted.id}`);
  }

  // 4. Create a post
  console.log("Creating post...");
  await db.insert(posts).values({
    predictionId: predictionIds[0],
    tastemakerId: tastemakerIds[0],
    title: "Knxwledge is about to have a moment",
    body: "The production catalog is deep and the streaming numbers are climbing. Calling 500K in 4 weeks.",
    published: true,
  });

  console.log("\nSeed complete:");
  console.log(`  ${artistIds.length} artists`);
  console.log(`  ${tastemakerIds.length} tastemakers`);
  console.log(`  ${predictionIds.length} predictions`);
  console.log(`  1 post`);

  process.exit(0);
}
