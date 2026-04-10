import { notFound } from "next/navigation";
import { getTastemakerProfile } from "@/app/domains/tastemakers/service/tastemaker-service";
import { PredictionCard } from "@/app/components/prediction-card";
import { resolveEnsName } from "@/app/shared/ens";
import { formatAddress } from "@/app/shared/format-address";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TastemakerProfilePage({ params }: Props) {
  const { id } = await params;
  const profile = await getTastemakerProfile(id);

  if (!profile) {
    notFound();
  }

  const { tastemaker, predictions, stats } = profile;
  const ensName = tastemaker.walletAddress
    ? await resolveEnsName(tastemaker.walletAddress)
    : null;
  const displayName =
    ensName ?? tastemaker.displayName ?? tastemaker.walletAddress ?? "Anonymous";
  const reputation = tastemaker.reputationScore?.toFixed(3) ?? "\u2014";

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      {/* Profile header */}
      <div className="mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-fg break-words">
          {displayName}
        </h1>
        {tastemaker.walletAddress && (
          <p className="mt-1 text-sm text-fg-faint font-mono">
            {formatAddress(tastemaker.walletAddress)}
          </p>
        )}
        <p className="mt-3 text-lg text-fg-muted">
          Reputation score:{" "}
          <span className="font-semibold text-accent">{reputation}</span>
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-3 gap-2 sm:gap-4 rounded-lg border border-border bg-bg-raised p-3 sm:p-4">
        <div className="text-center">
          <p className="text-xl sm:text-2xl font-bold text-fg">
            {stats.totalPredictions}
          </p>
          <p className="text-xs text-fg-faint mt-0.5">Total predictions</p>
        </div>
        <div className="text-center">
          <p className="text-xl sm:text-2xl font-bold text-fg">
            {stats.resolvedPredictions}
          </p>
          <p className="text-xs text-fg-faint mt-0.5">Resolved</p>
        </div>
        <div className="text-center">
          <p className="text-xl sm:text-2xl font-bold text-fg">
            {stats.winRate !== null ? `${stats.winRate}%` : "\u2014"}
          </p>
          <p className="text-xs text-fg-faint mt-0.5">Win rate</p>
        </div>
      </div>

      {/* Predictions list */}
      <section>
        <h2 className="mb-4 font-serif text-lg font-semibold text-fg">
          Predictions
        </h2>
        {predictions.length === 0 ? (
          <p className="text-sm text-fg-faint">No predictions yet.</p>
        ) : (
          <ul className="space-y-3">
            {predictions.map((item) => (
              <li key={item.prediction.id}>
                <PredictionCard item={item} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
