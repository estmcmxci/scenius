import { takeSnapshot } from "@/app/domains/soundcloud/service/snapshot";
import { takeTrackSnapshot } from "@/app/domains/soundcloud/service/track-snapshot";
import { getEnv } from "@/app/config/env";

function isTrackUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Track URLs have at least two path segments: /username/track-slug
    const segments = parsed.pathname.split("/").filter(Boolean);
    return segments.length >= 2;
  } catch {
    return false;
  }
}

export async function previewCommand(url: string) {
  const env = getEnv();

  if (isTrackUrl(url)) {
    console.log(`Resolving track: ${url}\n`);

    const result = await takeTrackSnapshot(
      url,
      env.SOUNDCLOUD_CLIENT_ID,
      env.SOUNDCLOUD_CLIENT_SECRET
    );

    const { artist, track, snapshot } = result;

    console.log(`  ${track.title}`);
    console.log(`  by ${artist.username}`);
    console.log();
    console.log(`  Plays:      ${snapshot.playbackCount.toLocaleString()}`);
    console.log(`  Likes:      ${snapshot.likesCount.toLocaleString()}`);
    console.log(`  Reposts:    ${snapshot.repostsCount.toLocaleString()}`);
    console.log(`  Comments:   ${snapshot.commentCount.toLocaleString()}`);
    console.log();
    console.log(`  Artist:     ${artist.permalinkUrl}`);
    console.log(`  Track:      ${track.permalinkUrl}`);
  } else {
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
}
