import { NextResponse } from "next/server";
import { getVoiceIdForAccent } from "@/lib/tts";
import { isNonEmptyString } from "@/lib/validators";

export const runtime = "nodejs";

type RequestBody = {
  sentence?: unknown;
  accent?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    const sentence = isNonEmptyString(body.sentence) ? body.sentence.trim() : "";
    const accent = isNonEmptyString(body.accent) ? body.accent.trim() : "";

    if (!sentence || !accent) {
      return NextResponse.json(
        { error: "sentence and accent are required." },
        { status: 400 }
      );
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json({ error: "ELEVENLABS_API_KEY is missing." }, { status: 500 });
    }

    const voiceId = getVoiceIdForAccent(accent);

    if (!voiceId) {
      return NextResponse.json(
        { error: `No voice is configured for accent "${accent}".` },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text: sentence,
          model_id: process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.4,
            similarity_boost: 0.8
          }
        })
      }
    );

    if (!response.ok || !response.body) {
      const errorText = await response.text();
      console.error("TTS upstream error", errorText);

      return NextResponse.json({ error: "Failed to generate speech." }, { status: 502 });
    }

    return new NextResponse(response.body, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    console.error("Failed to stream TTS audio", error);
    return NextResponse.json({ error: "Failed to generate speech." }, { status: 500 });
  }
}
