"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useModal } from "@getpara/react-sdk";
import { ArtistPreview } from "@/app/components/artist-preview";
import { formatAddress } from "@/app/shared/format-address";

const HORIZONS = ["1w", "2w", "4w", "8w"] as const;
type Horizon = (typeof HORIZONS)[number];

type FieldErrors = Record<string, string[]>;

export default function SubmitPage() {
  const router = useRouter();
  const { isConnected, embedded } = useAccount();
  const { openModal } = useModal();

  const wallets = embedded?.wallets ?? [];
  const evmWallet = wallets.find((w) => w.type === "EVM");
  const walletAddress = evmWallet?.address ?? null;

  const [url, setUrl] = useState("");
  const [debouncedUrl, setDebouncedUrl] = useState("");
  const [streamThreshold, setStreamThreshold] = useState("");
  const [predictedOutcome, setPredictedOutcome] = useState<"yes" | "no">("yes");
  const [horizon, setHorizon] = useState<Horizon>("2w");

  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const handleUrlBlur = useCallback(() => {
    const trimmed = url.trim();
    if (trimmed && trimmed !== debouncedUrl) {
      setDebouncedUrl(trimmed);
    }
  }, [url, debouncedUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress) return;
    setFieldErrors({});
    setFormError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.trim(),
          streamThreshold: Number(streamThreshold),
          predictedOutcome,
          horizon,
          walletAddress,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        if (res.status === 400 && body?.details) {
          if (typeof body.details === "object") {
            setFieldErrors(body.details as FieldErrors);
          } else {
            setFormError(String(body.details));
          }
        } else {
          setFormError(body?.error ?? "Something went wrong. Try again.");
        }
        return;
      }

      const data = await res.json();
      router.push(`/predictions/${data.predictionId}`);
    } catch {
      setFormError("Network error. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Submit a Prediction
          </h1>
          <p className="mt-2 text-base text-gray-600">
            Sign in to submit a prediction on an independent artist.
          </p>
        </header>
        <button
          onClick={() => openModal()}
          className="rounded-md bg-gray-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          Sign In to Submit
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Submit a Prediction
        </h1>
        <p className="mt-2 text-base text-gray-600">
          Predict whether an independent artist will hit a stream threshold
          within a given time horizon.
        </p>
      </header>

      {walletAddress && (
        <div className="mb-8 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
          Predicting as:{" "}
          <span className="font-mono font-medium">
            {formatAddress(walletAddress)}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SoundCloud URL */}
        <Field
          label="SoundCloud URL"
          error={fieldErrors.url}
          hint="Paste a link to the artist's SoundCloud profile"
        >
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={handleUrlBlur}
            placeholder="https://soundcloud.com/artist-name"
            className={inputClass(fieldErrors.url)}
            required
          />
        </Field>

        {/* Artist Preview */}
        {debouncedUrl && (
          <div className="mt-2">
            <ArtistPreview url={debouncedUrl} />
          </div>
        )}

        {/* Stream Threshold */}
        <Field
          label="Stream Threshold"
          error={fieldErrors.streamThreshold}
          hint="Total plays the artist must reach for this prediction to resolve yes"
        >
          <input
            type="number"
            min={1}
            value={streamThreshold}
            onChange={(e) => setStreamThreshold(e.target.value)}
            placeholder="e.g. 50000"
            className={inputClass(fieldErrors.streamThreshold)}
            required
          />
        </Field>

        {/* Predicted Outcome */}
        <Field
          label="Your Prediction"
          error={fieldErrors.predictedOutcome}
        >
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPredictedOutcome("yes")}
              className={toggleClass(predictedOutcome === "yes")}
            >
              Yes &mdash; will hit threshold
            </button>
            <button
              type="button"
              onClick={() => setPredictedOutcome("no")}
              className={toggleClass(predictedOutcome === "no")}
            >
              No &mdash; won&apos;t hit threshold
            </button>
          </div>
        </Field>

        {/* Horizon */}
        <Field label="Time Horizon" error={fieldErrors.horizon}>
          <div className="flex gap-2">
            {HORIZONS.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setHorizon(h)}
                className={toggleClass(horizon === h)}
              >
                {h}
              </button>
            ))}
          </div>
        </Field>

        {/* Form-level error */}
        {formError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {formError}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-gray-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {submitting ? "Submitting..." : "Submit Prediction"}
        </button>
      </form>
    </main>
  );
}

/* -- Helpers ------------------------------------------------- */

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string[];
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-900">
        {label}
      </label>
      {hint && (
        <p className="mt-1 text-xs text-gray-500">{hint}</p>
      )}
      <div className="mt-2">{children}</div>
      {error &&
        error.map((msg) => (
          <p key={msg} className="mt-1 text-xs text-red-600">
            {msg}
          </p>
        ))}
    </div>
  );
}

function inputClass(error?: string[]): string {
  const base =
    "w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900";
  return error && error.length > 0
    ? `${base} border-red-300 focus:ring-red-500`
    : `${base} border-gray-300`;
}

function toggleClass(active: boolean): string {
  const base =
    "rounded-md px-4 py-2 text-sm font-medium transition-colors";
  return active
    ? `${base} bg-gray-900 text-white`
    : `${base} bg-gray-100 text-gray-600 hover:bg-gray-200`;
}
