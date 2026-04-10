import { getFeedItems } from "@/app/domains/feed/service/feed-service";
import { FeedCard } from "@/app/components/feed-card";

export default async function Home() {
  const items = await getFeedItems({ outcome: "all" });

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      <header className="mb-8 sm:mb-10">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-fg">
          Scenius
        </h1>
        <p className="mt-2 text-base text-fg-muted leading-relaxed">
          Reputation-weighted predictions on independent music
        </p>
      </header>

      {items.length === 0 ? (
        <p className="text-sm text-fg-faint">
          No predictions yet. Seed the database with{" "}
          <code className="rounded bg-bg-elevated px-1.5 py-0.5 text-xs text-fg-muted">
            pnpm cli seed
          </code>
        </p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.predictionId}>
              <FeedCard item={item} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
