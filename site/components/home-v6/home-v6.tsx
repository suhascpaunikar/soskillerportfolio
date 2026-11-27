import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { CopyEmail } from "@/components/home-v3/copy-email";
import { SiliconGarden } from "@/components/home-v6/silicon-garden";
import { CartArt, MarkerArt } from "@/components/home/work";
import { VersionSwitch } from "@/components/versions/switch";
import { EMAIL, experiments } from "@/lib/career";
import { measurements, pickup } from "@/lib/case-studies";
import { AI_WORKFLOW, BEFORE, EXPERIENCE, RESULTS, TITLE } from "@/lib/profile";
import { cn } from "@/lib/utils";

/**
 * Home page, version 6: AI-first.
 * The workflow is the hero. Near-black, mono labels, one lime, the look of a tool.
 */

const WRAP = "mx-auto w-full max-w-[1200px] px-5 sm:px-8";
const MONO = "font-mono text-xs leading-none tracking-[0.02em]";
const FOCUS = "outline-offset-4 focus-visible:outline-2 focus-visible:outline-[#c8f542]";
const LIME = "text-[#c8f542]";
const PANEL = "rounded-xl border border-white/[0.1] bg-[#121411]";

function Header() {
  return (
    <header className={cn(WRAP, "flex h-16 items-center justify-between gap-4")}>
      <Link href="/v6" className={cn("flex items-center gap-2.5 rounded font-mono text-sm text-white no-underline", FOCUS)}>
        <i aria-hidden="true" className="block size-2.5 rounded-[2px] bg-[#c8f542]" />
        suhas.paunikar
      </Link>
      <nav aria-label="Primary" className="flex items-center gap-6 max-lg:hidden">
        {[
          ["#workflow", "workflow"],
          ["#work", "work"],
          ["#experience", "experience"],
        ].map(([href, label]) => (
          <Link key={href} href={href} className={cn(MONO, "rounded py-2 text-white/55 no-underline hover:text-white", FOCUS)}>
            {label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <VersionSwitch current="/v6" tone="dark" />
        <a href={`mailto:${EMAIL}`} className={cn("flex h-8 items-center gap-1.5 whitespace-nowrap rounded-md bg-[#c8f542] max-sm:hidden px-3 text-[13px] font-semibold text-black no-underline hover:bg-white", FOCUS)}>
          Hire me
        </a>
      </div>
    </header>
  );
}

function Line({ k, children }: { k: string; children: ReactNode }) {
  return (
    <p className="m-0 flex gap-4">
      <span className="w-[86px] shrink-0 text-white/40">{k}</span>
      <span className="text-white/85">{children}</span>
    </p>
  );
}

function Terminal() {
  return (
    <div className={cn(PANEL, "overflow-hidden font-mono text-[13px] leading-[1.75] shadow-[0_30px_80px_rgba(0,0,0,0.5)]")}>
      <div className="flex items-center gap-1.5 border-b border-white/[0.1] px-4 py-3">
        <i className="block size-2.5 rounded-full bg-white/15" />
        <i className="block size-2.5 rounded-full bg-white/15" />
        <i className="block size-2.5 rounded-full bg-white/15" />
        <span className="ml-3 text-xs text-white/40">how-i-work</span>
      </div>
      <div className="flex flex-col gap-5 p-5">
        <div>
          <p className="m-0 text-white">
            <span className={LIME}>$</span> suhas --workflow
          </p>
          <Line k="research">AI to synthesise, people to verify</Line>
          <Line k="prototype">from idea to clickable, with AI</Line>
          <Line k="build">working front-end, with Claude Code</Line>
          <Line k="measure">ship it, then read the numbers</Line>
        </div>
        <div>
          <p className="m-0 text-white">
            <span className={LIME}>$</span> suhas --results
          </p>
          {RESULTS.filter((_, i) => i !== 2).map((r) => (
            <p key={r.value} className="m-0 flex gap-3 text-white/85">
              <Check className={cn("mt-[5px] size-3.5 shrink-0", LIME)} aria-hidden="true" />
              <span>
                <span className="text-white">{r.value}</span> {r.label}
              </span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className={cn(WRAP, "grid gap-12 pb-20 pt-12 lg:grid-cols-[1fr_480px] lg:items-center lg:gap-16 lg:pb-28 lg:pt-20")}>
      <div>
        <p className={cn("m-0 inline-flex items-center gap-2 rounded-full border border-white/[0.14] px-3 py-2 text-white/70", MONO)}>
          <i aria-hidden="true" className="block size-1.5 rounded-full bg-[#c8f542]" />
          {TITLE} · 4 years · open to roles
        </p>
        <h1 className="m-0 mt-7 text-[clamp(40px,5.6vw,76px)] font-medium leading-[1.02] tracking-[-0.035em] text-white">
          I design with AI in the loop, from first prompt to <span className={LIME}>shipped product.</span>
        </h1>
        <p className="m-0 mt-7 max-w-[44ch] text-lg leading-[1.5] text-white/65 lg:text-xl">
          Senior product designer for commerce, retail and AI tools, most recently at Lenskart. I research, prototype and build with AI, and the work shows up in the numbers.
        </p>
        <div className="mt-9 flex flex-wrap gap-2">
          <Link href="#workflow" className={cn("flex h-11 items-center gap-2 rounded-lg bg-white px-5 text-[15px] font-semibold text-black no-underline hover:bg-[#c8f542]", FOCUS)}>
            See how I work <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link href="#work" className={cn("flex h-11 items-center rounded-lg border border-white/20 px-5 text-[15px] font-medium text-white no-underline hover:border-white/60", FOCUS)}>
            See the work
          </Link>
        </div>
        <p className={cn("m-0 mt-10 text-white/40", MONO)}>figma · framer · claude code</p>
      </div>
      <Terminal />
    </section>
  );
}

function Label({ n, children }: { n: string; children: ReactNode }) {
  return (
    <p className={cn("m-0 text-white/50", MONO)}>
      <span className={LIME}>{n}</span> {children}
    </p>
  );
}

function Workflow() {
  return (
    <section id="workflow" className={cn(WRAP, "scroll-mt-6 pb-20 lg:pb-28")}>
      <Label n="01">workflow</Label>
      <h2 className="m-0 mt-5 max-w-[20ch] text-[clamp(30px,3.8vw,52px)] font-medium leading-[1.05] tracking-[-0.03em] text-white">Four places AI changes how I design.</h2>
      <ol className="m-0 mt-12 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4">
        {AI_WORKFLOW.map((w, i) => (
          <li key={w.id} className={cn(PANEL, "relative flex min-h-[300px] flex-col justify-between gap-8 p-5")}>
            {i < AI_WORKFLOW.length - 1 && <i aria-hidden="true" className="absolute -right-3 top-9 z-10 hidden h-px w-3 bg-[#c8f542] lg:block" />}
            <div className="flex items-center justify-between">
              <span className={cn("flex size-8 items-center justify-center rounded-md border border-[#c8f542]/50 text-[13px]", LIME, "font-mono")}>{i + 1}</span>
              <span className={cn("text-white/35", MONO)}>{w.id}</span>
            </div>
            <div>
              <h3 className="m-0 text-[22px] font-medium leading-[1.15] tracking-[-0.02em] text-white">{w.step}</h3>
              <p className="m-0 mt-3 text-[15px] leading-[1.5] text-white/60">{w.body}</p>
              <p className={cn("m-0 mt-5 rounded-md bg-white/[0.06] px-2.5 py-2 leading-[1.4] text-white/75", MONO)}>↳ {w.proof}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Case({ study, art, wide }: { study: typeof pickup; art: ReactNode; wide?: boolean }) {
  return (
    <article className={cn(PANEL, "group relative flex flex-col overflow-hidden", wide && "lg:col-span-2 lg:flex-row")}>
      <div className={cn("flex min-h-[300px] items-center justify-center border-white/[0.1] bg-[#0b0c0a] p-6", wide ? "lg:w-1/2 lg:border-r" : "border-b")}>{art}</div>
      <div className="flex flex-1 flex-col items-start gap-5 p-6">
        <p className={cn("m-0 text-white/45", MONO)}>
          {study.company.toLowerCase()} · {study.facts[2].value.toLowerCase()}
        </p>
        <h3 className="m-0 text-[26px] font-medium leading-[1.1] tracking-[-0.025em] text-white lg:text-[32px]">
          <Link href={`/work/${study.slug}`} className={cn("rounded text-inherit no-underline after:absolute after:inset-0", FOCUS)}>
            {study.title}
          </Link>
        </h3>
        <p className="m-0 max-w-[48ch] text-[15px] leading-[1.5] text-white/60">{study.lede}</p>
        <ul className="m-0 mt-auto flex list-none flex-wrap gap-1.5 p-0 pt-2">
          {study.stats.map((s) => (
            <li key={s.value} className={cn("rounded-md border border-[#c8f542]/35 px-2.5 py-2", LIME, MONO)}>
              {s.value}
            </li>
          ))}
        </ul>
        <span className={cn("flex items-center gap-1.5 text-white/60 group-hover:text-white", MONO)}>
          read the case study <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}

function Work() {
  const built = experiments.find((x) => x.id === "fidle");
  return (
    <section id="work" className={cn(WRAP, "scroll-mt-6 pb-20 lg:pb-28")}>
      <Label n="02">work</Label>
      <h2 className="m-0 mt-5 max-w-[20ch] text-[clamp(30px,3.8vw,52px)] font-medium leading-[1.05] tracking-[-0.03em] text-white">Shipped at scale, and measured.</h2>
      <div className="mt-12 grid gap-3 lg:grid-cols-2">
        <Case study={measurements} art={<MarkerArt />} wide />
        <Case study={pickup} art={<CartArt />} />
        <article className={cn(PANEL, "flex flex-col justify-between gap-10 p-6")}>
          <div>
            <p className={cn("m-0 text-white/45", MONO)}>built with claude code</p>
            <h3 className="m-0 mt-5 text-[26px] font-medium leading-[1.1] tracking-[-0.025em] text-white lg:text-[32px]">{built?.title}</h3>
            <p className="m-0 mt-4 max-w-[44ch] text-[15px] leading-[1.5] text-white/60">{built?.line}</p>
          </div>
          <div className="rounded-lg border border-white/[0.1] bg-[#0b0c0a] p-4 font-mono text-[13px] leading-[1.7] text-white/70">
            <p className="m-0">
              <span className={LIME}>$</span> also built this way
            </p>
            <p className="m-0 text-white/85">→ this portfolio, seven versions of it</p>
          </div>
          <Link href="/lab" className={cn("flex w-fit items-center gap-1.5 rounded text-white/60 no-underline hover:text-white", MONO, FOCUS)}>
            open the lab <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </article>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className={cn(WRAP, "scroll-mt-6 pb-20 lg:pb-28")}>
      <Label n="03">experience</Label>
      <div className={cn(PANEL, "mt-8 overflow-hidden")}>
        {EXPERIENCE.map((e) => (
          <div key={e.company} className="grid gap-x-8 gap-y-1.5 border-t border-white/[0.1] px-5 py-5 first:border-t-0 lg:grid-cols-[190px_260px_1fr] lg:items-baseline">
            <span className={cn("text-white/40", MONO)}>{e.dates.toLowerCase()}</span>
            <p className="m-0 text-lg font-medium leading-[1.2] text-white">
              {e.company} <span className="font-normal text-white/45">· {e.role}</span>
            </p>
            <p className="m-0 text-[15px] leading-[1.45] text-white/60">{e.line}</p>
          </div>
        ))}
      </div>
      <p className={cn("m-0 mt-4 leading-[1.5] text-white/35", MONO)}>{`// ${BEFORE.toLowerCase()}`}</p>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className={cn(WRAP, "pb-10")}>
      <div className="rounded-2xl bg-[#c8f542] p-6 text-black lg:p-12">
        <p className={cn("m-0 text-black/60", MONO)}>04 next prompt</p>
        <h2 className="m-0 mt-6 max-w-[16ch] text-[clamp(36px,5.6vw,76px)] font-medium leading-none tracking-[-0.035em]">Tell me the problem. I will show you a prototype.</h2>
        <div className="mt-10 flex flex-wrap gap-2">
          <a href={`mailto:${EMAIL}`} className="flex h-12 items-center gap-2 rounded-lg bg-black px-5 text-[15px] font-semibold text-white no-underline outline-offset-4 hover:bg-[#222] focus-visible:outline-2 focus-visible:outline-black">
            {EMAIL} <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
          <CopyEmail className="flex h-12 cursor-pointer items-center gap-2 rounded-lg border border-black/40 bg-transparent px-5 text-[15px] font-semibold text-black outline-offset-4 hover:border-black focus-visible:outline-2 focus-visible:outline-black" />
          <Link href="/resume" className="flex h-12 items-center rounded-lg border border-black/40 px-5 text-[15px] font-semibold text-black no-underline outline-offset-4 hover:border-black focus-visible:outline-2 focus-visible:outline-black">
            Résumé
          </Link>
        </div>
      </div>
    </section>
  );
}

/** A bare wafer that grows a tree of models when watered. */
function Footer() {
  return (
    <footer className={cn(WRAP, "pt-16 lg:pt-24")}>
      <SiliconGarden />
      <div className="mt-6 text-center">
        <Link href="/lab/silicon-garden" className={cn("text-[#c8f542] underline underline-offset-4", MONO)}>
          Explore the 3D Silicon Garden
        </Link>
      </div>
      <p className={cn("m-0 pb-8 pt-14 text-center text-white/35", MONO)}>© 2026 suhas paunikar · designed and built with claude code</p>
    </footer>
  );
}

export function HomeV6() {
  return (
    <div className="v2 min-h-dvh bg-[#0b0c0a] bg-[linear-gradient(rgb(255_255_255/0.035)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.035)_1px,transparent_1px)] font-figtree text-white [background-size:48px_48px]">
      <a href="#main" className="sr-only rounded bg-[#c8f542] px-3 py-2 text-black focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Workflow />
        <Work />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
