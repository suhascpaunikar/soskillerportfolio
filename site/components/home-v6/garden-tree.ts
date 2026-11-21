/**
 * The garden's tree, drawn as characters on a 63 × 28 grid and worked out once at load.
 * Deterministic, so the server and the browser draw the same tree.
 *
 * Each grown stage is the same tree at a different age: one skeleton of trunk, limbs,
 * branches and twigs, scaled from the root, with leaf clumps lit from the upper left.
 */

export const COLS = 63;
export const ROWS = 28;
export const MID = 31;
export const BASE = ROWS - 1;

export type Tone =
  | "sprout"
  | "stem"
  | "bark0"
  | "bark1"
  | "bark2"
  | "twig"
  | "root"
  | "grass"
  | "leaf0"
  | "leaf1"
  | "leaf2"
  | "leaf3"
  | "leaf4";

export type Cell = { key: string; r: number; c: number; ch: string; tone: Tone };

/** A stable pseudo-random number in [0, 1). */
export function hash(a: number, b: number, salt: number) {
  let x = (a * 73856093) ^ (b * 19349663) ^ (salt * 83492791);
  x = Math.imul(x ^ (x >>> 13), 1274126177);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
}

// ───── The skeleton, in [cols from the trunk, rows above the ground] ─────

type Point = [x: number, y: number];
type Limb = { from: Point; to: Point; level: 1 | 2 | 3; thick?: boolean };
type Clump = [x: number, y: number, ry: number];

const TRUNK = 7; // rows of trunk on the grown tree before it forks

const LIMBS: Limb[] = [
  { from: [-1, 7], to: [-9, 12], level: 1, thick: true },
  { from: [1, 7], to: [10, 12.5], level: 1, thick: true },
  { from: [0, 7], to: [-0.5, 15], level: 1, thick: true },

  { from: [-9, 12], to: [-17, 14.5], level: 2 },
  { from: [-9, 12], to: [-11, 17.5], level: 2 },
  { from: [10, 12.5], to: [18, 14.5], level: 2 },
  { from: [10, 12.5], to: [11, 18], level: 2 },
  { from: [-0.5, 15], to: [-5, 19.5], level: 2 },
  { from: [-0.5, 15], to: [4, 20], level: 2 },

  { from: [-17, 14.5], to: [-23, 15.5], level: 3 },
  { from: [-17, 14.5], to: [-19, 18], level: 3 },
  { from: [-11, 17.5], to: [-15, 20], level: 3 },
  { from: [18, 14.5], to: [24, 15.5], level: 3 },
  { from: [18, 14.5], to: [20, 18], level: 3 },
  { from: [11, 18], to: [15, 20.5], level: 3 },
  { from: [-5, 19.5], to: [-7, 22.5], level: 3 },
  { from: [4, 20], to: [6, 23], level: 3 },
];

/** Leaf clumps for each grown stage, before scaling. ry is in rows; clumps are about twice as wide. */
const SAPLING_CLUMPS: Clump[] = [
  [-9, 12.8, 3.4],
  [10, 13.3, 3.4],
  [-0.5, 16, 4],
];

const YOUNG_CLUMPS: Clump[] = [
  [-17, 15, 2.8],
  [-11, 18, 3.2],
  [18, 15, 2.8],
  [11, 18.5, 3.2],
  [-5, 20, 3.2],
  [4, 20.5, 3.2],
  [0, 16.5, 3.8],
  [-8, 14, 2.8],
  [8, 14.5, 2.8],
];

const GROWN_CLUMPS: Clump[] = [
  [-23, 16, 2.5],
  [-19, 18.8, 3],
  [-14, 21.2, 3.2],
  [-7, 23.2, 3.2],
  [6, 23.4, 3.1],
  [14.5, 21.2, 3.2],
  [20, 18.8, 3],
  [24, 16, 2.5],
  [0, 19.5, 4.4],
  [-10, 16.5, 3.6],
  [10, 16.8, 3.6],
  [-16, 14.6, 2.2],
  [17, 14.6, 2.2],
  [0, 14.5, 2.8],
];

// ───── Drawing ─────

type Mark = { ch: string; tone: Tone };
type Grid = (Mark | null)[][];

const blank = (): Grid => Array.from({ length: ROWS }, () => Array<Mark | null>(COLS).fill(null));
const at = (g: Grid, r: number, c: number) => (r >= 0 && r < ROWS && c >= 0 && c < COLS ? g[r][c] : undefined);
function put(g: Grid, r: number, c: number, ch: string, tone: Tone) {
  if (r >= 0 && r < ROWS && c >= 0 && c < COLS && ch !== " ") g[r][c] = { ch, tone };
}

/** Writes a line of text centred on the trunk, `dy` rows above the ground. */
function text(g: Grid, dy: number, s: string, tone: (i: number, ch: string) => Tone) {
  const start = MID - Math.floor(s.length / 2);
  for (let i = 0; i < s.length; i++) put(g, BASE - dy, start + i, s[i], tone(i, s[i]));
}

/**
 * A limb as ASCII: walk the grid from one end to the other and pick each character from the
 * step that leaves it, so shallow runs read `_/` or `\_` and steep ones read `|`, `/` or `\`.
 */
function line(g: Grid, [x0, y0]: Point, [x1, y1]: Point, tone: Tone, shift = 0) {
  let c = Math.round(MID + x0) + shift;
  let r = Math.round(BASE - y0);
  const c1 = Math.round(MID + x1) + shift;
  const r1 = Math.round(BASE - y1);
  const dc = Math.abs(c1 - c);
  const dr = Math.abs(r1 - r);
  const sc = c < c1 ? 1 : -1;
  const sr = r < r1 ? 1 : -1;
  let err = dc - dr;
  const cells: [number, number][] = [[r, c]];
  while (c !== c1 || r !== r1) {
    const e2 = 2 * err;
    if (e2 > -dr) {
      err -= dr;
      c += sc;
    }
    if (e2 < dc) {
      err += dc;
      r += sr;
    }
    cells.push([r, c]);
  }
  cells.forEach(([cr, cc], i) => {
    const [nr, nc] = cells[Math.min(i + 1, cells.length - 1)];
    const [pr, pc] = cells[Math.max(i - 1, 0)];
    const [tr, tc] = i < cells.length - 1 ? [nr - cr, nc - cc] : [cr - pr, cc - pc];
    const ch = tr === 0 ? "_" : tc === 0 ? "|" : tc > 0 === tr < 0 ? "/" : "\\";
    put(g, cr, cc, ch, tone);
  });
}

const GRAIN = "||:|'|!:";

/** The trunk: bark grain inside, lit on the left and shaded on the right, flaring into roots. */
function trunk(g: Grid, height: number, widths: number[], roots: [string, string]) {
  const widthAt = (dy: number) => widths[Math.min(dy, widths.length - 1)];
  for (let dy = 0; dy <= height; dy++) {
    const w = widthAt(dy);
    const half = Math.floor(w / 2);
    const flare = dy < height && w > widthAt(dy + 1);
    for (let i = -half; i <= half; i++) {
      const edge = i === -half ? (flare ? "/" : "|") : i === half ? (flare ? "\\" : "|") : null;
      const ch = w === 1 ? "|" : (edge ?? GRAIN[Math.floor(hash(i + 40, Math.floor(dy / 2), 9) * GRAIN.length)]);
      const tone: Tone = i < -half / 3 ? "bark0" : i > half / 3 ? "bark2" : "bark1";
      put(g, BASE - dy, MID + i, ch, tone);
    }
  }
  const [left, right] = roots;
  const half = Math.floor(widthAt(0) / 2);
  for (let i = 0; i < left.length; i++) put(g, BASE, MID - half - left.length + i, left[i], "root");
  for (let i = 0; i < right.length; i++) put(g, BASE, MID + half + 1 + i, right[i], "root");
}

/** Leaf characters from shadow to highlight: sparse in the dark, dense where the light falls. */
const RAMP: [Tone, string][] = [
  ["leaf0", ".:,'."],
  ["leaf1", ":;%,"],
  ["leaf2", "%&*%"],
  ["leaf3", "&%@&*"],
  ["leaf4", "&@&*@"],
];

const LIGHT = [-0.52, -0.62, 0.58]; // from the upper left, a little in front

/** Leaves: each clump shaded as a soft ball, with creases where clumps meet and gaps in the shade. */
function crown(g: Grid, clumps: Clump[], s: number, branches: Grid) {
  const scaled = clumps.map(([x, y, ry]) => ({ c: MID + x * s, r: BASE - y * s, ry: ry * s, rx: ry * s * 2.1, depth: 0 }));
  const top = Math.min(...scaled.map((k) => k.r - k.ry));
  const bottom = Math.max(...scaled.map((k) => k.r + k.ry));
  // Clumps near the middle of the crown sit behind the outer ones, so they get less light.
  const cc = scaled.reduce((sum, k) => sum + k.c, 0) / scaled.length;
  const cr = scaled.reduce((sum, k) => sum + k.r, 0) / scaled.length;
  const far = Math.max(...scaled.map((k) => Math.hypot((k.c - cc) / 2.1, k.r - cr)));
  scaled.forEach((k, i) => (k.depth = (Math.hypot((k.c - cc) / 2.1, k.r - cr) / far - 0.6) * 0.22 + (hash(i, 3, 11) - 0.5) * 0.08));

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let d1 = Infinity;
      let d2 = Infinity;
      let near = scaled[0];
      for (const k of scaled) {
        const d = ((c - k.c) / k.rx) ** 2 + ((r - k.r) / k.ry) ** 2;
        if (d < d1) {
          d2 = d1;
          d1 = d;
          near = k;
        } else if (d < d2) d2 = d;
      }
      const n = hash(r, c, 1);
      if (d1 > 1 + (n - 0.5) * 0.45) continue;

      const nx = (c - near.c) / near.rx;
      const ny = (r - near.r) / near.ry;
      const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
      let v = 0.34 + 0.55 * (nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]);
      v -= (1 - nz) * 0.18; // each clump darkens towards its rim
      v += near.depth;
      v += ((bottom - r) / Math.max(1, bottom - top) - 0.5) * 0.22; // the top of the crown catches more light
      v -= Math.max(0, 1 - Math.abs(d1 - d2) * 2.5) * 0.3; // the crease where two clumps meet
      v += (hash(r, c, 4) - 0.5) * 0.16;
      v = Math.min(1, Math.max(0, v));

      const gap = d1 > 0.72 ? n < 0.3 : n < 0.03 + 0.3 * (1 - v) ** 3;
      if (gap) continue;
      // Limbs show through the shaded underside of the crown.
      if (branches[r][c] && v < 0.42) continue;

      const [tone, chars] = RAMP[Math.min(RAMP.length - 1, Math.floor(v * RAMP.length))];
      put(g, r, c, chars[Math.floor(hash(r, c, 2) * chars.length)], tone);
    }
  }
}

function overlay(under: Grid, over: Grid) {
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (over[r][c]) under[r][c] = over[r][c];
}

function cellsOf(g: Grid): Cell[] {
  const out: Cell[] = [];
  g.forEach((row, r) =>
    row.forEach((m, c) => {
      if (m) out.push({ key: `${r}-${c}-${m.ch}-${m.tone}`, r, c, ch: m.ch, tone: m.tone });
    }),
  );
  return out;
}

type Age = { s: number; levels: number; clumps: Clump[]; widths: number[]; roots: [string, string]; grass?: boolean };

function tree({ s, levels, clumps, widths, roots, grass }: Age): Grid {
  const g = blank();
  const wood = blank();
  const height = Math.round(TRUNK * s);
  const scale = ([x, y]: Point): Point => [x * s, y * s];
  for (const limb of LIMBS) {
    if (limb.level > levels) continue;
    const tone: Tone = limb.level === 3 ? "twig" : limb.level === 2 ? "bark1" : "bark0";
    line(wood, scale(limb.from), scale(limb.to), tone);
    if (limb.thick && s > 0.6) line(wood, scale(limb.from), scale([(limb.from[0] + limb.to[0]) / 2, (limb.from[1] + limb.to[1]) / 2]), "bark2", 1);
  }
  overlay(g, wood);
  crown(g, clumps, s, wood);
  trunk(g, height, widths, roots);
  if (grass) {
    for (const [dy, x, tuft] of [
      [0, -17, ".,\\|/,"],
      [0, 13, ",\\/,."],
      [0, -24, "'\"'"],
      [0, 21, "\"|\""],
      [1, -16, "\\/"],
    ] as const) {
      for (let i = 0; i < tuft.length; i++) if (!at(g, BASE - dy, MID + x + i)) put(g, BASE - dy, MID + x + i, tuft[i], "grass");
    }
  }
  return g;
}

function sprout(): Grid {
  const g = blank();
  const rows: [number, string][] = [
    [4, ",-.   .-,"],
    [3, "(   \\ /   )"],
    [2, "`-._|_.-'"],
    [1, "|"],
    [0, ".,;|;,."],
  ];
  for (const [dy, s] of rows) text(g, dy, s, (i, ch) => (ch === "|" ? "stem" : dy === 0 ? "grass" : "sprout"));
  return g;
}

const AGES: Age[] = [
  { s: 0.5, levels: 1, clumps: SAPLING_CLUMPS, widths: [3, 1], roots: ["_", "_"] },
  { s: 0.72, levels: 2, clumps: YOUNG_CLUMPS, widths: [5, 3], roots: ["_.", "._"] },
  { s: 1, levels: 3, clumps: GROWN_CLUMPS, widths: [9, 7, 5], roots: ["__.-'", "'-.__"], grass: true },
];

// ───── Fruit ─────

export type Fruit = { name: string; lab: string; color: string; r: number; c: number };

/** Fruit labels are drawn this much larger than the grid, so they read on a phone. */
export const FRUIT_SCALE = 1.3;

const ANTHROPIC = "#ec8a64";

export const FRUIT: Fruit[] = [
  { name: "opus", lab: "Anthropic", color: ANTHROPIC, r: 2, c: 22 },
  { name: "fable", lab: "Anthropic", color: ANTHROPIC, r: 3, c: 36 },
  { name: "gemini", lab: "Google", color: "#79a8ff", r: 6, c: 11 },
  { name: "gpt", lab: "OpenAI", color: "#ededed", r: 5, c: 28 },
  { name: "sonnet", lab: "Anthropic", color: ANTHROPIC, r: 7, c: 45 },
  { name: "llama", lab: "Meta", color: "#b59cff", r: 9, c: 18 },
  { name: "mistral", lab: "Mistral AI", color: "#ffc04d", r: 10, c: 37 },
  { name: "deepseek", lab: "DeepSeek", color: "#5ccfe6", r: 12, c: 24 },
]

/** How many grid columns a fruit's label covers, at its larger size. */
export const fruitWidth = (f: Fruit) => Math.ceil((f.name.length + 2) * FRUIT_SCALE);

/** The cells a fruit hangs in, one column wider on each side. */
const inPocket = (f: Fruit, cell: { r: number; c: number }) => cell.r === f.r && cell.c >= f.c - 1 && cell.c <= f.c + fruitWidth(f);

// ───── The stages ─────

const GROWN_GRID = tree(AGES[2]);
const BARE = cellsOf(GROWN_GRID);

/** Every stage's cells: the bare wafer, a sprout, a sapling, a young tree, and the grown tree with its fruit. */
export const STAGES: Cell[][] = [
  [],
  cellsOf(sprout()),
  cellsOf(tree(AGES[0])),
  cellsOf(tree(AGES[1])),
  BARE.filter((cell) => !FRUIT.some((f) => inPocket(f, cell))),
];

export const GROWN = STAGES.length - 1;

/** The leaves behind each fruit, grown back in once it is picked. */
export const POCKETS = FRUIT.map((f) => BARE.filter((cell) => inPocket(f, cell)));
