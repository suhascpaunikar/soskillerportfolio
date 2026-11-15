"use client";

import { useEffect, useState } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { companyName, rangeOf, work, type WorkItem } from "@/lib/career";
import { cn } from "@/lib/utils";

import { Btn, CONTAINER, Eyebrow, FOCUS, T } from "./ui";

/** How long each item stays up before the list moves on by itself. */
const DWELL = 7000;

/** Lenskart first, then everything before it: the order a reviewer wants. */
const ORDER = ["pickup", "ai", "cashback", "pos", "websites", "campaigns"];
const ITEMS = ORDER.map((id) => work.find((w) => w.id === id)).filter((w): w is WorkItem => Boolean(w));

const MONO_XS = "font-mono text-[11px] uppercase leading-none tracking-[0.02em]";

/** The shipped cart: the whole pickup choice is two lines above the pay button. */
function CartArt() {
  const row = "flex items-center gap-3 rounded-md border px-3.5 py-3";
  return (
    <div className="w-full max-w-[340px] rounded-lg border border-white/[0.16] bg-ink/70 p-4 shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
      <p className={cn("m-0 mb-3.5 text-white/50", MONO_XS)}>Cart · how do you want it?</p>
      <div className="flex flex-col gap-2">
        <div className={cn(row, "border-white/[0.12] text-white/65")}>
          <i className="block size-3.5 rounded-full border border-white/40" />
          <span className="flex-1 text-sm">Home delivery</span>
          <span className="font-mono text-[13px]">₹2,000</span>
        </div>
        <div className={cn(row, "border-flame/70 bg-flame/[0.08] text-white")}>
          <i className="block size-3.5 rounded-full border-4 border-flame bg-white" />
          <span className="flex-1 text-sm">Collect from store</span>
          <span className="font-mono text-[13px]">₹1,950</span>
        </div>
      </div>
      <div className="mt-3.5 flex h-9 items-center justify-center rounded-md bg-paper text-sm font-medium text-ink">Pay ₹1,950</div>
    </div>
  );
}

/** Placing a pupil marker with the zoomed-in view, AI and manual values side by side. */
function MarkerArt() {
  return (
    <div className="w-full max-w-[340px] rounded-lg border border-white/[0.16] bg-ink/70 p-4 shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
      <p className={cn("m-0 mb-3.5 text-white/50", MONO_XS)}>iPad · align the pupil marker</p>
      <svg viewBox="0 0 300 150" className="block w-full" fill="none" aria-hidden="true">
        <rect x="18" y="38" width="112" height="74" rx="24" stroke="rgba(255,255,255,.45)" strokeWidth="1.5" />
        <rect x="170" y="38" width="112" height="74" rx="24" stroke="rgba(255,255,255,.45)" strokeWidth="1.5" />
        <path d="M130 66c12-12 28-12 40 0" stroke="rgba(255,255,255,.45)" strokeWidth="1.5" />
        <circle cx="74" cy="75" r="9" stroke="rgba(255,255,255,.35)" />
        <circle cx="226" cy="75" r="9" stroke="rgba(255,255,255,.35)" />
        <path d="M226 58v34M209 75h34" stroke="#ff6600" strokeWidth="1.5" />
        <circle cx="226" cy="75" r="2.5" fill="#ff6600" />
        <circle cx="262" cy="30" r="26" fill="#111010" stroke="#eaeae6" strokeWidth="1.5" />
        <circle cx="262" cy="30" r="13" stroke="rgba(255,255,255,.35)" />
        <path d="M262 10v40M242 30h40" stroke="#ff6600" strokeWidth="1.5" />
      </svg>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {["AI", "Manual"].map((k, i) => (
          <div key={k} className="rounded-md border border-white/[0.12] px-3 py-2.5">
            <p className={cn("m-0 text-white/50", MONO_XS)}>{k}</p>
            <i className={cn("mt-2 block h-1.5 rounded-full", i ? "w-[88%] bg-paper" : "w-[80%] bg-flame")} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** A slot that says what footage belongs here, until it exists. */
function PendingArt({ item }: { item: WorkItem }) {
  return (
    <div className="w-full max-w-[340px] rounded-lg border border-dashed border-white/25 bg-ink/50 p-4">
      <p className={cn("m-0 text-white/50", MONO_XS)}>This picture will come here</p>
      <p className="m-0 mt-3 font-mono text-[13px] leading-[1.5] text-white/80">{item.media.replace(/^\[|\]$/g, "")}</p>
    </div>
  );
}

function Preview({ item }: { item: WorkItem }) {
  return (
    <div key={item.id} className="v2-rise grid overflow-hidden rounded-lg sm:grid-cols-[1fr_235px]">
      <div className="grain grain-light relative flex min-h-[260px] items-center justify-center bg-stone p-6 lg:min-h-[420px]">
        <div className="relative z-10 flex w-full justify-center">{item.id === "pickup" ? <CartArt /> : item.id === "ai" ? <MarkerArt /> : <PendingArt item={item} />}</div>
      </div>
      <div className="grain relative flex flex-col justify-between gap-8 bg-sand p-5 text-ink">
        <div className="relative z-10">
          <p className={cn("m-0 text-ink/60", MONO_XS)}>{companyName(item.company)}</p>
          <p className={cn("m-0 mt-2 text-ink/60", MONO_XS)}>{rangeOf(item)}</p>
        </div>
        <ul className="relative z-10 m-0 flex list-none flex-col gap-3 p-0">
          {(item.chips.length ? item.chips : [item.label]).map((chip) => (
            <li key={chip} className={cn("border-t border-ink/25 pt-3", item.chips.length ? T.h4 : T.body)}>
              {chip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Work() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  /** The list stops moving by itself once the visitor has chosen an item or is pointing at it. */
  const [held, setHeld] = useState(false);
  const [hover, setHover] = useState(false);
  const auto = !reduced && !held && !hover;

  useEffect(() => {
    if (!auto) return;
    const id = setTimeout(() => setActive((i) => (i + 1) % ITEMS.length), DWELL);
    return () => clearTimeout(id);
  }, [auto, active]);

  const item = ITEMS[active];

  return (
    <section id="work" className="relative scroll-mt-8">
      <div className={cn(CONTAINER, "grid gap-x-20 gap-y-10 py-20 lg:grid-cols-[440px_1fr] lg:py-[130px]")}>
        <Eyebrow className="lg:pt-3.5">Work</Eyebrow>
        <h2 className={cn("m-0 max-w-[17ch] font-normal text-white", T.h2)}>Six things shipped, from film edits to checkout flows</h2>

        <div className="order-last lg:order-none lg:mt-6" onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
          <ol className="m-0 list-none border-b border-white/[0.16] p-0">
            {ITEMS.map((w, i) => {
              const on = i === active;
              return (
                <li key={w.id} className="relative border-t border-white/[0.16]">
                  {on && (
                    <i
                      key={auto ? "run" : "hold"}
                      aria-hidden="true"
                      className={cn("absolute -top-px left-0 block h-px bg-white", auto ? "v2-fill w-full" : "w-20")}
                      style={auto ? { animationDuration: `${DWELL}ms` } : undefined}
                    />
                  )}
                  <button
                    type="button"
                    aria-expanded={on}
                    aria-controls={`work-${w.id}`}
                    onClick={() => {
                      setActive(i);
                      setHeld(true);
                    }}
                    className={cn(
                      "flex w-full cursor-pointer items-baseline gap-[18px] border-0 bg-transparent px-0 text-left transition-colors",
                      on ? "pb-3 pt-5 text-white" : "py-4 text-white/50 hover:text-white/80",
                      FOCUS,
                    )}
                  >
                    <span className="font-mono text-sm text-white/50">{String(i + 1).padStart(2, "0")}</span>
                    <span className={T.h4}>{w.title}</span>
                  </button>
                  {on && (
                    <div id={`work-${w.id}`} className="v2-rise pb-6 pl-[34px]">
                      <p className={cn("m-0 max-w-[40ch] text-white/65", T.body)}>{w.line}</p>
                      {w.href && (
                        <Btn href={w.href} arrow className="mt-5">
                          {w.cta}
                        </Btn>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        <div className="lg:mt-[110px]">
          <Preview item={item} />
        </div>
      </div>
    </section>
  );
}
