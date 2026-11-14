import type { StaticImageData } from "next/image";

/**
 * The shape of a case study. Both studies fill the same skeleton, so a reader learns it once:
 * title card, the 30-second cut, then the chapters, credits and the next feature.
 */

export type Ratio = "16/9" | "3/2" | "4/3" | "1/1" | "4/5" | "3/4" | "9/16";

/**
 * A slot for an image or a clip.
 * Until `src` is set, the page shows a placeholder that says "This image will come here" and what belongs in it.
 */
export interface Shot {
  /** What goes in this slot. Shown on the placeholder, and used as the alt text unless `alt` is set. */
  label: string;
  /** Placeholder only: where the picture is today, or that it still has to be made. */
  source?: string;
  /** The line under the picture: what to notice. It stays once the picture is in. */
  caption?: string;
  /** "video" for a short loop. Defaults to "image". */
  kind?: "image" | "video";
  /** The slot's proportions. Set it to match the picture you drop in. Defaults to 16/9. */
  ratio?: Ratio;
  /**
   * The picture: a path under `public/` (for example "/work/pickup-in-store/cart.png")
   * or an imported image. A video must be a path.
   */
  src?: string | StaticImageData;
  alt?: string;
  /** A still for a video, shown before it plays. A path under `public/`. */
  poster?: string;
}

export interface Stat {
  value: string;
  label: string;
  /** Colours the number and adds an arrow: "up" for a gain, "down" for a loss. */
  tone?: "up" | "down";
}

/** One explored direction, with the reason it stayed or went. */
export interface Option {
  name: string;
  /** What worked. */
  pro: string;
  /** What ruled it out. */
  con?: string;
  verdict: { text: string; tone: "cut" | "shipped" };
  shot: Shot;
}

/** One side of a before-and-after. */
export interface Side {
  tag: string;
  title: string;
  body: string;
  shot: Shot;
}

/** A decision or a screen: what it is, why, and the picture that shows it. */
export interface Scene {
  title: string;
  body: string[];
  shots: Shot[];
}

export interface FlowStep {
  text: string;
  /** A second, quieter line. */
  note?: string;
  /** Highlights the step. */
  focus?: boolean;
  /** The column the step starts in, when rows need to line up in time. Otherwise steps follow one another. */
  col?: number;
}

/** A row of steps, drawn like a track on the home page's timeline. */
export interface FlowRow {
  label: string;
  layer: "work" | "co" | "exp";
  steps: FlowStep[];
}

export type Block =
  | { type: "text"; body: string[] }
  | { type: "subhead"; text: string }
  | { type: "shot"; shot: Shot }
  /** Two or three findings, each with its proof. */
  | { type: "points"; items: Array<{ title: string; body: string }> }
  /** Short labelled lists, side by side. */
  | { type: "lists"; items: Array<{ label: string; items: string[] }> }
  /** Labelled one-liners: what each competitor taught, what each customer said. */
  | { type: "notes"; label?: string; items: Array<{ term: string; body: string }> }
  /** A single line to carry away, with a small label above it. */
  | { type: "takeaway"; label: string; line: string }
  | { type: "options"; items: Option[] }
  | { type: "flow"; rows: FlowRow[]; caption?: string }
  /** How a test divided its audience, drawn to scale: `share` is a percentage. */
  | { type: "split"; parts: Array<{ label: string; share: number; note?: string; focus?: boolean }>; caption?: string }
  | { type: "versus"; sides: [Side, Side] }
  | { type: "scenes"; items: Scene[] }
  | { type: "stats"; items: Stat[] }
  /** The turning point, set like a film intertitle. Use it once per study. */
  | { type: "intertitle"; label: string; line: string; sub?: string }
  | { type: "lessons"; items: Array<{ title: string; body: string }> }
  /** Something only you can add. Shown as a dashed note so it can't be mistaken for finished copy. */
  | { type: "todo"; text: string };

export interface Chapter {
  /** The anchor, unique within the study. */
  id: string;
  /** The small line above the heading, and the name in the chapter list. */
  label: string;
  /** The heading: a statement, not a label. */
  title: string;
  blocks: Block[];
}

export interface CaseStudy {
  slug: string;
  /** The matching entry in lib/career.ts. Its dates fill the timeline, so they are edited in one place. */
  workId: string;
  /** The short name: page header, chapter anchors, next-feature card. */
  name: string;
  company: string;
  meta: { title: string; description: string };
  /** The headline, in two halves: what it was, then what it achieved. */
  title: string;
  outcome: string;
  lede: string;
  /** Two or three headline numbers. */
  stats: Stat[];
  /** Role, team, platform, status. The timeline is added from lib/career.ts. */
  facts: Array<{ label: string; value: string }>;
  /** The shipped design. It sits beside the headline, in the first screen. */
  hero: Shot;
  /** The 30-second cut: the whole story in four short answers. */
  cut30: Array<{ label: string; body: string }>;
  chapters: Chapter[];
  credits: Array<{ role: string; name: string }>;
}
