"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  wordId: number;
  word: string;
};

export function GenerateExamplesButton({ wordId, word }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-example", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ wordId, word })
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error || "Failed to generate examples.");
        return;
      }

      router.refresh();
    } catch (generationError) {
      console.error(generationError);
      setError("Something went wrong while generating examples.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex max-w-xs flex-col items-end gap-3">
      <button
        type="button"
        onClick={handleGenerate}
        disabled={isLoading}
        className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? "Generating..." : "Generate Examples"}
      </button>
      {error ? <p className="text-right text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
