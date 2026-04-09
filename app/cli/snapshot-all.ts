import { getEnv } from "@/app/config/env";
import { listPendingArtists } from "@/app/domains/resolution/repo/pending-artists";
import { takeSnapshot } from "@/app/domains/soundcloud/service/snapshot";
import {
  upsertArtist,
  insertSnapshot,
} from "@/app/domains/soundcloud/repo/snapshot-repo";

export async function snapshotAllCommand() {
  const env = getEnv();
  const pendingArtists = await listPendingArtists();

  console.log(`Found ${pendingArtists.length} artists with pending predictions`);

  let snapshotted = 0;
  let errors = 0;

  for (const { artistId, permalinkUrl } of pendingArtists) {
    try {
      console.log(`Snapshotting ${permalinkUrl}...`);
      const result = await takeSnapshot(
        permalinkUrl,
        env.SOUNDCLOUD_CLIENT_ID,
        env.SOUNDCLOUD_CLIENT_SECRET
      );

      const upsertedId = await upsertArtist(result);
      await insertSnapshot(upsertedId, result);

      console.log(
        `  ${result.artist.username}: ${result.totals.plays} plays, ${result.artist.followersCount} followers`
      );
      snapshotted++;
    } catch (err) {
      errors++;
      console.error(`  Failed to snapshot artist ${artistId}: ${err}`);
    }
  }

  console.log(`Done. Snapshotted: ${snapshotted}, Errors: ${errors}`);
  process.exit(0);
}
