"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { CartArt, MarkerArt } from "@/components/home/work";
import { companyName, rangeOf, work, type WorkItem } from "@/lib/career";
import { cn } from "@/lib/utils";

const ORDER = ["pickup", "ai", "cashback", "pos", "websites", "campaigns"];
const ITEMS = ORDER.map((id) => work.find((w) => w.id === id)).filter((w): w is WorkItem => Boolean(w));

const FILTERS = [
  { id: "all", label: "All", test: () => true },
  { id: "cases", label: "Case studies", test: (w: WorkItem) => Boolean(w.caseStudy) },
  { id: "lenskart", label: "Lenskart", test: (w: WorkItem) => w.company === "lenskart" },
  { id: "earlier", label: "Earlier", test: (w: WorkItem) => w.company !== "lenskart" },
] as const;

const MONO = "font-mono text-[11px] uppercase leading-none tracking-[0.06em]";

function Card({ item, wide }: { item: WorkItem; wide: boolean }) {
  const art = item.id === "pickup" ? <CartArt /> : item.id === "ai" ? <MarkerArt /> : null;
  return (
    <article className={cn("v2-rise group relative flex flex-col gap-5 rounded-[20px] border border-black/[0.07] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]", wide && "md:col-span-2 md:flex-row md:gap-8")}>
      <div
        className={cn(
          "flex min-h-[260px] items-center justify-center rounded-xl p-5",
          wide && "md:min-h-[340px] md:flex-1",
          art ? (item.id === "ai" ? "bg-[#1f3fae]" : "bg-[#3a3532]") : "border border-dashed border-black/20 bg-[#f5f4f0]",
        )}
      >
        {art ?? (
          <p className="m-0 max-w-[30ch] text-center font-mono text-xs leading-[1.6] text-black/45">
            this picture will come here
            <br />
            <span className="text-black/70">{item.media.replace(/^\[|\]$/g, "")}</span>
          </p>
        )}
      </div>
      <div className={cn("flex flex-1 flex-col gap-3 px-1 pb-1", wide && "md:max-w-[400px] md:justify-center md:py-6 md:pr-6")}>
        <p className={cn("m-0 text-black/50", MONO)}>
          {companyName(item.company)} <span className="text-black/25">•</span> {item.caseStudy ? "Case study" : rangeOf(item)}
        </p>
        <h3 className={cn("m-0 font-medium leading-[1.15] tracking-[-0.02em] text-[#1e1e20]", wide ? "text-2xl md:text-[32px]" : "text-[22px]")}>
          {item.href && item.caseStudy ? (
            <Link href={item.href} className="rounded text-inherit no-underline outline-offset-4 after:absolute after:inset-0 after:rounded-[20px] focus-visible:outline-2 focus-visible:outline-[#1e1e20]">
              {item.title}
            </Link>
          ) : (
            item.title
          )}
        </h3>
        <p className="m-0 text-[15px] leading-[1.5] text-black/60">{item.line}</p>
        {item.chips.length > 0 && (
          <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0 pt-1">
            {item.chips.map((c) => (
              <li key={c} className="rounded-full border border-black/10 px-2.5 py-1.5 text-xs leading-none text-black/70">
                {c}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto pt-3">
          {item.caseStudy ? (
            <span aria-hidden="true" className="flex h-9 w-12 items-center justify-center rounded-lg bg-[#1e1e20] text-white transition-transform group-hover:translate-x-1">
              <ArrowRight className="size-4" />
            </span>
          ) : (
            <span className="font-serif text-lg italic text-black/40">case study soon</span>
          )}
        </div>
      </div>
    </article>
  );
}

export function WorkGrid() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const active = FILTERS.find((f) => f.id === filter) ?? FILTERS[0];
  const shown = ITEMS.filter(active.test);

  return (
    <>
      <div role="group" aria-label="Filter the work" className="mt-7 flex flex-wrap justify-center gap-1.5">
        {FILTERS.map((f) => {
          const on = f.id === filter;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(f.id)}
              className={cn(
                "h-8 cursor-pointer rounded-full border px-3.5 text-[13px] leading-none outline-offset-2 transition-colors focus-visible:outline-2 focus-visible:outline-[#1e1e20]",
                on ? "border-[#1e1e20] bg-[#1e1e20] text-white" : "border-black/15 bg-transparent text-black/65 hover:border-black/40 hover:text-black",
              )}
            >
              {f.label} <span className={on ? "text-white/55" : "text-black/35"}>{ITEMS.filter(f.test).length}</span>
            </button>
          );
        })}
      </div>
      <div key={filter} className="mt-10 grid gap-4 md:grid-cols-2">
        {shown.map((item, i) => (
          <Card key={item.id} item={item} wide={i === 0 && shown.length % 2 === 1} />
        ))}
      </div>
    </>
  );
}
