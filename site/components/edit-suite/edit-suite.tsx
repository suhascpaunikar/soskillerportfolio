"use client";

import { useCallback, useEffect, useState } from "react";

import { useMediaQuery, usePrefersReducedMotion } from "@/hooks/use-media-query";
import { EMAIL, TOTAL, clamp, frameAt, nextStart, prevStart, type Frame } from "@/lib/career";

import { DesktopSuite } from "./desktop-suite";
import { ExportDialog } from "./export-dialog";
import { PhoneSuite } from "./phone-suite";

export type LayerKey = "exp" | "work" | "co";
export type Layers = Record<LayerKey, boolean>;

export interface Suite {
  pos: number;
  frame: Frame;
  /** True while the reel plays. */
  running: boolean;
  /** Cross-dissolve length in ms; 0 (hard cuts) when the visitor prefers reduced motion. */
  fade: number;
  hidden: Layers;
  copied: boolean;
  /** Move the playhead and stop playback (clicks, keys, the scrubber). */
  jump: (pos: number) => void;
  /** Move the playhead without touching playback (the phone timeline's scroll). */
  seek: (pos: number) => void;
  pause: () => void;
  togglePlay: () => void;
  prev: () => void;
  next: () => void;
  toggleLayer: (key: LayerKey) => void;
  copyEmail: () => void;
  openExport: () => void;
}

const FRAME_MS = 200;

export function EditSuite() {
  const reduced = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)", null);
  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hidden, setHidden] = useState<Layers>({ exp: false, work: false, co: false });
  const [copied, setCopied] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const running = playing && pos < TOTAL;
  const fade = reduced ? 0 : 500;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setPos((p) => Math.min(TOTAL, p + 1)), FRAME_MS);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  const jump = useCallback((v: number) => {
    setPlaying(false);
    setPos(clamp(Math.round(v)));
  }, []);

  const seek = useCallback((v: number) => setPos(clamp(Math.round(v))), []);
  const pause = useCallback(() => setPlaying(false), []);

  const togglePlay = useCallback(() => {
    if (running) {
      setPlaying(false);
      return;
    }
    if (pos >= TOTAL) setPos(0);
    setPlaying(true);
  }, [running, pos]);

  const copyEmail = useCallback(() => {
    navigator.clipboard?.writeText(EMAIL).catch(() => undefined);
    setCopied(true);
  }, []);

  const suite: Suite = {
    pos,
    frame: frameAt(pos),
    running,
    fade,
    hidden,
    copied,
    jump,
    seek,
    pause,
    togglePlay,
    prev: () => jump(prevStart(pos)),
    next: () => jump(nextStart(pos)),
    toggleLayer: (key) => setHidden((h) => ({ ...h, [key]: !h[key] })),
    copyEmail,
    openExport: () => setExportOpen(true),
  };

  // Before hydration both layouts render and CSS picks one; afterwards only the visible one stays mounted.
  return (
    <>
      {isDesktop !== false && <DesktopSuite suite={suite} className={isDesktop === null ? "hidden lg:flex" : "flex"} />}
      {isDesktop !== true && <PhoneSuite suite={suite} className={isDesktop === null ? "lg:hidden" : undefined} />}
      <ExportDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        copied={copied}
        onCopy={copyEmail}
        variant={isDesktop === false ? "sheet" : "center"}
      />
    </>
  );
}
