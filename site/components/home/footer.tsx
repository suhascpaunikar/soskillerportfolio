import Link from "next/link";

import { EMAIL } from "@/lib/career";
import { cn } from "@/lib/utils";

import { CONTAINER, FOCUS, Mark, T } from "./ui";

const LINKS = [
  { href: "/v2#work", label: "Work" },
  { href: "/v2#backstory", label: "Backstory" },
  { href: "/lab", label: "Lab" },
  { href: "/", label: "V1 · the reel" },
  { href: "/v3", label: "V3" },
  { href: "/v4", label: "V4" },
  { href: "/about", label: "About" },
  { href: "/now", label: "Now" },
  { href: "/resume", label: "Résumé" },
];

const CASES = [
  { href: "/work/pickup-in-store", label: "Pickup in store" },
  { href: "/work/ai-progressive-measurements", label: "AI measurements" },
];

const LINK = cn(T.mono, "rounded py-2 leading-[1.32] no-underline transition-colors", FOCUS);

export function Footer() {
  return (
    <footer className={cn(CONTAINER, "pb-16 pt-20")}>
      <div className="flex flex-col justify-between gap-14 lg:flex-row">
        <Link href="/v2" className={cn("flex h-fit w-fit items-center gap-3 rounded-md text-white no-underline", FOCUS)}>
          <Mark className="size-11 lg:size-[52px]" />
          <span className="text-[40px] font-medium leading-none tracking-[-0.03em] lg:text-[52px]">Suhas Paunikar</span>
        </Link>

        <div className="flex flex-col gap-12 sm:flex-row lg:gap-24">
          <div>
            <p className={cn("m-0 text-white/55", T.mono)}>Navigation</p>
            <nav aria-label="Footer" className="mt-6 grid grid-cols-2 gap-x-12">
              {LINKS.map((l) => (
                <Link key={l.href} href={l.href} className={cn(LINK, "text-white hover:text-white/65")}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <p className={cn("m-0 text-white/55", T.mono)}>Contact</p>
            <a href={`mailto:${EMAIL}`} className={cn("mt-8 block rounded text-white/45 no-underline transition-colors hover:text-white", T.body, FOCUS)}>
              {EMAIL}
            </a>
          </div>
        </div>
      </div>

      <nav aria-label="Case studies" className="mt-24 flex flex-wrap gap-x-8">
        {CASES.map((l) => (
          <Link key={l.href} href={l.href} className={cn(LINK, "text-white/65 hover:text-white")}>
            {l.label}
          </Link>
        ))}
      </nav>

      <div className={cn("mt-14 flex flex-wrap justify-between gap-x-8 gap-y-3 border-t border-white/[0.16] pt-16 text-white/65", T.mono, "leading-[1.32]")}>
        <p className="m-0">© 2026 Suhas Paunikar</p>
        <p className="m-0">Designed and built by Suhas Paunikar</p>
      </div>
    </footer>
  );
}
