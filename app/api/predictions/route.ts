import { NextRequest, NextResponse } from "next/server";
import { createPredictionSchema } from "@/app/domains/predictions/types/create-prediction";
import { submitPrediction } from "@/app/domains/predictions/service/prediction-service";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json().catch(() => null);
  const parsed = createPredictionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  let result;
  try {
    result = await submitPrediction(parsed.data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";

    if (message.includes("SoundCloud") || message.includes("SC API") || message.includes("SC token")) {
      return NextResponse.json(
        { error: "Failed to fetch from SoundCloud", details: message },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error", details: message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    predictionId: result.predictionId,
    url: `/predictions/${result.predictionId}`,
    artist: result.artist,
    snapshot: result.totals,
  });
}
