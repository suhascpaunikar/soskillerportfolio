"use client";

import { Play } from "lucide-react";
import Link from "next/link";

import { MetalShell, metalFill, metalInner } from "@/components/ui/liquid-metal";
import { cn } from "@/lib/utils";

import type { Suite } from "./edit-suite";

/** The one action for whatever is in the monitor: play the reel, open the clip's page, or ask about it. */
export function Cta({ suite, phone = false }: { suite: Suite; phone?: boolean }) {
  const { frame, hidden } = suite;
  const work = hidden.work ? null : frame.work;
  const accent = phone ? "text-playhead" : undefined;

  return (
    <MetalShell live className={cn(!work && !frame.isIntro && "opacity-70")}>
      {(metal) => {
        const handlers = { onMouseEnter: metal.hover, onMouseLeave: metal.leave };
        if (frame.isIntro && !phone) {
          return (
            <button
              type="button"
              {...handlers}
              onClick={() => {
                metal.kick();
                suite.togglePlay();
              }}
              className={cn(metalInner, "cursor-pointer")}
              style={metalFill}
            >
              <Play className="size-3 fill-current" aria-hidden="true" />
              Play the reel
            </button>
          );
        }
        if (work?.href) {
          return (
            <Link href={work.href} {...handlers} onClick={metal.kick} className={cn(metalInner, phone && "h-[42px] px-4 text-sm font-semibold", accent)} style={metalFill}>
              {work.cta} →
            </Link>
          );
        }
        if (work) {
          return (
            <button
              type="button"
              {...handlers}
              onClick={() => {
                metal.kick();
                suite.openExport();
              }}
              className={cn(metalInner, "cursor-pointer", phone && "h-[42px] px-4 text-sm font-semibold")}
              style={metalFill}
            >
              {phone ? "Ask me about it" : "No case study yet · ask me about it"}
            </button>
          );
        }
        return (
          <span className={cn(metalInner, "text-muted-foreground", phone && "h-[42px] px-4")} style={metalFill}>
            {frame.isIntro ? "Swipe the timeline" : phone ? "Swipe to the next clip" : "Keep scrubbing"}
          </span>
        );
      }}
    </MetalShell>
  );
}
