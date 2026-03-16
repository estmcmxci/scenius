import { notFound } from "next/navigation";
import { getTastemakerProfile } from "@/app/domains/tastemakers/service/tastemaker-service";
import type { TastemakerPredictionRow } from "@/app/domains/tastemakers/service/tastemaker-service";

interface PageProps {
  params: Promise<{ id: string }>;
}

function formatDate(date: Date | null): string {
  if (!date) return "\u2014";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function OutcomeBadge({ outcome }: { outcome: string | null }) {
  if (!outcome || outcome === "pending") {
    return (
      <span className="inline-block rounded-full bg-stone-200 px-2.5 py-0.5 text-xs font-medium text-stone-600">
        Pending
      </span>
    );
  }
  if (outcome === "correct") {
    return (
      <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
        Correct
      </span>
    );
  }
  return (
    <span className="inline-block rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-700">
      Incorrect
    </span>
  );
}

function PredictionRow({ p }: { p: TastemakerPredictionRow }) {
  return (
    <li className="border-b border-stone-200 py-5 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-stone-900">
            {p.artistPermalinkUrl ? (
              <a
                href={p.artistPermalinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-stone-300 underline-offset-2 hover:decoration-stone-500"
              >
                {p.artistUsername}
              </a>
            ) : (
              p.artistUsername
            )}{" "}
            {p.artistPermalinkUrl && (
              <span className="text-xs text-stone-400">via SoundCloud</span>
            )}
          </p>
          <p className="mt-1 text-sm text-stone-600">
            Predicted <span className="font-medium">{p.predictedOutcome}</span>
            {p.streamThreshold != null && (
              <> at {p.streamThreshold.toLocaleString()} streams</>
            )}
            {" \u00b7 "}
            {p.horizon} horizon
          </p>
          {p.totalPlaysAtPrediction != null && (
            <p className="mt-0.5 text-xs text-stone-400">
              {p.totalPlaysAtPrediction.toLocaleString()} total plays at time of
              prediction
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <OutcomeBadge outcome={p.outcome} />
          <span className="text-xs text-stone-400">{formatDate(p.createdAt)}</span>
        </div>
      </div>
      <div className="mt-2">
        <a
          href={`/predictions/${p.id}`}
          className="text-xs font-medium text-teal-700 underline decoration-teal-300 underline-offset-2 hover:decoration-teal-500"
        >
          View prediction details
        </a>
      </div>
    </li>
  );
}

export default async function TastemakerProfilePage({ params }: PageProps) {
  const { id } = await params;
  const profile = await getTastemakerProfile(id);

  if (!profile) {
    notFound();
  }

  const winRateDisplay =
    profile.stats.winRate != null
      ? `${(profile.stats.winRate * 100).toFixed(0)}%`
      : "\u2014";

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      {/* Header */}
      <header className="mb-10">
        <h1 className="font-serif text-3xl font-normal tracking-tight text-stone-900">
          {profile.displayName ?? "Anonymous Tastemaker"}
        </h1>
        {profile.walletAddress && (
          <p className="mt-1 font-mono text-xs text-stone-400 truncate">
            {profile.walletAddress}
          </p>
        )}
        <p className="mt-2 text-sm text-stone-500">
          Member since {formatDate(profile.createdAt)}
        </p>
      </header>

      {/* Stats */}
      <section className="mb-10 grid grid-cols-3 gap-6 rounded-lg border border-stone-200 bg-stone-50 p-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
            Reputation
          </p>
          <p className="mt-1 text-2xl font-semibold text-stone-900">
            {profile.reputationScore?.toFixed(2) ?? "\u2014"}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
            Predictions
          </p>
          <p className="mt-1 text-2xl font-semibold text-stone-900">
            {profile.stats.totalPredictions}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
            Win Rate
          </p>
          <p className="mt-1 text-2xl font-semibold text-stone-900">
            {winRateDisplay}
          </p>
          {profile.stats.resolved > 0 && (
            <p className="mt-0.5 text-xs text-stone-400">
              {profile.stats.correct}/{profile.stats.resolved} resolved
            </p>
          )}
        </div>
      </section>

      {/* Predictions */}
      <section>
        <h2 className="mb-4 font-serif text-xl text-stone-900">Predictions</h2>
        {profile.predictions.length === 0 ? (
          <p className="text-sm text-stone-500">
            No predictions yet.
          </p>
        ) : (
          <ul className="divide-y-0">
            {profile.predictions.map((p) => (
              <PredictionRow key={p.id} p={p} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
