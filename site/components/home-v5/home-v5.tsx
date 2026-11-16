import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { CopyEmail } from "@/components/home-v3/copy-email";
import { CartArt, MarkerArt } from "@/components/home/work";
import { VersionSwitch } from "@/components/versions/switch";
import { EMAIL } from "@/lib/career";
import { measurements, pickup } from "@/lib/case-studies";
import { AI_WORKFLOW, BEFORE, EXPERIENCE, RESULTS, TITLE } from "@/lib/profile";
import { cn } from "@/lib/utils";

/**
 * Home page, version 5: impact first.
 * The numbers are the hero. White page, black rules, heavy type, one blue.
 */

const WRAP = "mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-10";
const MONO = "font-mono text-[11px] uppercase leading-none tracking-[0.08em]";
const FOCUS = "outline-offset-4 focus-visible:outline-2 focus-visible:outline-black";
const HEAVY = "font-semibold leading-[0.95] tracking-[-0.045em]";

function Header() {
  return (
    <header className="border-b border-black">
      <div className={cn(WRAP, "flex h-16 items-center justify-between gap-4")}>
        <Link href="/v5" className={cn("flex items-baseline gap-3 rounded text-black no-underline", FOCUS)}>
          <span className="whitespace-nowrap text-lg font-semibold leading-none tracking-[-0.02em]">Suhas Paunikar</span>
          <span className={cn("text-black/55 max-lg:hidden", MONO)}>{TITLE}</span>
        </Link>
        <div className="flex items-center gap-2">
          <VersionSwitch current="/v5" />
          <a href={`mailto:${EMAIL}`} className={cn("flex h-9 items-center gap-1.5 whitespace-nowrap bg-azure max-sm:hidden px-3.5 text-sm font-semibold text-white no-underline hover:bg-black", FOCUS)}>
            Email me <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className={cn(WRAP, "pb-12 pt-12 lg:pb-16 lg:pt-20")}>
      <p className={cn("m-0 text-black/60", MONO)}>{TITLE} · 4 years · commerce, retail and AI tools</p>
      <h1 className={cn("m-0 mt-6 max-w-[13ch] text-[clamp(48px,9.4vw,136px)] text-black", HEAVY)}>
        I design products that move <span className="text-azure">the numbers.</span>
      </h1>
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <p className="m-0 max-w-[46ch] text-xl leading-[1.35] tracking-[-0.01em] text-black/75 lg:text-2xl">
          Four years designing checkout, in-store and AI products, most recently at Lenskart. I work AI-first, from research to shipped front-end, and I measure what I ship.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href="#work" className={cn("flex h-11 items-center gap-2 bg-black px-5 text-[15px] font-semibold text-white no-underline hover:bg-azure", FOCUS)}>
            See the results <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link href="/resume" className={cn("flex h-11 items-center border border-black px-5 text-[15px] font-semibold text-black no-underline hover:bg-black hover:text-white", FOCUS)}>
            Résumé
          </Link>
        </div>
      </div>
    </section>
  );
}

function Results() {
  return (
    <section aria-label="Results" className="border-y border-black">
      <div className={cn(WRAP, "grid sm:grid-cols-2 lg:grid-cols-4")}>
        {RESULTS.map((r, i) => (
          <Link
            key={r.value}
            href={r.href}
            className={cn("group flex min-h-[250px] flex-col justify-between gap-10 border-black py-6 text-black no-underline max-sm:border-t max-sm:first:border-t-0 sm:px-6 sm:first:pl-0 lg:border-l lg:first:border-l-0", i === 1 && "sm:max-lg:border-l", i === 3 && "sm:max-lg:border-l", i > 1 && "sm:max-lg:border-t", FOCUS)}
          >
            <p className={cn("m-0 flex items-center justify-between text-black/55", MONO)}>
              {r.from}
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </p>
            <div>
              <p className={cn("m-0 whitespace-nowrap text-[clamp(52px,5.2vw,76px)]", HEAVY, i === 0 && "text-azure")}>
                {r.value}
                {r.unit && <span className="ml-2 text-[0.4em] tracking-[-0.02em]">{r.unit}</span>}
              </p>
              <p className="m-0 mt-3 max-w-[22ch] text-base leading-[1.35] text-black/70">{r.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function SectionHead({ n, label, title }: { n: string; label: string; title: string }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
      <p className={cn("m-0 text-black/60", MONO)}>
        {n} / {label}
      </p>
      <h2 className={cn("m-0 max-w-[18ch] text-[clamp(34px,4.6vw,64px)] text-black", HEAVY, "leading-none")}>{title}</h2>
    </div>
  );
}

function Case({ study, art, tint }: { study: typeof pickup; art: ReactNode; tint: string }) {
  return (
    <article className="grid border-t border-black lg:grid-cols-[240px_1fr_minmax(0,460px)]">
      <dl className="m-0 flex flex-col gap-4 py-6 lg:pr-6">
        {study.facts.map((f) => (
          <div key={f.label}>
            <dt className={cn("text-black/50", MONO)}>{f.label}</dt>
            <dd className="m-0 mt-1.5 text-sm leading-[1.35] text-black/80">{f.value}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-col items-start gap-6 border-black py-6 lg:border-l lg:px-8">
        <h3 className="m-0 text-[28px] font-semibold leading-[1.05] tracking-[-0.03em] lg:text-[40px]">{study.title}</h3>
        <p className="m-0 max-w-[48ch] text-lg leading-[1.4] text-black/70">{study.lede}</p>
        <ul className="m-0 flex list-none flex-wrap gap-x-8 gap-y-4 p-0">
          {study.stats.map((s) => (
            <li key={s.value}>
              <p className="m-0 text-2xl font-semibold leading-none tracking-[-0.03em] text-azure">{s.value}</p>
              <p className="m-0 mt-1.5 max-w-[20ch] text-[13px] leading-[1.3] text-black/60">{s.label}</p>
            </li>
          ))}
        </ul>
        <Link href={`/work/${study.slug}`} className={cn("mt-auto flex h-10 items-center gap-2 bg-black px-4 text-sm font-semibold text-white no-underline hover:bg-azure", FOCUS)}>
          Read the case study <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
      <div className={cn("flex min-h-[300px] items-center justify-center p-6 lg:my-6", tint)}>{art}</div>
    </article>
  );
}

function Work() {
  return (
    <section id="work" className={cn(WRAP, "scroll-mt-6 py-20 lg:py-28")}>
      <SectionHead n="01" label="Selected work" title="Two products, live at Lenskart, with the numbers to show for it." />
      <div className="mt-12 border-b border-black lg:mt-16">
        <Case study={pickup} art={<CartArt />} tint="bg-[#3a3532]" />
        <Case study={measurements} art={<MarkerArt />} tint="bg-azure" />
      </div>
    </section>
  );
}

function Workflow() {
  return (
    <section id="ai" className="bg-black text-white">
      <div className={cn(WRAP, "py-20 lg:py-28")}>
        <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
          <p className={cn("m-0 text-white/60", MONO)}>02 / How I work</p>
          <h2 className={cn("m-0 max-w-[16ch] text-[clamp(34px,4.6vw,64px)]", HEAVY, "leading-none")}>AI is in every step, and I can build what I design.</h2>
        </div>
        <ol className="m-0 mt-12 grid list-none border-t border-white/30 p-0 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {AI_WORKFLOW.map((w, i) => (
            <li key={w.id} className="flex min-h-[280px] flex-col justify-between gap-8 border-white/30 py-6 max-sm:border-b sm:px-6 sm:first:pl-0 lg:border-l lg:first:border-l-0">
              <p className={cn("m-0 text-[56px] text-white/25", HEAVY)}>{String(i + 1).padStart(2, "0")}</p>
              <div>
                <h3 className="m-0 text-2xl font-semibold leading-[1.1] tracking-[-0.03em]">{w.step}</h3>
                <p className="m-0 mt-3 text-[15px] leading-[1.45] text-white/70">{w.body}</p>
                <p className={cn("m-0 mt-5 text-[#7da2ff]", MONO)}>{w.proof}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className={cn(WRAP, "py-20 lg:py-28")}>
      <SectionHead n="03" label="Experience" title="Four years of product design." />
      <ul className="m-0 mt-12 list-none border-b border-black p-0 lg:mt-16">
        {EXPERIENCE.map((e) => (
          <li key={e.company} className="grid gap-x-8 gap-y-1.5 border-t border-black py-5 lg:grid-cols-[240px_1fr_1.6fr] lg:items-baseline">
            <span className={cn("text-black/55", MONO)}>{e.dates}</span>
            <p className="m-0 text-2xl font-semibold leading-[1.1] tracking-[-0.03em]">
              {e.company} <span className="font-normal text-black/45">· {e.role}</span>
            </p>
            <p className="m-0 max-w-[56ch] text-base leading-[1.4] text-black/65">{e.line}</p>
          </li>
        ))}
      </ul>
      <p className="m-0 mt-5 text-sm leading-[1.4] text-black/50">{BEFORE}</p>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="bg-azure text-white">
      <div className={cn(WRAP, "py-16 lg:py-24")}>
        <h2 className={cn("m-0 max-w-[12ch] text-[clamp(48px,9.4vw,136px)]", HEAVY)}>Which number do you need moved?</h2>
        <div className="mt-12 flex flex-wrap items-center gap-2">
          <a href={`mailto:${EMAIL}`} className="flex h-12 items-center gap-2 bg-white px-5 text-base font-semibold text-black no-underline outline-offset-4 hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-white">
            {EMAIL} <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
          <CopyEmail className="flex h-12 cursor-pointer items-center gap-2 border border-white bg-transparent px-5 text-base font-semibold text-white outline-offset-4 hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-white" />
        </div>
        <p className={cn("m-0 mt-16 text-white/70", MONO)}>© 2026 Suhas Paunikar · designed and built by Suhas Paunikar, with Claude Code</p>
      </div>
    </section>
  );
}

export function HomeV5() {
  return (
    <div className="v2 min-h-dvh bg-white font-figtree text-black [color-scheme:light]">
      <a href="#main" className="sr-only bg-black px-3 py-2 text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Results />
        <Work />
        <Workflow />
        <Experience />
        <Contact />
      </main>
    </div>
  );
}
