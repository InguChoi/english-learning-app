import { notFound } from "next/navigation";
import { GenerateExamplesButton } from "@/components/generate-examples-button";
import { TTSPlayer } from "@/components/tts-player";
import { prisma } from "@/lib/prisma";
import { formatExampleType } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function WordDetailPage({ params }: Props) {
  const { id } = await params;
  const wordId = Number(id);

  if (!Number.isInteger(wordId)) {
    notFound();
  }

  const word = await prisma.word.findUnique({
    where: { id: wordId },
    include: {
      examples: {
        orderBy: {
          createdAt: "asc"
        }
      }
    }
  });

  if (!word) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
              Word detail
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">
              {word.word}
            </h1>
            <p className="mt-4 text-lg text-slate-600">{word.meaning}</p>
            {word.notes ? (
              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Notes
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {word.notes}
                </p>
              </div>
            ) : null}
          </div>

          <div className="flex shrink-0 items-start">
            <GenerateExamplesButton wordId={word.id} word={word.word} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Example sentences</h2>
          <span className="rounded-full bg-white/80 px-3 py-1 text-sm font-medium text-slate-500">
            {word.examples.length} saved
          </span>
        </div>

        {word.examples.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 p-10 text-center">
            <p className="text-lg font-semibold text-slate-900">No examples yet</p>
            <p className="mt-2 text-slate-600">
              Use the generate button to create AI examples for this word.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {word.examples.map((example) => (
              <div
                key={example.id}
                className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.45)]"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
                      {formatExampleType(example.type)}
                    </p>
                    <p className="mt-3 text-lg leading-8 text-slate-800">{example.sentence}</p>
                  </div>
                  <div className="lg:w-72">
                    <TTSPlayer sentence={example.sentence} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
