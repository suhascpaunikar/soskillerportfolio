"use client";

import { Eye, EyeOff, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import Link from "next/link";
import type { CSSProperties, KeyboardEvent } from "react";

import { LiquidMetalSurface, MetalButton } from "@/components/ui/liquid-metal";
import { INTRO, TOTAL, companies, companyName, dateAt, describe, experiments, pct, rangeOf, work, type Span } from "@/lib/career";
import { cn } from "@/lib/utils";

import { CLIP_BG, CLIP_SHADOW, LANE_BG, RULER_LABELS, TICKS, WAVE, ringAnchor } from "./clip-styles";
import type { LayerKey, Suite } from "./edit-suite";

const ROWS: Array<{ key: LayerKey; name: string; sub: string; color: string; height: number }> = [
  { key: "exp", name: "Experiments", sub: "TOP LAYER", color: "bg-exp", height: 56 },
  { key: "work", name: "Work", sub: "MIDDLE LAYER", color: "bg-work", height: 48 },
  { key: "co", name: "Company", sub: "BOTTOM LAYER", color: "bg-co", height: 48 },
];

const place = (c: Span): CSSProperties => ({ left: `${pct(c.s)}%`, width: `${pct(c.e - c.s)}%` });

const clipBase =
  "clip absolute box-border flex items-center overflow-hidden border-[1.5px] border-transparent text-white no-underline [text-shadow:0_1px_1px_rgba(0,0,0,0.55)] outline-offset-2 focus-visible:outline-2 focus-visible:outline-playhead";

function Ring({ left, width, top, height, radius, visible }: { left: string; width: string; top: number; height: number; radius: number; visible: boolean }) {
  return (
    <LiquidMetalSurface
      style={{
        top,
        height,
        left: `calc(${left} - 3px)`,
        width: `calc(${width} + 6px)`,
        borderRadius: radius,
        opacity: visible ? 1 : 0,
        transition: "left 260ms ease, width 260ms ease, top 260ms ease, opacity 200ms ease",
      }}
    />
  );
}

export function DesktopTimeline({ suite }: { suite: Suite }) {
  const { pos, frame, running, hidden, fade, rating } = suite;
  const flip = pos > TOTAL * 0.86;

  const onKeys = (e: KeyboardEvent<HTMLElement>) => {
    const k = e.key.toLowerCase();
    if (k === "j") {
      e.preventDefault();
      suite.prev();
    } else if (k === "l") {
      e.preventDefault();
      suite.next();
    } else if (k === "k" || k === " ") {
      e.preventDefault();
      suite.togglePlay();
    }
  };

  const expRing = ringAnchor(experiments, hidden.exp ? null : frame.experiment, pos);
  const workRing = ringAnchor(work, hidden.work ? null : frame.work, pos);
  const coRing = ringAnchor(companies, hidden.co ? null : frame.company, pos);

  return (
    <section aria-label="Timeline" className="flex h-[264px] shrink-0 flex-col border-t border-line bg-panel">
      <div className="flex h-[52px] shrink-0 items-center gap-3.5 border-b border-[#1f1f23] px-4">
        <div role="group" aria-label="Transport" className="flex items-center gap-2.5">
          <MetalButton shape="circle" innerClassName="size-[38px]" onClick={suite.prev} disabled={pos <= 0} aria-label="Previous clip" title="Previous clip (J)">
            <SkipBack className="size-3.5" aria-hidden="true" />
          </MetalButton>
          <MetalButton
            live
            shape="circle"
            innerClassName="text-playhead"
            onClick={suite.togglePlay}
            aria-label={running ? "Pause the reel" : "Play the reel"}
            title={`${running ? "Pause" : "Play"} the reel (K)`}
          >
            {running ? <Pause className="size-3.5 fill-current" aria-hidden="true" /> : <Play className="size-3.5 fill-current" aria-hidden="true" />}
          </MetalButton>
          <MetalButton shape="circle" innerClassName="size-[38px]" onClick={suite.next} disabled={pos >= TOTAL} aria-label="Next clip" title="Next clip (L)">
            <SkipForward className="size-3.5" aria-hidden="true" />
          </MetalButton>
        </div>
        <span className="min-w-[88px] font-mono text-[13px] font-semibold text-playhead">{dateAt(pos)}</span>
        <span className="text-xs text-dim">Drag along the years to scrub · click a clip to open it</span>
        <span className="ml-auto font-mono text-[11px] tracking-[0.04em] text-muted-foreground">
          {rating === "u" ? "CUT · NO DISSOLVE" : `CROSS DISSOLVE · ${fade / 1000} S`}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 pb-2.5 pr-4 pt-1.5">
        <div className="flex w-44 shrink-0 flex-col gap-1 pl-4 pr-2.5">
          <div className="flex h-[30px] items-center pl-2.5 font-mono text-[10px] font-semibold tracking-[0.08em] text-dim">YEARS</div>
          {ROWS.map((row) => (
            <div key={row.key} className="flex items-center gap-2 rounded-lg bg-track pl-2.5 pr-1" style={{ height: row.height }}>
              <span aria-hidden="true" className={cn("size-2.5 shrink-0 rounded-[3px]", row.color)} />
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="text-xs font-semibold leading-none">{row.name}</span>
                <span className="font-mono text-[10px] leading-none text-dim">{row.sub}</span>
              </span>
              <MetalButton
                shape="circle"
                innerClassName="size-7"
                onClick={() => suite.toggleLayer(row.key)}
                aria-label={`${hidden[row.key] ? "Show" : "Hide"} the ${row.name.toLowerCase()} layer`}
                title={`${hidden[row.key] ? "Show" : "Hide"} the ${row.name.toLowerCase()} layer`}
              >
                {hidden[row.key] ? <EyeOff className="size-3.5" aria-hidden="true" /> : <Eye className="size-3.5" aria-hidden="true" />}
              </MetalButton>
            </div>
          ))}
        </div>

        <div className="relative flex min-w-0 flex-1 flex-col gap-1">
          <div className="relative h-[30px] rounded-md bg-track">
            {TICKS.map((t) => (
              <span
                key={t.at}
                aria-hidden="true"
                className={cn("absolute bottom-0 w-px", t.major ? "h-3.5 bg-[#4a4a52]" : "h-1.5 bg-[#34343a]")}
                style={{ left: `${pct(t.at)}%` }}
              />
            ))}
            {RULER_LABELS.map((l) => (
              <span
                key={l.text}
                aria-hidden="true"
                className="absolute top-[5px] font-mono text-[11px] leading-none text-muted-foreground"
                style={{ left: `calc(${pct(l.at)}% + 5px)` }}
              >
                {l.text}
              </span>
            ))}
            <span aria-hidden="true" className="absolute right-1.5 top-[5px] font-mono text-[10px] font-semibold leading-none tracking-[0.06em] text-dim">
              NOW
            </span>
            <input
              className="scrub absolute inset-0 m-0 size-full cursor-ew-resize p-0 opacity-0"
              type="range"
              min={0}
              max={TOTAL}
              step={1}
              value={pos}
              onChange={(e) => suite.jump(Number(e.target.value))}
              onKeyDown={onKeys}
              aria-label="Scrub through the years"
              aria-valuetext={describe(frame)}
              aria-keyshortcuts="J K L"
            />
            <div className="scrub-ring pointer-events-none absolute inset-0 rounded-md" aria-hidden="true" />
          </div>

          <div className="relative flex flex-col gap-1">
            <div className="relative h-14 rounded-lg" style={{ ...LANE_BG.exp, opacity: hidden.exp ? 0.35 : 1 }}>
              <Ring {...ringPlace(expRing.clip)} top={expRing.clip.row === 0 ? 2 : 26} height={28} radius={10} visible={expRing.visible} />
              {experiments.map((x) => (
                <Link
                  key={x.id}
                  href={x.href}
                  onFocus={() => suite.jump(x.s)}
                  title={x.title}
                  aria-label={`${x.title}, experiment, ${x.when.toLowerCase()}. Opens the Lab.`}
                  className={cn(clipBase, "h-[22px] rounded-[7px] px-2")}
                  style={{ ...place(x), top: x.row === 0 ? 5 : 29, background: CLIP_BG.exp, boxShadow: CLIP_SHADOW }}
                >
                  <span className="min-w-0 truncate text-[11px] font-semibold leading-none">{x.short}</span>
                </Link>
              ))}
            </div>

            <div className="relative h-12 rounded-lg" style={{ ...LANE_BG.work, opacity: hidden.work ? 0.35 : 1 }}>
              <Ring {...ringPlace(workRing.clip)} top={1} height={46} radius={11} visible={workRing.visible} />
              {work.map((w) => {
                const label = `${w.title} at ${companyName(w.company)}, ${rangeOf(w).toLowerCase()}`;
                const body = <span className="line-clamp-2 min-w-0 text-[11px] font-semibold leading-[1.2]">{w.short}</span>;
                const style: CSSProperties = { ...place(w), top: 4, height: 40, background: CLIP_BG.work, boxShadow: CLIP_SHADOW };
                return w.href ? (
                  <Link
                    key={w.id}
                    href={w.href}
                    onFocus={() => suite.jump(w.s)}
                    title={w.title}
                    aria-label={`${label}. Opens its page.`}
                    className={cn(clipBase, "rounded-lg px-[9px]")}
                    style={style}
                  >
                    {body}
                  </Link>
                ) : (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => suite.jump(w.s)}
                    title={w.title}
                    aria-label={`${label}. No case study yet; moves the playhead here.`}
                    className={cn(clipBase, "cursor-pointer rounded-lg px-[9px] text-left")}
                    style={style}
                  >
                    {body}
                  </button>
                );
              })}
            </div>

            <div className="relative h-12 rounded-lg" style={{ ...LANE_BG.co, opacity: hidden.co ? 0.35 : 1 }}>
              <Ring {...ringPlace(coRing.clip)} top={1} height={46} radius={11} visible={coRing.visible} />
              {companies.map((c) => (
                <Link
                  key={c.id}
                  href={c.href}
                  onFocus={() => suite.jump(c.s)}
                  title={`${c.name} · ${c.role}`}
                  aria-label={`${c.name}, ${c.role}, ${c.dates}. Opens ${c.href === "/now" ? "Now" : "About"}.`}
                  className={cn(clipBase, "rounded-lg")}
                  style={{ ...place(c), top: 4, height: 40, background: CLIP_BG.co, boxShadow: CLIP_SHADOW }}
                >
                  <span className="absolute left-[9px] right-[9px] top-1.5 truncate text-[11px] font-semibold leading-none">
                    {c.name}
                    <span className="font-medium opacity-80"> · {c.role}</span>
                  </span>
                  <svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true" className="absolute bottom-1 left-1 h-4 w-[calc(100%-8px)]">
                    <path d={WAVE} fill="none" stroke="#a7ebc8" strokeWidth={1} strokeOpacity={0.55} vectorEffect="non-scaling-stroke" />
                  </svg>
                </Link>
              ))}
            </div>

            <button
              type="button"
              onClick={() => suite.jump(0)}
              title="Intro"
              aria-label="Intro: name, email and two lines about Suhas. Moves the playhead to the start."
              className={cn(clipBase, "inset-y-0 left-0 z-[2] cursor-pointer flex-col items-start justify-center gap-[5px] rounded-[9px] px-2.5 text-left text-[#141416] [text-shadow:none]")}
              style={{
                width: `${pct(INTRO)}%`,
                background: CLIP_BG.intro,
                boxShadow: frame.isIntro ? `0 0 0 2px var(--color-playhead), ${CLIP_SHADOW}` : CLIP_SHADOW,
              }}
            >
              <span className="text-xs font-bold leading-none">Intro</span>
              <span className="font-mono text-[9px] font-semibold leading-tight text-[#3a3a40]">NAME · EMAIL</span>
            </button>
          </div>

          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 z-[5] w-0" style={{ left: `${pct(pos)}%` }}>
            <span className="absolute -left-px bottom-0 top-3 w-0.5 bg-playhead" />
            <svg width="14" height="16" viewBox="0 0 14 16" className="absolute -left-[7px] top-0">
              <path d="M1 1h12v8l-6 6-6-6z" fill="var(--color-playhead)" />
            </svg>
            <span
              className="absolute top-1.5 whitespace-nowrap rounded bg-playhead px-1.5 py-[3px] font-mono text-[11px] font-semibold leading-none text-playhead-ink"
              style={{ left: flip ? -10 : 10, transform: flip ? "translateX(-100%)" : undefined }}
            >
              {dateAt(pos)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ringPlace(c: Span) {
  return { left: `${pct(c.s)}%`, width: `${pct(c.e - c.s)}%` };
}
