import { notFound } from "next/navigation";
import Link from "next/link";
import { getPredictionDetail } from "@/app/domains/predictions/service/prediction-service";
import { getAttestationUrl } from "@/app/config/eas";
import { resolveEnsName } from "@/app/shared/ens";
import { formatAddress } from "@/app/shared/format-address";

const OUTCOME_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  yes: "bg-green-100 text-green-800",
  no: "bg-red-100 text-red-800",
};

const HORIZON_LABELS: Record<string, string> = {
  "1w": "1 week",
  "2w": "2 weeks",
  "4w": "4 weeks",
  "8w": "8 weeks",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PredictionPage({ params }: Props) {
  const { id } = await params;
  const detail = await getPredictionDetail(id);

  if (!detail) {
    notFound();
  }

  const { prediction, artist, snapshot, tastemaker } = detail;
  const outcome = prediction.outcome ?? "pending";
  const outcomeStyle = OUTCOME_STYLES[outcome] ?? OUTCOME_STYLES.pending;
  const horizonLabel = HORIZON_LABELS[prediction.horizon] ?? prediction.horizon;
  const ensName = tastemaker.walletAddress
    ? await resolveEnsName(tastemaker.walletAddress)
    : null;
  const displayName = ensName ?? tastemaker.displayName ?? "Anonymous";

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      {/* Back link */}
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
        ← Back to feed
      </Link>

      {/* Prediction header */}
      <div className="mt-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          {artist.avatarUrl && (
            <img
              src={artist.avatarUrl}
              alt=""
              className="h-12 w-12 rounded-full object-cover"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {artist.username}
            </h1>
            {artist.city && (
              <p className="text-sm text-gray-500">{artist.city}</p>
            )}
          </div>
        </div>

        <p className="text-lg text-gray-700">
          <span className="font-medium">{displayName}</span>
          {" predicts "}
          <span className="font-semibold">
            {prediction.predictedOutcome === "yes" ? "will" : "will not"}
          </span>
          {" hit "}
          <span className="font-bold text-gray-900">
            {Number(prediction.streamThreshold).toLocaleString()}
          </span>
          {" streams in "}
          {horizonLabel}
        </p>

        <span
          className={`mt-3 inline-block rounded-full px-3 py-1 text-sm font-medium capitalize ${outcomeStyle}`}
        >
          {outcome}
        </span>
      </div>

      {/* Catalog snapshot at prediction time */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Catalog at prediction time
        </h2>
        <div className="grid grid-cols-2 gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div>
            <p className="text-xl font-bold text-gray-900">
              {Number(snapshot.totalPlays ?? 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">plays</p>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">
              {Number(snapshot.followersCount ?? 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">followers</p>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">
              {Number(snapshot.totalLikes ?? 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">likes</p>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">
              {Number(snapshot.totalReposts ?? 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">reposts</p>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-400">
          Data via{" "}
          {artist.permalinkUrl ? (
            <a
              href={artist.permalinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              SoundCloud
            </a>
          ) : (
            "SoundCloud"
          )}
          {" · snapshotted "}
          {snapshot.takenAt.toLocaleDateString()}
        </p>
      </section>

      {/* Tastemaker */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Tastemaker
        </h2>
        <Link
          href={`/tastemakers/${tastemaker.id}`}
          className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 hover:border-gray-400 transition-colors"
        >
          <div>
            <p className="font-medium text-gray-900">{displayName}</p>
            {tastemaker.walletAddress && (
              <p className="text-xs text-gray-400 font-mono">
                {formatAddress(tastemaker.walletAddress)}
              </p>
            )}
            <p className="text-sm text-gray-500">
              Reputation: {tastemaker.reputationScore?.toFixed(3) ?? "—"}
            </p>
          </div>
        </Link>
      </section>

      {/* Metadata */}
      <section className="text-xs text-gray-400">
        {prediction.createdAt && (
          <p>Created: {new Date(prediction.createdAt).toLocaleDateString()}</p>
        )}
        {prediction.resolvedAt && (
          <p>Resolved: {new Date(prediction.resolvedAt).toLocaleDateString()}</p>
        )}
        {prediction.easAttestationUid && (
          <p>
            Attestation:{" "}
            <a
              href={getAttestationUrl(prediction.easAttestationUid)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              View on EAS
            </a>
          </p>
        )}
        <p className="mt-1 font-mono">{prediction.id}</p>
      </section>
    </main>
  );
}
