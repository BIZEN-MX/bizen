import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    const apiKey = process.env.GOOGLE_TTS_API_KEY;

    if (!apiKey) {
      console.error("DEBUG: GOOGLE_TTS_API_KEY is missing in .env");
      return NextResponse.json(
        { error: "Google TTS API key is missing" },
        { status: 500 }
      );
    }

    if (!text) {
      return NextResponse.json(
        { error: "No text provided" },
        { status: 400 }
      );
    }

    // Google Cloud TTS API — v1beta1 for Studio voices
    const url = `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${apiKey}`;

    const body = {
      input: { text },
      voice: {
        // es-US-Studio-B: Premium Studio voice — most natural, clear, human-sounding male
        languageCode: "es-US",
        name: "es-US-Studio-B",
        ssmlGender: "MALE",
      },
      audioConfig: {
        audioEncoding: "MP3",
        pitch: 0.0,        // No pitch adjustment — Studio voices are already well-tuned
        speakingRate: 0.90, // Slightly slower for clarity; 1.0 = normal
        effectsProfileId: ["small-bluetooth-speaker-class-device"]
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Google TTS API error:", errorData);

      // Fallback: try Wavenet-B if Studio not available on this key tier
      const fallbackBody = {
        input: { text },
        voice: {
          languageCode: "es-US",
          name: "es-US-Neural2-B",
          ssmlGender: "MALE",
        },
        audioConfig: {
          audioEncoding: "MP3",
          pitch: 0.0,
          speakingRate: 0.90,
        },
      };

      const fallbackUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
      const fallbackResponse = await fetch(fallbackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fallbackBody),
      });

      if (!fallbackResponse.ok) {
        return NextResponse.json(
          { error: "Failed to generate speech from Google Cloud" },
          { status: response.status }
        );
      }

      const fallbackData = await fallbackResponse.json();
      const fallbackBuffer = Buffer.from(fallbackData.audioContent, "base64");
      return new NextResponse(fallbackBuffer, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Cache-Control": "no-store",
        },
      });
    }

    const data = await response.json();
    const audioBuffer = Buffer.from(data.audioContent, "base64");

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store", // Prevents browser from serving stale audio
      },
    });
  } catch (error) {
    console.error("Error in Google TTS API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
