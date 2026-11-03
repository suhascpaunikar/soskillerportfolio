"use client";

import Link from "next/link";

import { dateAt, rangeOf } from "@/lib/career";
import { cn } from "@/lib/utils";

import { CaseStudyBadge } from "./clip-label";
import { Cta } from "./cta";
import { DesktopTimeline } from "./desktop-timeline";
import type { Suite } from "./edit-suite";
import { Monitor } from "./monitor";

export const NAV = [
  { href: "/", label: "Work" },
  { href: "/lab", label: "Lab" },
  { href: "/about", label: "About" },
  { href: "/now", label: "Now" },
  { href: "/resume", label: "Résumé" },
];

/** Avatar, name and status, top left. */
export function Identity({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#2e2e34] bg-raised font-mono text-[10px] font-semibold text-soft">
        SP
      </span>
      <div className="min-w-0">
        <p className={cn("m-0 truncate font-semibold leading-tight text-white", compact ? "text-[15px]" : "text-sm")}>Suhas Paunikar</p>
        <p className="m-0 mt-0.5 truncate text-[11px] leading-tight text-muted-foreground">Product designer · open to roles</p>
      </div>
    </div>
  );
}

export function DesktopSuite({ suite, className }: { suite: Suite; className?: string }) {
  const { frame, hidden } = suite;
  const shownWork = hidden.work ? null : frame.work;
  const frameName = frame.isIntro ? "Intro" : (shownWork?.title ?? frame.company?.name ?? "No clip");
  const chip = frame.isIntro ? "SUHAS PAUNIKAR" : (frame.company?.name.toUpperCase() ?? "GAP");
  const badge = frame.isIntro ? "INTRO · 00:00" : shownWork ? rangeOf(shownWork) : dateAt(frame.pos);

  return (
    <div className={cn("relative h-dvh min-h-[700px] flex-col overflow-hidden bg-app", className)}>
      <header className="flex h-[60px] shrink-0 items-center justify-between gap-4 border-b border-[#1e1e22] px-5">
        <Identity />
        <nav aria-label="Primary" className="flex items-center gap-0.5 rounded-full bg-[#0a0a0c] p-[3px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.7),inset_0_0_0_1px_#000,0_1px_0_rgba(255,255,255,0.06)]">
          {NAV.map((item) => {
            const current = item.href === "/";
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "flex h-[34px] items-center rounded-full border px-3.5 text-[13px] no-underline transition-colors",
                  current ? "border-white/[0.16] bg-[linear-gradient(180deg,#202020_0%,#000_100%)] font-semibold text-white" : "border-transparent font-medium text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="flex min-h-0 flex-1 flex-col items-center gap-3 px-7 pb-3.5 pt-4">
        <div className="flex min-h-0 w-full flex-1 items-center justify-center [container-type:size]">
          <div className="flex flex-col gap-2" style={{ width: "min(100cqw, calc((100cqh - 30px) * 16 / 9))" }}>
            <div className="flex h-[22px] items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true" className="text-[#8b8b95]">
                  <path d="M8 5v14M16 5v14" />
                </svg>
                <span className="truncate text-xs text-soft">{frameName}</span>
                <span className="shrink-0 rounded bg-[#1f1f23] px-1.5 py-[3px] font-mono text-[10px] leading-none text-muted-foreground">{chip}</span>
                {shownWork?.caseStudy && <CaseStudyBadge />}
              </span>
              <span className="font-mono text-xs text-muted-foreground">{dateAt(frame.pos)}</span>
            </div>
            <div className="aspect-video w-full">
              <Monitor suite={suite} variant="desktop" />
            </div>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-center gap-2.5">
          <span className="rounded bg-[#2563eb] px-2 py-[5px] font-mono text-[11px] font-semibold leading-none tracking-[0.02em] text-white">{badge}</span>
          <Cta suite={suite} />
        </div>
      </main>

      <DesktopTimeline suite={suite} />
    </div>
  );
}
