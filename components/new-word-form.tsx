"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function NewWordForm() {
  const router = useRouter();
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/words", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ word, meaning, notes })
      });

      const data = (await response.json()) as { error?: string; id?: number };

      if (!response.ok || !data.id) {
        setError(data.error || "Failed to save the word.");
        return;
      }

      router.push(`/words/${data.id}`);
      router.refresh();
    } catch (submitError) {
      console.error(submitError);
      setError("Something went wrong while saving the word.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]"
    >
      <div className="space-y-6">
        <div>
          <label htmlFor="word" className="block text-sm font-semibold text-slate-700">
            Word
          </label>
          <input
            id="word"
            value={word}
            onChange={(event) => setWord(event.target.value)}
            placeholder="for example: resilient"
            required
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div>
          <label htmlFor="meaning" className="block text-sm font-semibold text-slate-700">
            Meaning
          </label>
          <input
            id="meaning"
            value={meaning}
            onChange={(event) => setMeaning(event.target.value)}
            placeholder="what this word means to you"
            required
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-semibold text-slate-700">
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="memory tip, synonym, grammar note, or context"
            rows={5}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-w-36 items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Saving..." : "Save word"}
        </button>
      </div>
    </form>
  );
}
