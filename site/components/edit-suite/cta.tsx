"use client";

import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { Icon } from "@/components/ui/ds-icon";
import { cn } from "@/lib/utils";

import type { Suite } from "./edit-suite";

/** The one action for whatever is in the monitor: play the reel, read the case study, open the clip's page, or ask about it. */
export function Cta({ suite, phone = false }: { suite: Suite; phone?: boolean }) {
  const { frame, hidden } = suite;
  const work = hidden.work ? null : frame.work;
  const size = "lg";

  if (frame.isIntro && !phone) {
    return (
      <Button variant="secondary" size={size} onClick={suite.togglePlay}>
        <Icon name="play-solid" className="-ml-1 size-5" />
        Play the reel
      </Button>
    );
  }
  if (work?.href) {
    return (
      <Link href={work.href} className={buttonVariants({ variant: work.caseStudy ? "default" : "secondary", size })}>
        {work.cta}
        <Icon name="arrow-right" className="-mr-1 size-5" />
      </Link>
    );
  }
  if (work) {
    return (
      <Button variant="secondary" size={size} onClick={suite.openExport}>
        {phone ? "Ask me about it" : "No case study yet · ask me about it"}
      </Button>
    );
  }
  return (
    <span className={cn(buttonVariants({ variant: "ghost", size }), "pointer-events-none cursor-default text-muted-foreground")}>
      {frame.isIntro ? "Swipe the timeline" : phone ? "Swipe to the next clip" : "Keep scrubbing"}
    </span>
  );
}
