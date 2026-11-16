import Link from "next/link";

import { cn } from "@/lib/utils";

export const NAV = [
  { href: "/", label: "Work" },
  { href: "/lab", label: "Lab" },
  { href: "/about", label: "About" },
  { href: "/now", label: "Now" },
  { href: "/resume", label: "Résumé" },
  { href: "/v2", label: "V2" },
  { href: "/v3", label: "V3" },
  { href: "/v4", label: "V4" },
] as const;

/**
 * The pill navigation in the header.
 * `current` is the section the page belongs to; `exact` is false on pages inside a section (a case study sits under Work).
 */
export function PrimaryNav({ current = "/", exact = true, className }: { current?: string; exact?: boolean; className?: string }) {
  return (
    <nav
      aria-label="Primary"
      className={cn(
        "flex items-center gap-0.5 rounded-full bg-[#0a0a0c] p-[3px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.7),inset_0_0_0_1px_#000,0_1px_0_rgba(255,255,255,0.06)]",
        className,
      )}
    >
      {NAV.map((item) => {
        const on = item.href === current;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={on ? (exact ? "page" : "true") : undefined}
            className={cn(
              "flex h-[34px] items-center rounded-full border px-3.5 text-[13px] no-underline outline-offset-2 transition-colors focus-visible:outline-2 focus-visible:outline-playhead",
              on ? "border-white/[0.16] bg-[linear-gradient(180deg,#202020_0%,#000_100%)] font-semibold text-white" : "border-transparent font-medium text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
