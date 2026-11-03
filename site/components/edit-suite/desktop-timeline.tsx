"use client";

import { Eye, EyeOff, Minus, Pause, Play, Plus, SkipBack, SkipForward } from "lucide-react";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

import { Button } from "@/components/ui/button";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { usePinchZoom } from "@/hooks/use-pinch-zoom";
import { INTRO, TOTAL, companies, companyName, dateAt, describe, experiments, pct, rangeOf, work, type Span } from "@/lib/career";
import { cn } from "@/lib/utils";

import { ClipLabel } from "./clip-label";
import { CLIP_CLASS, INTRO_STYLE, LANE_BG, PLAYHEAD_FLAG, WAVE, clipStyle, rulerMarks } from "./clip-styles";
import type { LayerKey, Suite } from "./edit-suite";

const ROWS: Array<{ key: LayerKey; name: string; color: string; height: number }> = [
  { key: "exp", name: "Experiments", color: "bg-exp", height: 56 },
  { key: "work", name: "Work", color: "bg-work", height: 48 },
  { key: "co", name: "Company", color: "bg-co", height: 48 },
];

const RULER_HEIGHT = 30;
const MAX_ZOOM = 8;
const ZOOM_STEP = 1.5;

const place = (c: Span): CSSProperties => ({ left: `${pct(c.s)}%`, width: `${pct(c.e - c.s)}%` });

export function DesktopTimeline({ suite }: { suite: Suite }) {
  const { pos, frame, running, hidden } = suite;
  const reduced = usePrefersReducedMotion();

  // Zoom: 1 fits the whole career; up to MAX_ZOOM times wider, scrolled horizontally.
  const scroller = useRef<HTMLDivElement>(null);
  const zoomRef = useRef(1);
  const anchor = useRef<{ frac: number; x: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [view, setView] = useState({ left: 0, width: 0 });

  /** Zoom to `next`, keeping the point `x` pixels from the left edge of the view where it is. */
  const zoomTo = (next: number, x?: number) => {
    const el = scroller.current;
    if (!el) return;
    const z = Math.min(MAX_ZOOM, Math.max(1, next));
    if (Math.abs(z - zoomRef.current) < 0.001) return;
    const width = el.clientWidth;
    if (x === undefined) {
      // Buttons and keys zoom around the playhead, or bring it to the middle if it's off screen.
      const at = (pos / TOTAL) * el.scrollWidth - el.scrollLeft;
      anchor.current = { frac: pos / TOTAL, x: at >= 0 && at <= width ? at : width / 2 };
    } else {
      anchor.current = { frac: (el.scrollLeft + x) / el.scrollWidth, x };
    }
    zoomRef.current = z;
    setZoom(z);
  };

  usePinchZoom(scroller, (factor, clientX) => {
    const el = scroller.current;
    if (el) zoomTo(zoomRef.current * factor, clientX - el.getBoundingClientRect().left);
  });

  // After a zoom, scroll so the anchor point stays put.
  useLayoutEffect(() => {
    const el = scroller.current;
    const a = anchor.current;
    if (!el || !a) return;
    el.scrollLeft = a.frac * el.scrollWidth - a.x;
    anchor.current = null;
  }, [zoom]);

  // Track the visible window, for ruler density and the playhead label.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const measure = () => setView({ left: el.scrollLeft, width: el.clientWidth });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.addEventListener("scroll", measure, { passive: true });
    // A mouse wheel pans the zoomed timeline sideways, as in an editor; Ctrl/⌘ + wheel zooms (see usePinchZoom).
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey || zoomRef.current <= 1 || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", measure);
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  // Keep the playhead in view while it moves (playback, clip jumps), unless the whole timeline fits.
  useEffect(() => {
    const el = scroller.current;
    if (!el || zoomRef.current <= 1) return;
    const x = (pos / TOTAL) * el.scrollWidth;
    const { scrollLeft, clientWidth } = el;
    if (x >= scrollLeft + 24 && x <= scrollLeft + clientWidth - 24) return;
    el.scrollTo({ left: x - clientWidth * (running ? 0.1 : 0.35), behavior: running || reduced ? "auto" : "smooth" });
  }, [pos, running, reduced]);

  const contentWidth = view.width * zoom;
  const marks = rulerMarks(view.width ? contentWidth / TOTAL : 12);
  const flip = view.width ? (pos / TOTAL) * contentWidth - view.left > view.width - 90 : pos > TOTAL * 0.86;

  const onKeys = (e: KeyboardEvent<HTMLElement>) => {
    const k = e.key.toLowerCase();
    if (k === "=" || k === "+") {
      e.preventDefault();
      zoomTo(zoom * ZOOM_STEP);
    } else if (k === "-" || k === "_") {
      e.preventDefault();
      zoomTo(zoom / ZOOM_STEP);
    } else if (k === "0") {
      e.preventDefault();
      zoomTo(1);
    } else if (k === "j") {
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

  return (
    <section aria-label="Timeline" className="flex shrink-0 flex-col border-t border-line bg-panel">
      <div className="grid h-[52px] shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-[#1f1f23] px-4">
        <span className="font-mono text-[13px] font-semibold text-playhead">{dateAt(pos)}</span>
        <div role="group" aria-label="Transport" className="flex items-center gap-2.5">
          <Button size="icon" onClick={suite.prev} disabled={pos <= 0} aria-label="Previous clip" title="Previous clip (J)">
            <SkipBack className="size-3.5" aria-hidden="true" />
          </Button>
          <Button
            size="icon-lg"
            className="text-playhead"
            onClick={suite.togglePlay}
            aria-label={running ? "Pause the reel" : "Play the reel"}
            title={`${running ? "Pause" : "Play"} the reel (K)`}
          >
            {running ? <Pause className="size-3.5 fill-current" aria-hidden="true" /> : <Play className="size-3.5 fill-current" aria-hidden="true" />}
          </Button>
          <Button size="icon" onClick={suite.next} disabled={pos >= TOTAL} aria-label="Next clip" title="Next clip (L)">
            <SkipForward className="size-3.5" aria-hidden="true" />
          </Button>
        </div>
        <div className="flex items-center gap-3 justify-self-end">
          <span className="text-xs text-dim">Drag the years to scrub · pinch to zoom · click a clip to open it</span>
          <div role="group" aria-label="Zoom" className="flex items-center gap-0.5 rounded-full bg-[#0a0a0c] p-[3px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.7),inset_0_0_0_1px_#000,0_1px_0_rgba(255,255,255,0.06)]">
            <Button variant="ghost" size="icon-sm" onClick={() => zoomTo(zoom / ZOOM_STEP)} disabled={zoom <= 1} aria-label="Zoom out" title="Zoom out (−)">
              <Minus className="size-3.5" aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              className="h-7 min-w-12 px-1.5 font-mono text-[11px] tabular-nums"
              onClick={() => zoomTo(1)}
              disabled={zoom <= 1}
              aria-label={`Zoom ${Math.round(zoom * 100)}%. Fit the whole timeline.`}
              title="Fit the whole timeline (0)"
            >
              {Math.round(zoom * 100)}%
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => zoomTo(zoom * ZOOM_STEP)} disabled={zoom >= MAX_ZOOM} aria-label="Zoom in" title="Zoom in (+)">
              <Plus className="size-3.5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 pb-2.5 pr-4 pt-1.5">
        <div className="flex w-44 shrink-0 flex-col gap-1 pl-4 pr-2.5">
          <div className="flex items-center pl-2.5 font-mono text-[10px] font-semibold tracking-[0.08em] text-dim" style={{ height: RULER_HEIGHT }}>
            YEARS
          </div>
          {ROWS.map((row) => (
            <div key={row.key} className="flex items-center gap-2 rounded-lg bg-track pl-2.5 pr-1" style={{ height: row.height }}>
              <span aria-hidden="true" className={cn("size-2.5 shrink-0 rounded-[3px]", row.color)} />
              <span className={cn("min-w-0 flex-1 truncate text-xs font-semibold", hidden[row.key] && "text-muted-foreground")}>{row.name}</span>
              <Button
                size="icon-sm"
                onClick={() => suite.toggleLayer(row.key)}
                aria-pressed={!hidden[row.key]}
                aria-label={`${hidden[row.key] ? "Show" : "Hide"} the ${row.name.toLowerCase()} layer`}
                title={`${hidden[row.key] ? "Show" : "Hide"} the ${row.name.toLowerCase()} layer`}
              >
                {hidden[row.key] ? <EyeOff className="size-3.5" aria-hidden="true" /> : <Eye className="size-3.5" aria-hidden="true" />}
              </Button>
            </div>
          ))}
        </div>

        <div ref={scroller} className="no-scrollbar min-w-0 flex-1 touch-pan-x overflow-x-auto overflow-y-hidden overscroll-x-contain">
          <div className="relative flex flex-col gap-1" style={{ width: `${zoom * 100}%` }}>
            <div className="relative rounded-md bg-track" style={{ height: RULER_HEIGHT }}>
              {marks.ticks.map((t) => (
                <span
                  key={t.at}
                  aria-hidden="true"
                  className={cn("absolute bottom-0 w-px", t.major ? "h-3.5 bg-tick-major" : "h-1.5 bg-tick")}
                  style={{ left: `${pct(t.at)}%` }}
                />
              ))}
              {marks.labels.map((l) => (
                <span
                  key={`${l.at}-${l.text}`}
                  aria-hidden="true"
                  className={cn("absolute top-[5px] font-mono leading-none", l.minor ? "text-[10px] text-dim" : "text-[11px] text-muted-foreground")}
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
                aria-keyshortcuts="J K L + - 0"
              />
              <div className="scrub-ring pointer-events-none absolute inset-0 rounded-md" aria-hidden="true" />
            </div>

            <div className="relative flex flex-col gap-1">
              <div className="relative h-14 rounded-lg" style={{ ...LANE_BG.exp, opacity: hidden.exp ? 0.35 : 1 }}>
                {experiments.map((x) => (
                  <Link
                    key={x.id}
                    href={x.href}
                    onFocus={() => suite.jump(x.s)}
                    title={x.title}
                    aria-label={`${x.title}, experiment, ${x.when.toLowerCase()}. Opens the Lab.`}
                    className={cn(CLIP_CLASS, "top-[15px] h-[26px] rounded-[7px]")}
                    style={{ ...place(x), ...clipStyle("exp", { focus: true, live: live.exp === x.id }) }}
                  >
                    <ClipLabel label={x.short} />
                  </Link>
                ))}
              </div>

              <div className="relative h-12 rounded-lg" style={{ ...LANE_BG.work, opacity: hidden.work ? 0.35 : 1 }}>
                {work.map((w) => {
                  const label = `${w.title} at ${companyName(w.company)}, ${rangeOf(w).toLowerCase()}`;
                  const body = <ClipLabel eyebrow={w.eyebrow} label={w.label} caseStudy={w.caseStudy} />;
                  const style: CSSProperties = { ...place(w), ...clipStyle("work", { focus: w.caseStudy, live: live.work === w.id }) };
                  const cls = cn(CLIP_CLASS, "top-1 h-10 rounded-lg");
                  return w.href ? (
                    <Link
                      key={w.id}
                      href={w.href}
                      onFocus={() => suite.jump(w.s)}
                      title={w.caseStudy ? `${w.title} · case study` : w.title}
                      aria-label={`${w.caseStudy ? "Case study: " : ""}${label}. Opens its page.`}
                      className={cls}
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
                      className={cn(cls, "cursor-pointer p-0")}
                      style={style}
                    >
                      {body}
                    </button>
                  );
                })}
              </div>

              <div className="relative h-12 rounded-lg" style={{ ...LANE_BG.co, opacity: hidden.co ? 0.35 : 1 }}>
                {companies.map((c) => (
                  <Link
                    key={c.id}
                    href={c.href}
                    onFocus={() => suite.jump(c.s)}
                    title={`${c.name} · ${c.role}`}
                    aria-label={`${c.name}, ${c.role}, ${c.dates}. Opens ${c.href === "/now" ? "Now" : "About"}.`}
                    className={cn(CLIP_CLASS, "top-1 h-10 rounded-lg")}
                    style={{ ...place(c), ...clipStyle("co", { focus: c.focus, live: live.co === c.id }) }}
                  >
                    <svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true" className="absolute bottom-0.5 left-1 h-3 w-[calc(100%-8px)]">
                      <path d={WAVE} fill="none" stroke="#a7ebc8" strokeWidth={1} strokeOpacity={0.35} vectorEffect="non-scaling-stroke" />
                    </svg>
                    <ClipLabel label={c.name} sub={c.sub} />
                  </Link>
                ))}
              </div>

              <button
                type="button"
                onClick={() => suite.jump(0)}
                title="Intro"
                aria-label="Intro: name, email and two lines about Suhas. Moves the playhead to the start."
                className={cn(CLIP_CLASS, "inset-y-0 left-0 z-[2] cursor-pointer flex-col items-start justify-center gap-[5px] rounded-[9px] px-2.5 text-[#141416] [text-shadow:none]")}
                style={{ width: `${pct(INTRO)}%`, ...INTRO_STYLE(frame.isIntro) }}
              >
                <span className="text-xs font-bold leading-none">Intro</span>
                <span className="font-mono text-[9px] font-semibold leading-tight text-[#3a3a40]">NAME · EMAIL</span>
              </button>
            </div>

            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 z-[5] w-0" style={{ left: `${pct(pos)}%` }}>
              <span className="absolute -left-px bottom-0 top-3 w-0.5 bg-playhead" />
              <svg width="14" height="16" viewBox="0 0 14 16" className="absolute -left-[7px] top-0">
                <path d={PLAYHEAD_FLAG} fill="var(--color-playhead)" />
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
      </div>
    </section>
  );
}
