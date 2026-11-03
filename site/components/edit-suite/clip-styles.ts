import type { CSSProperties } from "react";

import { INTRO, SPAN_MONTHS, YEARS, at, monthLabel } from "@/lib/career";

/** A still chrome rim around each clip (a static gradient, not the liquid-metal shader). */
const RIM =
  "conic-gradient(from 210deg at 50% 50%, #f4f4f6 0deg, #77777f 45deg, #e8e8ee 95deg, #2c2c32 150deg, #ffe1e1 185deg, #c9d3ff 215deg, #3a3a42 265deg, #ededf2 320deg, #f4f4f6 360deg)";

const body = (top: string, bottom: string) => `linear-gradient(180deg, ${top} 0%, ${bottom} 100%) padding-box, ${RIM} border-box`;

export type Layer = "exp" | "work" | "co";

const LAYER = {
  exp: { fill: body("#7b45d9", "#4a1f96"), focus: body("#9a66ff", "#5a2cbc"), glow: "rgba(154,102,255,0.5)" },
  work: { fill: body("#4954c8", "#252e84"), focus: body("#6b78f5", "#3442b4"), glow: "rgba(107,120,245,0.5)" },
  co: { fill: body("#25905d", "#125235"), focus: body("#36b878", "#18704a"), glow: "rgba(54,184,120,0.45)" },
} as const;

export const CLIP_SHADOW = "inset 0 1px 0 rgba(255,255,255,0.25), 0 2px 6px rgba(0,0,0,0.5)";

/** Classes every clip shares: the rim border, white label text with a soft shadow, and a focus ring. */
export const CLIP_CLASS =
  "clip absolute box-border flex items-center overflow-hidden border-[1.5px] border-transparent text-left text-white no-underline [text-shadow:0_1px_1px_rgba(0,0,0,0.55)] outline-offset-2 focus-visible:outline-2 focus-visible:outline-playhead";

/**
 * A clip's fill and shadow. Highlighted clips (the case studies, their company, the experiments) get a
 * brighter fill and a glow; the clip under the playhead gets a yellow ring in the playhead's colour.
 */
export function clipStyle(layer: Layer, { focus = false, live = false }: { focus?: boolean; live?: boolean } = {}): CSSProperties {
  const c = LAYER[layer];
  const shadows = [live ? "0 0 0 2px var(--color-playhead)" : null, focus ? `0 0 14px ${c.glow}` : null, CLIP_SHADOW].filter(Boolean);
  return { background: focus ? c.focus : c.fill, boxShadow: shadows.join(", ") };
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

/** A fake audio waveform drawn on the company clips. */
export const WAVE = (() => {
  let d = "";
  for (let i = 1; i < 200; i += 2.5) {
    const a = Math.abs(Math.sin(i * 0.37) * 0.55 + Math.sin(i * 0.13 + 1.3) * 0.45);
    const h = 1 + a * 7.5;
    d += `M${i.toFixed(1)} ${(10 - h).toFixed(1)}V${(10 + h).toFixed(1)}`;
  }
  return d;
})();

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
