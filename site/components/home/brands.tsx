import { cn } from "@/lib/utils";

import { T } from "./ui";

/** Set as type, not logos: the marks are not mine to redraw. Each name gets a face that hints at the brand's voice. */
const BRANDS = [
  { name: "Lenskart", cls: "font-semibold tracking-[-0.03em]" },
  { name: "Netflix", cls: "font-bold uppercase tracking-[0.02em]" },
  { name: "Prime Video", cls: "font-medium tracking-[-0.02em]" },
  { name: "Tinder", cls: "font-bold lowercase tracking-[-0.03em]" },
  { name: "HDFC Life", cls: "font-semibold" },
  { name: "LA Times", cls: "font-serif text-[30px]" },
  { name: "Vedanta", cls: "font-light lowercase tracking-[0.02em]" },
  { name: "Dabur", cls: "font-serif text-[30px] italic" },
] as const;

export function Brands() {
  return (
    <section className="relative px-4 py-8 sm:px-8">
      <div className="rounded-3xl border border-white/[0.08] bg-band px-6 py-9 lg:px-10 lg:py-10">
        <p className={cn("m-0 text-white/80", T.mono)}>
          Brands I have designed and edited <b className="font-bold">for</b>
        </p>
        <ul className="m-0 mt-9 grid list-none grid-cols-2 items-center gap-x-6 gap-y-7 p-0 sm:grid-cols-4 lg:flex lg:justify-between lg:gap-8">
          {BRANDS.map((b) => (
            <li key={b.name} className={cn("whitespace-nowrap text-2xl leading-none text-white/45", b.cls)}>
              {b.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
