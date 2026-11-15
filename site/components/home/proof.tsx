import { measurements, pickup } from "@/lib/case-studies";
import { cn } from "@/lib/utils";

import { Btn, CONTAINER, T } from "./ui";

/** 100 orders, 23 of them picked up in store. */
function Orders() {
  const picked = new Set([3, 8, 14, 17, 21, 26, 29, 33, 38, 41, 45, 52, 56, 59, 63, 67, 72, 76, 81, 85, 88, 93, 97]);
  return (
    <div aria-hidden="true" className="grid grid-cols-10 gap-[5px]">
      {Array.from({ length: 100 }, (_, i) => (
        <i key={i} className={cn("block aspect-square rounded-[2px]", picked.has(i) ? "bg-flame" : "bg-white/[0.14]")} />
      ))}
    </div>
  );
}

/** Returns on delivery against returns on pickup: 2.5 to 1. */
function Returns() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-3 font-mono text-[11px] uppercase leading-none text-white/65">
      <div>
        <p className="m-0 mb-2">Delivery</p>
        <i className="block h-7 w-full rounded-[2px] bg-white/25" />
      </div>
      <div>
        <p className="m-0 mb-2">Pickup</p>
        <i className="block h-7 w-[40%] rounded-[2px] bg-flame" />
      </div>
    </div>
  );
}

/** Minutes per measurement, before and after. */
function Minutes() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-3 font-mono text-[11px] uppercase leading-none text-white/65">
      <div>
        <p className="m-0 mb-2">Before · 15 – 20 min</p>
        <div className="flex gap-[3px]">
          {Array.from({ length: 20 }, (_, i) => (
            <i key={i} className={cn("block h-7 flex-1 rounded-[2px]", i < 15 ? "bg-white/25" : "bg-white/10")} />
          ))}
        </div>
      </div>
      <div>
        <p className="m-0 mb-2">After · 3 – 5 min</p>
        <div className="flex gap-[3px]">
          {Array.from({ length: 20 }, (_, i) => (
            <i key={i} className={cn("block h-7 flex-1 rounded-[2px]", i < 3 ? "bg-flame" : i < 5 ? "bg-flame/45" : "bg-transparent")} />
          ))}
        </div>
      </div>
    </div>
  );
}

const STATS = [
  { value: "23 in 100", label: "online orders now picked up in store", art: <Orders />, cls: "bg-umber lg:mt-[156px]", art_cls: "max-w-[230px]" },
  { value: "2.5× fewer", label: "returns on pickup orders than on delivery", art: <Returns />, cls: "bg-stone lg:mt-16", art_cls: "" },
  { value: "70% faster", label: "progressive-lens measurements, in every store", art: <Minutes />, cls: "bg-umber", art_cls: "" },
];

/** A connector between the two halves of a case card: two short bridges, as if the cards were cut from one sheet. */
function Bridge({ className }: { className: string }) {
  return (
    <span aria-hidden="true" className="hidden w-[46px] shrink-0 flex-col justify-between py-7 sm:flex">
      <i className={cn("block h-4", className)} />
      <i className={cn("block h-4", className)} />
    </span>
  );
}

function CaseCard({ study, tone, className }: { study: typeof pickup; tone: "paper" | "blue"; className?: string }) {
  const blue = tone === "blue";
  const surface = blue ? "bg-azure text-white" : "bg-paper-2 text-[#1b1a18]";
  return (
    <article className={cn("flex w-full max-w-[694px] flex-col gap-1.5 sm:flex-row sm:gap-0", className)}>
      <div className={cn("flex min-h-[150px] flex-col justify-between gap-6 rounded-2xl p-5 sm:min-h-[240px] sm:w-[237px] sm:shrink-0", surface)}>
        <p className="m-0 text-[40px] font-semibold leading-none tracking-[-0.04em]">{study.company}</p>
        <div>
          <p className="m-0 text-base font-medium leading-[1.32]">{study.name}</p>
          <p className={cn("m-0 mt-1 text-sm leading-[1.3]", blue ? "text-white/80" : "text-[#1b1a18]/65")}>{study.facts[0].value}</p>
        </div>
      </div>
      <Bridge className={blue ? "bg-azure" : "bg-paper-2"} />
      <div className={cn("flex min-w-0 flex-1 flex-col items-start justify-between gap-8 rounded-2xl p-5", surface)}>
        <p className={cn("m-0", T.lead)}>{study.lede}</p>
        <Btn href={`/work/${study.slug}`} tone={blue ? "line-white" : "line-ink"} arrow>
          Read case study
        </Btn>
      </div>
    </article>
  );
}

export function Proof() {
  return (
    <section className="relative overflow-clip bg-band">
      <div aria-hidden="true" className="glyph-field absolute inset-0 opacity-40 [mask-image:none]" />
      <div className={cn(CONTAINER, "relative pt-20")}>
        <div className="grid gap-x-3 gap-y-3 lg:grid-cols-3 lg:items-start">
          <h2 className={cn("m-0 max-w-[13ch] pb-8 font-normal text-white lg:absolute lg:pb-0", T.h2)}>Shipped, then measured in stores.</h2>
          {STATS.map((s) => (
            <div key={s.value} className={cn("grain grain-light relative border border-white/[0.16] p-6", s.cls)}>
              <div className="relative z-10 flex min-h-[300px] flex-col justify-between gap-10 lg:min-h-[340px]">
                <div>
                  <p className="m-0 text-4xl leading-[1.1] tracking-[-0.01em] text-white">{s.value}</p>
                  <p className={cn("m-0 mt-5 max-w-[20ch] text-white/65", T.lead)}>{s.label}</p>
                </div>
                <div className={s.art_cls}>{s.art}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={cn(CONTAINER, "relative flex flex-col gap-8 py-16")}>
        <CaseCard study={pickup} tone="paper" />
        <CaseCard study={measurements} tone="blue" className="lg:self-end" />
      </div>

      <div className="relative pb-16 lg:pr-[320px]">
        <div className="grain grain-soft relative bg-flame lg:rounded-r-md">
          <div className="relative z-10 mx-auto grid max-w-[1120px] gap-8 px-4 py-9 sm:px-8 lg:ml-0 lg:grid-cols-[190px_1fr] lg:gap-12 lg:pl-[120px] lg:pr-16">
            <div className="flex flex-col items-start gap-6">
              <p className={cn("m-0 text-white", T.mono)}>Now playing</p>
              <Btn href="/now" tone="line-white" arrow>
                What I’m doing now
              </Btn>
            </div>
            <p className="m-0 max-w-[30ch] text-2xl leading-[1.2] tracking-[-0.01em] text-white">Freelancing since March 2026 with Balter and Rainbow Hospitals, and open to the next full-time team.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
