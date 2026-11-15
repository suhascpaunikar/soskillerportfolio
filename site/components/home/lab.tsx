"use client";

import { useState } from "react";

import { experiments } from "@/lib/career";
import { cn } from "@/lib/utils";

import { Btn, CONTAINER, FOCUS, T } from "./ui";

export function Lab() {
  const [active, setActive] = useState(0);
  const x = experiments[active];

  return (
    <section id="lab" className="grain grain-light relative scroll-mt-8 bg-band">
      <div className={cn(CONTAINER, "relative z-10 grid gap-10 py-20 lg:grid-cols-[244px_1fr] lg:gap-20 lg:py-32")}>
        <div className="flex flex-col items-start justify-between gap-8">
          <h2 className={cn("m-0 font-normal text-white", T.h3)}>Five side projects, each built to answer one question.</h2>
          <div className="flex flex-wrap gap-2">
            <Btn href="/lab" tone="white" arrow>
              Open the lab
            </Btn>
            <Btn href="/" tone="ghost">
              Play the reel
            </Btn>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-md bg-paper p-3 sm:p-10">
          <div aria-hidden="true" className="glyph-field absolute inset-0 invert [mask-image:none]" />
          <div className="grain grain-light relative rounded-xl bg-stone p-4 shadow-[0_18px_40px_rgba(0,0,0,0.25)]">
            <div aria-hidden="true" className="relative z-10 flex gap-2 pb-4 pl-0.5 pt-1.5">
              <i className="block size-3 rounded-full bg-black/40" />
              <i className="block size-3 rounded-full bg-black/40" />
              <i className="block size-3 rounded-full bg-black/40" />
            </div>
            <div className="relative z-10 rounded-lg border border-white/[0.12] bg-umber">
              <div role="tablist" aria-label="Experiments" className="no-scrollbar flex overflow-x-auto border-b border-white/[0.12] px-2">
                {experiments.map((e, i) => (
                  <button
                    key={e.id}
                    type="button"
                    role="tab"
                    id={`lab-tab-${e.id}`}
                    aria-selected={i === active}
                    aria-controls="lab-panel"
                    onClick={() => setActive(i)}
                    className={cn(
                      "-mb-px shrink-0 cursor-pointer border-0 border-b bg-transparent px-2.5 py-4 font-mono text-xs leading-[1.5] transition-colors",
                      i === active ? "border-white text-white" : "border-transparent text-white/65 hover:text-white",
                      FOCUS,
                    )}
                  >
                    {e.short}
                  </button>
                ))}
              </div>
              <p className="m-0 border-b border-white/[0.12] px-4 font-mono text-[13px] leading-[44px] text-white">
                <span className="text-flame">$ </span>open {x.id}
                <span className="float-right text-white/50">{x.when}</span>
              </p>
              <div key={x.id} role="tabpanel" id="lab-panel" aria-labelledby={`lab-tab-${x.id}`} className="v2-rise min-h-[212px] px-4 py-6 font-mono text-[13px] leading-[1.65] text-white">
                <p className="m-0 text-white/50">title</p>
                <p className="m-0">{x.title}</p>
                <p className="m-0 mt-5 text-white/50">the idea</p>
                <p className="m-0 max-w-[52ch]">{x.line}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
