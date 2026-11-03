"use client";

import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { Suite } from "./edit-suite";

/** The one action for whatever is in the monitor: play the reel, read the case study, open the clip's page, or ask about it. */
export function Cta({ suite, phone = false }: { suite: Suite; phone?: boolean }) {
  const { frame, hidden } = suite;
  const work = hidden.work ? null : frame.work;
  const size = phone ? "lg" : "default";

  if (frame.isIntro && !phone) {
    return (
      <Button size={size} onClick={suite.togglePlay}>
        <Play className="size-3 fill-current" aria-hidden="true" />
        Play the reel
      </Button>
    );
  }
  if (work?.href) {
    return (
      <Link href={work.href} className={buttonVariants({ variant: work.caseStudy ? "accent" : "default", size, className: phone && !work.caseStudy ? "text-playhead" : undefined })}>
        {work.cta}
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </Link>
    );
  }
  if (work) {
    return (
      <Button size={size} onClick={suite.openExport}>
        {phone ? "Ask me about it" : "No case study yet · ask me about it"}
      </Button>
    );
  }
  return (
    <span className={cn(buttonVariants({ size }), "pointer-events-none cursor-default text-muted-foreground opacity-70")}>
      {frame.isIntro ? (phone ? "Swipe or pinch the timeline" : "Swipe the timeline") : phone ? "Swipe to the next clip" : "Keep scrubbing"}
    </span>
  );
}
