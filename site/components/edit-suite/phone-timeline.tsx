"use client";

import type { CSSProperties, KeyboardEvent } from "react";
import { useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { INTRO, TOTAL, clamp, companies, companyName, dateAt, experiments, rangeOf, work, type Span } from "@/lib/career";
import { cn } from "@/lib/utils";

import { ClipLabel } from "./clip-label";
import { CLIP_HEIGHT, INTRO_STYLE, KNOB_PATH, RULER_LABELS, TICKS, TICK_MAJOR, TICK_MINOR, WAVE, clipStyle, waveColor } from "./clip-styles";
import type { Suite } from "./edit-suite";

/** Pixels per month on the phone timeline. */
const PX = 12;
const STEP_MS = 200;

const RULER = 28;
const GAP = 4;

const clipBase =
  "clip absolute inset-y-0 box-border flex cursor-pointer items-center overflow-hidden p-0 text-left outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring";

const place = (c: Span): CSSProperties => ({ left: c.s * PX, width: (c.e - c.s) * PX });

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

  const live = {
    exp: hidden.exp ? null : frame.experiment?.id,
    work: hidden.work ? null : frame.work?.id,
    co: hidden.co ? null : frame.company?.id,
  };

  const lane = (layer: "exp" | "work" | "co"): CSSProperties => ({ height: CLIP_HEIGHT, opacity: hidden[layer] ? 0.35 : 1 });

  return (
    <section aria-label="Timeline" className="flex shrink-0 border-t border-line bg-timeline pb-2 pt-1">
      <div aria-hidden="true" className="flex w-12 shrink-0 flex-col pl-2.5" style={{ gap: GAP }}>
        <div style={{ height: RULER }} />
        {[
          { label: "EXP", color: "bg-exp" },
          { label: "WORK", color: "bg-work" },
          { label: "CO", color: "bg-co" },
        ].map((row) => (
          <div key={row.label} className="flex flex-col justify-center gap-[5px]" style={{ height: CLIP_HEIGHT }}>
            <span className={cn("size-2 rounded-[2px]", row.color)} />
            <span className="font-mono text-[9px] font-medium leading-none tracking-[0.06em] text-muted-foreground">{row.label}</span>
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
          className="no-scrollbar overflow-x-auto overflow-y-hidden overscroll-x-contain outline-offset-[-2px] focus-visible:outline-2 focus-visible:outline-ring"
        >
          {/* 50% padding each side lets both ends of the timeline reach the centre playhead. */}
          <div className="relative flex flex-col px-[50%]" style={{ width: TOTAL * PX, boxSizing: "content-box", gap: GAP }}>
            <div className="relative" style={{ height: RULER }}>
              {TICKS.map((t) => (
                <span
                  key={t.at}
                  aria-hidden="true"
                  className="absolute bottom-0 w-px bg-tick"
                  style={{ left: t.at * PX, height: t.major ? TICK_MAJOR : TICK_MINOR }}
                />
              ))}
              {RULER_LABELS.map((l) => (
                <span key={l.text} aria-hidden="true" className="absolute top-[7px] whitespace-nowrap pl-1 font-mono text-xxs font-light leading-none text-ruler-text" style={{ left: l.at * PX }}>
                  {l.text}
                </span>
              ))}
              <span aria-hidden="true" className="absolute top-[7px] pl-1 font-mono text-[9px] font-light leading-none text-ruler-text" style={{ left: TOTAL * PX }}>
                NOW
              </span>
            </div>

            <div className="relative flex flex-col" style={{ gap: GAP }}>
              <div className="relative rounded-[4px] bg-white/[0.02]" style={lane("exp")}>
                {experiments.map((x) => (
                  <button
                    key={x.id}
                    type="button"
                    onClick={() => suite.jump(x.s)}
                    aria-label={`${x.title}, experiment, ${x.when.toLowerCase()}. Shows it in the monitor.`}
                    className={clipBase}
                    style={{ ...place(x), ...clipStyle("exp", { focus: true, live: live.exp === x.id }) }}
                  >
                    <ClipLabel label={x.short} />
                  </button>
                ))}
              </div>

              <div className="relative rounded-[4px] bg-white/[0.02]" style={lane("work")}>
                {work.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => suite.jump(w.s)}
                    aria-label={`${w.caseStudy ? "Case study: " : ""}${w.title} at ${companyName(w.company)}, ${rangeOf(w).toLowerCase()}. Shows it in the monitor.`}
                    className={clipBase}
                    style={{ ...place(w), ...clipStyle("work", { focus: w.caseStudy, live: live.work === w.id }) }}
                  >
                    <ClipLabel eyebrow={w.eyebrow} label={w.label} caseStudy={w.caseStudy} />
                  </button>
                ))}
              </div>

              <div className="relative rounded-[4px] bg-white/[0.02]" style={lane("co")}>
                {companies.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => suite.jump(c.s)}
                    aria-label={`${c.name}, ${c.role}, ${c.dates}. Shows it in the monitor.`}
                    className={clipBase}
                    style={{ ...place(c), ...clipStyle("co", { focus: c.focus, live: live.co === c.id }) }}
                  >
                    <svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-x-1 bottom-0.5 h-3 w-[calc(100%-8px)]">
                      <path d={WAVE} fill="none" stroke={waveColor("co")} strokeWidth={1} strokeOpacity={0.22} vectorEffect="non-scaling-stroke" />
                    </svg>
                    <ClipLabel label={c.name} sub={c.sub} />
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => suite.jump(0)}
                aria-label="Intro: name, email and two lines about Suhas. Moves the playhead to the start."
                className={cn(clipBase, "z-[2] flex-col items-start justify-center gap-1 px-2")}
                style={{ width: INTRO * PX, ...INTRO_STYLE(frame.isIntro) }}
              >
                <span className="text-xs font-semibold leading-none">Intro</span>
                <span className="font-mono text-[8px] font-medium leading-tight whitespace-nowrap text-[#55555c]">NAME · EMAIL</span>
              </button>
            </div>
          </div>
        </div>

        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 z-[5] w-0">
          <span className="absolute -left-px bottom-0 w-[3px] bg-timeline" style={{ top: RULER }} />
          <span className="absolute left-0 bottom-0 w-px bg-playhead" style={{ top: RULER - 10 }} />
          <svg width="10" height="13" viewBox="0 0 10 13" className="absolute -left-[5px] overflow-visible" style={{ top: RULER - 14 }}>
            <path d={KNOB_PATH} fill="var(--color-playhead)" stroke="var(--color-timeline)" strokeWidth={2} paintOrder="stroke" />
          </svg>
          <span className="absolute left-2 top-0 whitespace-nowrap rounded-[3px] bg-playhead px-[5px] py-0.5 font-mono text-[10px] font-semibold leading-none text-playhead-ink">
            {dateAt(pos)}
          </span>
        </div>
      </div>
    </section>
  );
}
