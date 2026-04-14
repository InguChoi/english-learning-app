import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function WordsPage() {
  const words = await prisma.word.findMany({
    include: {
      _count: {
        select: {
          examples: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)] sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
            Vocabulary bank
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Saved words</h1>
          <p className="mt-2 text-slate-600">
            Review saved words with Korean meaning, English definition, example sentences, and TTS.
          </p>
        </div>
        <Link
          href="/words/new"
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Add new word
        </Link>
      </div>

      {words.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 p-10 text-center">
          <h2 className="text-xl font-semibold text-slate-900">No words saved yet</h2>
          <p className="mt-3 text-slate-600">Start by adding a word you want to remember.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {words.map((entry) => (
            <Link
              key={entry.id}
              href={`/words/${entry.id}`}
              className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.45)] hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_24px_60px_-35px_rgba(29,78,216,0.45)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                    {entry.word}
                  </h2>
                  <p className="mt-2 text-slate-600">
                    {entry.koreanMeaning || entry.meaning || "Meaning will be generated after save."}
                  </p>
                  {entry.englishDefinition ? (
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {entry.englishDefinition}
                    </p>
                  ) : null}
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                  {entry._count.examples} examples
                </span>
              </div>
              {entry.notes ? (
                <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">{entry.notes}</p>
              ) : null}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
