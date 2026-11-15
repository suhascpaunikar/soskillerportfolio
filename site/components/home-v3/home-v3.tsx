import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Btn, Mark, btn } from "@/components/home/ui";
import { CartArt, MarkerArt } from "@/components/home/work";
import { EMAIL, TOTAL, at, companies, experiments, rangeOf, work, type CompanyId } from "@/lib/career";
import { measurements, pickup } from "@/lib/case-studies";
import { cn } from "@/lib/utils";

import { CopyEmail } from "./copy-email";

/**
 * The home page, third take. It borrows a mood from agentmail.to (warm neutrals, one orange,
 * mono labels, grain) and nothing else: the page is paper, the type is large, and the career
 * runs across it as a strip of film.
 */

const WRAP = "mx-auto w-full max-w-[1360px] px-5 sm:px-8 lg:px-12";
const MONO = "font-mono text-xs uppercase leading-none tracking-[0.04em]";
const FOCUS = "outline-offset-4 focus-visible:outline-2 focus-visible:outline-ink";
const DISPLAY = "font-normal leading-[0.94] tracking-[-0.035em]";

const NAV = [
  { href: "#work", label: "Work" },
  { href: "#backstory", label: "Backstory" },
  { href: "#lab", label: "Lab" },
  { href: "/about", label: "About" },
];

const VERSIONS = [
  { href: "/", label: "V1" },
  { href: "/v2", label: "V2" },
  { href: "/v3", label: "V3" },
  { href: "/v4", label: "V4" },
];

function Versions({ className }: { className?: string }) {
  return (
    <nav aria-label="Versions of this page" className={cn("flex items-center gap-0.5 rounded-md bg-ink/[0.08] p-0.5", className)}>
      {VERSIONS.map((v) => {
        const on = v.href === "/v3";
        return (
          <Link key={v.href} href={v.href} aria-current={on ? "page" : undefined} className={cn(MONO, "rounded px-2 py-2 no-underline", on ? "bg-ink text-paper" : "text-ink/60 hover:text-ink", FOCUS)}>
            {v.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Header() {
  return (
    <header className={cn(WRAP, "flex h-[72px] items-center justify-between gap-4")}>
      <Link href="/v3" className={cn("flex items-center gap-2 rounded text-ink no-underline", FOCUS)}>
        <Mark className="size-6 text-flame" />
        <span className="text-xl font-medium leading-none tracking-[-0.02em]">Suhas Paunikar</span>
      </Link>
      <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className={cn(MONO, "rounded py-2 text-ink/60 no-underline hover:text-ink", FOCUS)}>
            {n.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <Versions className="max-sm:hidden" />
        <Btn href={`mailto:${EMAIL}`} tone="ink" arrow>
          Hire me
        </Btn>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className={cn(WRAP, "pb-14 pt-14 lg:pb-20 lg:pt-24")}>
      <p className={cn("m-0 flex items-center gap-2.5 text-ink/60", MONO)}>
        <i aria-hidden="true" className="block size-2 rounded-full bg-flame" />
        Product designer · open to roles
      </p>
      <h1 className={cn("m-0 mt-8 text-[clamp(44px,7.8vw,116px)] text-ink", DISPLAY)}>
        <span className="text-ink/35">I used to cut films.</span>
        <br />
        Now I cut checkout flows.
      </h1>
      <div className="mt-10 flex flex-col justify-between gap-8 lg:mt-14 lg:flex-row lg:items-end">
        <p className="m-0 max-w-[34ch] text-xl leading-[1.3] tracking-[-0.01em] text-ink/75 lg:text-2xl">
          Product designer for commerce, retail and AI tools, most recently at Lenskart, where store pickup now takes 23 in 100 online orders.
        </p>
        <div className="flex flex-wrap gap-2">
          <Btn href="#work" tone="ink" arrow className="h-10 px-4">
            See the work
          </Btn>
          <Btn href="/resume" tone="ghost-ink" className="h-10 px-4">
            Résumé
          </Btn>
        </div>
      </div>
    </section>
  );
}

const START = at(2019, 4);
const SPAN = TOTAL - START;

const CLIP: Record<CompanyId, string> = {
  oml: "bg-sky text-ink",
  saoji: "bg-sand text-ink",
  ting: "bg-paper text-ink",
  tenk: "bg-stone text-white",
  lenskart: "bg-flame text-ink",
  freelance: "border border-dashed border-white/50 text-white",
};

const SPROCKETS = "h-2.5 bg-[repeating-linear-gradient(90deg,rgb(255_255_255/0.2)_0_14px,transparent_14px_36px)]";

/** Seven years as one strip of film: each job is a clip, as wide as the time it took. */
function Filmstrip() {
  return (
    <section aria-label="Career, 2019 to now" className="grain grain-light relative bg-ink text-white">
      <div className="no-scrollbar relative z-10 overflow-x-auto">
        <div className="min-w-[1080px] px-5 py-6 sm:px-8 lg:px-12">
          <div aria-hidden="true" className={SPROCKETS} />
          <div className="relative mt-5 h-4">
            <span className={cn("absolute left-0 text-white/50", MONO)}>Apr 2019</span>
            {[2020, 2021, 2022, 2023, 2024, 2025, 2026].map((y) => (
              <span key={y} style={{ left: `${((at(y, 1) - START) / SPAN) * 100}%` }} className={cn("absolute border-l border-white/25 pl-1.5 text-white/50", MONO)}>
                {y}
              </span>
            ))}
          </div>
          <ol className="m-0 mt-2 flex list-none gap-1 p-0">
            {companies.map((c) => (
              <li key={c.id} style={{ flexGrow: c.e - c.s }} className={cn("relative flex h-[132px] min-w-0 basis-0 flex-col justify-between overflow-hidden rounded-[4px] p-3", CLIP[c.id], c.id !== "freelance" && c.id !== "tenk" && "grain grain-soft")}>
                <p className="relative z-10 m-0 truncate text-xl leading-none tracking-[-0.02em]">{c.name}</p>
                <div className="relative z-10">
                  <p className="m-0 line-clamp-2 text-sm leading-[1.25] opacity-75">{c.role}</p>
                  <p className={cn("m-0 mt-1.5 truncate opacity-60", MONO, "text-[10px] tracking-normal")}>{c.dates}</p>
                </div>
              </li>
            ))}
          </ol>
          <div aria-hidden="true" className={cn(SPROCKETS, "mt-5")} />
        </div>
      </div>
    </section>
  );
}

const STATS = [
  { value: "23 in 100", label: "online orders now picked up in store", from: "Pickup in store" },
  { value: "2.5×", label: "fewer returns on pickup orders than on delivery", from: "Pickup in store" },
  { value: "70%", label: "faster progressive-lens measurements, live in every store", from: "AI measurements" },
];

function Stats() {
  return (
    <section className={cn(WRAP, "grid gap-x-10 py-16 md:grid-cols-3 lg:py-24")}>
      {STATS.map((s) => (
        <div key={s.value} className="border-t border-ink py-6">
          <p className={cn("m-0 text-ink/55", MONO)}>{s.from}</p>
          <p className={cn("m-0 mt-8 text-[clamp(56px,7vw,96px)] text-ink", DISPLAY)}>{s.value}</p>
          <p className="m-0 mt-4 max-w-[22ch] text-lg leading-[1.3] text-ink/70">{s.label}</p>
        </div>
      ))}
    </section>
  );
}

function SectionHead({ index, label, title }: { index: string; label: string; title: string }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
      <p className={cn("m-0 text-ink/55", MONO)}>
        {index} — {label}
      </p>
      <h2 className={cn("m-0 max-w-[18ch] text-[clamp(34px,4.6vw,64px)] text-ink", DISPLAY, "leading-none")}>{title}</h2>
    </div>
  );
}

function CaseCard({ study, tone, art }: { study: typeof pickup; tone: "ink" | "blue"; art: ReactNode }) {
  const blue = tone === "blue";
  return (
    <article className={cn("flex flex-col overflow-hidden rounded-2xl text-white", blue ? "bg-azure" : "bg-ink")}>
      <div className={cn("grain grain-light relative flex min-h-[300px] items-center justify-center p-6 lg:min-h-[380px]", blue ? "bg-[#0f43c4]" : "bg-stone")}>
        <div className="relative z-10 flex w-full justify-center">{art}</div>
      </div>
      <div className="flex flex-1 flex-col items-start gap-6 p-6 lg:p-8">
        <p className={cn("m-0 text-white/65", MONO)}>
          {study.company} · {study.outcome}
        </p>
        <h3 className="m-0 text-[28px] font-normal leading-[1.08] tracking-[-0.02em] lg:text-4xl">{study.title}</h3>
        <p className="m-0 max-w-[46ch] text-base leading-[1.4] text-white/75">{study.lede}</p>
        <Btn href={`/work/${study.slug}`} tone={blue ? "white" : "paper"} arrow className="mt-auto h-10 px-4">
          Read the case study
        </Btn>
      </div>
    </article>
  );
}

const ALSO = ["cashback", "pos", "websites", "campaigns"].map((id) => work.find((w) => w.id === id)).filter((w) => w !== undefined);

function Work() {
  return (
    <section id="work" className={cn(WRAP, "scroll-mt-6 pb-20 lg:pb-28")}>
      <SectionHead index="01" label="Selected work" title="Two case studies, both live at Lenskart." />
      <div className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-2">
        <CaseCard study={pickup} tone="ink" art={<CartArt />} />
        <CaseCard study={measurements} tone="blue" art={<MarkerArt />} />
      </div>

      <h3 className={cn("m-0 mt-16 text-ink/55 lg:mt-24", MONO)}>Also shipped</h3>
      <ul className="m-0 mt-5 list-none border-b border-ink/20 p-0">
        {ALSO.map((w, i) => (
          <li key={w.id} className="grid gap-x-8 gap-y-2 border-t border-ink/20 py-6 lg:grid-cols-[48px_1fr_1.25fr_260px] lg:items-baseline">
            <span className={cn("text-ink/45", MONO)}>{String(i + 3).padStart(2, "0")}</span>
            <p className="m-0 text-2xl leading-[1.1] tracking-[-0.02em] text-ink lg:text-[28px]">{w.title}</p>
            <p className="m-0 max-w-[52ch] text-base leading-[1.4] text-ink/65">{w.line}</p>
            <span className={cn("text-ink/55 lg:text-right", MONO)}>
              {companies.find((c) => c.id === w.company)?.name} · {rangeOf(w)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

const REELS = [
  {
    n: "Reel 01 · 2019 – 21",
    title: "Film editor",
    body: "Freelance video editor at OML. Digital campaigns for Netflix, Amazon Prime, Tinder and HDFC Life, and videos with creators including Zakir Khan and Biswa Kalyan Rath.",
    cls: "bg-sky",
  },
  {
    n: "Reel 02 · 2021 – 22",
    title: "Founder",
    body: "Started Saoji Spice, a cloud kitchen.",
    todo: "One line on what you built at Saoji Spice and what running it taught you.",
    cls: "bg-sand",
  },
  {
    n: "Reel 03 · 2022 – now",
    title: "Product designer",
    body: "UX designer at Ting, cohort 8 at 10k Designers, product designer at Lenskart, and freelance since March 2026 with clients including Balter and Rainbow Hospitals.",
    cls: "bg-flame",
  },
];

function Backstory() {
  return (
    <section id="backstory" className={cn(WRAP, "scroll-mt-6 pb-20 lg:pb-28")}>
      <SectionHead index="02" label="Backstory" title="Three careers. The cut carried over." />
      <div className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-3">
        {REELS.map((r, i) => (
          <article key={r.title} className={cn("grain grain-soft relative flex min-h-[340px] flex-col justify-between gap-12 rounded-2xl p-6 text-ink lg:min-h-[420px]", r.cls, i === 1 && "lg:mt-10", i === 2 && "lg:mt-20")}>
            <p className={cn("relative z-10 m-0 text-ink/65", MONO)}>{r.n}</p>
            <div className="relative z-10">
              <h3 className={cn("m-0 text-[40px] lg:text-5xl", DISPLAY)}>{r.title}</h3>
              <p className="m-0 mt-5 max-w-[36ch] text-base leading-[1.4] text-ink/80">{r.body}</p>
              {r.todo && <p className="m-0 mt-4 rounded-md border border-dashed border-ink/40 p-3 font-mono text-[13px] leading-[1.5] text-ink/65">[{r.todo}]</p>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Lab() {
  return (
    <section id="lab" className={cn(WRAP, "scroll-mt-6 pb-20 lg:pb-28")}>
      <div className="grain grain-light relative rounded-3xl bg-ink p-6 text-white lg:p-12">
        <div className="relative z-10">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className={cn("m-0 text-white/55", MONO)}>03 — Lab</p>
              <h2 className={cn("m-0 mt-6 max-w-[16ch] text-[clamp(34px,4.6vw,64px)]", DISPLAY, "leading-none")}>Side projects, one question each.</h2>
            </div>
            <Btn href="/lab" tone="paper" arrow className="h-10 w-fit px-4">
              Open the lab
            </Btn>
          </div>
          <ul className="m-0 mt-12 grid list-none gap-px overflow-hidden rounded-xl bg-white/[0.16] p-0 sm:grid-cols-2 lg:grid-cols-5">
            {experiments.map((x) => (
              <li key={x.id} className="flex min-h-[210px] flex-col justify-between gap-8 bg-ink p-5">
                <p className={cn("m-0 text-flame", MONO)}>{x.when}</p>
                <div>
                  <p className="m-0 text-xl leading-[1.15] tracking-[-0.01em]">{x.title}</p>
                  <p className="m-0 mt-3 text-sm leading-[1.4] text-white/65">{x.line}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className={cn(WRAP, "scroll-mt-6")}>
      <div className="grain grain-soft relative rounded-3xl bg-flame p-6 text-ink lg:p-12">
        <div className="relative z-10">
          <p className={cn("m-0 text-ink/70", MONO)}>04 — Next</p>
          <h2 className={cn("m-0 mt-8 text-[clamp(46px,9vw,128px)]", DISPLAY)}>Let’s make the next cut.</h2>
          <div className="mt-12 flex flex-col justify-between gap-8 lg:mt-20 lg:flex-row lg:items-end">
            <a href={`mailto:${EMAIL}`} className={cn("flex w-fit items-center gap-2 break-all rounded text-2xl leading-[1.1] tracking-[-0.02em] text-ink underline decoration-ink/40 underline-offset-[6px] hover:decoration-ink lg:text-4xl", FOCUS)}>
              {EMAIL}
              <ArrowUpRight className="size-6 shrink-0 lg:size-8" strokeWidth={1.5} aria-hidden="true" />
            </a>
            <div className="flex flex-wrap gap-2">
              <CopyEmail className={btn("ink", "h-10 border-0 px-4")} />
              <Btn href="/resume" tone="line-ink" className="h-10 px-4">
                Résumé
              </Btn>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className={cn(WRAP, "flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between")}>
      <p className={cn("m-0 text-ink/55", MONO)}>© 2026 Suhas Paunikar · designed and built by Suhas Paunikar</p>
      <div className="flex items-center gap-6">
        {[
          { href: "/about", label: "About" },
          { href: "/now", label: "Now" },
          { href: "/lab", label: "Lab" },
        ].map((l) => (
          <Link key={l.href} href={l.href} className={cn(MONO, "rounded py-2 text-ink/60 no-underline hover:text-ink", FOCUS)}>
            {l.label}
          </Link>
        ))}
        <Versions />
      </div>
    </footer>
  );
}

export function HomeV3() {
  return (
    <div className="v2 min-h-dvh bg-paper font-figtree text-ink [color-scheme:light]">
      <a href="#main" className="sr-only rounded-md bg-ink px-3 py-2 text-paper focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Filmstrip />
        <Stats />
        <Work />
        <Backstory />
        <Lab />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
