import { cn } from "@/lib/utils";

/** Avatar, name and status: the top-left corner of every page. */
export function Identity({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#2e2e34] bg-raised font-mono text-[10px] font-semibold text-soft">
        SP
      </span>
      <div className="min-w-0">
        <p className={cn("m-0 truncate font-semibold leading-tight text-white", compact ? "text-[15px]" : "text-sm")}>Suhas Paunikar</p>
        <p className="m-0 mt-0.5 truncate text-[11px] leading-tight text-muted-foreground">Product designer · open to roles</p>
      </div>
    </div>
  );
}
