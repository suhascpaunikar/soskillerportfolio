"use client";

import { Upload } from "lucide-react";
import Link from "next/link";

import { MetalButton, chromeRim } from "@/components/ui/liquid-metal";
import { EMAIL, dateAt, rangeOf } from "@/lib/career";
import { cn } from "@/lib/utils";

import { AssetsPanel } from "./assets-panel";
import { Cta } from "./cta";
import { DesktopTimeline } from "./desktop-timeline";
import type { Rating, Suite } from "./edit-suite";
import { Monitor } from "./monitor";

const NAV = [
  { href: "/", label: "Work" },
  { href: "/lab", label: "Lab" },
  { href: "/about", label: "About" },
  { href: "/now", label: "Now" },
  { href: "/resume", label: "Résumé" },
];

const RATINGS: Array<{ key: Rating; label: string; aria: string }> = [
  { key: "u", label: "U", aria: "U: hard cuts, no motion" },
  { key: "ua", label: "U/A", aria: "U/A: half-second dissolves" },
  { key: "a", label: "A", aria: "A: slow dissolves" },
];

const recessed = "rounded-full bg-[#0a0a0c] p-[3px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.7),inset_0_0_0_1px_#000,0_1px_0_rgba(255,255,255,0.06)]";

export function DesktopSuite({ suite, className }: { suite: Suite; className?: string }) {
  const { frame, hidden } = suite;
  const shownWork = hidden.work ? null : frame.work;
  const frameName = frame.isIntro ? "Intro" : (shownWork?.title ?? frame.company?.name ?? "No clip");
  const chip = frame.isIntro ? "SUHAS PAUNIKAR" : (frame.company?.name.toUpperCase() ?? "GAP");
  const badge = frame.isIntro ? "INTRO · 00:00" : shownWork ? rangeOf(shownWork) : dateAt(frame.pos);

  return (
    <div className={cn("relative h-dvh min-h-[720px] flex-col overflow-hidden bg-app", className)}>
      <div className="flex min-h-0 flex-1">
        <aside aria-label="Assets" className="w-[264px] shrink-0 border-r border-line bg-panel">
          <AssetsPanel suite={suite} variant="sidebar" />
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-[60px] shrink-0 items-center justify-between gap-4 border-b border-[#1e1e22] px-5">
            <div className="flex min-w-0 items-center gap-2.5">
              <a href={`mailto:${EMAIL}`} className="whitespace-nowrap font-mono text-[13px] text-soft no-underline">
                {EMAIL}
              </a>
              <MetalButton onClick={suite.copyEmail} innerClassName="h-8 px-3.5 text-xs">
                {suite.copied ? "Copied" : "Copy email"}
              </MetalButton>
            </div>
            <div className="flex flex-wrap items-center gap-3.5">
              <nav aria-label="Primary" className={cn("flex items-center gap-0.5", recessed)}>
                {NAV.map((item) =>
                  item.href === "/" ? (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current="page"
                      className="flex h-[34px] items-center rounded-full px-3.5 text-[13px] font-semibold text-white no-underline [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]"
                      style={chromeRim(undefined, 1.5)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <Link key={item.href} href={item.href} className="flex h-[34px] items-center rounded-full px-3 text-[13px] font-medium text-muted-foreground no-underline hover:text-foreground">
                      {item.label}
                    </Link>
                  ),
                )}
              </nav>
              <div role="group" aria-label="Motion certificate: sets the transition between clips" className={cn("flex gap-0.5", recessed)}>
                {RATINGS.map((r) => {
                  const on = suite.rating === r.key;
                  return (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => suite.setRating(r.key)}
                      aria-pressed={on}
                      aria-label={r.aria}
                      title={r.aria}
                      className={cn(
                        "h-8 min-w-[42px] cursor-pointer rounded-full px-2.5 font-mono text-[11px] font-semibold",
                        on ? "text-white" : "border-[1.5px] border-transparent text-muted-foreground hover:text-foreground",
                      )}
                      style={on ? chromeRim(undefined, 1.5) : undefined}
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>
              <MetalButton live onClick={suite.openExport}>
                <Upload className="size-3.5" aria-hidden="true" />
                Export · Hire me
              </MetalButton>
            </div>
          </header>

          <div className="flex min-h-0 flex-1 flex-col items-center gap-3 px-7 pb-3.5 pt-4">
            <div className="flex min-h-0 w-full flex-1 items-center justify-center [container-type:size]">
              <div className="flex flex-col gap-2" style={{ width: "min(100cqw, calc((100cqh - 30px) * 16 / 9))" }}>
                <div className="flex h-[22px] items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8b8b95" strokeWidth="2.4" aria-hidden="true">
                      <path d="M8 5v14M16 5v14" />
                    </svg>
                    <span className="truncate text-xs text-soft">{frameName}</span>
                    <span className="shrink-0 rounded bg-[#1f1f23] px-1.5 py-[3px] font-mono text-[10px] leading-none text-muted-foreground">
                      {chip}
                    </span>
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
          </div>
        </main>
      </div>

      <DesktopTimeline suite={suite} />
    </div>
  );
}
