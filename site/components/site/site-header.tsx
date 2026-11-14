import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

import { Identity } from "./identity";
import { PrimaryNav } from "./primary-nav";

/**
 * The header on inside pages. Wide screens get the same identity and navigation as the home page;
 * phones get a back button and the page's name. The yellow line under it is a playhead for the page's scroll.
 */
export function SiteHeader({ title, section = "/" }: { title: string; section?: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#1e1e22] bg-app/85 backdrop-blur-md">
      <div className="mx-auto flex h-[60px] max-w-[1280px] items-center justify-between gap-3 px-3.5 sm:px-6 lg:px-10">
        <Link href="/" aria-label="Back to the edit" className={buttonVariants({ size: "icon", className: "lg:hidden" })}>
          <ArrowLeft className="size-4" aria-hidden="true" />
        </Link>
        <p className="m-0 min-w-0 flex-1 truncate text-center font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-soft lg:hidden">{title}</p>
        <span aria-hidden="true" className="size-9 shrink-0 lg:hidden" />

        <Link href="/" className="hidden rounded-lg no-underline outline-offset-4 focus-visible:outline-2 focus-visible:outline-playhead lg:block">
          <Identity />
          <span className="sr-only">, home</span>
        </Link>
        <PrimaryNav current={section} exact={false} className="hidden lg:flex" />
      </div>
      <div aria-hidden="true" className="scroll-playhead absolute inset-x-0 -bottom-px h-px bg-playhead" />
    </header>
  );
}
