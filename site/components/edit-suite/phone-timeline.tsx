"use client";

import type { CSSProperties, KeyboardEvent } from "react";
import { useEffect, useRef } from "react";

import { LiquidMetalSurface } from "@/components/ui/liquid-metal";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { INTRO, TOTAL, clamp, companies, companyName, dateAt, experiments, rangeOf, work, type Span } from "@/lib/career";
import { cn } from "@/lib/utils";

import { CLIP_BG, CLIP_SHADOW, LANE_BG, RULER_LABELS, TICKS, WAVE, ringAnchor } from "./clip-styles";
import type { Suite } from "./edit-suite";

/** Pixels per month on the phone timeline. */
const PX = 12;
const STEP_MS = 200;

const clipBase =
  "absolute box-border flex items-center overflow-hidden border-[1.5px] border-transparent text-left text-white [text-shadow:0_1px_1px_rgba(0,0,0,0.55)] outline-offset-2 focus-visible:outline-2 focus-visible:outline-playhead";

const place = (c: Span): CSSProperties => ({ left: c.s * PX, width: (c.e - c.s) * PX });

function Ring({ clip, top, height, radius, visible }: { clip: Span; top: number; height: number; radius: number; visible: boolean }) {
  return (
    <LiquidMetalSurface
      style={{
        top,
        height,
        left: clip.s * PX - 3,
        width: (clip.e - clip.s) * PX + 6,
        borderRadius: radius,
        opacity: visible ? 1 : 0,
        transition: "left 260ms ease, width 260ms ease, top 260ms ease, opacity 200ms ease",
      }}
    />
  );
}

/**
 * The playhead stays fixed in the middle; the timeline scrolls under it.
 * Swiping scrubs; buttons, taps and the reel move the scroll position to match.
 */
export function PhoneTimeline({ suite }: { suite: Suite }) {
  const { pos, running, frame, hidden } = suite;
  const scroller = useRef<HTMLDivElement>(null);
  /** The last position reported by a scroll, so we don't scroll back to where the user already is. */
  const fromScroll = useRef<number | null>(null);
  const tweening = useRef(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = scroller.current;
    if (!el || fromScroll.current === pos) return;
    const target = pos * PX;
    if (Math.abs(el.scrollLeft - target) < 1) return;

    if (running && !reduced) {
      // While the reel plays, glide one month per step instead of jumping 12px at a time.
      const start = el.scrollLeft;
      const t0 = performance.now();
      let raf = 0;
      tweening.current = true;
      const tick = (now: number) => {
        const k = Math.min(1, (now - t0) / STEP_MS);
        el.scrollLeft = start + (target - start) * k;
        if (k < 1) raf = requestAnimationFrame(tick);
        else tweening.current = false;
      };
      raf = requestAnimationFrame(tick);
      return () => {
        cancelAnimationFrame(raf);
        tweening.current = false;
      };
    }

    el.scrollTo({ left: target, behavior: reduced || running ? "auto" : "smooth" });
  }, [pos, running, reduced]);

  const onScroll = () => {
    const el = scroller.current;
    if (!el || tweening.current) return;
    const p = clamp(Math.round(el.scrollLeft / PX));
    fromScroll.current = p;
    if (p !== pos) suite.seek(p);
  };

  const interrupt = () => {
    if (running) suite.pause();
  };

  const onKeys = (e: KeyboardEvent<HTMLDivElement>) => {
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
    <section aria-label="Timeline" className="flex shrink-0 border-t border-line bg-panel pb-2 pt-1.5">
      <div aria-hidden="true" className="flex w-12 shrink-0 flex-col gap-1 pl-2.5">
        <div className="h-6" />
        {[
          { label: "EXP", color: "bg-exp", h: "h-14" },
          { label: "WORK", color: "bg-work", h: "h-11" },
          { label: "CO", color: "bg-co", h: "h-11" },
        ].map((row) => (
          <div key={row.label} className={cn("flex flex-col justify-center gap-[5px]", row.h)}>
            <span className={cn("size-2 rounded-[2px]", row.color)} />
            <span className="font-mono text-[9px] font-semibold leading-none tracking-[0.06em] text-muted-foreground">{row.label}</span>
          </div>
        ))}
      </div>

      <div className="relative min-w-0 flex-1">
        <div
          ref={scroller}
          onScroll={onScroll}
          onTouchStart={interrupt}
          onWheel={interrupt}
          onPointerDown={interrupt}
          onKeyDown={onKeys}
          tabIndex={0}
          role="region"
          aria-label="Timeline. Swipe, or use the arrow keys, to scrub through the years."
          aria-keyshortcuts="J K L"
          className="no-scrollbar overflow-x-auto overflow-y-hidden overscroll-x-contain outline-offset-[-2px] focus-visible:outline-2 focus-visible:outline-playhead"
        >
          {/* 50% padding each side lets both ends of the timeline reach the centre playhead. */}
          <div className="relative flex flex-col gap-1 px-[50%]" style={{ width: TOTAL * PX, boxSizing: "content-box" }}>
            <div className="relative h-6">
              {TICKS.map((t) => (
                <span
                  key={t.at}
                  aria-hidden="true"
                  className={cn("absolute bottom-0 w-px", t.major ? "h-3 bg-[#4a4a52]" : "h-[5px] bg-[#34343a]")}
                  style={{ left: t.at * PX }}
                />
              ))}
              {RULER_LABELS.map((l) => (
                <span key={l.text} aria-hidden="true" className="absolute top-[3px] whitespace-nowrap pl-[5px] font-mono text-[10px] leading-none text-muted-foreground" style={{ left: l.at * PX }}>
                  {l.text}
                </span>
              ))}
              <span aria-hidden="true" className="absolute top-[3px] pl-[5px] font-mono text-[9px] font-semibold leading-none tracking-[0.06em] text-dim" style={{ left: TOTAL * PX }}>
                NOW
              </span>
            </div>

            <div className="relative flex flex-col gap-1">
              <div className="relative h-14 rounded-lg" style={{ ...LANE_BG.exp, opacity: hidden.exp ? 0.35 : 1 }}>
                <Ring clip={expRing.clip} top={expRing.clip.row === 0 ? 0 : 26} height={30} radius={10} visible={expRing.visible} />
                {experiments.map((x) => (
                  <button
                    key={x.id}
                    type="button"
                    onClick={() => suite.jump(x.s)}
                    aria-label={`${x.title}, experiment, ${x.when.toLowerCase()}. Shows it in the monitor.`}
                    className={cn(clipBase, "h-6 cursor-pointer rounded-[7px] px-2")}
                    style={{ ...place(x), top: x.row === 0 ? 3 : 29, background: CLIP_BG.exp, boxShadow: CLIP_SHADOW }}
                  >
                    <span className="min-w-0 truncate text-[11px] font-semibold leading-none">{x.short}</span>
                  </button>
                ))}
              </div>

              <div className="relative h-11 rounded-lg" style={{ ...LANE_BG.work, opacity: hidden.work ? 0.35 : 1 }}>
                <Ring clip={workRing.clip} top={1} height={42} radius={11} visible={workRing.visible} />
                {work.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => suite.jump(w.s)}
                    aria-label={`${w.title} at ${companyName(w.company)}, ${rangeOf(w).toLowerCase()}. Shows it in the monitor.`}
                    className={cn(clipBase, "top-1 h-9 cursor-pointer rounded-lg px-[9px]")}
                    style={{ ...place(w), background: CLIP_BG.work, boxShadow: CLIP_SHADOW }}
                  >
                    <span className="line-clamp-2 min-w-0 text-[11px] font-semibold leading-[1.15]">{w.short}</span>
                  </button>
                ))}
              </div>

              <div className="relative h-11 rounded-lg" style={{ ...LANE_BG.co, opacity: hidden.co ? 0.35 : 1 }}>
                <Ring clip={coRing.clip} top={1} height={42} radius={11} visible={coRing.visible} />
                {companies.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => suite.jump(c.s)}
                    aria-label={`${c.name}, ${c.role}, ${c.dates}. Shows it in the monitor.`}
                    className={cn(clipBase, "top-1 h-9 cursor-pointer rounded-lg p-0")}
                    style={{ ...place(c), background: CLIP_BG.co, boxShadow: CLIP_SHADOW }}
                  >
                    <span className="absolute left-[9px] right-[9px] top-[5px] truncate text-[11px] font-semibold leading-none">{c.name}</span>
                    <svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true" className="absolute bottom-1 left-1 h-[13px] w-[calc(100%-8px)]">
                      <path d={WAVE} fill="none" stroke="#a7ebc8" strokeWidth={1} strokeOpacity={0.55} vectorEffect="non-scaling-stroke" />
                    </svg>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => suite.jump(0)}
                aria-label="Intro: name, email and two lines about Suhas. Moves the playhead to the start."
                className={cn(clipBase, "inset-y-0 left-0 z-[2] cursor-pointer flex-col items-start justify-center gap-[5px] rounded-[9px] px-[9px] text-[#141416] [text-shadow:none]")}
                style={{
                  width: INTRO * PX,
                  background: CLIP_BG.intro,
                  boxShadow: frame.isIntro ? `0 0 0 2px var(--color-playhead), ${CLIP_SHADOW}` : CLIP_SHADOW,
                }}
              >
                <span className="text-xs font-bold leading-none">Intro</span>
                <span className="font-mono text-[8px] font-semibold leading-tight text-[#3a3a40]">NAME · EMAIL</span>
              </button>
            </div>
          </div>
        </div>

        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 z-[5] w-0">
          <span className="absolute -left-px bottom-0 top-2.5 w-0.5 bg-playhead" />
          <svg width="14" height="16" viewBox="0 0 14 16" className="absolute -left-[7px] -top-0.5">
            <path d="M1 1h12v8l-6 6-6-6z" fill="var(--color-playhead)" />
          </svg>
          <span className="absolute left-[9px] top-0.5 whitespace-nowrap rounded bg-playhead px-[5px] py-0.5 font-mono text-[10px] font-semibold leading-none text-playhead-ink">
            {dateAt(pos)}
          </span>
        </div>
      </div>
    </section>
  );
}
