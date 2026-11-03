"use client";

import { Clapperboard, CircleUser, Clock, FileText, FlaskConical } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/ds-icon";
import { TOTAL } from "@/lib/career";
import { cn } from "@/lib/utils";

import { Cta } from "./cta";
import { Identity } from "./desktop-suite";
import type { Suite } from "./edit-suite";
import { Monitor } from "./monitor";
import { PhoneTimeline } from "./phone-timeline";

const TABS = [
  { href: "/", label: "Work", Icon: Clapperboard },
  { href: "/lab", label: "Lab", Icon: FlaskConical },
  { href: "/about", label: "About", Icon: CircleUser },
  { href: "/now", label: "Now", Icon: Clock },
  { href: "/resume", label: "Résumé", Icon: FileText },
];

export function PhoneSuite({ suite, className }: { suite: Suite; className?: string }) {
  const { pos, running } = suite;

  return (
    <div className={cn("relative flex h-dvh min-h-[620px] flex-col overflow-hidden bg-app", className)}>
      <header className="flex h-14 shrink-0 items-center border-b border-line bg-panel px-3.5">
        <Identity compact />
      </header>

      <div className="flex min-h-0 flex-1 bg-canvas px-3 pb-1 pt-2.5">
        <div className="relative min-w-0 flex-1">
          <Monitor suite={suite} variant="phone" />
        </div>
      </div>

      <div className="flex h-[54px] shrink-0 items-center gap-1 bg-canvas px-3">
        <Button variant="ghost" size="icon-lg" onClick={suite.prev} disabled={pos <= 0} aria-label="Previous clip">
          <Icon name="go-to-start" />
        </Button>
        <Button variant="secondary" size="icon-lg" onClick={suite.togglePlay} aria-label={running ? "Pause the reel" : "Play the reel"}>
          <Icon name={running ? "pause" : "play-solid"} />
        </Button>
        <Button variant="ghost" size="icon-lg" onClick={suite.next} disabled={pos >= TOTAL} aria-label="Next clip">
          <Icon name="go-to-end" />
        </Button>
        <div className="flex min-w-0 flex-1 justify-end">
          <Cta suite={suite} phone />
        </div>
      </div>

      <PhoneTimeline suite={suite} />

      <nav aria-label="Primary" className="flex shrink-0 border-t border-line bg-panel px-1 pb-1.5 pt-1">
        {TABS.map(({ href, label, Icon: TabIcon }) => (
          <Link
            key={href}
            href={href}
            aria-current={href === "/" ? "page" : undefined}
            className={cn(
              "flex min-h-[52px] flex-1 flex-col items-center justify-center gap-1 text-[11px] no-underline",
              href === "/" ? "font-semibold text-foreground" : "text-muted-foreground",
            )}
          >
            <TabIcon className="size-5" strokeWidth={1.75} aria-hidden="true" />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
