import { cn } from "@/lib/utils";

import { Btn, CONTAINER, Mark, T } from "./ui";

/** The dome of lines behind the slate, with the years of the career pinned on it. */
function Dome() {
  const meridians = [70, 150, 240, 340, 450, 570, 700, 840];
  const parallels = [60, 120, 180, 240, 300];
  const pins: [number, number, string][] = [
    [212, 328, "{2019}"],
    [318, 250, "{2021}"],
    [390, 348, "{2022}"],
    [1028, 288, "{2024}"],
    [1038, 392, "{2026}"],
  ];
  return (
    <svg viewBox="0 0 1440 520" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-0 bottom-0 h-[520px] w-full" aria-hidden="true">
      <defs>
        <linearGradient id="dome-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="dome-clip">
          <ellipse cx="720" cy="520" rx="840" ry="340" />
        </clipPath>
      </defs>
      <g fill="none" stroke="url(#dome-fade)" strokeWidth="1.5" clipPath="url(#dome-clip)">
        {meridians.map((rx) => (
          <ellipse key={rx} cx="720" cy="520" rx={rx} ry="340" />
        ))}
        {parallels.map((y) => (
          <ellipse key={y} cx="720" cy={520 - y} rx={Math.sqrt(1 - (y / 340) ** 2) * 840} ry={y * 0.16} />
        ))}
      </g>
      {pins.map(([x, y, label]) => (
        <g key={label}>
          <circle cx={x} cy={y} r="5" className="fill-flame" />
          <text x={x + 14} y={y + 16} className="fill-white/70 font-mono text-[12px]">
            {label}
          </text>
        </g>
      ))}
    </svg>
  );
}

const LABEL = "absolute right-3.5 font-mono text-[11px] uppercase leading-none tracking-[0.04em] sm:text-xs";

/**
 * Three careers as a stack: film editor at the bottom, founder above it, product designer on top.
 * The paper tab is the slate for the cut that is playing now.
 */
function Slate() {
  return (
    <div className="relative mx-auto w-full max-w-[540px]">
      {/* Back board and the paper tab */}
      <div className="grain relative mx-1 h-[88px] rounded-t-lg bg-[#c9540c] [clip-path:polygon(1.5%_0,98.5%_0,100%_100%,0_100%)]" />
      <div className="absolute inset-x-7 top-[46px] flex h-[42px] items-center justify-between gap-3 bg-paper pl-4 pr-3 font-mono text-[13px] leading-none text-ink [clip-path:polygon(0_0,calc(100%-14px)_0,100%_14px,100%_100%,0_100%)]">
        <p className="m-0 truncate">
          <span className="text-ink/45"><span className="max-sm:hidden">scene 24 · </span>take 02 · </span>pickup in store
        </p>
        <span aria-hidden="true" className="flex shrink-0 gap-1.5 pr-3">
          <i className="block size-2.5 rounded-full border border-ink/50" />
          <i className="block size-2.5 rounded-full border border-ink/50" />
          <i className="block size-2.5 rounded-full bg-ink/60" />
        </span>
      </div>

      {/* Product designer */}
      <div className="grain grain-soft relative -mt-px h-[220px] rounded-md bg-flame shadow-[0_6px_24px_rgba(0,0,0,0.45)] sm:h-[290px]">
        <Mark className="absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 text-[#d95600] drop-shadow-[0_1px_0_rgba(255,160,90,0.55)]" />
        <span className={cn(LABEL, "bottom-3.5 text-[#8a3400]")}>Product designer · 2022 – now</span>
      </div>
      {/* Founder */}
      <div className="grain relative mx-2 h-9 rounded-b-md bg-sand shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
        <span className={cn(LABEL, "bottom-2.5 text-[#6d5443]")}>Founder, cloud kitchen · 2021 – 22</span>
      </div>
      {/* Film editor */}
      <div className="grain relative mx-4 h-8 rounded-b-md bg-sky shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
        <span className={cn(LABEL, "bottom-2 text-[#3f607e]")}>Film editor · 2019 – 21</span>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-clip">
      <div aria-hidden="true" className="glyph-field absolute inset-x-0 top-0 h-[360px]" />
      <Dome />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,transparent,var(--color-ink))]" />

      <div className={cn(CONTAINER, "relative pb-24 pt-20 lg:pb-28 lg:pt-[150px]")}>
        <div className="mx-auto flex max-w-[784px] flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <h1 className={cn("m-0 max-w-[520px] text-balance font-normal text-white lg:w-[520px] lg:shrink-0", T.h1)}>Product designer for commerce and AI</h1>
          <div className="flex flex-col items-start gap-8 lg:max-w-[230px] lg:gap-9 lg:pt-1.5">
            <p className={cn("m-0 text-white/80", T.body)}>I used to cut films. Now I cut checkout flows.</p>
            <Btn href="#work" arrow>
              See the work
            </Btn>
          </div>
        </div>
        <div className="mt-12 lg:mt-9">
          <Slate />
        </div>
      </div>
    </section>
  );
}
