import type { ReactNode } from "react";

import { EMAIL } from "@/lib/career";
import { cn } from "@/lib/utils";

import { Btn, CONTAINER, Eyebrow, T } from "./ui";

/** Rings of small frames, a few of them lit: the pattern behind the section. */
function Rings() {
  const rings = [150, 215, 280, 345, 410, 475];
  return (
    <svg viewBox="0 0 900 900" className="absolute -right-[180px] -top-[80px] hidden w-[900px] opacity-70 lg:block" fill="none" aria-hidden="true">
      {rings.map((r, ri) => (
        <g key={r}>
          <circle cx="450" cy="450" r={r} stroke="rgba(255,255,255,0.14)" />
          {Array.from({ length: 10 + ri * 6 }, (_, i) => {
            const a = (i / (10 + ri * 6)) * Math.PI * 2 + ri * 0.4;
            const lit = (i * 7 + ri * 3) % 11 === 0;
            return (
              <rect
                key={i}
                x={Math.round((450 + Math.cos(a) * r) * 10) / 10 - 5}
                y={Math.round((450 + Math.sin(a) * r) * 10) / 10 - 4}
                width="10"
                height="8"
                rx="1.5"
                fill="#111010"
                stroke={lit ? "#5a5eea" : "rgba(255,255,255,0.4)"}
              />
            );
          })}
        </g>
      ))}
    </svg>
  );
}

const STROKE = "rgba(255,255,255,0.28)";

function Card({ title, body, className, children }: { title: string; body: string; className?: string; children: ReactNode }) {
  return (
    <article className={cn("relative flex min-h-[220px] flex-col justify-between gap-10 overflow-hidden rounded-md bg-umber p-4", className)}>
      <div aria-hidden="true" className="absolute inset-0 max-lg:opacity-40">
        {children}
      </div>
      <h3 className={cn("relative m-0 font-normal text-white", T.h4)}>{title}</h3>
      <p className={cn("relative m-0 max-w-[25ch] text-white/80", T.small)}>{body}</p>
    </article>
  );
}

export function Principles() {
  return (
    <section className="relative overflow-clip">
      <Rings />
      <div className={cn(CONTAINER, "relative py-24 lg:pb-[150px] lg:pt-[104px]")}>
        <Eyebrow>How I work</Eyebrow>
        <h2 className={cn("m-0 mt-10 max-w-[12ch] font-normal text-white", T.h2)}>Lighter, not louder.</h2>

        <div className="mt-16 grid gap-2.5 lg:grid-cols-[498px_306px_1fr] lg:items-start">
          <div>
            <Card title="Cut it down" body="Pickup went from a screen of its own to two lines on the cart, with the ₹50 saving showing in the total." className="lg:min-h-[150px]">
              <svg viewBox="0 0 498 150" className="absolute right-0 top-0 h-full max-sm:hidden" fill="none" stroke={STROKE}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                  <rect key={i} x={262 + (i % 5) * 44} y={22 + Math.floor(i / 5) * 58} width="36" height="48" rx="3" strokeDasharray={i < 8 ? "3 4" : undefined} stroke={i < 8 ? STROKE : "#ff6600"} />
                ))}
              </svg>
            </Card>
            <p className={cn("m-0 mt-16 max-w-[32ch] text-white/80", T.body)}>Three habits from the edit suite that survived the move to product design.</p>
            <div className="mt-8 flex flex-wrap gap-2">
              <Btn href="/about" tone="white" arrow>
                Read the backstory
              </Btn>
              <Btn href={`mailto:${EMAIL}`} tone="ghost">
                Hiring?
              </Btn>
            </div>
          </div>

          <Card title="Humans in charge" body="The pilot reached 85% AI–manual parity against a 98% target, so manual stayed the source of truth." className="lg:min-h-[264px]">
            <svg viewBox="0 0 306 264" className="h-full w-full" fill="none" stroke={STROKE}>
              <path d="M0 130C60 40 150 40 306 150M0 180C90 90 190 90 306 190M150 264C200 170 250 130 306 110" />
              {[
                [24, 98],
                [122, 64],
                [236, 92],
                [208, 122],
                [52, 136],
                [262, 152],
                [296, 182],
                [214, 180],
              ].map(([x, y]) => (
                <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" stroke="#ff6600" fill="#272320" />
              ))}
            </svg>
          </Card>

          <Card title="Ship, measure, re-cut" body="V1 of pickup reached 10–12% adoption and cost 10% of checkout conversion. V2 recovered it at 23–25%." className="lg:min-h-[332px]">
            <svg viewBox="0 0 376 332" className="h-full w-full" fill="none" stroke={STROKE}>
              {Array.from({ length: 11 }, (_, i) => (
                <path key={i} d={`M0 ${190 - i * 10}C90 ${80 - i * 5} 180 ${70 + i * 7} 250 ${170 + i * 3}S340 ${210 - i * 4} 376 ${200 - i * 6}`} />
              ))}
            </svg>
          </Card>
        </div>
      </div>
    </section>
  );
}
