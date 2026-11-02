import { CHROME } from "@/components/ui/liquid-metal";
import { INTRO, YEARS, at, type Span } from "@/lib/career";

/** Coloured clip bodies with a thin chrome rim, per layer. */
const metalBody = (top: string, bottom: string) => `linear-gradient(180deg, ${top} 0%, ${bottom} 100%) padding-box, ${CHROME} border-box`;

export const CLIP_BG = {
  exp: metalBody("#7b45d9", "#4a1f96"),
  work: metalBody("#4954c8", "#252e84"),
  co: metalBody("#25905d", "#125235"),
  intro: metalBody("#ffffff", "#d9d5cb"),
} as const;

export const CLIP_SHADOW = "inset 0 1px 0 rgba(255,255,255,0.25), 0 2px 6px rgba(0,0,0,0.5)";

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

/** Ruler ticks: a tall one each January, short ones each quarter. Positions are in timeline months. */
export const TICKS = [
  { at: 0, major: true },
  ...Array.from({ length: Math.ceil(95 / 3) }, (_, i) => ({ at: INTRO + i * 3, major: (i * 3) % 12 === 0 })),
];

export const RULER_LABELS = [{ at: 0, text: "INTRO" }, ...YEARS.map((y) => ({ at: at(y, 1), text: String(y) }))];

/**
 * Where the liquid ring sits in a lane: around the live clip, or, when nothing in the lane is live,
 * faded out over the last clip that started so it doesn't jump around.
 */
export function ringAnchor<T extends Span>(clips: T[], live: T | null, pos: number): { clip: T; visible: boolean } {
  if (live) return { clip: live, visible: true };
  const previous = [...clips].reverse().find((c) => c.s <= pos);
  return { clip: previous ?? clips[0], visible: false };
}
