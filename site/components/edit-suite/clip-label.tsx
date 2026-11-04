import { cn } from "@/lib/utils";

/** The "Case study" tag: white on dark backgrounds (the monitor), dark on the light case-study clips. */
export function CaseStudyBadge({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-[15px] w-fit max-w-full shrink-0 items-center overflow-hidden whitespace-nowrap rounded-[4px] px-1.5 font-mono text-[8.5px] font-bold uppercase leading-none tracking-[0.06em] [text-shadow:none]",
        tone === "light" ? "bg-white text-[#1b2170]" : "bg-[#0e1238] text-white",
        className,
      )}
    >
      Case study
    </span>
  );
}

/**
 * The text inside a clip: an optional small-caps line (or the case-study tag) above the label,
 * or the label with a second line under it (company role).
 */
export function ClipLabel({ eyebrow, label, sub, caseStudy = false }: { eyebrow?: string; label: string; sub?: string; caseStudy?: boolean }) {
  return (
    <span className="relative flex min-w-0 flex-col justify-center gap-[3px] px-[9px]">
      {caseStudy ? (
        <CaseStudyBadge tone="dark" />
      ) : (
        eyebrow && <span className="truncate text-[9px] font-semibold uppercase leading-none tracking-[0.05em] opacity-80">{eyebrow}</span>
      )}
      <span className="truncate text-[11px] font-semibold leading-[1.2]">{label}</span>
      {sub && <span className="truncate text-[11px] font-medium leading-[1.2] opacity-80">{sub}</span>}
    </span>
  );
}
