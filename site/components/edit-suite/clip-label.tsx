import { cn } from "@/lib/utils";

/** The "Case study" tag: Diffusion Studio's default badge (primary blue, small radius), shrunk to fit a clip. */
export function CaseStudyBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-[14px] w-fit max-w-full shrink-0 items-center overflow-hidden whitespace-nowrap rounded-[3px] bg-primary px-1 text-[8.5px] font-semibold uppercase leading-none tracking-[0.06em] text-white",
        className,
      )}
    >
      Case study
    </span>
  );
}

/**
 * The text inside a clip: an optional small-caps line (or the case-study tag) above the label,
 * or the label with a second line under it (company role). Inter 11px, inset 6px, as in Diffusion Studio.
 */
export function ClipLabel({ eyebrow, label, sub, caseStudy = false }: { eyebrow?: string; label: string; sub?: string; caseStudy?: boolean }) {
  return (
    <span className="relative flex min-w-0 flex-col justify-center gap-[3px] px-1.5">
      {caseStudy ? (
        <CaseStudyBadge />
      ) : (
        eyebrow && <span className="truncate text-[8.5px] font-semibold uppercase leading-none tracking-[0.06em] opacity-75">{eyebrow}</span>
      )}
      <span className="truncate text-[11px] font-semibold leading-[1.15]">{label}</span>
      {sub && <span className="truncate text-[11px] leading-[1.15] opacity-75">{sub}</span>}
    </span>
  );
}
