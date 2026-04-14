import { NewWordForm } from "@/components/new-word-form";

export default function NewWordPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
          Add vocabulary
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Save a new word</h1>
        <p className="mt-3 text-slate-600">
          Add the word, what it means to you, and any notes you want to remember later.
        </p>
      </div>

      <NewWordForm />
    </section>
  );
}
