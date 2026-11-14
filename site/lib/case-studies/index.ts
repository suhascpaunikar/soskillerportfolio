import { INTRO, START_YEAR, work } from "@/lib/career";

import { measurements } from "./ai-progressive-measurements";
import { pickup } from "./pickup-in-store";
import type { CaseStudy } from "./types";

export type { Block, CaseStudy, Chapter, FlowRow, Option, Ratio, Scene, Shot, Side, Stat } from "./types";
export { measurements, pickup };

/** In running order: each study's "Next feature" card points at the one after it. */
export const caseStudies: CaseStudy[] = [pickup, measurements];

export const nextStudy = (study: CaseStudy) => caseStudies[(caseStudies.indexOf(study) + 1) % caseStudies.length];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** A timeline position (see lib/career.ts) as a month and a year. */
function monthAt(pos: number) {
  const m = Math.floor(pos) - INTRO;
  return { month: MONTHS[((m % 12) + 12) % 12], year: START_YEAR + Math.floor(m / 12) };
}

/** The study's dates, read from its clip in lib/career.ts: "≈ Feb – Jul 2024". The ≈ stays until the clip's dates are confirmed. */
export function timelineOf(study: CaseStudy): string | null {
  const clip = work.find((w) => w.id === study.workId);
  if (!clip) return null;
  const from = monthAt(clip.s);
  const to = monthAt(clip.e - 1);
  const start = from.year === to.year ? from.month : `${from.month} ${from.year}`;
  return `${clip.approx ? "≈ " : ""}${start} – ${to.month} ${to.year}`;
}

/** Keeps number ranges ("10–12%"), "23 in 100", "+20 NPS" and "5 pm" from splitting across two lines. */
const noBreak = (text: string) =>
  text
    .replace(/(\d)–(\d)/g, "$1\u2060–\u2060$2")
    .replace(/(\d+) in (\d+)/g, "$1\u00a0in\u00a0$2")
    .replace(/(\d) (pm|am|NPS)\b/g, "$1\u00a0$2");

/** Keys whose values are settings, paths or anchors, never copy. `meta` (the browser tab and link previews) stays as written. */
const NOT_TEXT = new Set(["slug", "workId", "id", "type", "ratio", "kind", "src", "poster", "tone", "layer", "meta"]);

/** A copy of a study with its text typeset for the page. The content files stay plain, with no invisible characters to trip over. */
export function typeset<T>(value: T): T {
  if (typeof value === "string") return noBreak(value) as T;
  if (Array.isArray(value)) return value.map((item) => typeset(item)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, NOT_TEXT.has(key) ? item : typeset(item)])) as T;
  }
  return value;
}

/** Keys that hold settings or placeholder notes, not copy a visitor reads. */
const NOT_COPY = new Set(["type", "id", "ratio", "kind", "src", "poster", "alt", "tone", "source", "col", "focus", "layer", "label"]);

function countWords(value: unknown): number {
  if (typeof value === "string") return value.split(/\s+/).filter(Boolean).length;
  if (Array.isArray(value)) return value.reduce<number>((n, item) => n + countWords(item), 0);
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (record.type === "todo") return 0;
    return Object.entries(record).reduce((n, [key, item]) => (NOT_COPY.has(key) ? n : n + countWords(item)), 0);
  }
  return 0;
}

/** Words of running copy in a study: headline, the 30-second cut and the chapters. Placeholder labels and notes to self don't count. */
export const wordCount = (study: CaseStudy) => countWords([study.title, study.outcome, study.lede, study.cut30, study.chapters]);

/** Reading time in minutes, at about 220 words a minute. */
export const readingMinutes = (study: CaseStudy) => Math.max(1, Math.round(wordCount(study) / 220));
