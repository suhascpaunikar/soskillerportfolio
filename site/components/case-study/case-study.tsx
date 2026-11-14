import { ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

import { CaseStudyBadge } from "@/components/edit-suite/clip-label";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { buttonVariants } from "@/components/ui/button";
import { EMAIL } from "@/lib/career";
import { nextStudy, readingMinutes, timelineOf, typeset, type CaseStudy, type Chapter } from "@/lib/case-studies";

import { BlockView, Stats } from "./blocks";
import { ChapterRail, type RailItem } from "./chapter-rail";
import { CopyEmail } from "./copy-email";
import { Figure } from "./shot";

const two = (n: number) => String(n).padStart(2, "0");
const SHELL = "mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10";
const EYEBROW = "m-0 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-work-ink";
/** Clears the sticky header when a chapter link jumps to its section. */
const ANCHOR = "scroll-mt-[84px]";

function ChapterSection({ chapter, n, anchor }: { chapter: Chapter; n: number; anchor: string }) {
  return (
    <section id={anchor} aria-labelledby={`${anchor}-title`} className={`${ANCHOR} border-t border-line py-14 first:border-t-0 first:pt-0 lg:py-[72px]`}>
      <p className={EYEBROW}>
        {two(n)} · {chapter.label}
      </p>
      <h2 id={`${anchor}-title`} className="mb-0 mt-3 max-w-[24ch] text-balance font-serif text-[34px] font-normal leading-[1.06] text-white sm:text-[44px]">
        {chapter.title}
      </h2>
      <div className="mt-8 flex flex-col gap-8">
        {chapter.blocks.map((block, i) => (
          <BlockView key={i} block={block} />
        ))}
      </div>
    </section>
  );
}

/**
 * A case study page, "The Cut": the title card with the result and the shipped design, the 30-second cut,
 * then the chapters beside a sticky chapter list, the credits and the next feature.
 * The content comes from lib/case-studies; picture slots stay placeholders until a shot has a `src`.
 */
export function CaseStudyPage({ study: source }: { study: CaseStudy }) {
  const study = typeset(source);
  const next = typeset(nextStudy(source));
  const timeline = timelineOf(source);
  const minutes = readingMinutes(source);
  // Anchors carry the study's id, so two studies kept in the page at once never share one.
  const anchor = (id: string) => `${study.workId}-${id}`;
  const facts = [...study.facts.slice(0, 2), ...(timeline ? [{ label: "Timeline", value: timeline }] : []), ...study.facts.slice(2)];
  const creditsN = study.chapters.length + 1;
  const rail: RailItem[] = [
    { id: anchor("cut-30"), n: "00", label: "The 30-second cut" },
    ...study.chapters.map((chapter, i) => ({ id: anchor(chapter.id), n: two(i + 1), label: chapter.label })),
    { id: anchor("credits"), n: two(creditsN), label: "Credits" },
  ];

  return (
    <div className="min-h-dvh bg-app">
      <a
        href={`#${anchor("main")}`}
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#141416]"
      >
        Skip to the case study
      </a>
      <SiteHeader title={study.name} />

      <main id={anchor("main")}>
        <article>
          {/* Title card: the result, the facts and the shipped design, all in the first screen. */}
          <header className={`${SHELL} pb-10 pt-7 lg:pb-12 lg:pt-9`}>
            <Link
              href="/"
              className="mb-7 hidden w-fit items-center gap-1.5 rounded font-mono text-xs text-muted-foreground no-underline outline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-playhead lg:flex"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Back to the edit
            </Link>
            <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-12">
              <div className="flex min-w-0 flex-col gap-5">
                <div className="flex flex-wrap items-center gap-2">
                  <CaseStudyBadge />
                  <p className={EYEBROW}>
                    {study.company} · {study.name}
                  </p>
                </div>
                <h1 className="m-0 text-balance font-serif text-[40px] font-normal leading-[1.02] text-white sm:text-[52px] xl:text-[58px]">
                  {study.title}
                  <span className="sr-only">: </span>
                  <span className="mt-2.5 block text-[0.72em] italic leading-[1.08] text-work-ink">{study.outcome}</span>
                </h1>
                <p className="m-0 max-w-[52ch] text-pretty text-[17px] leading-[1.55] text-soft sm:text-lg">{study.lede}</p>
              </div>
              <Figure shot={study.hero} monitor eager sizes="(min-width: 1024px) 560px, 100vw" />
            </div>

            <Stats items={study.stats} className="mt-9" />
            <dl className="m-0 mt-4 grid gap-x-6 gap-y-4 rounded-xl border border-line px-4 py-4 sm:grid-cols-2 sm:px-5 lg:grid-cols-5">
              {facts.map((fact) => (
                <div key={fact.label} className="flex min-w-0 flex-col gap-1">
                  <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-dim">{fact.label}</dt>
                  <dd className="m-0 text-sm leading-snug text-foreground">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </header>

          {/* The 30-second cut: the whole story for a reader who stops here. */}
          <section id={anchor("cut-30")} aria-labelledby={`${anchor("cut-30")}-title`} className={`${SHELL} ${ANCHOR}`}>
            <div className="overflow-hidden rounded-2xl border border-[#2b2b31] bg-panel">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line px-4 py-3.5 sm:px-6">
                <h2 id={`${anchor("cut-30")}-title`} className="m-0 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-playhead">
                  00 · The 30-second cut
                </h2>
                <a
                  href={`#${anchor(study.chapters[0].id)}`}
                  className="flex items-center gap-1.5 rounded font-mono text-[11px] uppercase tracking-[0.06em] text-muted-foreground no-underline outline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-playhead"
                >
                  Director’s cut · {minutes} min read
                  <ArrowDown className="size-3" aria-hidden="true" />
                </a>
              </div>
              <dl className="m-0 grid gap-px bg-line sm:grid-cols-2 xl:grid-cols-4">
                {study.cut30.map((item) => (
                  <div key={item.label} className="flex flex-col gap-2 bg-panel px-4 py-5 sm:px-6">
                    <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-dim">{item.label}</dt>
                    <dd className="m-0 text-[15px] leading-[1.55] text-foreground">{item.body}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* The Director's cut: chapters, with the chapter list alongside. */}
          <div className={`${SHELL} grid gap-10 py-12 lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-14 lg:py-16 xl:grid-cols-[210px_minmax(0,860px)] xl:justify-between`}>
            <ChapterRail items={rail} className="lg:sticky lg:top-[92px] lg:self-start" />
            <div className="min-w-0">
              {study.chapters.map((chapter, i) => (
                <ChapterSection key={chapter.id} chapter={chapter} n={i + 1} anchor={anchor(chapter.id)} />
              ))}

              <section id={anchor("credits")} aria-labelledby={`${anchor("credits")}-title`} className={`${ANCHOR} border-t border-line py-14 lg:py-[72px]`}>
                <p className={EYEBROW}>{two(creditsN)} · Credits</p>
                <h2 id={`${anchor("credits")}-title`} className="mb-0 mt-3 font-serif text-[34px] font-normal leading-[1.06] text-white sm:text-[44px]">
                  The people who shipped it
                </h2>
                <dl className="m-0 mt-9 flex flex-col gap-3">
                  {study.credits.map((credit) => (
                    <div key={`${credit.role}-${credit.name}`} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-baseline gap-5 sm:grid-cols-2">
                      <dt className="text-right font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{credit.role}</dt>
                      <dd className="m-0 font-serif text-[22px] leading-tight text-white sm:text-2xl">{credit.name}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>
          </div>
        </article>

        {/* Close: the next feature, and how to get the longer version. */}
        <div className={`${SHELL} flex flex-col gap-4 pb-16`}>
          <Link
            href={`/work/${next.slug}`}
            className="clip group flex flex-col gap-3 rounded-2xl border border-[#3f4790] bg-[linear-gradient(180deg,#1b1e3d_0%,#141631_100%)] p-6 no-underline outline-offset-4 focus-visible:outline-2 focus-visible:outline-playhead sm:p-10"
          >
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-work-ink">Next feature</span>
            <span className="flex items-center justify-between gap-4 font-serif text-[36px] leading-[1.02] text-white sm:text-[52px]">
              {next.name}
              <ArrowRight className="size-7 shrink-0 text-work-ink sm:size-9" aria-hidden="true" />
            </span>
            <span className="max-w-[60ch] text-base leading-normal text-soft">{next.outcome}</span>
          </Link>

          <div className="flex flex-col gap-5 rounded-2xl border border-line p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-1.5">
              <p className="m-0 font-serif text-[26px] italic leading-tight text-white">There is more to this than fits on a page.</p>
              <p className="m-0 text-[15px] leading-normal text-soft">The trade-offs, the dead ends and what didn’t ship. I’m happy to walk you through it.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a href={`mailto:${EMAIL}`} className="rounded font-mono text-sm text-white underline decoration-[#4b4b55] underline-offset-[5px] outline-offset-4 focus-visible:outline-2 focus-visible:outline-playhead">
                {EMAIL}
              </a>
              <CopyEmail />
              <Link href="/resume" className={buttonVariants()}>
                Résumé
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
