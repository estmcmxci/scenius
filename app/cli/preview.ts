import { takeSnapshot } from "@/app/domains/soundcloud/service/snapshot";
import { getEnv } from "@/app/config/env";

export async function previewCommand(url: string) {
  const env = getEnv();

  console.log(`Resolving artist: ${url}\n`);

  const result = await takeSnapshot(
    url,
    env.SOUNDCLOUD_CLIENT_ID,
    env.SOUNDCLOUD_CLIENT_SECRET
  );

  const { artist, totals } = result;

  console.log(`  ${artist.username}`);
  if (artist.city) console.log(`  ${artist.city}`);
  console.log();
  console.log(`  Followers:  ${artist.followersCount.toLocaleString()}`);
  console.log(`  Tracks:     ${artist.trackCount.toLocaleString()}`);
  console.log(`  Plays:      ${totals.plays.toLocaleString()}`);
  console.log(`  Likes:      ${totals.likes.toLocaleString()}`);
  console.log(`  Reposts:    ${totals.reposts.toLocaleString()}`);
  console.log(`  Comments:   ${totals.comments.toLocaleString()}`);
  console.log();
  console.log(`  SoundCloud: ${artist.permalinkUrl}`);
}
