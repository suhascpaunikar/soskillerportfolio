import { Film, ImageIcon } from "lucide-react";
import Image from "next/image";

import type { Ratio, Shot } from "@/lib/case-studies";
import { cn } from "@/lib/utils";

import { Clip } from "./clip";

const RATIO: Record<Ratio, string> = {
  "16/9": "aspect-[16/9]",
  "3/2": "aspect-[3/2]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "4/5": "aspect-[4/5]",
  "3/4": "aspect-[3/4]",
  "9/16": "aspect-[9/16]",
};

/** The same dashed, striped slot the home page's monitor uses for media that isn't in yet. */
export const SLOT_STRIPES = "repeating-linear-gradient(135deg, rgba(255,255,255,0.035) 0 10px, rgba(255,255,255,0) 10px 20px)";

/** Files in public/ are served under the repo path on GitHub Pages (see next.config.ts). Imported images already carry it. */
const withBase = (path: string) => `${process.env.PAGES_BASE_PATH ?? ""}${path}`;

const CORNERS = ["-left-1 -top-1", "-right-1 -top-1", "-bottom-1 -left-1", "-bottom-1 -right-1"] as const;

/** What a slot shows until its picture is added: "This image will come here", and what belongs in it. */
function Placeholder({ shot, compact, square }: { shot: Shot; compact: boolean; square: boolean }) {
  const what = shot.kind === "video" ? "video" : "image";
  const SlotIcon = shot.kind === "video" ? Film : ImageIcon;
  return (
    <div
      role="img"
      aria-label={`Placeholder. This ${what} will come here: ${shot.label}`}
      className={cn(
        "absolute inset-0 flex flex-col items-center justify-center border border-dashed border-[#3a3a44] text-center",
        !square && "rounded-[10px]",
        compact ? "gap-1.5 p-2" : "gap-2.5 p-5",
      )}
      style={{ background: SLOT_STRIPES }}
    >
      <SlotIcon className={cn("text-dim", compact ? "size-4" : "size-5")} strokeWidth={1.75} aria-hidden="true" />
      <p className={cn("m-0 font-mono font-semibold text-muted-foreground", compact ? "text-[9px] leading-[1.35]" : "text-xs leading-snug")}>This {what} will come here</p>
      {!compact && <p className="m-0 max-w-[40ch] text-balance text-sm leading-snug text-soft">{shot.label}</p>}
      {!compact && shot.source && <p className="m-0 max-w-[44ch] text-balance font-mono text-[10px] leading-normal text-dim">{shot.source}</p>}
    </div>
  );
}

/**
 * One picture slot with its caption.
 * `monitor` draws the home page's program-monitor outline around it (used for the hero);
 * `compact` is for thumbnail-sized slots, where the placeholder only has room for its one line.
 */
export function Figure({
  shot,
  className,
  compact = false,
  monitor = false,
  eager = false,
  sizes = "(min-width: 1024px) 860px, 100vw",
}: {
  shot: Shot;
  className?: string;
  compact?: boolean;
  monitor?: boolean;
  eager?: boolean;
  sizes?: string;
}) {
  const { src } = shot;
  const alt = shot.alt ?? shot.label;
  const box = cn("relative w-full overflow-hidden bg-screen", !monitor && "rounded-[10px]", RATIO[shot.ratio ?? "16/9"]);

  let media;
  if (!src) {
    media = (
      <div className={box}>
        <Placeholder shot={shot} compact={compact} square={monitor} />
      </div>
    );
  } else if (shot.kind === "video") {
    media = <div className={box}>{typeof src === "string" && <Clip src={withBase(src)} poster={shot.poster ? withBase(shot.poster) : undefined} label={alt} />}</div>;
  } else if (typeof src === "string") {
    media = (
      <div className={box}>
        <Image src={withBase(src)} alt={alt} fill sizes={sizes} loading={eager ? "eager" : "lazy"} className="object-contain" />
      </div>
    );
  } else {
    media = <Image src={src} alt={alt} sizes={sizes} loading={eager ? "eager" : "lazy"} className={cn("h-auto w-full", !monitor && "rounded-[10px]")} />;
  }

  return (
    <figure className={cn("m-0 flex min-w-0 flex-col gap-2.5", className)}>
      {monitor ? (
        <div className="relative">
          {media}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 outline outline-[1.5px] outline-select" />
          {CORNERS.map((corner) => (
            <span key={corner} aria-hidden="true" className={cn("absolute size-2 bg-white shadow-[0_0_0_1.5px_var(--color-select)]", corner)} />
          ))}
        </div>
      ) : (
        media
      )}
      {shot.caption && <figcaption className="text-[13px] leading-normal text-muted-foreground">{shot.caption}</figcaption>}
    </figure>
  );
}
