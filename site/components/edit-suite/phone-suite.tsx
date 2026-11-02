"use client";

import { Clapperboard, CircleUser, Clock, FileText, FlaskConical, Folder, Pause, Play, SkipBack, SkipForward, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { MetalButton } from "@/components/ui/liquid-metal";
import { TOTAL } from "@/lib/career";
import { cn } from "@/lib/utils";

import { AssetsPanel } from "./assets-panel";
import { Cta } from "./cta";
import type { Suite } from "./edit-suite";
import { Modal } from "./modal";
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
  const [assetsOpen, setAssetsOpen] = useState(false);
  const { pos, running } = suite;

  return (
    <div className={cn("relative flex h-dvh min-h-[620px] flex-col overflow-hidden bg-app", className)}>
      <header className="flex h-[60px] shrink-0 items-center gap-2 border-b border-line bg-panel px-2.5">
        <MetalButton shape="circle" onClick={() => setAssetsOpen(true)} aria-label="Assets: browse by company">
          <Folder className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
        </MetalButton>
        <div className="min-w-0 flex-1 pl-0.5">
          <h1 className="m-0 truncate text-[15px] font-semibold leading-tight text-white">Suhas Paunikar</h1>
          <p className="m-0 mt-0.5 truncate text-[11px] leading-tight text-muted-foreground">Product designer · open to roles</p>
        </div>
        <MetalButton live onClick={suite.openExport} innerClassName="px-4 font-semibold">
          Hire me
        </MetalButton>
      </header>

      <div className="flex min-h-0 flex-1 px-3 pb-1 pt-2.5">
        <div className="relative min-w-0 flex-1">
          <Monitor suite={suite} variant="phone" />
        </div>
      </div>

      <div className="flex h-[58px] shrink-0 items-center gap-2 px-3">
        <MetalButton shape="circle" onClick={suite.prev} disabled={pos <= 0} aria-label="Previous clip">
          <SkipBack className="size-3.5" aria-hidden="true" />
        </MetalButton>
        <MetalButton live shape="circle" innerClassName="text-playhead" onClick={suite.togglePlay} aria-label={running ? "Pause the reel" : "Play the reel"}>
          {running ? <Pause className="size-4 fill-current" aria-hidden="true" /> : <Play className="size-4 fill-current" aria-hidden="true" />}
        </MetalButton>
        <MetalButton shape="circle" onClick={suite.next} disabled={pos >= TOTAL} aria-label="Next clip">
          <SkipForward className="size-3.5" aria-hidden="true" />
        </MetalButton>
        <div className="flex min-w-0 flex-1 justify-end">
          <Cta suite={suite} phone />
        </div>
      </div>

      <PhoneTimeline suite={suite} />

      <nav aria-label="Primary" className="flex shrink-0 border-t border-line bg-panel px-1 pb-1.5 pt-1">
        {TABS.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={href === "/" ? "page" : undefined}
            className={cn(
              "flex min-h-[52px] flex-1 flex-col items-center justify-center gap-1 text-[11px] no-underline",
              href === "/" ? "font-semibold text-white" : "text-muted-foreground",
            )}
          >
            <Icon className="size-5" strokeWidth={2} aria-hidden="true" />
            {label}
          </Link>
        ))}
      </nav>

      <Modal open={assetsOpen} onClose={() => setAssetsOpen(false)} label="Assets" variant="sheet">
        <div className="flex h-[64dvh] flex-col rounded-t-[18px] border-t border-[#2e2e34] bg-panel">
          <span aria-hidden="true" className="mx-auto mb-0.5 mt-2 h-1 w-9 shrink-0 rounded-full bg-[#3a3a42]" />
          <div className="flex shrink-0 items-center justify-between pb-1.5 pl-4 pr-2.5 pt-0.5">
            <h2 className="m-0 text-base font-semibold text-white">Assets</h2>
            <MetalButton shape="circle" onClick={() => setAssetsOpen(false)} aria-label="Close assets" autoFocus>
              <X className="size-4" aria-hidden="true" />
            </MetalButton>
          </div>
          <AssetsPanel suite={suite} variant="sheet" onPick={() => setAssetsOpen(false)} />
        </div>
      </Modal>
    </div>
  );
}
