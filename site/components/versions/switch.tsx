import Link from "next/link";

import { VERSIONS } from "@/lib/versions";
import { cn } from "@/lib/utils";

const TONES = {
  light: { box: "bg-black/[0.06]", on: "bg-[#111] text-white", off: "text-black/55 hover:text-black", ring: "focus-visible:outline-black" },
  dark: { box: "bg-white/[0.08]", on: "bg-white text-black", off: "text-white/55 hover:text-white", ring: "focus-visible:outline-white" },
} as const;

/**
 * Links to every version of the home page. On wide screens it is a row of pills;
 * on phones, where seven pills do not fit, it is one link to the list of versions.
 */
export function VersionSwitch({ current, tone = "light", className }: { current: string; tone?: keyof typeof TONES; className?: string }) {
  const t = TONES[tone];
  const item = "whitespace-nowrap rounded px-2 py-2 font-mono text-[11px] uppercase leading-none tracking-[0.06em] no-underline outline-offset-2 focus-visible:outline-2";
  return (
    <nav aria-label="Versions of this page" className={cn("flex items-center gap-0.5 rounded-md p-0.5", t.box, className)}>
      {VERSIONS.map((v) => (
        <Link key={v.href} href={v.href} aria-current={v.href === current ? "page" : undefined} className={cn(item, t.ring, v.href === current ? t.on : t.off, "max-md:hidden")}>
          {v.label}
        </Link>
      ))}
      <Link href="/versions" className={cn(item, t.ring, t.off, "md:hidden")}>
        {VERSIONS.find((v) => v.href === current)?.label} · all versions
      </Link>
    </nav>
  );
}
