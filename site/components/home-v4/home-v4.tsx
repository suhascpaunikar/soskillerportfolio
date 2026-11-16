import { ArrowRight, ArrowUpRight, Download, Mail } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { CopyEmail } from "@/components/home-v3/copy-email";
import { Mark } from "@/components/home/ui";
import { EMAIL, companies, experiments } from "@/lib/career";
import { cn } from "@/lib/utils";

import { WorkGrid } from "./work-grid";

/**
 * The home page, fourth take. It learns from five designers' portfolios rather than a product site:
 * the bio is a paragraph you read, not a headline; the navigation floats at the bottom;
 * work sits in cards you can filter; and the tone is first person throughout.
 */

const WRAP = "mx-auto w-full max-w-[1120px] px-5 sm:px-8";
const MONO = "font-mono text-[11px] uppercase leading-none tracking-[0.06em]";
const FOCUS = "outline-offset-4 focus-visible:outline-2 focus-visible:outline-[#1e1e20]";
const INK = "text-[#1e1e20]";

const VERSIONS = [
  { href: "/", label: "V1" },
  { href: "/v2", label: "V2" },
  { href: "/v3", label: "V3" },
  { href: "/v4", label: "V4" },
];

function Header() {
  return (
    <header className={cn(WRAP, "flex h-[72px] items-center justify-between gap-4")}>
      <Link href="/v4" className={cn("flex items-center gap-2 rounded no-underline", INK, FOCUS)}>
        <Mark className="size-5 text-flame" />
        <span className="text-[17px] font-medium leading-none tracking-[-0.01em]">Suhas Paunikar</span>
      </Link>
      <nav aria-label="Versions of this page" className="flex items-center gap-0.5 rounded-full border border-black/10 bg-white p-0.5">
        {VERSIONS.map((v) => {
          const on = v.href === "/v4";
          return (
            <Link key={v.href} href={v.href} aria-current={on ? "page" : undefined} className={cn(MONO, "rounded-full px-2.5 py-2 no-underline", on ? "bg-[#1e1e20] text-white" : "text-black/55 hover:text-black", FOCUS)}>
              {v.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

/** A word the eye should land on. */
const B = ({ children }: { children: ReactNode }) => <span className={cn("font-medium", INK)}>{children}</span>;
/** A place I have left. */
const Was = ({ children }: { children: ReactNode }) => <s className="decoration-black/40 decoration-[1.5px]">{children}</s>;

function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("mx-0.5 inline-block rounded-lg px-2 py-0.5 align-baseline font-medium", className)}>{children}</span>;
}

function Hero() {
  return (
    <section className={cn(WRAP, "grid gap-12 pb-16 pt-10 lg:grid-cols-[1fr_280px] lg:gap-16 lg:pb-24 lg:pt-20")}>
      <div>
        <p className="m-0 font-serif text-2xl italic text-black/50">I used to cut films. Now I cut checkout flows.</p>
        <h1 className="m-0 mt-7 text-[26px] font-normal leading-[1.4] tracking-[-0.015em] text-[#a09a94] sm:text-[30px] lg:text-[34px]">
          I am
          <Chip className="bg-sky/60 text-[#1d4a73]">Suhas,</Chip>a <B>product designer</B> who got here by way of <Was>film editing</Was> → <Was>a cloud kitchen</Was> → <B>checkout flows</B>.
        </h1>
        <div className="mt-7 flex flex-col gap-7 text-[26px] leading-[1.4] tracking-[-0.015em] text-[#a09a94] sm:text-[30px] lg:text-[34px]">
          <p className="m-0">
            Before design I edited campaigns for <B>Netflix, Prime Video and Tinder</B> at OML, then started
            <Chip className="mr-0 bg-sand/60 text-[#6b4a33]">Saoji Spice</Chip>, a cloud kitchen.
          </p>
          <p className="m-0">
            Most recently at
            <Chip className="bg-flame/15 text-[#b84a00]">Lenskart</Chip>I redesigned store pickup, which now takes <B>23 in 100 online orders</B>, and an iPad flow that made lens measurements <B>70% faster</B>.
          </p>
          <p className="m-0">
            I am freelancing now, and <span className="font-medium text-flame">open to the next full-time team</span>.
          </p>
        </div>
      </div>

      <aside aria-label="Now" className="h-fit rounded-[20px] border border-black/[0.07] bg-white p-5 text-sm leading-[1.5] text-black/60 lg:mt-14 lg:-rotate-1">
        <p className={cn("m-0 flex items-center gap-2 text-black/50", MONO)}>
          <i aria-hidden="true" className="block size-2 rounded-full bg-[#2fa36b]" />
          now
        </p>
        <ul className="m-0 mt-4 flex list-none flex-col gap-1.5 p-0">
          <li>
            → Freelance product design for <B>Balter</B> and <B>Rainbow Hospitals</B>
          </li>
          <li>
            → Open to the next <B>full-time team</B>
          </li>
        </ul>
        <p className="m-0 mt-4">
          Previously at <B>Lenskart</B>, <B>Ting</B>, <B>OML</B>
        </p>
        <p className="m-0 mt-4">
          Reach out via{" "}
          <a href={`mailto:${EMAIL}`} className={cn("rounded font-medium underline decoration-black/30 underline-offset-4 hover:decoration-black", INK, FOCUS)}>
            email
          </a>
        </p>
        <div className="mt-5 flex flex-wrap gap-2 border-t border-black/[0.07] pt-4">
          <Link href="/resume" className={cn("flex h-8 items-center gap-1.5 rounded-full bg-[#1e1e20] px-3.5 text-[13px] font-medium text-white no-underline hover:bg-black", FOCUS)}>
            Résumé <Download className="size-3.5" aria-hidden="true" />
          </Link>
          <CopyEmail className={cn("flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-black/15 bg-transparent px-3.5 text-[13px] font-medium text-black/70 hover:border-black/40 hover:text-black", FOCUS)} />
        </div>
      </aside>
    </section>
  );
}

const WORKED_WITH = ["Lenskart", "Netflix", "Prime Video", "Tinder", "HDFC Life", "LA Times", "Vedanta", "Dabur UK"];

function WorkedWith() {
  return (
    <section aria-label="Worked with" className={WRAP}>
      <div className="flex flex-col gap-4 rounded-[20px] bg-[#1e1e20] px-6 py-5 text-white sm:flex-row sm:items-center sm:gap-8">
        <p className={cn("m-0 shrink-0 text-flame", MONO)}>Designed and edited for</p>
        <ul className="m-0 flex list-none flex-wrap gap-x-7 gap-y-2 p-0 text-lg font-medium leading-none tracking-[-0.01em] text-white/80">
          {WORKED_WITH.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Head({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="text-center">
      <p className="m-0 font-serif text-2xl italic text-black/50">{kicker}</p>
      <h2 className={cn("m-0 mt-2 text-[34px] font-normal leading-[1.1] tracking-[-0.025em] lg:text-5xl", INK)}>{title}</h2>
    </div>
  );
}

function Work() {
  return (
    <section id="work" className={cn(WRAP, "scroll-mt-10 pt-24 lg:pt-32")}>
      <Head kicker="the work" title="Things I have shipped" />
      <WorkGrid />
    </section>
  );
}

const year = (dates: string) => dates.match(/\d{4}/)?.[0] ?? "";

function Timeline() {
  return (
    <section id="timeline" className={cn(WRAP, "scroll-mt-10 pt-24 lg:pt-32")}>
      <Head kicker="a quick tour" title="2019 to now" />
      <ol className="m-0 mt-12 grid list-none gap-x-4 gap-y-8 p-0 sm:grid-cols-2 lg:grid-cols-6">
        {companies.map((c, i) => (
          <li key={c.id} className="relative border-t border-black/15 pt-5">
            <i aria-hidden="true" className={cn("absolute -top-[5px] left-0 block size-[9px] rounded-full", c.focus ? "bg-flame" : "bg-[#1e1e20]")} />
            <p className={cn("m-0 text-[40px] font-medium leading-none tracking-[-0.03em]", c.focus ? "text-flame" : i === companies.length - 1 ? INK : "text-[#b9b3ad]")}>{year(c.dates)}</p>
            <p className={cn("m-0 mt-4 text-lg font-medium leading-[1.2]", INK)}>{c.name}</p>
            <p className="m-0 mt-1 text-sm leading-[1.4] text-black/55">{c.role}</p>
            <p className={cn("m-0 mt-3 text-black/40", MONO)}>{c.dates}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

const TINT = ["bg-[#fde9d6]", "bg-[#dfeaf6]", "bg-[#e6f2dc]", "bg-[#efe3f5]", "bg-[#f6ecc9]"];

function Side() {
  return (
    <section id="side" className="scroll-mt-10 pt-24 lg:pt-32">
      <div className={WRAP}>
        <Head kicker="on the side" title="Experiments from the lab" />
      </div>
      <ul className="no-scrollbar m-0 mt-12 flex list-none gap-4 overflow-x-auto px-5 pb-2 sm:px-8 lg:justify-center">
        {experiments.map((x, i) => (
          <li key={x.id} className="w-[250px] shrink-0">
            <p className={cn("m-0 text-black/55", MONO, "leading-[1.5]")}>
              {x.short} / side project / {x.when.toLowerCase()}
            </p>
            <div className={cn("mt-3 flex h-[250px] flex-col justify-between rounded-[20px] p-5", TINT[i % TINT.length], i % 2 ? "rotate-1" : "-rotate-1")}>
              <p className={cn("m-0 text-2xl font-medium leading-[1.1] tracking-[-0.02em]", INK)}>{x.title}</p>
              <p className="m-0 text-sm leading-[1.45] text-black/65">{x.line}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="m-0 mt-8 text-center">
        <Link href="/lab" className={cn("inline-flex items-center gap-1.5 rounded text-[15px] font-medium underline decoration-black/30 underline-offset-4 hover:decoration-black", INK, FOCUS)}>
          Open the lab <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </p>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className={cn(WRAP, "scroll-mt-10 pt-24 lg:pt-32")}>
      <div className="rounded-[28px] bg-[#1e1e20] px-6 py-14 text-center text-[#f5f4f0] lg:py-24">
        <p className="m-0 font-serif text-2xl italic text-white/50">got a flow that needs cutting?</p>
        <h2 className="m-0 mx-auto mt-4 max-w-[14ch] text-[44px] font-normal leading-none tracking-[-0.03em] lg:text-[80px]">
          Drop me a cold <span className="font-semibold">email</span>
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <a href={`mailto:${EMAIL}`} className="flex h-11 items-center gap-2 rounded-full bg-[#f5f4f0] px-5 text-[15px] font-medium text-[#1e1e20] no-underline outline-offset-4 hover:bg-white focus-visible:outline-2 focus-visible:outline-white">
            {EMAIL} <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
          <CopyEmail className="flex h-11 cursor-pointer items-center gap-2 rounded-full border border-white/25 bg-transparent px-5 text-[15px] font-medium text-white/80 outline-offset-4 hover:border-white/60 hover:text-white focus-visible:outline-2 focus-visible:outline-white" />
        </div>
      </div>
    </section>
  );
}

const DOCK = [
  { href: "#work", label: "work" },
  { href: "#timeline", label: "timeline" },
  { href: "#side", label: "play" },
  { href: "/about", label: "about", wide: true },
];

/** The navigation: a pill that floats at the bottom of the screen, within thumb reach. */
function Dock() {
  return (
    <nav aria-label="Primary" className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-3">
      <div className="flex items-center gap-0.5 rounded-full border border-black/10 bg-white/90 p-1 text-[13px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md">
        {DOCK.map((d) => (
          <Link key={d.href} href={d.href} className={cn("whitespace-nowrap rounded-full px-3 py-2 leading-none text-black/60 no-underline hover:bg-black/[0.05] hover:text-black max-sm:px-2.5", "wide" in d && "max-sm:hidden", FOCUS)}>
            {d.label}
          </Link>
        ))}
        <Link href="/resume" className={cn("ml-1 flex items-center gap-1 whitespace-nowrap rounded-full bg-flame/15 px-3 py-2 font-medium leading-none text-[#b84a00] no-underline hover:bg-flame/25", FOCUS)}>
          résumé <Download className="size-3" aria-hidden="true" />
        </Link>
        <a href={`mailto:${EMAIL}`} className={cn("flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#1e1e20] px-3 py-2 font-medium leading-none text-white no-underline hover:bg-black", FOCUS)}>
          <Mail className="size-3" aria-hidden="true" /> say hi
        </a>
      </div>
    </nav>
  );
}

export function HomeV4() {
  return (
    <div className="v2 min-h-dvh bg-[#f5f4f0] bg-[radial-gradient(rgb(0_0_0/0.09)_1px,transparent_1px)] font-figtree text-[#1e1e20] [background-size:18px_18px] [color-scheme:light]">
      <a href="#main" className="sr-only rounded-md bg-[#1e1e20] px-3 py-2 text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <WorkedWith />
        <Work />
        <Timeline />
        <Side />
        <Contact />
      </main>
      <footer className={cn(WRAP, "pb-28 pt-10 text-center text-black/45", MONO)}>© 2026 Suhas Paunikar · designed and built by Suhas Paunikar</footer>
      <Dock />
    </div>
  );
}
