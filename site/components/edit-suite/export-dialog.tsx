"use client";

import { X } from "lucide-react";

import { MetalButton, MetalLink } from "@/components/ui/liquid-metal";
import { cn } from "@/lib/utils";

import { Modal } from "./modal";

const rows: Array<[string, string]> = [
  ["FORMAT", "Product designer"],
  ["PRESET", "[Full-time or contract]"],
  ["DESTINATION", "[City] or remote"],
  ["AVAILABLE", "From [MONTH 2026]"],
];

/** "Export · Hire me": the contact sheet, styled as an editor's export settings. */
export function ExportDialog({
  open,
  onClose,
  copied,
  onCopy,
  variant,
}: {
  open: boolean;
  onClose: () => void;
  copied: boolean;
  onCopy: () => void;
  variant: "center" | "sheet";
}) {
  const sheet = variant === "sheet";
  return (
    <Modal open={open} onClose={onClose} label="Export settings" variant={variant}>
      <div
        className={cn(
          "flex flex-col gap-4 border border-[#34343a] bg-[#17171a] p-5",
          sheet ? "rounded-t-[18px] border-b-0 pb-7" : "rounded-2xl p-[22px]",
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="m-0 text-lg font-semibold text-white">Export settings</h2>
          <MetalButton shape="circle" onClick={onClose} aria-label="Close" autoFocus>
            <X className="size-4" aria-hidden="true" />
          </MetalButton>
        </div>
        <dl className="m-0 flex flex-col rounded-[10px] border border-line">
          {rows.map(([label, value], i) => (
            <div key={label} className={cn("flex justify-between gap-3 px-3.5 py-3", i < rows.length - 1 && "border-b border-line")}>
              <dt className="font-mono text-xs leading-snug text-muted-foreground">{label}</dt>
              <dd className="m-0 text-right text-sm">{value}</dd>
            </div>
          ))}
        </dl>
        <div className={cn("flex gap-3", sheet ? "flex-col" : "flex-wrap")}>
          <MetalButton onClick={onCopy} className={sheet ? "w-full" : "flex-[1_1_160px]"} innerClassName="h-12 w-full text-[15px] font-semibold text-white">
            {copied ? "Copied" : "Copy email"}
          </MetalButton>
          <MetalLink href="/now" className={sheet ? "w-full" : "flex-[1_1_160px]"} innerClassName="h-12 w-full text-[15px] font-semibold">
            Book a 20-min call
          </MetalLink>
          <MetalLink href="/resume" className={sheet ? "w-full" : "flex-[1_1_100px]"} innerClassName="h-12 w-full text-[15px] font-semibold">
            Résumé
          </MetalLink>
        </div>
        <p className="m-0 font-mono text-xs leading-normal text-muted-foreground">Estimated render time: a reply within a day.</p>
      </div>
    </Modal>
  );
}
