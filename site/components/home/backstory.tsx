"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import { CONTAINER, FOCUS, T } from "./ui";

interface Chapter {
  id: string;
  tab: string;
  title: string;
  /** Tailwind classes for the folder when it is the open one. */
  tone: string;
  cells: { label: string; body: string; todo?: boolean }[];
  /** The companies in this chapter, as clips on a strip. */
  clips: { name: string; years: string; grow: number }[];
}

const CHAPTERS: Chapter[] = [
  {
    id: "design",
    tab: "Product designer",
    title: "Product designer",
    tone: "bg-flame",
    cells: [
      { label: "Lenskart · 2024 – 26", body: "Product designer. Pickup in store, AI progressive measurements, Claim Cashback and a handheld POS for store staff." },
      { label: "Ting · 2022 – 23", body: "UX designer. E-commerce and corporate websites for LA Times, Vedanta, Dabur UK and Prowise." },
      { label: "10k Designers · 2023 – 24", body: "Cohort 8. The first experiments in the lab date from here." },
      { label: "Freelance · 2026 – now", body: "Product design for clients including Balter and Rainbow Hospitals." },
    ],
    clips: [
      { name: "Ting", years: "22 – 23", grow: 13 },
      { name: "10k Designers", years: "23 – 24", grow: 10 },
      { name: "Lenskart", years: "24 – 26", grow: 25 },
      { name: "Freelance", years: "26 –", grow: 9 },
    ],
  },
  {
    id: "founder",
    tab: "Founder",
    title: "Founder, cloud kitchen",
    tone: "bg-sand",
    cells: [
      { label: "Saoji Spice · 2021 – 22", body: "Started and ran a cloud kitchen between the edit suite and the design tools." },
      { label: "What it taught me", body: "One line on what you built at Saoji Spice and what running it taught you.", todo: true },
    ],
    clips: [{ name: "Saoji Spice", years: "21 – 22", grow: 1 }],
  },
  {
    id: "film",
    tab: "Film editor",
    title: "Film editor",
    tone: "bg-sky",
    cells: [
      { label: "OML · 2019 – 21", body: "Freelance video editor, cutting with cross-functional teams." },
      { label: "Campaigns", body: "Digital campaigns for Netflix, Amazon Prime, Tinder and HDFC Life." },
      { label: "Creators", body: "Videos with creators including Zakir Khan and Biswa Kalyan Rath." },
      { label: "What carried over", body: "The cut. I used to cut films. Now I cut checkout flows." },
    ],
    clips: [{ name: "OML", years: "19 – 21", grow: 1 }],
  },
];

/** A folder with a paper tab: the open chapter takes its colour, the others stay stone. */
function Folder({ chapter, index, on, onSelect }: { chapter: Chapter; index: number; on: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      role="tab"
      id={`tab-${chapter.id}`}
      aria-selected={on}
      aria-controls={`panel-${chapter.id}`}
      onClick={onSelect}
      className={cn("group relative block h-[76px] min-w-0 flex-1 cursor-pointer border-0 bg-transparent p-0 text-left lg:h-auto lg:w-[182px] lg:flex-none", on ? "lg:h-[130px]" : "lg:h-[98px]", FOCUS)}
    >
      <span className={cn("grain grain-soft absolute inset-x-0 bottom-0 top-2 rounded-md shadow-[0.5px_1.5px_1px_rgba(0,0,0,0.75)] transition-colors", on ? chapter.tone : "bg-stone group-hover:bg-[#504a47]")} />
      {on ? (
        <span className="absolute left-3 right-3 top-0 z-10 flex h-8 items-center bg-paper px-1.5 font-mono text-[10px] uppercase leading-[1.05] tracking-[-0.02em] text-ink [clip-path:polygon(0_0,calc(100%-9px)_0,100%_9px,100%_100%,0_100%)]">
          {chapter.tab}
        </span>
      ) : (
        <>
          <span className="absolute inset-x-0 top-2 z-10 h-7 rounded-md border-b border-black/30" />
          <i className="absolute left-1/2 top-[30px] z-10 block size-3.5 -translate-x-1/2 rounded-full bg-black/40" />
          <span className="sr-only">{chapter.tab}</span>
        </>
      )}
      <span className={cn("absolute bottom-1.5 right-2 z-10 font-mono text-base leading-none", on ? "text-ink/70" : "text-white/45")}>{String(index + 1).padStart(2, "0")}</span>
    </button>
  );
}

export function Backstory() {
  const [active, setActive] = useState(0);
  const chapter = CHAPTERS[active];

  return (
    <section id="backstory" className="relative scroll-mt-8 overflow-clip">
      <div className={cn(CONTAINER, "pb-24 pt-10 lg:pb-[150px]")}>
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <h2 className={cn("m-0 font-normal text-white", T.h2)}>Backstory</h2>
          <p className={cn("m-0 max-w-[330px] text-white/80", T.body)}>Three careers in seven years. Each one is still in how I work.</p>
        </div>

        <div className="mt-12 flex flex-col gap-6 lg:mt-16 lg:flex-row lg:gap-[78px]">
          <div role="tablist" aria-label="Careers" className="flex gap-2.5 lg:flex-col">
            {CHAPTERS.map((c, i) => (
              <Folder key={c.id} chapter={c} index={i} on={i === active} onSelect={() => setActive(i)} />
            ))}
          </div>

          <div role="tabpanel" id={`panel-${chapter.id}`} aria-labelledby={`tab-${chapter.id}`} className="min-w-0 flex-1 bg-band">
            <div key={chapter.id} className="v2-rise">
              <div className="px-5 pt-7 lg:px-8 lg:pt-8">
                <h3 className={cn("m-0 border-b border-white/[0.12] pb-7 font-normal text-white", T.h3)}>{chapter.title}</h3>
                <dl className="m-0 grid gap-x-12 gap-y-8 py-9 sm:grid-cols-2">
                  {chapter.cells.map((cell) => (
                    <div key={cell.label}>
                      <dt className="font-mono text-base uppercase leading-[1.1] tracking-[-0.01em] text-white">{cell.label}</dt>
                      <dd className={cn("m-0 mt-3.5 max-w-[32ch]", T.body, cell.todo ? "rounded-md border border-dashed border-white/25 p-3 font-mono text-[13px] text-white/50" : "text-white/65")}>
                        {cell.todo ? `[${cell.body}]` : cell.body}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="grain grain-light relative ml-5 bg-stone px-5 py-8 lg:ml-8 lg:px-8 lg:py-10">
                <div className="relative z-10 flex flex-wrap gap-1.5">
                  {chapter.clips.map((clip) => (
                    <div key={clip.name} style={{ flexGrow: clip.grow }} className={cn("grain grain-soft relative h-[72px] min-w-[128px] basis-0 rounded-md p-2.5 text-ink shadow-[0_4px_15px_rgba(0,0,0,0.25)]", chapter.tone)}>
                      <p className="relative z-10 m-0 truncate text-sm font-medium leading-none">{clip.name}</p>
                      <p className="absolute bottom-2.5 left-2.5 z-10 m-0 truncate font-mono text-[11px] leading-none text-ink/65">{clip.years}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
