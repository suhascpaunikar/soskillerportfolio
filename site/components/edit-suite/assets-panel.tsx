"use client";

import { ArrowUpRight, ChevronLeft, FileText, Film, Folder, IdCard, LayoutGrid, List, Search } from "lucide-react";
import Link from "next/link";
import { useState, type ReactNode } from "react";

import { MetalButton, chromeRim } from "@/components/ui/liquid-metal";
import { companies, experiments, isLive, rangeOf, work, type CompanyId } from "@/lib/career";
import { cn } from "@/lib/utils";

import type { Suite } from "./edit-suite";

interface Item {
  kind: "work" | "exp";
  title: string;
  range: string;
  s: number;
  e: number;
  href?: string;
}

type Tile =
  | { kind: "intro"; id: "intro"; name: string; badge: string; search: string }
  | { kind: "folder"; id: CompanyId | "exps"; name: string; badge: string; search: string; items: Item[]; startAt: number }
  | { kind: "link"; id: string; name: string; badge: string; search: string; href: string }
  | { kind: "contact"; id: "contact"; name: string; badge: string; search: string };

const asItem = (kind: Item["kind"], x: { title: string; s: number; e: number; approx?: boolean; href?: string; when?: string }): Item => ({
  kind,
  title: x.title,
  range: kind === "exp" ? `EXPERIMENT · ${x.when ?? ""}` : rangeOf(x),
  s: x.s,
  e: x.e,
  href: kind === "exp" ? "/lab" : x.href,
});

const companyFolders: Tile[] = companies.map((c) => {
  const items = [
    ...work.filter((w) => w.company === c.id).map((w) => asItem("work", w)),
    ...experiments.filter((x) => x.s >= c.s && x.s < c.e).map((x) => asItem("exp", x)),
  ];
  return {
    kind: "folder",
    id: c.id,
    name: c.folder,
    badge: String(items.length),
    search: `${c.folder} ${c.name} ${items.map((i) => i.title).join(" ")}`,
    items,
    startAt: c.s,
  };
});

const TILES: Tile[] = [
  { kind: "intro", id: "intro", name: "INTRO", badge: "0:00", search: "intro suhas paunikar name email" },
  ...companyFolders,
  {
    kind: "folder",
    id: "exps",
    name: "EXPERIMENTS",
    badge: String(experiments.length),
    search: `experiments lab concepts ${experiments.map((x) => x.title).join(" ")}`,
    items: experiments.map((x) => asItem("exp", x)),
    startAt: experiments[0].s,
  },
  { kind: "link", id: "resume", name: "RESUME.pdf", badge: "PDF", search: "resume cv", href: "/resume" },
  { kind: "link", id: "about", name: "ABOUT.txt", badge: "TXT", search: "about story previously", href: "/about" },
  { kind: "contact", id: "contact", name: "CONTACT.vcf", badge: "VCF", search: "contact email hire export call" },
];

const TILE_SHADOW = "0 0 0 1px rgba(0,0,0,0.3), 0 9px 9px rgba(0,0,0,0.12), 0 2px 5px rgba(0,0,0,0.15)";
const TILE_GLOW = "0 0 0 1px rgba(0,0,0,0.3), 0 0 20px rgba(201,211,255,0.5), 0 2px 5px rgba(0,0,0,0.15)";

function TileIcon({ tile, className }: { tile: Tile; className?: string }) {
  if (tile.kind === "folder") return <Folder aria-hidden="true" className={cn("fill-[#4b4b55] stroke-[#4b4b55]", className)} />;
  if (tile.kind === "intro") return <Film aria-hidden="true" strokeWidth={1.6} className={cn("text-muted-foreground", className)} />;
  if (tile.kind === "contact") return <IdCard aria-hidden="true" strokeWidth={1.6} className={cn("text-muted-foreground", className)} />;
  return <FileText aria-hidden="true" strokeWidth={1.6} className={cn("text-muted-foreground", className)} />;
}

export function AssetsPanel({
  suite,
  variant,
  onPick,
}: {
  suite: Suite;
  variant: "sidebar" | "sheet";
  /** Called after an item is chosen, so a sheet can close itself. */
  onPick?: () => void;
}) {
  const [query, setQuery] = useState("");
  const [listView, setListView] = useState(false);
  const [folderId, setFolderId] = useState<Tile["id"] | null>(null);
  const sheet = variant === "sheet";
  const { frame } = suite;

  const q = query.trim().toLowerCase();
  const tiles = TILES.filter((t) => !q || t.search.toLowerCase().includes(q));
  const folder = !q && folderId ? TILES.find((t): t is Extract<Tile, { kind: "folder" }> => t.kind === "folder" && t.id === folderId) : undefined;
  const isActive = (t: Tile) => (t.kind === "intro" ? frame.isIntro : t.kind === "folder" && frame.company?.id === t.id);

  const choose = (t: Tile) => {
    if (t.kind === "folder") {
      suite.jump(t.startAt);
      setFolderId(t.id);
    } else if (t.kind === "intro") {
      suite.jump(0);
      onPick?.();
    } else if (t.kind === "contact") {
      onPick?.();
      suite.openExport();
    }
  };

  const tileBody = (t: Tile, size: "grid" | "list") =>
    size === "grid" ? (
      <>
        <span
          className={cn("metal relative flex items-center justify-center", sheet ? "h-16 rounded-2xl" : "h-[50px] rounded-[14px]")}
          style={{ ...chromeRim(), boxShadow: isActive(t) ? TILE_GLOW : TILE_SHADOW }}
        >
          <span className="absolute left-1.5 top-1.5 rounded bg-[#2a2a30] px-[5px] py-[3px] font-mono text-[10px] font-semibold leading-none text-soft">{t.badge}</span>
          <TileIcon tile={t} className="size-[26px]" />
        </span>
        <span className="truncate text-[11px] font-semibold tracking-[0.02em]">{t.name}</span>
      </>
    ) : (
      <>
        <TileIcon tile={t} className="size-[18px] shrink-0" />
        <span className="min-w-0 flex-1 truncate text-xs font-semibold">{t.name}</span>
        <span className="font-mono text-[10px] text-dim">{t.badge}</span>
      </>
    );

  const renderTile = (t: Tile, size: "grid" | "list"): ReactNode => {
    const cls =
      size === "grid"
        ? "flex min-w-0 flex-col gap-[7px] rounded-[14px] text-left text-foreground no-underline outline-offset-4 focus-visible:outline-2 focus-visible:outline-playhead"
        : cn("flex min-h-10 w-full items-center gap-2.5 rounded-lg px-2 text-left text-foreground no-underline", isActive(t) && "bg-[#1b1f2b]");
    if (t.kind === "link") {
      return (
        <Link key={t.id} href={t.href} className={cls} onClick={onPick}>
          {tileBody(t, size)}
        </Link>
      );
    }
    const aria =
      t.kind === "folder"
        ? `Open the ${t.name} folder, ${t.badge} items, and move the playhead there`
        : t.kind === "intro"
          ? "Move the playhead to the intro"
          : "Open contact and hiring details";
    return (
      <button key={t.id} type="button" aria-label={aria} className={cn(cls, "cursor-pointer")} onClick={() => choose(t)}>
        {tileBody(t, size)}
      </button>
    );
  };

  return (
    <div className={cn("flex min-h-0 flex-col", sheet ? "flex-1" : "h-full")}>
      {!sheet && (
        <>
          <div className="flex h-11 shrink-0 items-center justify-between px-3.5">
            <div aria-hidden="true" className="flex gap-2">
              <span className="size-3 rounded-full bg-[#ff5f57]" />
              <span className="size-3 rounded-full bg-[#febc2e]" />
              <span className="size-3 rounded-full bg-[#28c840]" />
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2.5 border-b border-line px-3.5 pb-3.5 pt-0.5">
            <span aria-hidden="true" className="flex size-[30px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#4b4b55] font-mono text-[10px] font-semibold text-muted-foreground">
              SP
            </span>
            <div className="min-w-0">
              <h1 className="m-0 text-sm font-semibold leading-tight text-white">Suhas Paunikar</h1>
              <p className="m-0 mt-0.5 text-xs leading-snug text-muted-foreground">Product designer · open to roles</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center justify-between py-2.5 pl-3.5 pr-2.5">
            <h2 className="m-0 text-[13px] font-semibold">
              Assets <span className="font-medium text-dim">({TILES.length})</span>
            </h2>
            <MetalButton
              shape="circle"
              innerClassName="size-8"
              onClick={() => setListView((v) => !v)}
              aria-label={listView ? "Show assets as a grid" : "Show assets as a list"}
              title={listView ? "Show assets as a grid" : "Show assets as a list"}
            >
              {listView ? <LayoutGrid className="size-3.5" aria-hidden="true" /> : <List className="size-3.5" aria-hidden="true" />}
            </MetalButton>
          </div>
        </>
      )}

      <div className={cn("shrink-0", sheet ? "px-4 pb-2.5" : "px-3.5 pb-3")}>
        <label className="block">
          <span className={cn(sheet ? "mb-1.5 block font-mono text-[10px] font-semibold tracking-[0.08em] text-muted-foreground" : "sr-only")}>
            {sheet ? "SEARCH" : "Search assets"}
          </span>
          <span className="relative block">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-dim" />
            <input
              type="search"
              autoComplete="off"
              placeholder={sheet ? undefined : "Search"}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setFolderId(null);
              }}
              className={cn(
                "w-full rounded-full border border-input bg-raised pl-9 pr-3 text-foreground placeholder:text-dim focus-visible:outline-2 focus-visible:outline-[#c9d3ff]",
                sheet ? "h-11 text-base" : "h-[38px] text-[13px]",
              )}
            />
          </span>
        </label>
      </div>

      <div className={cn("min-h-0 flex-1 overflow-y-auto", sheet ? "px-4 pb-5 pt-1.5" : "px-3.5 pb-4 pt-1")}>
        {folder ? (
          <div className="flex flex-col gap-1.5">
            <MetalButton onClick={() => setFolderId(null)} className="mb-1 self-start" innerClassName={cn("pl-2 pr-3.5 text-xs", sheet ? "h-10 text-sm" : "h-[34px]")}>
              <ChevronLeft className="size-4" aria-hidden="true" />
              All assets
            </MetalButton>
            <p className="m-0 mb-1 ml-0.5 font-mono text-[11px] font-semibold tracking-[0.06em] text-muted-foreground">
              {folder.name} · {folder.items.length} {folder.items.length === 1 ? "item" : "items"}
            </p>
            <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
              {folder.items.map((item) => (
                <li key={item.title} className={cn("flex items-center gap-0.5 rounded-lg", !frame.isIntro && isLive(item, suite.pos) && "bg-[#1f1f24]")}>
                  <button
                    type="button"
                    onClick={() => {
                      suite.jump(item.s);
                      onPick?.();
                    }}
                    className={cn("flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-left", sheet ? "min-h-[52px]" : "min-h-12")}
                  >
                    <span aria-hidden="true" className={cn("size-2.5 shrink-0 rounded-[3px]", item.kind === "exp" ? "bg-exp" : "bg-work")} />
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className={cn("font-semibold leading-tight", sheet ? "text-sm" : "text-xs")}>{item.title}</span>
                      <span className="font-mono text-[10px] leading-tight text-dim">{item.range}</span>
                    </span>
                  </button>
                  {item.href && (
                    <Link href={item.href} aria-label={`Open ${item.title}`} title={`Open ${item.title}`} className="flex size-10 shrink-0 items-center justify-center rounded-lg text-soft">
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : tiles.length === 0 ? (
          <p className="m-0 my-2 text-[13px] leading-normal text-muted-foreground">No assets match “{query}”.</p>
        ) : listView && !sheet ? (
          <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
            {tiles.map((t) => (
              <li key={t.id}>{renderTile(t, "list")}</li>
            ))}
          </ul>
        ) : (
          <div className={cn("grid gap-x-2.5", sheet ? "grid-cols-3 gap-y-3.5" : "grid-cols-2 gap-y-2.5")}>{tiles.map((t) => renderTile(t, "grid"))}</div>
        )}
      </div>
    </div>
  );
}
