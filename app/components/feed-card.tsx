import Link from "next/link";
import type { FeedItem } from "@/app/domains/feed/types/feed-item";
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
  item: FeedItem;
};

export function FeedCard({ item }: Props) {
  const outcome = item.outcome;
  const outcomeStyle = OUTCOME_STYLES[outcome] ?? OUTCOME_STYLES.pending;
  const horizonLabel = HORIZON_LABELS[item.horizon] ?? item.horizon;

  return (
    <Link
      href={`/predictions/${item.predictionId}`}
      className="block rounded-lg border border-gray-200 bg-white p-5 hover:border-gray-400 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {item.artistAvatarUrl && (
              <img
                src={item.artistAvatarUrl}
                alt=""
                className="h-8 w-8 rounded-full object-cover"
              />
            )}
            <p className="text-base font-semibold text-gray-900 truncate">
              {item.artistName}
            </p>
          </div>

          <p className="mt-2 text-sm text-gray-700">
            <span className="font-medium">
              {item.tastemakerEnsName
                ?? item.tastemakerName
                ?? (item.tastemakerWalletAddress
                  ? formatAddress(item.tastemakerWalletAddress)
                  : "Anonymous")}
            </span>
            {" predicts "}
            <span className="font-medium">
              {item.predictedOutcome === "yes" ? "will" : "will not"}
            </span>
            {" hit "}
            <span className="font-semibold text-gray-900">
              {item.streamThreshold.toLocaleString()}
            </span>
            {" streams in "}
            {horizonLabel}
          </p>

          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
            {item.snapshotPlays !== null && (
              <span>
                {item.snapshotPlays.toLocaleString()} plays at prediction
                <span className="ml-1 text-gray-400">via SoundCloud</span>
              </span>
            )}
            <span>rep: {item.reputationScore.toFixed(2)}</span>
            {item.createdAt && (
              <span>{new Date(item.createdAt).toLocaleDateString()}</span>
            )}
            {item.easAttestationUid && (
              <span className="text-blue-600 hover:text-blue-800 underline">
                Attested on EAS
              </span>
            )}
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${outcomeStyle}`}
        >
          {outcome}
        </span>
      </div>
    </Link>
  );
}
