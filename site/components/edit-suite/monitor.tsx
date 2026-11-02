"use client";

import type { CSSProperties } from "react";

import { EMAIL, YEARS, companies, companyName, dateAt, experiments, rangeOf, work } from "@/lib/career";
import { cn } from "@/lib/utils";

import { MetalButton } from "@/components/ui/liquid-metal";

import type { Suite } from "./edit-suite";

/** Each layer is a stack of frames; switching frames cross-dissolves them. */
export function fx(on: boolean, fade: number): CSSProperties {
  return {
    opacity: on ? 1 : 0,
    visibility: on ? "visible" : "hidden",
    transition: `opacity ${fade}ms ease, visibility 0s linear ${on ? 0 : fade}ms`,
  };
}

export function Monitor({ suite, variant }: { suite: Suite; variant: "desktop" | "phone" }) {
  const { frame, fade, hidden } = suite;
  const phone = variant === "phone";
  const showWork = !!frame.work && !hidden.work;
  const showCompany = !!frame.company && !hidden.co;
  const showExperiment = !!frame.experiment && !hidden.exp;
  const workHiddenOnly = !!frame.work && hidden.work;

  return (
    <section aria-label="Program monitor" className="relative size-full">
      <div className="absolute inset-0 overflow-hidden bg-screen">
        {YEARS.map((year) => (
          <span
            key={year}
            aria-hidden="true"
            className={cn(
              "absolute font-sans font-bold leading-none tracking-[-0.05em] text-[#141418]",
              phone ? "-bottom-3 right-2.5 text-[112px]" : "-bottom-4 right-[22px] text-[150px]",
            )}
            style={fx(frame.year === year, fade)}
          >
            {year}
          </span>
        ))}

        {phone && (
          <span aria-hidden="true" className="absolute left-3.5 top-3.5 font-mono text-[11px] font-semibold tracking-[0.06em] text-muted-foreground">
            {dateAt(frame.pos)}
          </span>
        )}

        {work.map((w) => (
          <div
            key={w.id}
            className={cn(
              "absolute inset-0 flex box-border",
              phone ? "flex-col gap-2.5 px-4 pb-[84px] pt-[62px]" : "gap-7 px-9 pb-[92px] pt-[34px]",
            )}
            style={fx(showWork && frame.work?.id === w.id, fade)}
          >
            <div className={cn("flex min-w-0 flex-col", phone ? "gap-2.5" : "flex-[1_1_56%] gap-3")}>
              <p className={cn("m-0 font-mono font-semibold tracking-[0.06em] text-work-ink", phone ? "text-[10px] leading-[1.35]" : "text-[11px] leading-[1.3]")}>
                WORK · {companyName(w.company).toUpperCase()} · {rangeOf(w)}
              </p>
              <h2 className={cn("m-0 font-serif font-normal text-white", phone ? "text-[32px] leading-[1.05]" : "text-[40px] leading-[1.05]")}>{w.title}</h2>
              <p className={cn("m-0 text-soft", phone ? "text-sm leading-[1.45]" : "max-w-[44ch] text-[15px] leading-normal")}>{w.line}</p>
              {w.chips.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {w.chips.map((chip) => (
                    <span key={chip} className={cn("rounded-full border border-[#3f4790] font-mono text-[#e1e4ff]", phone ? "px-[9px] py-[5px] text-[11px]" : "px-2.5 py-1.5 text-xs")}>
                      {chip}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div
              className={cn(
                "box-border flex items-center justify-center rounded-[10px] border border-dashed border-[#3a3a44] text-center font-mono text-dim",
                phone ? "min-h-12 flex-1 p-2.5 text-[10px] leading-normal" : "flex-[0_0_32%] p-4 text-[11px] leading-normal",
              )}
              style={{ background: "repeating-linear-gradient(135deg, rgba(255,255,255,0.035) 0 10px, rgba(255,255,255,0) 10px 20px)" }}
            >
              {w.media}
            </div>
          </div>
        ))}

        <div className="absolute inset-0 box-border flex items-center justify-center p-6" style={fx(!frame.isIntro && !showWork, fade)}>
          <p className="m-0 max-w-[36ch] text-center font-mono text-xs leading-relaxed text-dim">
            {workHiddenOnly ? "The work layer is hidden. Turn it back on with its eye in the timeline." : phone ? "No clip at this point. Keep swiping." : "No clip at this point. Keep scrubbing."}
          </p>
        </div>

        {companies.map((c) => (
          <div
            key={c.id}
            className={cn(
              "absolute box-border flex items-center rounded-lg border border-[#2b2b31] bg-[rgba(12,12,14,0.92)]",
              phone ? "bottom-3 left-3 max-w-[calc(100%-24px)] gap-2.5 py-[9px] pl-2.5 pr-3" : "bottom-6 left-7 max-w-[calc(100%-56px)] gap-3 py-2.5 pl-3 pr-4",
            )}
            style={fx(showCompany && frame.company?.id === c.id, fade)}
          >
            <span aria-hidden="true" className="size-2.5 shrink-0 rounded-[3px] bg-co" />
            <span className="flex min-w-0 flex-col gap-1">
              <span className={cn("font-semibold leading-tight text-white", phone ? "text-sm" : "text-[15px]")}>{c.name}</span>
              <span className={cn("font-mono leading-snug text-[#b4b4bd]", phone ? "text-[10px]" : "text-[11px]")}>
                {c.role} · {c.dates}
              </span>
            </span>
          </div>
        ))}

        {experiments.map((x) => (
          <div
            key={x.id}
            className={cn(
              "absolute box-border rounded-[10px] border border-exp bg-[#18121f] shadow-[0_10px_28px_rgba(0,0,0,0.5)]",
              phone ? "right-2.5 top-2.5 w-[58%] px-[11px] py-[9px]" : "right-[18px] top-[18px] w-[232px] px-3.5 py-3",
            )}
            style={fx(showExperiment && frame.experiment?.id === x.id, fade)}
          >
            <p className={cn("m-0 mb-1.5 font-mono font-semibold tracking-[0.08em] text-exp-ink", phone ? "text-[9px]" : "text-[10px]")}>EXPERIMENT · {x.when}</p>
            <p className={cn("m-0 font-semibold leading-tight text-white", phone ? "text-[13px]" : "mb-1 text-[15px]")}>{x.title}</p>
            {!phone && <p className="m-0 text-xs leading-[1.45] text-soft">{x.line}</p>}
          </div>
        ))}

        <div
          className={cn("absolute inset-0 box-border flex flex-col justify-center bg-screen", phone ? "gap-[18px] px-[22px] py-7" : "gap-[22px] px-[52px] py-10")}
          style={fx(frame.isIntro, fade)}
        >
          <p className="m-0 font-mono text-[11px] font-semibold tracking-[0.1em] text-dim">INTRO · 00:00</p>
          <p className={cn("m-0 font-serif leading-[0.95] text-white", phone ? "text-[52px]" : "text-[68px]")}>Suhas Paunikar</p>
          <div className="flex max-w-[34em] flex-col gap-2">
            <p className={cn("m-0 font-serif italic leading-tight text-foreground", phone ? "text-2xl" : "text-[26px]")}>
              I used to cut films. Now I cut checkout flows.
            </p>
            <p className={cn("m-0 leading-normal text-[#b4b4bd]", phone ? "text-[15px]" : "text-base")}>
              Product designer for commerce, retail and AI tools, most recently at Lenskart.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${EMAIL}`}
              className={cn("font-mono text-white underline decoration-[#4b4b55] underline-offset-[5px]", phone ? "text-[13px]" : "text-[15px]")}
            >
              {EMAIL}
            </a>
            <MetalButton onClick={suite.copyEmail} innerClassName="h-9 px-4 text-xs">
              {suite.copied ? "Copied" : "Copy email"}
            </MetalButton>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 outline outline-[1.5px] outline-select" />
      {(["-left-1 -top-1", "-right-1 -top-1", "-bottom-1 -left-1", "-bottom-1 -right-1"] as const).map((corner) => (
        <span key={corner} aria-hidden="true" className={cn("absolute size-2 bg-white shadow-[0_0_0_1.5px_var(--color-select)]", corner)} />
      ))}
    </section>
  );
}
