import { db } from "@/app/db/client";
import { predictions } from "@/app/domains/predictions/repo/schema";
import { posts } from "@/app/domains/feed/repo/schema";
import { and, eq, inArray, ne } from "drizzle-orm";

export async function prunePendingCommand() {
  const isDryRun = process.argv.includes("--dry-run");

  const victims = await db
    .select({
      id: predictions.id,
      createdAt: predictions.createdAt,
      horizon: predictions.horizon,
    })
    .from(predictions)
    .where(and(eq(predictions.outcome, "pending"), ne(predictions.horizon, "1w")));

  console.log(`Found ${victims.length} non-1w pending predictions:`);
  for (const v of victims) {
    console.log(`  ${v.id.slice(0, 8)}  ${v.createdAt!.toISOString()}  h=${v.horizon}`);
  }

  if (isDryRun) {
    console.log("\n[dry-run] No deletions made.");
    process.exit(0);
  }

  if (victims.length === 0) {
    console.log("Nothing to prune.");
    process.exit(0);
  }

  const ids = victims.map((v) => v.id);

  await db.delete(posts).where(inArray(posts.predictionId, ids));
  await db.delete(predictions).where(inArray(predictions.id, ids));

  console.log(`\nDeleted ${victims.length} predictions (and their posts).`);
  process.exit(0);
}
