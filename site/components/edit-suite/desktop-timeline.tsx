"use client";

import Link from "next/link";
import type { CSSProperties, KeyboardEvent } from "react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/ds-icon";
import { INTRO, TOTAL, companies, companyName, dateAt, describe, experiments, pct, rangeOf, work, type Span } from "@/lib/career";
import { cn } from "@/lib/utils";

import { ClipLabel } from "./clip-label";
import { CLIP_HEIGHT, INTRO_STYLE, KNOB_PATH, RULER_HEIGHT, RULER_LABELS, TICKS, TICK_MAJOR, TICK_MINOR, WAVE, clipStyle, waveColor } from "./clip-styles";
import type { LayerKey, Suite } from "./edit-suite";

const ROWS: Array<{ key: LayerKey; name: string; color: string }> = [
  { key: "exp", name: "Experiments", color: "bg-exp" },
  { key: "work", name: "Work", color: "bg-work" },
  { key: "co", name: "Company", color: "bg-co" },
];

const ROW_GAP = 4;

const place = (c: Span): CSSProperties => ({ left: `${pct(c.s)}%`, width: `${pct(c.e - c.s)}%` });

const clipBase =
  "clip absolute inset-y-0 box-border flex items-center overflow-hidden text-left no-underline outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring";

export function DesktopTimeline({ suite }: { suite: Suite }) {
  const { pos, frame, running, hidden } = suite;
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

  const live = {
    exp: hidden.exp ? null : frame.experiment?.id,
    work: hidden.work ? null : frame.work?.id,
    co: hidden.co ? null : frame.company?.id,
  };

  return (
    <section aria-label="Timeline" className="flex shrink-0 flex-col border-t border-line bg-timeline">
      <div className="grid h-11 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-line px-4">
        <span className="font-mono text-xs font-semibold tracking-[0.02em] text-playhead">{dateAt(pos)}</span>
        <div role="group" aria-label="Transport" className="flex items-center gap-1">
          <Button variant="ghost" size="icon-square" className="size-8" onClick={suite.prev} disabled={pos <= 0} aria-label="Previous clip" title="Previous clip (J)">
            <Icon name="go-to-start" />
          </Button>
          <Button
            variant="secondary"
            size="icon-square"
            className="size-8"
            onClick={suite.togglePlay}
            aria-label={running ? "Pause the reel" : "Play the reel"}
            title={`${running ? "Pause" : "Play"} the reel (K)`}
          >
            <Icon name={running ? "pause" : "play-solid"} />
          </Button>
          <Button variant="ghost" size="icon-square" className="size-8" onClick={suite.next} disabled={pos >= TOTAL} aria-label="Next clip" title="Next clip (L)">
            <Icon name="go-to-end" />
          </Button>
        </div>
        <span className="justify-self-end text-xs text-dim">Drag along the years to scrub · click a clip to open it</span>
      </div>

      <div className="flex min-h-0 pb-3 pr-4">
        <div className="flex w-44 shrink-0 flex-col pl-4 pr-3" style={{ gap: ROW_GAP }}>
          <div className="flex items-center pl-1 font-mono text-xxs font-medium tracking-[0.08em] text-dim" style={{ height: RULER_HEIGHT }}>
            YEARS
          </div>
          {ROWS.map((row) => (
            <div key={row.key} className="flex items-center gap-2 rounded-md pl-1" style={{ height: CLIP_HEIGHT }}>
              <span aria-hidden="true" className={cn("size-2 shrink-0 rounded-[2px]", row.color)} />
              <span className={cn("min-w-0 flex-1 truncate text-xs font-[450]", hidden[row.key] && "text-muted-foreground")}>{row.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => suite.toggleLayer(row.key)}
                aria-pressed={!hidden[row.key]}
                aria-label={`${hidden[row.key] ? "Show" : "Hide"} the ${row.name.toLowerCase()} layer`}
                title={`${hidden[row.key] ? "Show" : "Hide"} the ${row.name.toLowerCase()} layer`}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name={hidden[row.key] ? "eye-off" : "eye-on"} />
              </Button>
            </div>
          ))}
        </div>

        <div className="relative flex min-w-0 flex-1 flex-col" style={{ gap: ROW_GAP }}>
          <div className="relative" style={{ height: RULER_HEIGHT }}>
            {TICKS.map((t) => (
              <span
                key={t.at}
                aria-hidden="true"
                className="absolute bottom-0 w-px bg-tick"
                style={{ left: `${pct(t.at)}%`, height: t.major ? TICK_MAJOR : TICK_MINOR }}
              />
            ))}
            {RULER_LABELS.map((l) => (
              <span
                key={l.text}
                aria-hidden="true"
                className="absolute top-[13px] font-mono text-xxs font-light leading-none text-ruler-text"
                style={{ left: `calc(${pct(l.at)}% + 4px)` }}
              >
                {l.text}
              </span>
            ))}
            <span aria-hidden="true" className="absolute right-1 top-[13px] font-mono text-xxs font-light leading-none text-ruler-text">
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

          <div className="relative flex flex-col" style={{ gap: ROW_GAP }}>
            <div className="relative rounded-[4px] bg-white/[0.02]" style={{ height: CLIP_HEIGHT, opacity: hidden.exp ? 0.35 : 1 }}>
              {experiments.map((x) => (
                <Link
                  key={x.id}
                  href={x.href}
                  onFocus={() => suite.jump(x.s)}
                  title={x.title}
                  aria-label={`${x.title}, experiment, ${x.when.toLowerCase()}. Opens the Lab.`}
                  className={clipBase}
                  style={{ ...place(x), ...clipStyle("exp", { focus: true, live: live.exp === x.id }) }}
                >
                  <ClipLabel label={x.short} />
                </Link>
              ))}
            </div>

            <div className="relative rounded-[4px] bg-white/[0.02]" style={{ height: CLIP_HEIGHT, opacity: hidden.work ? 0.35 : 1 }}>
              {work.map((w) => {
                const label = `${w.title} at ${companyName(w.company)}, ${rangeOf(w).toLowerCase()}`;
                const body = <ClipLabel eyebrow={w.eyebrow} label={w.label} caseStudy={w.caseStudy} />;
                const style: CSSProperties = { ...place(w), ...clipStyle("work", { focus: w.caseStudy, live: live.work === w.id }) };
                return w.href ? (
                  <Link
                    key={w.id}
                    href={w.href}
                    onFocus={() => suite.jump(w.s)}
                    title={w.caseStudy ? `${w.title} · case study` : w.title}
                    aria-label={`${w.caseStudy ? "Case study: " : ""}${label}. Opens its page.`}
                    className={clipBase}
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
                    className={cn(clipBase, "cursor-pointer p-0")}
                    style={style}
                  >
                    {body}
                  </button>
                );
              })}
            </div>

            <div className="relative rounded-[4px] bg-white/[0.02]" style={{ height: CLIP_HEIGHT, opacity: hidden.co ? 0.35 : 1 }}>
              {companies.map((c) => (
                <Link
                  key={c.id}
                  href={c.href}
                  onFocus={() => suite.jump(c.s)}
                  title={`${c.name} · ${c.role}`}
                  aria-label={`${c.name}, ${c.role}, ${c.dates}. Opens ${c.href === "/now" ? "Now" : "About"}.`}
                  className={clipBase}
                  style={{ ...place(c), ...clipStyle("co", { focus: c.focus, live: live.co === c.id }) }}
                >
                  <svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-x-1 bottom-0.5 h-3 w-[calc(100%-8px)]">
                    <path d={WAVE} fill="none" stroke={waveColor("co")} strokeWidth={1} strokeOpacity={0.22} vectorEffect="non-scaling-stroke" />
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
              className={cn(clipBase, "z-[2] cursor-pointer flex-col items-start justify-center gap-1 px-2")}
              style={{ width: `${pct(INTRO)}%`, ...INTRO_STYLE(frame.isIntro) }}
            >
              <span className="text-xs font-semibold leading-none">Intro</span>
              <span className="font-mono text-[9px] font-medium leading-tight whitespace-nowrap text-[#55555c]">NAME · EMAIL</span>
            </button>
          </div>

          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 z-[5] w-0" style={{ left: `${pct(pos)}%` }}>
            <span className="absolute -left-px bottom-0 w-[3px] bg-timeline" style={{ top: RULER_HEIGHT }} />
            <span className="absolute left-0 bottom-0 w-px bg-playhead" style={{ top: RULER_HEIGHT - 12 }} />
            <svg width="10" height="13" viewBox="0 0 10 13" className="absolute -left-[5px] top-[22px] overflow-visible">
              <path d={KNOB_PATH} fill="var(--color-playhead)" stroke="var(--color-timeline)" strokeWidth={2} paintOrder="stroke" />
            </svg>
            <span
              className="absolute top-[3px] whitespace-nowrap rounded-[3px] bg-playhead px-1.5 py-[3px] font-mono text-xxs font-semibold leading-none text-playhead-ink"
              style={{ left: flip ? -8 : 8, transform: flip ? "translateX(-100%)" : undefined }}
            >
              {dateAt(pos)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
