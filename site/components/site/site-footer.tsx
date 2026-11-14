import Link from "next/link";

import { EMAIL } from "@/lib/career";

import { Identity } from "./identity";
import { NAV } from "./primary-nav";

const LINK = "rounded text-sm text-muted-foreground no-underline outline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-playhead";

/** The footer on inside pages: who made it, where else to go, how to write. */
export function SiteFooter() {
  return (
    <footer className="border-t border-[#1e1e22]">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <Link href="/" className="w-fit rounded-lg no-underline outline-offset-4 focus-visible:outline-2 focus-visible:outline-playhead">
          <Identity />
          <span className="sr-only">, home</span>
        </Link>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2.5">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className={LINK}>
              {item.label}
            </Link>
          ))}
          <a href={`mailto:${EMAIL}`} className={LINK}>
            {EMAIL}
          </a>
        </nav>
        <p className="m-0 font-mono text-[11px] leading-normal text-dim">Designed and built by Suhas Paunikar</p>
      </div>
    </footer>
  );
}
