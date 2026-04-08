import { getFeedItems } from "@/app/domains/feed/service/feed-service";
import { FeedCard } from "@/app/components/feed-card";

export default async function Home() {
  const items = await getFeedItems({ outcome: "all" });

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Scenius</h1>
        <p className="mt-2 text-base text-gray-600">
          Reputation-weighted predictions on independent music
        </p>
      </header>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">
          No predictions yet. Seed the database with{" "}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">
            pnpm cli seed
          </code>
        </p>
      ) : (
        <ul className="space-y-3">
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
