"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export interface RailItem {
  id: string;
  n: string;
  label: string;
}

/**
 * The chapter list. On wide screens it is a sticky rail beside the chapters; on phones it sits above them.
 * The yellow playhead marks the chapter being read.
 */
export function ChapterRail({ items, className }: { items: RailItem[]; className?: string }) {
  const ids = items.map((item) => item.id).join(" ");
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const sections = ids
      .split(" ")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      // The chapter whose top most recently crossed a line a third of the way down the window.
      const line = window.innerHeight / 3;
      let current = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= line) current = section;
      }
      // At the very end of the page the last chapter may never reach the line.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = sections[sections.length - 1];
      setActive(current.id);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids]);

  return (
    <nav aria-label="Chapters" className={cn("rounded-xl border border-line bg-panel p-4 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0", className)}>
      <p className="m-0 mb-3 font-mono text-[10px] font-semibold tracking-[0.12em] text-dim">IN THIS CUT</p>
      <ol className="m-0 grid list-none grid-cols-2 gap-x-4 p-0 lg:grid-cols-1 lg:border-l lg:border-line">
        {items.map((item) => {
          const on = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={on ? "location" : undefined}
                className={cn(
                  "relative flex min-h-9 items-baseline gap-2.5 py-2 text-[13px] leading-tight no-underline outline-offset-2 focus-visible:outline-2 focus-visible:outline-playhead lg:-ml-px lg:min-h-0 lg:border-l lg:py-[7px] lg:pl-4",
                  on ? "font-semibold text-white lg:border-playhead" : "text-muted-foreground hover:text-foreground lg:border-transparent",
                )}
              >
                <span className={cn("font-mono text-[10px] font-semibold", on ? "text-playhead" : "text-dim")}>{item.n}</span>
                {item.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
