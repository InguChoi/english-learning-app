"use client";

import { useEffect, useId, useRef, useState } from "react";

const accents = ["US", "UK", "AU"] as const;

type Props = {
  sentence: string;
};

export function TTSPlayer({ sentence }: Props) {
  const selectId = useId();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [accent, setAccent] = useState<(typeof accents)[number]>("US");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  async function handlePlay() {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ sentence, accent })
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error || "Failed to load audio.");
        return;
      }

      const audioBlob = await response.blob();

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }

      const objectUrl = URL.createObjectURL(audioBlob);
      objectUrlRef.current = objectUrl;

      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      audioRef.current.src = objectUrl;
      await audioRef.current.play();
    } catch (playError) {
      console.error(playError);
      setError("Something went wrong while playing audio.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <label
        htmlFor={selectId}
        className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
      >
        Accent
      </label>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <select
          id={selectId}
          value={accent}
          onChange={(event) => setAccent(event.target.value as (typeof accents)[number])}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
        >
          {accents.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handlePlay}
          disabled={isLoading}
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Loading..." : "Play Audio"}
        </button>
      </div>
      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
