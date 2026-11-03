"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { usePinchZoom } from "@/hooks/use-pinch-zoom";
import { INTRO, TOTAL, clamp, companies, companyName, dateAt, experiments, rangeOf, work, type Span } from "@/lib/career";
import { cn } from "@/lib/utils";

import { ClipLabel } from "./clip-label";
import { CLIP_HEIGHT, INTRO_STYLE, KNOB_PATH, TICK_MAJOR, TICK_MINOR, WAVE, clipStyle, rulerMarks, waveColor } from "./clip-styles";
import type { Suite } from "./edit-suite";

/** Pixels per month at the default zoom, and the most a pinch can zoom in. */
const DEFAULT_PX = 12;
const MAX_PX = 72;
/** Space at each end, so the playhead knob isn't cut off at the very start and end. */
const PAD = 6;
const STEP_MS = 200;
const RULER = 28;
const GAP = 4;

const clipBase =
  "clip absolute inset-y-0 box-border flex cursor-pointer items-center overflow-hidden p-0 text-left outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring";

/**
 * The timeline fills the strip from the first frame to the last, with no blank space at either end.
 * The scroll position and the playhead move together: at the start both sit at the left edge, at "now"
 * both sit at the right, so swiping anywhere still scrubs through every date. Dragging along the ruler
 * puts the playhead under your finger. Pinch to zoom; the zoom keeps the playhead where it is on screen.
 */
export function PhoneTimeline({ suite }: { suite: Suite }) {
  const { pos, running, frame, hidden } = suite;
  const scroller = useRef<HTMLDivElement>(null);
  /** The last position reported by a scroll, so we don't scroll back to where the user already is. */
  const fromScroll = useRef<number | null>(null);
  const tweening = useRef(false);
  /** True while the scroll position is being set to follow a zoom or resize. */
  const relayout = useRef(false);
  /** True while a finger drags along the ruler. */
  const scrubbing = useRef(false);
  const reduced = usePrefersReducedMotion();

  const [px, setPx] = useState(DEFAULT_PX);
  const pxRef = useRef(DEFAULT_PX);
  const [viewport, setViewport] = useState(0);
  const layout = useRef({ px: DEFAULT_PX, viewport: 0 });

  const fitPx = (width: number) => Math.max(1, (width - PAD * 2) / TOTAL);
  const setZoom = (next: number) => {
    const el = scroller.current;
    if (!el) return;
    const z = Math.min(MAX_PX, Math.max(fitPx(el.clientWidth), next));
    if (Math.abs(z - pxRef.current) < 0.01) return;
    pxRef.current = z;
    setPx(z);
  };

  const pinching = usePinchZoom(scroller, (factor) => setZoom(pxRef.current * factor));

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setViewport(el.clientWidth);
      if (pxRef.current < fitPx(el.clientWidth)) setZoom(fitPx(el.clientWidth));
    });
    ro.observe(el);
    return () => ro.disconnect();
    // setZoom only reads refs; running this once is enough.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const target = max > 0 ? (pos / TOTAL) * max : 0;

    // A zoom or resize changes the scroll range: move straight to the matching scroll position.
    if (layout.current.px !== px || layout.current.viewport !== viewport) {
      layout.current = { px, viewport };
      relayout.current = true;
      el.scrollLeft = target;
      fromScroll.current = pos;
      const id = requestAnimationFrame(() => {
        relayout.current = false;
      });
      return () => cancelAnimationFrame(id);
    }

    if (fromScroll.current === pos || Math.abs(el.scrollLeft - target) < 1) return;

    if (scrubbing.current) {
      el.scrollLeft = target;
      return;
    }

    if (running && !reduced) {
      // While the reel plays, glide one month per step instead of jumping.
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
  }, [pos, px, viewport, running, reduced]);

  const onScroll = () => {
    const el = scroller.current;
    if (!el || tweening.current || relayout.current || pinching.current || scrubbing.current) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 0) return;
    const p = clamp(Math.round((el.scrollLeft / max) * TOTAL));
    fromScroll.current = p;
    if (p !== pos) suite.seek(p);
  };

  const interrupt = () => {
    if (running) suite.pause();
  };

  /** Ruler drag: the playhead follows the finger. Inverts "playhead on screen = PAD + fraction × (width − 2·PAD)". */
  const scrubTo = (clientX: number) => {
    const el = scroller.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const span = el.clientWidth - PAD * 2;
    if (span <= 0) return;
    suite.jump(((clientX - rect.left - PAD) / span) * TOTAL);
  };
  const onRulerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    scrubbing.current = true;
    scrubTo(e.clientX);
  };
  const onRulerUp = () => {
    scrubbing.current = false;
  };
  const onRulerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) scrubTo(e.clientX);
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
    } else if (k === "=" || k === "+") {
      e.preventDefault();
      setZoom(px * 1.5);
    } else if (k === "-" || k === "_") {
      e.preventDefault();
      setZoom(px / 1.5);
    }
  };

  const live = {
    exp: hidden.exp ? null : frame.experiment?.id,
    work: hidden.work ? null : frame.work?.id,
    co: hidden.co ? null : frame.company?.id,
  };

  const place = (c: Span): CSSProperties => ({ left: c.s * px, width: (c.e - c.s) * px });
  const lane = (layer: "exp" | "work" | "co"): CSSProperties => ({ height: CLIP_HEIGHT, opacity: hidden[layer] ? 0.35 : 1 });
  const marks = rulerMarks(px);
  const flip = pos > TOTAL * 0.72;

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

      <div
        ref={scroller}
        onScroll={onScroll}
        onTouchStart={interrupt}
        onWheel={interrupt}
        onPointerDown={interrupt}
        onKeyDown={onKeys}
        tabIndex={0}
        role="region"
        aria-label="Timeline. Swipe, or use the arrow keys, to scrub through the years. Pinch to zoom."
        aria-keyshortcuts="J K L + -"
        className="no-scrollbar min-w-0 flex-1 touch-pan-x overflow-x-auto overflow-y-hidden overscroll-x-contain outline-offset-[-2px] focus-visible:outline-2 focus-visible:outline-ring"
      >
        <div style={{ paddingInline: PAD, width: TOTAL * px, boxSizing: "content-box" }}>
          <div className="relative flex flex-col" style={{ gap: GAP }}>
            <div
              className="relative cursor-ew-resize touch-none"
              style={{ height: RULER }}
              onPointerDown={onRulerDown}
              onPointerMove={onRulerMove}
              onPointerUp={onRulerUp}
              onPointerCancel={onRulerUp}
              aria-hidden="true"
            >
              {marks.ticks.map((t) => (
                <span key={t.at} className="absolute bottom-0 w-px bg-tick" style={{ left: t.at * px, height: t.major ? TICK_MAJOR : TICK_MINOR }} />
              ))}
              {marks.labels.map((l) => (
                <span
                  key={`${l.at}-${l.text}`}
                  className={cn("absolute top-[7px] whitespace-nowrap pl-1 font-mono text-xxs font-light leading-none", l.minor ? "text-ruler-text/70" : "text-ruler-text")}
                  style={{ left: l.at * px }}
                >
                  {l.text}
                </span>
              ))}
              <span className="absolute right-1 top-[7px] font-mono text-[9px] font-light leading-none text-ruler-text">NOW</span>
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
                style={{ width: INTRO * px, ...INTRO_STYLE(frame.isIntro) }}
              >
                <span className="text-xs font-semibold leading-none">Intro</span>
                <span className="whitespace-nowrap font-mono text-[8px] font-medium leading-tight text-[#55555c]">NAME · EMAIL</span>
              </button>
            </div>

            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 z-[5] w-0" style={{ left: pos * px }}>
              <span className="absolute -left-px bottom-0 w-[3px] bg-timeline" style={{ top: RULER }} />
              <span className="absolute bottom-0 left-0 w-px bg-playhead" style={{ top: RULER - 10 }} />
              <svg width="10" height="13" viewBox="0 0 10 13" className="absolute -left-[5px] overflow-visible" style={{ top: RULER - 14 }}>
                <path d={KNOB_PATH} fill="var(--color-playhead)" stroke="var(--color-timeline)" strokeWidth={2} paintOrder="stroke" />
              </svg>
              <span
                className="absolute top-0 whitespace-nowrap rounded-[3px] bg-playhead px-[5px] py-0.5 font-mono text-[10px] font-semibold leading-none text-playhead-ink"
                style={{ left: flip ? -8 : 8, transform: flip ? "translateX(-100%)" : undefined }}
              >
                {dateAt(pos)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
