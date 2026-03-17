import Link from "next/link";
import type { PredictionWithArtist } from "@/app/domains/tastemakers/repo/tastemaker-repo";

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
  item: PredictionWithArtist;
};

export function PredictionCard({ item }: Props) {
  const { prediction, artist } = item;
  const outcome = prediction.outcome ?? "pending";
  const outcomeStyle = OUTCOME_STYLES[outcome] ?? OUTCOME_STYLES.pending;
  const horizonLabel =
    HORIZON_LABELS[prediction.horizon] ?? prediction.horizon;

  return (
    <Link
      href={`/predictions/${prediction.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-4 hover:border-gray-400 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {artist.username}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Predicts{" "}
            <span className="font-medium text-gray-800">
              {prediction.predictedOutcome === "yes" ? "will" : "will not"}
            </span>{" "}
            hit{" "}
            <span className="font-medium text-gray-800">
              {Number(prediction.streamThreshold).toLocaleString()}
            </span>{" "}
            streams in {horizonLabel}
          </p>
          {prediction.createdAt && (
            <p className="mt-1 text-xs text-gray-400">
              {new Date(prediction.createdAt).toLocaleDateString()}
            </p>
          )}
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
