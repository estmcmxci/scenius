import { getFeedItems } from "@/app/domains/feed/service/feed-service";
import { FeedCard } from "@/app/components/feed-card";

export default async function ResolvedPage() {
  const items = await getFeedItems({ outcome: "resolved" });

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Resolved</h1>
        <p className="mt-2 text-base text-gray-600">
          Predictions that have been resolved against real SoundCloud data
        </p>
      </header>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">
          No resolved predictions yet. Predictions resolve automatically when
          their time horizon expires.
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
