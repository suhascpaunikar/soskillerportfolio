/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
 * Timeline styling ported from the Diffusion Studio editor's timeline engine
 * (https://github.com/diffusionstudio/editor, apps/web/src/engine/timeline:
 * config.ts, constants.ts, paths.ts). Their timeline draws on a canvas; these are
 * the same sizes, colours and shapes for the DOM timeline here.
 */

import type { CSSProperties } from "react";

import { INTRO, YEARS, at } from "@/lib/career";

/** Diffusion Studio: RULER_HEIGHT, RULER_TICK_HEIGHT_MAJOR / MINOR, CLIP_CORNER_RADIUS, DEFAULT_CLIP_HEIGHT. */
export const RULER_HEIGHT = 36;
export const TICK_MAJOR = 9;
export const TICK_MINOR = 3;
export const CLIP_RADIUS = 4;
export const CLIP_HEIGHT = 40;

/** The playhead knob that sits in the ruler (Diffusion Studio's KNOB_PATH, 10×13). */
export const KNOB_PATH =
  "M6.47987 12.372C5.68637 13.2449 4.31359 13.2449 3.52004 12.372L0.520121 9.07213C0.185444 8.70399 0 8.22432 0 7.72679L0 2C0 0.89543 0.895431 0 2 0L7.99987 0C9.10449 0 9.99994 0.895511 9.99987 2.00013L9.99949 7.72692C9.99946 8.22437 9.81405 8.70396 9.47945 9.07206L6.47987 12.372Z";

export type Layer = "exp" | "work" | "co";

/** Clip fill, highlighted fill and label colour per layer, from Diffusion Studio's COLORS.clip. */
const LAYER = {
  exp: { fill: "var(--color-exp-clip)", focus: "var(--color-exp-focus)", ink: "var(--color-exp-ink)", wave: "#b9a3ff" },
  work: { fill: "var(--color-work-clip)", focus: "var(--color-work-focus)", ink: "var(--color-work-ink)", wave: "#70a7ff" },
  co: { fill: "var(--color-co-clip)", focus: "var(--color-co-focus)", ink: "var(--color-co-ink)", wave: "#0dbf8a" },
} as const;

export const waveColor = (layer: Layer) => LAYER[layer].wave;

/**
 * A clip's colours. A highlighted clip (a case study, its company, or an experiment)
 * gets a brighter fill and a light inner edge; the clip under the playhead gets the
 * blue selection ring Diffusion Studio uses for selected clips.
 */
export function clipStyle(layer: Layer, { focus = false, live = false }: { focus?: boolean; live?: boolean } = {}): CSSProperties {
  const c = LAYER[layer];
  const edges = [focus ? `inset 0 0 0 1px color-mix(in srgb, ${c.ink} 55%, transparent)` : null, live ? "0 0 0 2px var(--color-select)" : null].filter(Boolean);
  return {
    background: focus ? c.focus : c.fill,
    color: c.ink,
    borderRadius: CLIP_RADIUS,
    boxShadow: edges.length ? edges.join(", ") : undefined,
  };
}

export const INTRO_STYLE = (live: boolean): CSSProperties => ({
  background: "#edf0f3",
  color: "#141416",
  borderRadius: CLIP_RADIUS,
  boxShadow: live ? "0 0 0 2px var(--color-select)" : undefined,
});

/** A fake audio waveform for the company clips. */
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
