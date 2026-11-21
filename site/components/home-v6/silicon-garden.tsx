"use client";

import { Droplet } from "lucide-react";
import { type CSSProperties, Fragment, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { BASE, type Cell, COLS, FRUIT, FRUIT_SCALE, GROWN, hash, MID, POCKETS, ROWS, STAGES, type Tone } from "./garden-tree";

/**
 * The V6 footer garden. A bare silicon wafer waits for water. Four waterings grow an ASCII tree
 * out of it, and the grown tree fruits AI models that can be knocked off onto the wafer.
 * Nothing is remembered: every visit starts with the bare wafer.
 */

/** Box geometry, in em of the box's own font size (1ch is 0.6em in JetBrains Mono). */
const TOP = 1; // the grid starts 1em down, leaving room for falling water
const LH = 1.15; // line height of one grid row
const GROUND = TOP + ROWS * LH - 0.15; // the wafer's centre, where the trunk is rooted
const HEIGHT = 39.5;

const TONE: Record<Tone, string> = {
  sprout: "text-[#a6e05a]",
  stem: "text-[#93b052]",
  bark0: "text-[#c9a173]",
  bark1: "text-[#9a744e]",
  bark2: "text-[#664b33]",
  twig: "text-[#7f6244]",
  root: "text-[#8a6a48]",
  grass: "text-[#7fb83a]",
  leaf0: "text-[#2f4d20]",
  leaf1: "text-[#46712a]",
  leaf2: "text-[#6a9f35]",
  leaf3: "text-[#96cb43]",
  leaf4: "text-[#c8f542]",
};

/** How far from the trunk, in ch, a fallen fruit may sit and still be on the wafer. */
const RIM = 25;

/** Where picked fruit comes to rest, in pick order: [ch from the trunk, em from the wafer's centre, tilt]. */
const SLOTS: [number, number, number][] = [
  [-9, 2.3, -6],
  [9, 2.3, 5],
  [-19, 0.4, -3],
  [19, 0.4, 7],
  [-16, -1.6, 3],
  [16, -1.6, -5],
  [-7, 4.1, 4],
  [7, 4.1, -7],
];

/** How far a cell is from the root, so growth spreads up the trunk and out along the branches. */
const reach = (cell: Cell) => BASE - cell.r + Math.abs(cell.c - MID) * 0.45;

type Placed = { cell: Cell; mode: "still" | "in" | "out"; delay: number };

/** The cells to draw going from one stage to the next: new cells grow in, lost cells wilt away. */
function transition(prev: number, stage: number): Placed[] {
  if (prev === stage) return STAGES[stage].map((cell) => ({ cell, mode: "still", delay: 0 }));
  const had = new Set(STAGES[prev].map((c) => c.key));
  const has = new Set(STAGES[stage].map((c) => c.key));
  const entering = STAGES[stage].filter((c) => !had.has(c.key));
  const leaving = STAGES[prev].filter((c) => !has.has(c.key));
  const start = Math.min(Infinity, ...entering.map(reach), ...leaving.map(reach));
  const delay = (cell: Cell) => Math.round((reach(cell) - start) * 16);
  return [
    ...STAGES[stage].map((cell): Placed => (had.has(cell.key) ? { cell, mode: "still", delay: 0 } : { cell, mode: "in", delay: delay(cell) })),
    ...leaving.map((cell): Placed => ({ cell, mode: "out", delay: delay(cell) })),
  ];
}

// ───── Water ─────

/** Raindrops: [spread from centre, -1 to 1], [landing, em from the wafer's centre], delay ms, fall ms. */
const DROPS = Array.from({ length: 18 }, (_, i) => ({
  x: hash(i, 7, 4) * 2 - 1,
  y: hash(i, 7, 5) * 5 - 2.5,
  delay: Math.round(hash(i, 7, 6) * 280),
  fall: 480 + Math.round(hash(i, 7, 8) * 160),
}));

/** How wide the water falls, by the stage being watered: a seed needs a narrow pour, a tree a wide one. */
const SPREAD = [8, 11, 17, 24];

/** The canopy's shadow on the wafer, by stage, as a share of the wafer's width. */
const SHADE = ["0%", "10%", "26%", "46%", "68%"];

const LABEL = ["water it", "a little more", "keep going", "one last drop"];

const SAID = [
  "",
  "A sprout breaks through the silicon.",
  "It grows into a sapling.",
  "It is a young tree now.",
  "Fully grown. Eight models hang ripe on the branches.",
];

const FLAT = `translate(-50%, -50%) translateY(${HEIGHT / 2 - GROUND}em) perspective(90em) rotateX(0deg)`;
const TILT = "translate(-50%, -50%) translateY(0em) perspective(90em) rotateX(72deg)";

const FOCUS = "outline-offset-4 focus-visible:outline-2 focus-visible:outline-[#c8f542]";

type Vars = CSSProperties & Record<`--${string}`, string>;

export function SiliconGarden() {
  const [{ stage, prev }, setGrowth] = useState({ stage: 0, prev: 0 });
  const [tilted, setTilted] = useState(false);
  const [pour, setPour] = useState(0);
  const [busy, setBusy] = useState(false);
  const [picked, setPicked] = useState<number[]>([]);
  const [said, setSaid] = useState("");

  const timers = useRef<number[]>([]);
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((id) => window.clearTimeout(id));
  }, []);
  const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));

  const cells = useMemo(() => transition(prev, stage), [prev, stage]);
  const grown = stage === GROWN;

  function water() {
    if (busy || grown) return;
    const next = stage + 1;
    const grow = () => {
      setGrowth({ stage: next, prev: stage });
      setSaid(SAID[next]);
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTilted(true);
      grow();
      return;
    }
    // The first watering lays the wafer down to become the ground; then the water falls.
    const first = !tilted;
    setBusy(true);
    setTilted(true);
    later(first ? 380 : 0, () => setPour((p) => p + 1));
    later(first ? 820 : 440, grow);
    later(first ? 1150 : 820, () => setBusy(false));
  }

  function pick(i: number) {
    if (picked.includes(i)) return;
    const now = [...picked, i];
    setPicked(now);
    setSaid(now.length === FRUIT.length ? "All eight models picked." : `${FRUIT[i].name} falls onto the wafer.`);
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className={cn("sg-box relative font-mono", !grown && "cursor-pointer")}
        style={{ width: `${COLS}ch`, height: `${HEIGHT}em`, fontSize: "clamp(7px, 2.25vw, 11px)", lineHeight: LH }}
        onClick={grown ? undefined : water}
      >
        <div aria-hidden="true" className={cn("sg-shadow", tilted && "sg-on")} style={{ top: `${GROUND}em` }} />
        <div aria-hidden="true" className="sg-wafer" style={{ top: `${GROUND}em`, transform: tilted ? TILT : FLAT }}>
          <div className="sg-disc sg-edge" style={{ transform: "translateZ(-0.75em)" }} />
          <div className="sg-disc sg-edge" style={{ transform: "translateZ(-0.5em)" }} />
          <div className="sg-disc sg-edge" style={{ transform: "translateZ(-0.25em)" }} />
          <div className="sg-disc sg-top">
            <div className="sg-dies" />
            <div className="sg-shade" style={{ "--size": SHADE[stage] } as Vars} />
            <span className="sg-scribe">sp·2026·w01</span>
            {pour > 0 && (
              <Fragment key={pour}>
                <span className="sg-ripple" style={{ "--d": "430ms" } as Vars} />
                <span className="sg-ripple" style={{ "--d": "650ms" } as Vars} />
              </Fragment>
            )}
          </div>
        </div>

        <div aria-hidden="true" className="absolute inset-x-0" style={{ top: `${TOP}em` }}>
          {cells.map(({ cell, mode, delay }) => (
            <span
              key={cell.key}
              className={cn("sg-cell", TONE[cell.tone], mode === "in" && "sg-in", mode === "out" && "sg-out")}
              style={{ left: `${cell.c}ch`, top: `${cell.r * LH}em`, "--d": `${delay}ms` } as Vars}
            >
              {cell.ch}
            </span>
          ))}
          {picked.flatMap((i) =>
            POCKETS[i].map((cell, j) => (
              <span
                key={`pocket-${cell.key}`}
                className={cn("sg-cell sg-in", TONE[cell.tone])}
                style={{ left: `${cell.c}ch`, top: `${cell.r * LH}em`, "--d": `${380 + j * 25}ms` } as Vars}
              >
                {cell.ch}
              </span>
            )),
          )}
        </div>

        {pour > 0 && (
          <div key={pour} aria-hidden="true" className="sg-rain">
            {DROPS.map((d, i) => (
              <span
                key={i}
                className="sg-drop"
                style={{ left: `${MID + d.x * SPREAD[Math.min(stage, SPREAD.length - 1)]}ch`, "--y": `${GROUND + d.y}em`, "--d": `${d.delay}ms`, "--t": `${d.fall}ms` } as Vars}
              >
                &apos;
              </span>
            ))}
          </div>
        )}

        {grown &&
          FRUIT.map((f, i) => {
            const slot = picked.indexOf(i);
            const down = slot >= 0;
            const [sx, sy, rot] = SLOTS[Math.max(slot, 0)];
            const width = (f.name.length + 2) * FRUIT_SCALE;
            const room = RIM - width / 2;
            const dx = MID + 0.5 + Math.max(-room, Math.min(room, sx)) - (f.c + width / 2);
            const dy = GROUND + sy - (TOP + f.r * LH + LH / 2);
            return (
              <button
                key={f.name}
                type="button"
                aria-disabled={down || undefined}
                aria-label={down ? `${f.name}, ${f.lab}, picked` : `Pick ${f.name}, ${f.lab}`}
                onClick={() => pick(i)}
                className={cn("sg-fruit font-semibold", down && "sg-fallen")}
                style={
                  {
                    left: `${f.c}ch`,
                    top: `${TOP + f.r * LH}em`,
                    color: f.color,
                    "--glow": `${f.color}55`,
                    "--dx": `${dx}ch`,
                    "--dy": `${dy}em`,
                    "--rot": `${rot}deg`,
                    "--d": `${620 + i * 70}ms`,
                  } as Vars
                }
              >
                <span className="sg-fx">
                  <span className="sg-fy">
                    <span className="sg-ripe">
                      <span className="sg-wob">({f.name})</span>
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
      </div>

      <div className="mt-6 flex h-11 items-center">
        {grown ? (
          <p className="m-0 font-mono text-xs tracking-[0.02em] text-white/45">{picked.length < FRUIT.length ? "ripe · tap a fruit to pick it" : "harvested · all 8 models"}</p>
        ) : (
          <button
            type="button"
            onClick={water}
            aria-disabled={busy || undefined}
            className={cn(
              "flex h-11 cursor-pointer items-center gap-2.5 rounded-lg border border-white/15 bg-[#121411] px-4 font-mono text-[13px] text-white/85 transition-colors hover:border-[#8fd3ff]/60 hover:text-white",
              FOCUS,
            )}
          >
            <Droplet className="size-3.5 text-[#8fd3ff]" aria-hidden="true" />
            {LABEL[stage]}
            <span aria-hidden="true" className="ml-1 flex gap-1">
              {LABEL.map((_, i) => (
                <i key={i} className={cn("block size-1.5 rounded-full", i < stage ? "bg-[#8fd3ff]" : "bg-white/15")} />
              ))}
            </span>
          </button>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {said}
      </p>
    </div>
  );
}
