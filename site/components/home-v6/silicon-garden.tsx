"use client";

import { Droplet } from "lucide-react";
import { type CSSProperties, Fragment, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * The V6 footer garden. A bare silicon wafer waits for water. Four waterings grow an ASCII tree
 * out of it, and the grown tree fruits AI models that can be knocked off onto the wafer.
 * Nothing is remembered: every visit starts with the bare wafer.
 */

// ───── The tree: a 41 × 17 character grid. Row 16 stands on the wafer. ─────

const COLS = 41;
const ROWS = 17;
const MID = 20;
const BASE = ROWS - 1;

/** Box geometry, in em of the box's own font size (1ch is 0.6em in JetBrains Mono). */
const TOP = 1; // the grid starts 1em down, leaving room for falling water
const LH = 1.2; // line height of one grid row
const GROUND = TOP + ROWS * LH - 0.15; // the wafer's centre, where the trunk is rooted
const HEIGHT = 26;

type Tone = "sprout" | "stem" | "wood" | "leaf0" | "leaf1" | "leaf2";
type Cell = { key: string; r: number; c: number; ch: string; tone: Tone };
type Cluster = { r: number; c: number; ry: number; rx: number };
type Stroke = [row: number, col: number, text: string];
type Plan = { clusters?: Cluster[]; wood?: Stroke[]; tone?: Tone };

const TONE: Record<Tone, string> = {
  sprout: "text-[#a6e05a]",
  stem: "text-[#93b052]",
  wood: "text-[#a8845b]",
  leaf0: "text-[#c8f542]",
  leaf1: "text-[#8cc63f]",
  leaf2: "text-[#5d9130]",
};

const LEAF = "&&&&%%*";

/** A stable pseudo-random number in [0, 1) for a grid cell, so server and client draw the same tree. */
function hash(r: number, c: number, salt: number) {
  let x = (r * 73856093) ^ (c * 19349663) ^ (salt * 83492791);
  x = Math.imul(x ^ (x >>> 13), 1274126177);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
}

function diagonal(row: number, col: number, toRow: number, step: 1 | -1, ch: string): Stroke[] {
  const out: Stroke[] = [];
  for (let r = row, c = col; r >= toRow; r--, c += step) out.push([r, c, ch]);
  return out;
}

function vertical(row: number, toRow: number, col: number): Stroke[] {
  const out: Stroke[] = [];
  for (let r = row; r >= toRow; r--) out.push([r, col, "|"]);
  return out;
}

// ───── Fruit ─────

type Fruit = { name: string; lab: string; color: string; r: number; c: number };

const ANTHROPIC = "#ec8a64";

const FRUIT: Fruit[] = [
  { name: "opus", lab: "Anthropic", color: ANTHROPIC, r: 1, c: 10 },
  { name: "fable", lab: "Anthropic", color: ANTHROPIC, r: 1, c: 24 },
  { name: "gemini", lab: "Google", color: "#79a8ff", r: 3, c: 3 },
  { name: "gpt", lab: "OpenAI", color: "#ededed", r: 3, c: 17 },
  { name: "sonnet", lab: "Anthropic", color: ANTHROPIC, r: 3, c: 28 },
  { name: "llama", lab: "Meta", color: "#b59cff", r: 5, c: 9 },
  { name: "mistral", lab: "Mistral AI", color: "#ffc04d", r: 5, c: 24 },
  { name: "deepseek", lab: "DeepSeek", color: "#5ccfe6", r: 7, c: 15 },
];

/** How far from the trunk, in ch, a fallen fruit may sit and still be on the wafer. */
const RIM = 17;

/** Where picked fruit comes to rest, in pick order: [ch from the trunk, em from the wafer's centre, tilt]. */
const SLOTS: [number, number, number][] = [
  [-6, 1.6, -6],
  [6, 1.6, 5],
  [-12.5, 0.3, -3],
  [12.5, 0.3, 7],
  [-11, -1.1, 3],
  [11, -1.1, -5],
  [-5, 2.8, 4],
  [5, 2.8, -7],
]

// ───── The four stages of growth, plus the bare wafer ─────

const PLANS: Plan[] = [
  {},
  { tone: "sprout", wood: [[14, 18, "_   _"], [15, 17, "(_\\|/_)"], [16, 20, "|"]] },
  {
    tone: "stem",
    clusters: [{ r: 10.6, c: 20, ry: 2, rx: 5.2 }],
    wood: [[12, 19, "\\|/"], ...vertical(15, 13, 20), [16, 19, "_|_"]],
  },
  {
    clusters: [
      { r: 7.2, c: 20, ry: 3.2, rx: 8.5 },
      { r: 8.6, c: 13, ry: 2.2, rx: 5.5 },
      { r: 8.6, c: 27, ry: 2.2, rx: 5.5 },
    ],
    wood: [
      ...diagonal(12, 18, 10, -1, "\\"),
      ...diagonal(12, 22, 10, 1, "/"),
      ...vertical(12, 10, 20),
      [13, 19, "\\|/"],
      ...vertical(15, 14, 20),
      [16, 19, "/|\\"],
    ],
  },
  {
    clusters: [
      { r: 4.2, c: 20, ry: 4.4, rx: 12 },
      { r: 5.8, c: 10, ry: 3.2, rx: 8.5 },
      { r: 5.8, c: 30, ry: 3.2, rx: 8.5 },
      { r: 1.9, c: 13, ry: 2.2, rx: 6 },
      { r: 1.9, c: 27, ry: 2.2, rx: 6 },
      { r: 8.6, c: 7, ry: 1.7, rx: 5.5 },
      { r: 8.6, c: 33, ry: 1.7, rx: 5.5 },
      { r: 8.4, c: 20, ry: 1.9, rx: 7 },
    ],
    wood: [
      ...diagonal(12, 17, 9, -1, "\\"),
      ...diagonal(12, 23, 9, 1, "/"),
      ...vertical(12, 9, 20),
      [10, 13, "__"],
      [10, 26, "__"],
      [13, 18, "\\\\|//"],
      ...vertical(15, 14, 19),
      ...vertical(15, 14, 20),
      ...vertical(15, 14, 21),
      [16, 17, "_/|||\\_"],
    ],
  },
];

const GROWN = PLANS.length - 1;

function draw(plan: Plan, withFruit: boolean): Cell[] {
  const grid: ({ ch: string; tone: Tone } | null)[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(null));

  // Leaves: a union of soft ellipses, ragged at the edges.
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let d = Infinity;
      for (const k of plan.clusters ?? []) d = Math.min(d, ((c - k.c) / k.rx) ** 2 + ((r - k.r) / k.ry) ** 2);
      const n = hash(r, c, 1);
      const hole = d > 0.62 ? n < 0.38 : n < 0.06;
      if (d <= 1 + (n - 0.5) * 0.5 && !hole) {
        const t = hash(r, c, 3);
        grid[r][c] = { ch: LEAF[Math.floor(hash(r, c, 2) * LEAF.length)], tone: t < 0.22 ? "leaf0" : t < 0.7 ? "leaf1" : "leaf2" };
      }
    }
  }

  // Wood and stems on top of the leaves.
  for (const [r, c, text] of plan.wood ?? []) {
    for (let i = 0; i < text.length; i++) if (text[i] !== " ") grid[r][c + i] = { ch: text[i], tone: plan.tone ?? "wood" };
  }

  // Clear a pocket for each fruit, one cell wider on each side.
  if (withFruit) {
    for (const f of FRUIT) for (let i = -1; i <= f.name.length + 2; i++) if (grid[f.r][f.c + i] !== undefined) grid[f.r][f.c + i] = null;
  }

  const cells: Cell[] = [];
  grid.forEach((row, r) =>
    row.forEach((cell, c) => {
      if (cell) cells.push({ key: `${r}-${c}-${cell.ch}-${cell.tone}`, r, c, ch: cell.ch, tone: cell.tone });
    }),
  );
  return cells;
}

const CELLS = PLANS.map((plan, i) => draw(plan, i === GROWN));

/** The leaves under each fruit, grown back in once it is picked. */
const BARE = draw(PLANS[GROWN], false);
const POCKETS = FRUIT.map((f) => BARE.filter((cell) => cell.r === f.r && cell.c >= f.c - 1 && cell.c <= f.c + f.name.length + 2));

/** How far a cell is from the root, so growth spreads up the trunk and out along the branches. */
const reach = (cell: Cell) => BASE - cell.r + Math.abs(cell.c - MID) * 0.45;

type Placed = { cell: Cell; mode: "still" | "in" | "out"; delay: number };

/** The cells to draw going from one stage to the next: new cells grow in, lost cells wilt away. */
function transition(prev: number, stage: number): Placed[] {
  if (prev === stage) return CELLS[stage].map((cell) => ({ cell, mode: "still", delay: 0 }));
  const had = new Set(CELLS[prev].map((c) => c.key));
  const has = new Set(CELLS[stage].map((c) => c.key));
  const entering = CELLS[stage].filter((c) => !had.has(c.key));
  const leaving = CELLS[prev].filter((c) => !has.has(c.key));
  const start = Math.min(Infinity, ...entering.map(reach), ...leaving.map(reach));
  const delay = (cell: Cell) => Math.round((reach(cell) - start) * 24);
  return [
    ...CELLS[stage].map((cell): Placed => (had.has(cell.key) ? { cell, mode: "still", delay: 0 } : { cell, mode: "in", delay: delay(cell) })),
    ...leaving.map((cell): Placed => ({ cell, mode: "out", delay: delay(cell) })),
  ];
}

// ───── Water ─────

/** Raindrops: [spread from centre, -1 to 1], [landing, em from the wafer's centre], delay ms, fall ms. */
const DROPS = Array.from({ length: 11 }, (_, i) => ({
  x: hash(i, 7, 4) * 2 - 1,
  y: hash(i, 7, 5) * 3 - 1.5,
  delay: Math.round(hash(i, 7, 6) * 280),
  fall: 480 + Math.round(hash(i, 7, 8) * 160),
}));

/** How wide the water falls, by the stage being watered: a seed needs a narrow pour, a tree a wide one. */
const SPREAD = [5, 7, 10, 14];

const LABEL = ["water it", "a little more", "keep going", "one last drop"];

const SAID = [
  "",
  "A sprout breaks through the silicon.",
  "It grows into a sapling.",
  "It is a young tree now.",
  "Fully grown. Eight models hang ripe on the branches.",
];

const FLAT = `translate(-50%, -50%) translateY(${HEIGHT / 2 - GROUND}em) perspective(60em) rotateX(0deg)`;
const TILT = "translate(-50%, -50%) translateY(0em) perspective(60em) rotateX(72deg)";

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
        style={{ width: `${COLS}ch`, height: `${HEIGHT}em`, fontSize: "clamp(9.5px, 3.3vw, 14px)", lineHeight: LH }}
        onClick={grown ? undefined : water}
      >
        <div aria-hidden="true" className={cn("sg-shadow", tilted && "sg-on")} style={{ top: `${GROUND}em` }} />
        <div aria-hidden="true" className="sg-wafer" style={{ top: `${GROUND}em`, transform: tilted ? TILT : FLAT }}>
          <div className="sg-disc sg-edge" style={{ transform: "translateZ(-0.45em)" }} />
          <div className="sg-disc sg-edge" style={{ transform: "translateZ(-0.3em)" }} />
          <div className="sg-disc sg-edge" style={{ transform: "translateZ(-0.15em)" }} />
          <div className="sg-disc sg-top">
            <div className="sg-dies" />
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
                style={{ left: `${cell.c}ch`, top: `${cell.r * LH}em`, "--d": `${380 + j * 40}ms` } as Vars}
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
            const width = f.name.length + 2;
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
