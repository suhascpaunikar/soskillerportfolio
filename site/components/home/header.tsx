"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { EMAIL } from "@/lib/career";
import { cn } from "@/lib/utils";

import { Btn, CONTAINER, FOCUS, Mark, T } from "./ui";

export const NAV = [
  { href: "#work", label: "Work" },
  { href: "#backstory", label: "Backstory" },
  { href: "#lab", label: "Lab" },
  { href: "/about", label: "About" },
  { href: "/", label: "V1" },
  { href: "/v3", label: "V3" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="relative z-20">
      <div className={cn(CONTAINER, "flex h-16 items-center justify-between gap-6")}>
        <Link href="/v2" className={cn("flex items-center gap-2 rounded-md text-white no-underline", FOCUS)}>
          <Mark className="size-7" />
          <span className="text-2xl font-medium leading-none tracking-[-0.02em]">Suhas Paunikar</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-4 lg:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className={cn(T.mono, "rounded px-1 py-2 text-white/65 no-underline transition-colors hover:text-white", FOCUS)}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Btn href="/resume" tone="ghost" className="bg-white/[0.12]">
            Résumé
          </Btn>
          <Btn href={`mailto:${EMAIL}`} arrow>
            Hire me
          </Btn>
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="home-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className={cn("flex size-10 cursor-pointer items-center justify-center rounded-md border-0 bg-white/[0.12] text-white lg:hidden", FOCUS)}
        >
          {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <div id="home-menu" className="absolute inset-x-0 top-16 border-y border-white/[0.16] bg-ink lg:hidden">
          <nav aria-label="Primary" className={cn(CONTAINER, "flex flex-col py-2")}>
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={cn(T.mono, "border-b border-white/[0.08] py-4 text-white no-underline", FOCUS)}>
                {item.label}
              </Link>
            ))}
            <div className="flex gap-2 py-4">
              <Btn href={`mailto:${EMAIL}`} arrow>
                Hire me
              </Btn>
              <Btn href="/resume" tone="ghost">
                Résumé
              </Btn>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
