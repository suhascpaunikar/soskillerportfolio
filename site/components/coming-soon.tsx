import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

/** Holding page for routes that are designed in the wireframes but not built yet. */
export function ComingSoon({ eyebrow, title, line }: { eyebrow: string; title: string; line: string }) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center gap-6 px-6 py-16">
      <p className="m-0 font-mono text-xs font-semibold tracking-[0.12em] text-muted-foreground">{eyebrow}</p>
      <h1 className="m-0 font-serif text-5xl leading-none text-white sm:text-6xl">{title}</h1>
      <p className="m-0 max-w-[52ch] text-lg leading-relaxed text-soft">{line}</p>
      <p className="m-0 font-mono text-xs text-dim">This page is still in the edit.</p>
      <div>
        <Link href="/" className={buttonVariants({ size: "lg" })}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to the edit
        </Link>
      </div>
    </main>
  );
}
