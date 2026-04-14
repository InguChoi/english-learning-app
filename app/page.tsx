import Link from "next/link";

const steps = [
  {
    title: "Save new words",
    description: "Build your own vocabulary bank with meanings and quick notes."
  },
  {
    title: "Generate useful examples",
    description: "Create three AI-crafted sentence styles for each word."
  },
  {
    title: "Practice accents",
    description: "Listen to the same sentence in different English accents."
  }
];

export default function HomePage() {
  return (
    <section className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_25px_70px_-35px_rgba(15,23,42,0.4)] backdrop-blur">
          <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
            Personal English learning app
          </span>
          <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Turn unfamiliar words into examples you can read, hear, and remember.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Keep vocabulary in one place, generate context with AI, and replay pronunciation in
            multiple accents without exposing your API keys to the browser.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/words"
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Browse words
            </Link>
            <Link
              href="/words/new"
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            >
              Add your first word
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-blue-200/70 bg-gradient-to-br from-blue-50 to-cyan-50 p-8 shadow-[0_25px_70px_-35px_rgba(29,78,216,0.45)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
            Built for repetition
          </p>
          <div className="mt-6 space-y-5">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-2xl bg-white/80 p-5 shadow-sm">
                <div className="text-sm font-semibold text-blue-700">0{index + 1}</div>
                <h2 className="mt-2 text-lg font-semibold text-slate-900">{step.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
