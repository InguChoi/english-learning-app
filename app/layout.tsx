import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "English Learning App",
  description: "Save new English words, generate examples with AI, and practice pronunciation with TTS."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="text-slate-900 antialiased">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
          <header className="mb-10 flex flex-col gap-4 rounded-3xl border border-white/60 bg-white/80 px-6 py-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="text-xl font-semibold tracking-tight text-slate-900">
              English Learning
            </Link>
            <nav className="flex items-center gap-3 text-sm font-medium text-slate-600">
              <Link href="/" className="rounded-full px-4 py-2 hover:bg-slate-100">
                Home
              </Link>
              <Link href="/words" className="rounded-full px-4 py-2 hover:bg-slate-100">
                Words
              </Link>
              <Link
                href="/words/new"
                className="rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Add Word
              </Link>
            </nav>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
