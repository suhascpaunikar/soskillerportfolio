import type { CSSProperties } from "react";

import { INTRO, SPAN_MONTHS, YEARS, at, monthLabel } from "@/lib/career";

/** A still chrome rim around each clip (a static gradient, not the liquid-metal shader). */
const RIM =
  "conic-gradient(from 210deg at 50% 50%, #f4f4f6 0deg, #77777f 45deg, #e8e8ee 95deg, #2c2c32 150deg, #ffe1e1 185deg, #c9d3ff 215deg, #3a3a42 265deg, #ededf2 320deg, #f4f4f6 360deg)";

const body = (top: string, bottom: string, rim: string = RIM) => `linear-gradient(180deg, ${top} 0%, ${bottom} 100%) padding-box, ${rim} border-box`;

export type Layer = "exp" | "work" | "co";

/**
 * Two treatments per layer, told apart by colour and contrast rather than effects:
 * the main clips (case studies, their company, the experiments) are light and vivid with dark text;
 * the rest are muted, darker shades of the layer colour with softer text.
 */
const LAYER = {
  exp: { muted: body("#3a2a66", "#2c1f52"), mutedInk: "#cbbcf2", main: body("#cdbbff", "#a98cf8"), mainInk: "#170c33" },
  work: { muted: body("#2b3068", "#20244f"), mutedInk: "#b4b9e6", main: body("#b3bcff", "#8a97f8"), mainInk: "#0e1238" },
  co: { muted: body("#1f4a35", "#163626"), mutedInk: "#a6d4bb", main: body("#86e8b4", "#52cb8c"), mainInk: "#052415" },
} as const;

export const CLIP_SHADOW = "inset 0 1px 0 rgba(255,255,255,0.25), 0 2px 6px rgba(0,0,0,0.5)";

/** Classes every clip shares: the rim border, white label text with a soft shadow, and a focus ring. */
export const CLIP_CLASS =
  "clip absolute box-border flex items-center overflow-hidden border-[1.5px] border-transparent text-left text-white no-underline [text-shadow:0_1px_1px_rgba(0,0,0,0.55)] outline-offset-2 focus-visible:outline-2 focus-visible:outline-playhead";

/** A clip's fill, text colour and shadow. The clip under the playhead also gets a yellow ring in the playhead's colour. */
export function clipStyle(layer: Layer, { focus = false, live = false }: { focus?: boolean; live?: boolean } = {}): CSSProperties {
  const c = LAYER[layer];
  return {
    background: focus ? c.main : c.muted,
    color: focus ? c.mainInk : c.mutedInk,
    textShadow: focus ? "none" : undefined,
    boxShadow: live ? `0 0 0 2px var(--color-playhead), ${CLIP_SHADOW}` : CLIP_SHADOW,
  };
}

export const INTRO_STYLE = (live: boolean): CSSProperties => ({
  background: body("#ffffff", "#d9d5cb"),
  boxShadow: live ? `0 0 0 2px var(--color-playhead), ${CLIP_SHADOW}` : CLIP_SHADOW,
});

export const LANE_BG = {
  exp: { background: "rgba(143,92,240,0.07)", boxShadow: "inset 0 2px 6px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(143,92,240,0.22)" },
  work: { background: "rgba(90,102,224,0.07)", boxShadow: "inset 0 2px 6px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(90,102,224,0.22)" },
  co: { background: "rgba(47,163,107,0.07)", boxShadow: "inset 0 2px 6px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(47,163,107,0.22)" },
} as const;

/** The playhead's flag, 14×16, pointing down onto the timeline. */
export const PLAYHEAD_FLAG = "M1 1h12v8l-6 6-6-6z";

export interface RulerMarks {
  ticks: Array<{ at: number; major: boolean }>;
  labels: Array<{ at: number; text: string; minor: boolean }>;
}

/**
 * Ruler ticks and labels for a zoom level, given in pixels per month: a tall tick and the year each
 * January, then quarter ticks, then month ticks, with month names once there is room for them.
 * Positions are in timeline months.
 */
export function rulerMarks(pxPerMonth: number): RulerMarks {
  const tickStep = pxPerMonth >= 10 ? 1 : 3;
  const labelStep = pxPerMonth >= 32 ? 1 : pxPerMonth >= 16 ? 3 : 0;
  const ticks: RulerMarks["ticks"] = [{ at: 0, major: true }];
  const labels: RulerMarks["labels"] = [{ at: 0, text: "INTRO", minor: false }, ...YEARS.map((y) => ({ at: at(y, 1), text: String(y), minor: false }))];
  for (let m = 0; m < SPAN_MONTHS; m += tickStep) {
    ticks.push({ at: INTRO + m, major: m % 12 === 0 });
    if (labelStep && m % 12 !== 0 && m % labelStep === 0) labels.push({ at: INTRO + m, text: monthLabel(INTRO + m).slice(0, 3), minor: true });
  }
  return { ticks, labels };
}
