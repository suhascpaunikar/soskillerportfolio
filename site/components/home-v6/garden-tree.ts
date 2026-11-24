/**
 * The garden's tree, drawn as characters on a 63 × 28 grid and worked out once at load.
 * Deterministic, so the server and the browser draw the same tree.
 *
 * Shaped like an umbrella tree: a long straight trunk forks into a narrow Y, the forks fan out
 * into branches, and the branches hold up a domed crown whose edges droop. Each grown stage is
 * the same tree at a different age, scaled from the root.
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

/** Smooth noise in [0, 1): hashed values on a lattice, blended between lattice points. */
function noise(x: number, y: number, salt: number) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const sx = (x - x0) ** 2 * (3 - 2 * (x - x0));
  const sy = (y - y0) ** 2 * (3 - 2 * (y - y0));
  const upper = hash(x0, y0, salt) * (1 - sx) + hash(x0 + 1, y0, salt) * sx;
  const lower = hash(x0, y0 + 1, salt) * (1 - sx) + hash(x0 + 1, y0 + 1, salt) * sx;
  return upper * (1 - sy) + lower * sy;
}

// ───── The shape, in [cols from the trunk, rows above the ground] ─────

type Point = [x: number, y: number];
type Limb = { from: Point; to: Point; level: 1 | 2 | 3 };

const TRUNK = 9; // rows of straight trunk before the fork

/**
 * The crown is the shell between two half-ellipses with one centre: the outer one is the top of
 * the dome and the inner one its underside. Beyond the ends of the inner one the shell hangs
 * down at the sides, like the edge of an umbrella.
 */
const DOME = { y: 15.5, a: 31, b: 11, a2: 22.5, b2: 4.2 };

const LIMBS: Limb[] = [
  // The fork: two arms rising almost side by side.
  { from: [-1, 9.5], to: [-3, 15.5], level: 1 },
  { from: [1, 9.5], to: [3, 15.5], level: 1 },

  // Long low branches out towards the drooping edges.
  { from: [-1.8, 12.3], to: [-13, 15.5], level: 2 },
  { from: [1.8, 12.3], to: [13.5, 15.8], level: 2 },
  // Each arm fans in two.
  { from: [-3, 15.5], to: [-9.5, 19.6], level: 2 },
  { from: [-3, 15.5], to: [-3.5, 20.5], level: 2 },
  { from: [3, 15.5], to: [10, 19.4], level: 2 },
  { from: [3, 15.5], to: [3, 20.6], level: 2 },

  // Twigs up into the underside of the crown.
  { from: [-13, 15.5], to: [-22, 18], level: 3 },
  { from: [-13, 15.5], to: [-19, 19.9], level: 3 },
  { from: [-9.5, 19.6], to: [-16, 20.8], level: 3 },
  { from: [-9.5, 19.6], to: [-11, 21.6], level: 3 },
  { from: [-3.5, 20.5], to: [-7, 22.2], level: 3 },
  { from: [-3.5, 20.5], to: [-1, 22.6], level: 3 },
  { from: [13.5, 15.8], to: [22.5, 18.2], level: 3 },
  { from: [13.5, 15.8], to: [19.5, 19.7], level: 3 },
  { from: [10, 19.4], to: [16.5, 20.7], level: 3 },
  { from: [10, 19.4], to: [11.5, 21.5], level: 3 },
  { from: [3, 20.6], to: [7.5, 22.1], level: 3 },
  { from: [3, 20.6], to: [1, 22.6], level: 3 },
  // Finer twigs off the branches, into the crown and its drooping edges.
  { from: [-7.4, 13.9], to: [-14, 21], level: 3 },
  { from: [7.6, 14], to: [14.5, 20.9], level: 3 },
  { from: [-17.5, 16.7], to: [-26, 18.8], level: 3 },
  { from: [18, 17], to: [26.5, 19], level: 3 },
  { from: [-16, 17.7], to: [-21, 20.3], level: 3 },
  { from: [16.5, 17.75], to: [21.5, 20.2], level: 3 },
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
 * A limb as ASCII. Steep stretches step one character per row (`|`, `/`, `\`). Shallow ones
 * curve along each row the way hand-drawn ASCII does: `.-'` rising to the right, `'-.` rising
 * to the left, so a long low branch reads as a thin slanted line rather than a ledge.
 */
function line(g: Grid, [x0, y0]: Point, [x1, y1]: Point, tone: Tone) {
  let c = Math.round(MID + x0);
  let r = Math.round(BASE - y0);
  const c1 = Math.round(MID + x1);
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
  // Group the cells into runs along each row.
  const runs: [number, number][][] = [];
  for (const cell of cells) {
    const last = runs[runs.length - 1];
    if (last && last[0][0] === cell[0]) last.push(cell);
    else runs.push([cell]);
  }
  const rising = r1 < Math.round(BASE - y0) ? sc : 0; // +1 rising to the right, -1 to the left
  for (const run of runs) {
    const cols = run.map(([, cc]) => cc).sort((p, q) => p - q);
    const row = run[0][0];
    if (cols.length === 1) {
      put(g, row, cols[0], dc === 0 || dr > dc * 2.5 ? "|" : sc > 0 ? "/" : "\\", tone);
      continue;
    }
    cols.forEach((cc, i) => {
      const low = rising > 0 ? i === 0 : i === cols.length - 1;
      const high = rising > 0 ? i === cols.length - 1 : i === 0;
      put(g, row, cc, rising === 0 ? "-" : low ? "." : high ? "'" : "-", tone);
    });
  }
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

const LIGHT = [-0.52, 0.62, 0.58]; // from the upper left, a little in front (y points up)

/**
 * Leaves: the domed shell, lit from the upper left. The top of the dome is brightest and the
 * underside darkest, soft noise breaks it into clumps, and the edges and underside are ragged.
 */
function dome(g: Grid, s: number, branches: Grid) {
  const cy = DOME.y * s;
  const a = DOME.a * s;
  const b = DOME.b * s;
  // The shell thins more slowly than the tree shrinks, so a young crown still looks full.
  const a2 = a - (DOME.a - DOME.a2) * Math.sqrt(s);
  const b2 = b - (DOME.b - DOME.b2) * Math.sqrt(s);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = c - MID;
      const y = BASE - r;
      const n = hash(r, c, 1);
      const outer = (x / a) ** 2 + ((y - cy) / b) ** 2;
      // A smooth top to the dome, more ragged further down its sides.
      const rough = y > cy + b * 0.55 ? 0.16 : 0.4;
      if (outer > 1 + (noise(c / 2.2, r / 1.1, 5) - 0.5) * rough) continue;
      // The drooping edges end raggedly a little above the centre line.
      if (y < cy + 0.9 * s - noise(c / 1.7, 3, 6) * 1.6 * s) continue;
      // Under the inner arc there are only a few stray leaves, thinning out with distance.
      const inner = (x / a2) ** 2 + ((y - cy) / b2) ** 2;
      if (inner < 1 && (inner < 0.7 || n > ((inner - 0.7) / 0.3) * 0.3)) continue;

      // How far up through the shell this cell sits: 0 on the underside, 1 on top.
      const under = Math.abs(x) < a2 ? cy + b2 * Math.sqrt(1 - (x / a2) ** 2) : cy;
      const over = cy + b * Math.sqrt(Math.max(0, 1 - (x / a) ** 2));
      const u = Math.min(1, Math.max(0, (y - under) / Math.max(0.5, over - under)));
      const nx = x / a;
      const ny = (y - cy) / b;
      const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
      let v = 0.14 + 0.34 * (nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]) + 0.48 * u;
      v += (noise(c / 3.4, r / 1.7, 7) - 0.5) * 0.42; // clumps of foliage
      v += (hash(r, c, 4) - 0.5) * 0.14;
      v = Math.min(1, Math.max(0, v));

      const gap = outer > 0.88 ? n < 0.12 : n < 0.02 + 0.22 * (1 - v) ** 3;
      if (gap) continue;
      // Branches show through the shaded underside.
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

type Age = { s: number; levels: number; widths: number[]; roots: [string, string]; grass?: boolean };

function tree({ s, levels, widths, roots, grass }: Age): Grid {
  const g = blank();
  const wood = blank();
  const height = Math.round(TRUNK * s);
  const scale = ([x, y]: Point): Point => [x * s, y * s];
  for (const limb of LIMBS) {
    if (limb.level > levels) continue;
    const tone: Tone = limb.level === 3 ? "twig" : limb.level === 2 ? "bark1" : "bark0";
    line(wood, scale(limb.from), scale(limb.to), tone);
  }
  overlay(g, wood);
  dome(g, s, wood);
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
  { s: 0.5, levels: 1, widths: [1], roots: ["_", "_"] },
  { s: 0.75, levels: 2, widths: [3, 1], roots: ["_.", "._"] },
  { s: 1, levels: 3, widths: [7, 5, 3], roots: ["__.-'", "'-.__"], grass: true },
]

// ───── Fruit ─────

export type Fruit = { name: string; lab: string; color: string; r: number; c: number };

/** Fruit labels are drawn this much larger than the grid, so they read on a phone. */
export const FRUIT_SCALE = 1.3;

const ANTHROPIC = "#ec8a64";

export const FRUIT: Fruit[] = [
  { name: "opus", lab: "Anthropic", color: ANTHROPIC, r: 4, c: 14 },
  { name: "fable", lab: "Anthropic", color: ANTHROPIC, r: 3, c: 26 },
  { name: "gemini", lab: "Google", color: "#79a8ff", r: 6, c: 6 },
  { name: "gpt", lab: "OpenAI", color: "#ededed", r: 4, c: 41 },
  { name: "sonnet", lab: "Anthropic", color: ANTHROPIC, r: 6, c: 46 },
  { name: "llama", lab: "Meta", color: "#b59cff", r: 8, c: 2 },
  { name: "mistral", lab: "Mistral AI", color: "#ffc04d", r: 8, c: 50 },
  { name: "deepseek", lab: "DeepSeek", color: "#5ccfe6", r: 5, c: 24 },
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
