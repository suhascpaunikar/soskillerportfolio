import { Check, TrendingDown, TrendingUp, X } from "lucide-react";
import type { CSSProperties } from "react";

import { LANE_BG, clipStyle } from "@/components/edit-suite/clip-styles";
import type { Block, FlowRow, Option, Scene, Side, Stat } from "@/lib/case-studies";
import { cn } from "@/lib/utils";

import { Figure, SLOT_STRIPES } from "./shot";

const LABEL = "m-0 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-dim";
const two = (n: number) => String(n).padStart(2, "0");

/** Inline styles plus CSS custom properties, which React's style type doesn't know about. */
const withVars = (style: CSSProperties, vars: Record<`--${string}`, string | number>) => ({ ...style, ...vars }) as CSSProperties;

function Text({ body }: { body: string[] }) {
  return (
    <div className="flex max-w-[66ch] flex-col gap-4">
      {body.map((paragraph) => (
        <p key={paragraph} className="m-0 text-[17px] leading-[1.65] text-soft">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function Points({ items }: { items: Array<{ title: string; body: string }> }) {
  return (
    <ol className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2">
      {items.map((item, i) => (
        <li key={item.title} className="flex flex-col gap-2 rounded-xl border border-line bg-panel p-5">
          <span aria-hidden="true" className="font-mono text-[11px] font-semibold text-dim">
            {two(i + 1)}
          </span>
          <h3 className="m-0 text-balance text-lg font-semibold leading-snug text-white">{item.title}</h3>
          <p className="m-0 text-[15px] leading-[1.55] text-soft">{item.body}</p>
        </li>
      ))}
    </ol>
  );
}

function Lists({ items }: { items: Array<{ label: string; items: string[] }> }) {
  return (
    <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
      {items.map((list) => (
        <div key={list.label} className="flex flex-col gap-3">
          <p className={LABEL}>{list.label}</p>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {list.items.map((item) => (
              <li key={item} className="flex gap-2.5 text-[15px] leading-snug text-soft">
                <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 rounded-[2px] bg-work" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Notes({ label, items }: { label?: string; items: Array<{ term: string; body: string }> }) {
  return (
    <div className="flex flex-col gap-3">
      {label && <p className={LABEL}>{label}</p>}
      <dl className="m-0 grid gap-x-8 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.term} className="flex flex-col gap-1 border-t border-line py-3.5">
            <dt className="text-sm font-semibold text-white">{item.term}</dt>
            <dd className="m-0 text-[15px] leading-[1.55] text-soft">{item.body}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Takeaway({ label, line }: { label: string; line: string }) {
  return (
    <div className="flex flex-col gap-2.5">
      <p className={LABEL}>{label}</p>
      <p className="m-0 max-w-[34ch] text-balance font-serif text-[26px] italic leading-[1.2] text-foreground sm:text-[30px]">{line}</p>
    </div>
  );
}

function Options({ items }: { items: Option[] }) {
  return (
    <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-2">
      {items.map((option) => {
        const shipped = option.verdict.tone === "shipped";
        return (
          <li key={option.name} className={cn("flex gap-4 rounded-xl border bg-panel p-4", shipped ? "border-playhead/70" : "border-line")}>
            <Figure shot={option.shot} compact sizes="120px" className="w-[96px] shrink-0 sm:w-[112px]" />
            <div className="flex min-w-0 flex-col gap-2.5">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                <p className="m-0 text-[15px] font-semibold text-white">{option.name}</p>
                <span
                  className={cn(
                    "rounded-[4px] px-1.5 py-[3px] font-mono text-[9.5px] font-bold uppercase leading-none tracking-[0.06em]",
                    shipped ? "bg-playhead text-playhead-ink" : "bg-[#2c1719] text-[#ff9a9d]",
                  )}
                >
                  {option.verdict.text}
                </span>
              </div>
              <p className="m-0 flex gap-2 text-sm leading-snug text-soft">
                <Check className="mt-0.5 size-4 shrink-0 text-[#52cb8c]" strokeWidth={2.5} aria-hidden="true" />
                <span>
                  <span className="sr-only">For: </span>
                  {option.pro}
                </span>
              </p>
              {option.con && (
                <p className="m-0 flex gap-2 text-sm leading-snug text-soft">
                  <X className="mt-0.5 size-4 shrink-0 text-destructive" strokeWidth={2.5} aria-hidden="true" />
                  <span>
                    <span className="sr-only">Against: </span>
                    {option.con}
                  </span>
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Steps drawn as clips on tracks, like the home page's timeline.
 * On wide screens every row shares one grid, so steps in different rows line up in time;
 * on narrow screens each row becomes a numbered list.
 */
function Flow({ rows, caption }: { rows: FlowRow[]; caption?: string }) {
  // Each step takes its explicit column, or the one after the step before it.
  const placed = rows.map((row) => {
    let next = 1;
    return row.steps.map((step) => {
      const col = step.col ?? next;
      next = col + 1;
      return { ...step, col };
    });
  });
  const columns = Math.max(...placed.flat().map((step) => step.col));
  // A long flow needs the widest layout before its steps can sit side by side.
  const long = columns > 4;

  return (
    <figure className="m-0 flex flex-col gap-2.5">
      <div className="flex flex-col gap-3 rounded-xl border border-[#1e1e22] bg-timeline p-3.5 sm:p-4">
        {rows.map((row, r) => (
          <div key={row.label} className="flex flex-col gap-1.5">
            <p className="m-0 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{row.label}</p>
            <ol
              aria-label={row.label}
              className={cn(
                "m-0 flex list-none flex-col gap-1.5 rounded-lg p-1.5",
                long ? "xl:grid xl:[grid-template-columns:repeat(var(--columns),minmax(0,1fr))]" : "sm:grid sm:[grid-template-columns:repeat(var(--columns),minmax(0,1fr))]",
              )}
              style={withVars(LANE_BG[row.layer], { "--columns": columns })}
            >
              {placed[r].map((step) => (
                <li
                  key={step.text}
                  className={cn(
                    "flex min-w-0 gap-2 rounded-[7px] border-[1.5px] border-transparent px-2.5 py-2",
                    long ? "xl:[grid-column-start:var(--column)] xl:flex-col xl:gap-1 xl:px-1.5" : "sm:[grid-column-start:var(--column)]",
                  )}
                  style={withVars(clipStyle(row.layer, { focus: step.focus }), { "--column": step.col })}
                >
                  <span aria-hidden="true" className="font-mono text-[10px] font-semibold leading-[1.5] opacity-70">
                    {two(step.col)}
                  </span>
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className={cn("hyphens-auto font-semibold leading-[1.25]", long ? "text-[13px] xl:text-[11.5px]" : "text-[13px]")}>{step.text}</span>
                    {step.note && <span className={cn("font-medium leading-[1.3] opacity-80", long ? "text-[11px] xl:text-[10px]" : "text-[11px]")}>{step.note}</span>}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      {caption && <figcaption className="text-[13px] leading-normal text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}

function Versus({ sides }: { sides: [Side, Side] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {sides.map((side, i) => (
        <div key={side.tag} className={cn("flex flex-col gap-3.5 rounded-xl border bg-panel p-4", i === 1 ? "border-[#3f4790]" : "border-line")}>
          <p className={cn("m-0 font-mono text-[11px] font-semibold uppercase tracking-[0.1em]", i === 1 ? "text-work-ink" : "text-muted-foreground")}>{side.tag}</p>
          <Figure shot={side.shot} sizes="(min-width: 640px) 420px, 100vw" />
          <div className="flex flex-col gap-1">
            <h3 className="m-0 text-[17px] font-semibold leading-snug text-white">{side.title}</h3>
            <p className="m-0 text-[15px] leading-[1.55] text-soft">{side.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Each scene is a heading, a line or two of why, and a picture big enough to carry the point. */
function Scenes({ items }: { items: Scene[] }) {
  return (
    <ol className="m-0 flex list-none flex-col gap-12 p-0 lg:gap-14">
      {items.map((scene, i) => (
        <li key={scene.title} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2.5">
            <span aria-hidden="true" className="font-mono text-[11px] font-semibold text-dim">
              {two(i + 1)}
            </span>
            <h3 className="m-0 max-w-[30ch] text-balance text-[22px] font-semibold leading-[1.25] text-white sm:text-2xl">{scene.title}</h3>
            {scene.body.map((paragraph) => (
              <p key={paragraph} className="m-0 max-w-[66ch] text-pretty text-base leading-[1.6] text-soft sm:text-[17px]">
                {paragraph}
              </p>
            ))}
          </div>
          {scene.shots.map((shot) => (
            <Figure key={shot.label} shot={shot} />
          ))}
        </li>
      ))}
    </ol>
  );
}

/** A test's audience drawn to scale on one track: who saw the new version and who stayed on the old one. */
function Split({ parts, caption }: { parts: Array<{ label: string; share: number; note?: string; focus?: boolean }>; caption?: string }) {
  return (
    <figure className="m-0 flex flex-col gap-2.5">
      <ul className="m-0 flex list-none gap-1.5 rounded-xl border border-[#1e1e22] bg-timeline p-2">
        {parts.map((part) => (
          <li
            key={part.label}
            className="flex min-w-[92px] flex-col gap-0.5 rounded-[7px] border-[1.5px] border-transparent px-2.5 py-2"
            style={{ ...clipStyle("work", { focus: part.focus }), flex: `${part.share} 1 0%` }}
          >
            <span className="font-mono text-[11px] font-semibold leading-[1.4]">{part.share}%</span>
            <span className="text-[13px] font-semibold leading-[1.25]">{part.label}</span>
            {part.note && <span className="text-[11px] font-medium leading-[1.3] opacity-80">{part.note}</span>}
          </li>
        ))}
      </ul>
      {caption && <figcaption className="text-[13px] leading-normal text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}

const STAT_COLUMNS: Record<number, string> = {
  1: "",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "grid-cols-2 xl:grid-cols-4",
};

export function Stats({ items, className }: { items: Stat[]; className?: string }) {
  return (
    <dl className={cn("m-0 grid gap-px overflow-hidden rounded-xl border border-line bg-line", STAT_COLUMNS[items.length] ?? "sm:grid-cols-2", className)}>
      {items.map((stat) => (
        <div key={stat.label} className="flex flex-col-reverse justify-end gap-2 bg-panel p-4 sm:p-5">
          <dt className="text-[13px] leading-snug text-muted-foreground">{stat.label}</dt>
          <dd
            className={cn(
              "m-0 flex items-center gap-2 font-serif text-[34px] leading-none sm:text-[40px]",
              stat.tone === "up" ? "text-[#6fdca3]" : stat.tone === "down" ? "text-[#ff7a7e]" : "text-white",
            )}
          >
            {stat.tone === "up" && <TrendingUp className="size-6 shrink-0" aria-hidden="true" />}
            {stat.tone === "down" && <TrendingDown className="size-6 shrink-0" aria-hidden="true" />}
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Intertitle({ label, line, sub }: { label: string; line: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-[#2b2b31] bg-screen px-6 py-12 text-center sm:px-12 sm:py-16">
      <p className="m-0 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-playhead">{label}</p>
      <p className="mx-auto mb-0 mt-4 max-w-[24ch] text-balance font-serif text-[32px] leading-[1.08] text-white sm:text-[44px]">{line}</p>
      {sub && <p className="mx-auto mb-0 mt-5 max-w-[54ch] text-pretty text-[15px] leading-relaxed text-soft">{sub}</p>}
    </div>
  );
}

function Lessons({ items }: { items: Array<{ title: string; body: string }> }) {
  return (
    <ol className="m-0 flex list-none flex-col gap-7 p-0">
      {items.map((item, i) => (
        <li key={item.title} className="grid gap-2 sm:grid-cols-[44px_minmax(0,1fr)]">
          <span aria-hidden="true" className="pt-2 font-mono text-[11px] font-semibold text-dim">
            {two(i + 1)}
          </span>
          <div className="flex flex-col gap-2">
            <h3 className="m-0 text-balance font-serif text-[26px] font-normal italic leading-[1.15] text-white sm:text-[30px]">{item.title}</h3>
            <p className="m-0 max-w-[62ch] text-base leading-[1.6] text-soft">{item.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** A gap only the author can fill, drawn like an empty picture slot so it can't pass for finished copy. */
function Todo({ text }: { text: string }) {
  return (
    <p className="m-0 flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-[10px] border border-dashed border-[#3a3a44] px-4 py-3 text-sm leading-snug text-muted-foreground" style={{ background: SLOT_STRIPES }}>
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-playhead">To add</span>
      <span>{text}</span>
    </p>
  );
}

export function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "text":
      return <Text body={block.body} />;
    case "subhead":
      return <h3 className="m-0 mt-2 text-balance text-[22px] font-semibold leading-snug text-white">{block.text}</h3>;
    case "shot":
      return <Figure shot={block.shot} />;
    case "points":
      return <Points items={block.items} />;
    case "lists":
      return <Lists items={block.items} />;
    case "notes":
      return <Notes label={block.label} items={block.items} />;
    case "takeaway":
      return <Takeaway label={block.label} line={block.line} />;
    case "options":
      return <Options items={block.items} />;
    case "flow":
      return <Flow rows={block.rows} caption={block.caption} />;
    case "split":
      return <Split parts={block.parts} caption={block.caption} />;
    case "versus":
      return <Versus sides={block.sides} />;
    case "scenes":
      return <Scenes items={block.items} />;
    case "stats":
      return <Stats items={block.items} />;
    case "intertitle":
      return <Intertitle label={block.label} line={block.line} sub={block.sub} />;
    case "lessons":
      return <Lessons items={block.items} />;
    case "todo":
      return <Todo text={block.text} />;
  }
}
