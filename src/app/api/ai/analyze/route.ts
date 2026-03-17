import { NextRequest, NextResponse } from "next/server";
import { analyzeSimulator } from "@/lib/ai-utils";

export async function POST(request: NextRequest) {
  try {
    const { simulatorName, inputs, outputs } = await request.json();

    if (!simulatorName || !inputs || !outputs) {
      return NextResponse.json(
        { error: "simulatorName, inputs, and outputs are required" },
        { status: 400 }
      );
    }

    const analysis = await analyzeSimulator(simulatorName, inputs, outputs);

    return NextResponse.json({ analysis });
  } catch (error: any) {
    console.error("AI Analysis API error:", error);
    return NextResponse.json(
      { error: "Failed to generate analysis" },
      { status: 500 }
    );
  }
}
