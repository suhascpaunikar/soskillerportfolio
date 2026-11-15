import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The home page's type scale. Everything is set at regular weight with -1% tracking;
 * size and opacity carry the hierarchy, and labels switch to mono capitals.
 */
export const T = {
  h1: "text-[40px] leading-[1.05] tracking-[-0.01em] lg:text-[56px] lg:leading-none",
  h2: "text-[32px] leading-[1.1] tracking-[-0.01em] lg:text-[40px]",
  h3: "text-2xl leading-[1.1] tracking-[-0.01em] lg:text-[32px]",
  h4: "text-2xl leading-[1.1] tracking-[-0.01em]",
  lead: "text-xl leading-[1.2] tracking-[-0.01em]",
  body: "text-base leading-[1.32] tracking-[-0.01em]",
  small: "text-sm leading-[1.32]",
  mono: "font-mono text-sm uppercase leading-none tracking-[-0.01em]",
} as const;

export const CONTAINER = "mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-[120px]";

export const FOCUS = "outline-offset-2 focus-visible:outline-2 focus-visible:outline-white/70";

const BTN = "inline-flex h-8 shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-md px-2.5 text-sm font-medium tracking-[-0.01em] no-underline transition-colors";

const TONES = {
  /** Paper on dark: the main action. */
  paper: "bg-paper text-ink hover:bg-white",
  white: "bg-white text-ink hover:bg-paper",
  /** A quiet second action on dark. */
  ghost: "bg-white/[0.08] text-white/65 hover:bg-white/[0.14] hover:text-white",
  /** On paper. */
  ink: "bg-black text-white hover:bg-[#2a2826]",
  "ghost-ink": "bg-black/[0.12] text-black/65 hover:bg-black/[0.18] hover:text-black",
  /** Outlined, on a coloured card. */
  "line-ink": "text-ink shadow-[inset_0_0_0_1px_rgb(17_16_15/0.4)] hover:bg-black/[0.06]",
  "line-white": "text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.7)] hover:bg-white/10",
} as const;

export type Tone = keyof typeof TONES;

export const btn = (tone: Tone = "paper", className?: string) => cn(BTN, TONES[tone], tone.includes("ink") ? "outline-offset-2 focus-visible:outline-2 focus-visible:outline-black/70" : FOCUS, className);

/** A link styled as a button. `arrow` adds the arrow the main actions carry. */
export function Btn({ href, tone = "paper", arrow = false, className, children }: { href: string; tone?: Tone; arrow?: boolean; className?: string; children: ReactNode }) {
  const inner = (
    <>
      {children}
      {arrow && <ArrowRight className="size-3.5" strokeWidth={1.75} aria-hidden="true" />}
    </>
  );
  if (/^(mailto:|https?:)/.test(href)) {
    return (
      <a href={href} className={btn(tone, className)}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={btn(tone, className)}>
      {inner}
    </Link>
  );
}

/** The small mono label that names a section. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("m-0 text-white/65", T.mono, className)}>{children}</p>;
}

/** The mark: a clapper slate reduced to three strokes. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path d="M3 9.2 26.6 3l1.3 4.8L4.3 14z" />
      <path d="M4 15h24v3.4H4z" />
      <path d="M4 20.2h24V26a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" />
    </svg>
  );
}
