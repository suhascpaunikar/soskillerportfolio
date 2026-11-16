import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { CopyEmail } from "@/components/home-v3/copy-email";
import { CartArt, MarkerArt } from "@/components/home/work";
import { VersionSwitch } from "@/components/versions/switch";
import { EMAIL } from "@/lib/career";
import { measurements, pickup } from "@/lib/case-studies";
import { AI_WORKFLOW, BEFORE, EXPERIENCE, TITLE } from "@/lib/profile";
import { cn } from "@/lib/utils";

/**
 * Home page, version 7: senior, plainly.
 * Reads like a well-set profile: a serif statement, the facts beside it, then the proof.
 * Cream page, deep green, no tricks.
 */

const WRAP = "mx-auto w-full max-w-[1160px] px-5 sm:px-8";
const LABEL = "text-[12px] font-semibold uppercase leading-none tracking-[0.1em]";
const FOCUS = "outline-offset-4 focus-visible:outline-2 focus-visible:outline-[#1f4d3a]";
const GREEN = "text-[#1f4d3a]";
const SERIF = "font-serif font-normal leading-[1.02] tracking-[-0.015em]";
const RULE = "border-[#1c1a17]/15";

function Header() {
  return (
    <header className={cn(WRAP, "flex h-[76px] items-center justify-between gap-4")}>
      <Link href="/v7" className={cn("whitespace-nowrap rounded font-serif text-2xl leading-none text-[#1c1a17] no-underline", FOCUS)}>
        Suhas Paunikar
      </Link>
      <nav aria-label="Primary" className="flex items-center gap-7 text-[15px] max-lg:hidden">
        {[
          ["#work", "Work"],
          ["#approach", "Approach"],
          ["#experience", "Experience"],
          ["/about", "About"],
        ].map(([href, label]) => (
          <Link key={href} href={href} className={cn("rounded py-2 text-[#1c1a17]/65 no-underline hover:text-[#1c1a17]", FOCUS)}>
            {label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <VersionSwitch current="/v7" />
        <a href={`mailto:${EMAIL}`} className={cn("flex h-9 items-center whitespace-nowrap rounded-full bg-[#1f4d3a] px-4 max-sm:hidden text-sm font-medium text-[#f7f3ea] no-underline hover:bg-[#163828]", FOCUS)}>
          Get in touch
        </a>
      </div>
    </header>
  );
}

const FACTS = [
  ["Experience", "4 years in product design"],
  ["Most recently", "Lenskart, 2024 – 2026"],
  ["Focus", "Checkout, in-store tools, AI features"],
  ["Workflow", "AI-first: research, prototyping, building with Claude Code"],
  ["Status", "Open to senior, full-time roles"],
];

function Hero() {
  return (
    <section className={cn(WRAP, "grid gap-12 pb-16 pt-10 lg:grid-cols-[1fr_340px] lg:gap-20 lg:pb-24 lg:pt-20")}>
      <div>
        <p className={cn("m-0", LABEL, GREEN)}>{TITLE}</p>
        <h1 className={cn("m-0 mt-6 text-[clamp(42px,6.2vw,84px)] text-[#1c1a17]", SERIF)}>
          I take a product from an unclear problem to a <em className={GREEN}>measured result</em>, and I use AI at every step.
        </h1>
        <p className="m-0 mt-8 max-w-[52ch] text-lg leading-[1.55] text-[#1c1a17]/70 lg:text-xl">
          Four years across commerce, retail and AI tools. At Lenskart I was the sole designer on store pickup, which now takes 23 in 100 online orders, and on an AI measurement flow that is live in every store.
        </p>
        <div className="mt-9 flex flex-wrap gap-2">
          <Link href="#work" className={cn("flex h-11 items-center gap-2 rounded-full bg-[#1c1a17] px-5 text-[15px] font-medium text-[#f7f3ea] no-underline hover:bg-[#1f4d3a]", FOCUS)}>
            Selected work <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link href="/resume" className={cn("flex h-11 items-center rounded-full border border-[#1c1a17]/30 px-5 text-[15px] font-medium text-[#1c1a17] no-underline hover:border-[#1c1a17]", FOCUS)}>
            Résumé
          </Link>
        </div>
      </div>
      <dl className={cn("m-0 h-fit border-t lg:mt-10", RULE)}>
        {FACTS.map(([k, v]) => (
          <div key={k} className={cn("border-b py-4", RULE)}>
            <dt className={cn(LABEL, "text-[#1c1a17]/45")}>{k}</dt>
            <dd className="m-0 mt-2 text-base leading-[1.4] text-[#1c1a17]">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

const PILLARS = [
  { title: "Ownership", body: "I was the sole designer on both Lenskart case studies: research, flows, prototyping, testing and rollout, working directly with product and engineering leads." },
  { title: "AI fluency", body: "AI is part of how I research, write, prototype and build. I ship working front-end with Claude Code, and I have designed an AI feature that runs in every Lenskart store." },
  { title: "Impact", body: "I stay with the work after launch. The first version of pickup cost conversion; the second recovered it and reached 23 to 25% adoption." },
];

function Pillars() {
  return (
    <section className="bg-[#1f4d3a] text-[#f7f3ea]">
      <div className={cn(WRAP, "grid gap-10 py-16 lg:grid-cols-3 lg:gap-14 lg:py-20")}>
        {PILLARS.map((p, i) => (
          <div key={p.title}>
            <p className={cn("m-0 text-[#f7f3ea]/50", LABEL)}>0{i + 1}</p>
            <h2 className={cn("m-0 mt-4 text-[40px]", SERIF)}>{p.title}</h2>
            <p className="m-0 mt-4 text-base leading-[1.55] text-[#f7f3ea]/75">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Head({ label, title }: { label: string; title: string }) {
  return (
    <div>
      <p className={cn("m-0", LABEL, GREEN)}>{label}</p>
      <h2 className={cn("m-0 mt-4 max-w-[20ch] text-[clamp(34px,4.4vw,60px)] text-[#1c1a17]", SERIF)}>{title}</h2>
    </div>
  );
}

function Case({ study, art, tint, flip }: { study: typeof pickup; art: ReactNode; tint: string; flip?: boolean }) {
  return (
    <article className={cn("grid items-center gap-8 border-t py-10 lg:grid-cols-2 lg:gap-16 lg:py-14", RULE)}>
      <div className={cn("flex min-h-[320px] items-center justify-center rounded-2xl p-6 lg:min-h-[400px]", tint, flip && "lg:order-last")}>{art}</div>
      <div className="flex flex-col items-start gap-5">
        <p className={cn("m-0 text-[#1c1a17]/50", LABEL)}>
          {study.company} · {study.facts[0].value.split(":")[0]}
        </p>
        <h3 className={cn("m-0 text-[34px] text-[#1c1a17] lg:text-[44px]", SERIF)}>{study.title}</h3>
        <p className="m-0 max-w-[50ch] text-[17px] leading-[1.55] text-[#1c1a17]/70">{study.lede}</p>
        <dl className={cn("m-0 grid w-full grid-cols-3 gap-4 border-y py-5", RULE)}>
          {study.stats.map((s) => (
            <div key={s.value}>
              <dt className={cn("font-serif text-[26px] leading-none lg:text-[30px]", GREEN)}>{s.value}</dt>
              <dd className="m-0 mt-2 text-[13px] leading-[1.35] text-[#1c1a17]/60">{s.label}</dd>
            </div>
          ))}
        </dl>
        <Link href={`/work/${study.slug}`} className={cn("flex items-center gap-2 rounded text-[15px] font-medium underline decoration-[#1f4d3a]/40 underline-offset-[5px] hover:decoration-[#1f4d3a]", GREEN, FOCUS)}>
          Read the case study <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function Work() {
  return (
    <section id="work" className={cn(WRAP, "scroll-mt-6 pt-20 lg:pt-28")}>
      <Head label="Selected work" title="Two products I owned end to end." />
      <div className="mt-12">
        <Case study={pickup} art={<CartArt />} tint="bg-[#2c2a26]" />
        <Case study={measurements} art={<MarkerArt />} tint="bg-[#1f4d3a]" flip />
      </div>
    </section>
  );
}

function Approach() {
  return (
    <section id="approach" className={cn(WRAP, "scroll-mt-6 pt-20 lg:pt-28")}>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div>
          <Head label="Approach" title="How AI fits into my work." />
          <p className="m-0 mt-6 max-w-[38ch] text-[17px] leading-[1.55] text-[#1c1a17]/70">It makes me faster at the parts that used to be slow, which leaves more time for the decisions that need judgement.</p>
        </div>
        <ol className={cn("m-0 list-none border-b p-0", RULE)}>
          {AI_WORKFLOW.map((w, i) => (
            <li key={w.id} className={cn("grid gap-x-6 gap-y-2 border-t py-6 sm:grid-cols-[40px_1fr]", RULE)}>
              <span className={cn("font-serif text-2xl leading-none", GREEN)}>{i + 1}</span>
              <div>
                <h3 className="m-0 text-xl font-medium leading-[1.2] text-[#1c1a17]">{w.step}</h3>
                <p className="m-0 mt-2 max-w-[54ch] text-base leading-[1.55] text-[#1c1a17]/70">{w.body}</p>
                <p className={cn("m-0 mt-3 text-[#1c1a17]/45", LABEL, "font-medium")}>{w.proof}</p>
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
    <section id="experience" className={cn(WRAP, "scroll-mt-6 pt-20 lg:pt-28")}>
      <Head label="Experience" title="Four years of product design." />
      <ul className={cn("m-0 mt-12 list-none border-b p-0", RULE)}>
        {EXPERIENCE.map((e) => (
          <li key={e.company} className={cn("grid gap-x-10 gap-y-1.5 border-t py-6 lg:grid-cols-[200px_300px_1fr] lg:items-baseline", RULE)}>
            <span className="text-[15px] text-[#1c1a17]/55">{e.dates}</span>
            <p className="m-0 font-serif text-[28px] leading-none text-[#1c1a17]">
              {e.company}
              <span className="ml-3 font-sans text-[15px] text-[#1c1a17]/55">{e.role}</span>
            </p>
            <p className="m-0 text-base leading-[1.5] text-[#1c1a17]/70">{e.line}</p>
          </li>
        ))}
      </ul>
      <p className="m-0 mt-5 text-sm italic leading-[1.5] text-[#1c1a17]/50">{BEFORE}</p>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className={cn(WRAP, "py-20 lg:py-28")}>
      <div className="rounded-3xl bg-[#1c1a17] px-6 py-14 text-center text-[#f7f3ea] lg:py-20">
        <p className={cn("m-0 text-[#f7f3ea]/50", LABEL)}>Open to senior, full-time roles</p>
        <h2 className={cn("m-0 mx-auto mt-6 max-w-[16ch] text-[clamp(40px,6.2vw,84px)]", SERIF)}>
          Let’s talk about <em className="text-[#9fd3b7]">your product.</em>
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <a href={`mailto:${EMAIL}`} className="flex h-12 items-center gap-2 rounded-full bg-[#f7f3ea] px-5 text-[15px] font-medium text-[#1c1a17] no-underline outline-offset-4 hover:bg-white focus-visible:outline-2 focus-visible:outline-white">
            {EMAIL} <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
          <CopyEmail className="flex h-12 cursor-pointer items-center gap-2 rounded-full border border-[#f7f3ea]/30 bg-transparent px-5 text-[15px] font-medium text-[#f7f3ea] outline-offset-4 hover:border-[#f7f3ea]/70 focus-visible:outline-2 focus-visible:outline-white" />
        </div>
      </div>
      <p className="m-0 mt-8 text-center text-sm text-[#1c1a17]/45">© 2026 Suhas Paunikar. Designed and built by me, with Claude Code.</p>
    </section>
  );
}

export function HomeV7() {
  return (
    <div className="v2 min-h-dvh bg-[#f7f3ea] font-figtree text-[#1c1a17] [color-scheme:light]">
      <a href="#main" className="sr-only rounded bg-[#1c1a17] px-3 py-2 text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Pillars />
        <Work />
        <Approach />
        <Experience />
        <Contact />
      </main>
    </div>
  );
}
