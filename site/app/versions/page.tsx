import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { VERSIONS } from "@/lib/versions";

export const metadata: Metadata = { title: "Versions" };

/** Every version of the home page, to compare side by side. */
export default function Page() {
  return (
    <main className="mx-auto min-h-dvh max-w-3xl px-5 py-14 sm:py-20">
      <p className="m-0 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Home page</p>
      <h1 className="m-0 mt-4 font-serif text-5xl leading-none text-white sm:text-6xl">Seven versions</h1>
      <p className="m-0 mt-5 max-w-[52ch] text-lg leading-relaxed text-soft">The same designer and the same work, presented seven ways. V5 to V7 use the newest positioning.</p>
      <ol className="m-0 mt-10 list-none border-b border-line p-0">
        {VERSIONS.map((v) => (
          <li key={v.href} className="border-t border-line">
            <Link href={v.href} className="group flex items-center gap-5 rounded py-5 text-inherit no-underline outline-offset-4 focus-visible:outline-2 focus-visible:outline-playhead">
              <span className="w-8 shrink-0 font-mono text-sm text-dim">{v.label}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-xl font-medium leading-tight text-white">{v.name}</span>
                <span className="mt-1 block text-sm leading-normal text-muted-foreground">{v.line}</span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-dim transition-transform group-hover:translate-x-1 group-hover:text-white" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
