/**
 * The career timeline that drives the home page.
 *
 * Time is measured in months. Position 0 is the start of the intro clip; the
 * intro lasts INTRO months of timeline space, then January 2019 begins and the
 * timeline runs to "now". Spans are half-open: [s, e).
 */

export const INTRO = 6;
export const START_YEAR = 2019;
export const SPAN_MONTHS = 95; // Jan 2019 → Dec 2026 (now)
export const TOTAL = INTRO + SPAN_MONTHS;
export const YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

/** Timeline position at the start of a given month (1–12). */
export const at = (year: number, month: number) => INTRO + (year - START_YEAR) * 12 + (month - 1);

export const clamp = (v: number) => Math.max(0, Math.min(TOTAL, v));
export const pct = (v: number) => (v / TOTAL) * 100;

export interface Span {
  s: number;
  e: number;
  /** Dates are estimates until confirmed. */
  approx?: boolean;
}

export type CompanyId = "oml" | "saoji" | "ting" | "lenskart" | "freelance";

export interface Company extends Span {
  id: CompanyId;
  name: string;
  folder: string;
  role: string;
  dates: string;
  href: string;
}

export interface WorkItem extends Span {
  id: string;
  company: CompanyId;
  /** Label on the timeline clip. */
  short: string;
  title: string;
  line: string;
  chips: string[];
  /** Placeholder for the loop or still that will play in the monitor. */
  media: string;
  href?: string;
  cta?: string;
}

export interface Experiment extends Span {
  id: string;
  short: string;
  title: string;
  line: string;
  when: string;
  row: 0 | 1;
  href: string;
}

export const companies: Company[] = [
  { id: "oml", name: "OML", folder: "OML", role: "Freelance video editor", dates: "Apr 2019 – Mar 2021", s: at(2019, 4), e: at(2021, 4), href: "/about" },
  { id: "saoji", name: "Saoji Spice", folder: "SAOJI_SPICE", role: "Founder, cloud kitchen", dates: "2021 – 2022", s: at(2021, 4), e: at(2022, 3), approx: true, href: "/about" },
  { id: "ting", name: "Ting", folder: "TING", role: "UX intern → Junior UX Associate → Freelance", dates: "Mar 2022 – Nov 2023", s: at(2022, 3), e: at(2023, 12), href: "/about" },
  { id: "lenskart", name: "Lenskart", folder: "LENSKART", role: "Product Designer", dates: "Feb 2024 – Mar 2026", s: at(2024, 2), e: at(2026, 3), href: "/about" },
  { id: "freelance", name: "Freelance", folder: "FREELANCE", role: "Product Designer", dates: "Mar 2026 – now", s: at(2026, 3), e: TOTAL, href: "/now" },
];

export const work: WorkItem[] = [
  {
    id: "campaigns",
    company: "oml",
    short: "Campaign edits · Netflix, Prime, Tinder, HDFC Life",
    title: "Campaign edits",
    line: "Digital campaigns for Netflix, Amazon Prime, Tinder and HDFC Life, cut with cross-functional teams, plus videos with creators including Zakir Khan and Biswa Kalyan Rath.",
    chips: [],
    media: "[A 6-second cut from a campaign, if the rights allow]",
    s: at(2019, 4),
    e: at(2021, 4),
    href: "/about",
    cta: "Read the backstory",
  },
  {
    id: "kitchen",
    company: "saoji",
    short: "Founded a cloud kitchen",
    title: "Founded a cloud kitchen",
    line: "[One line on what you built at Saoji Spice and what running it taught you]",
    chips: [],
    media: "[A photo from the kitchen]",
    s: at(2021, 4),
    e: at(2022, 3),
    approx: true,
    href: "/about",
    cta: "Read the backstory",
  },
  {
    id: "websites",
    company: "ting",
    short: "Websites · LA Times, Vedanta, Dabur UK, Prowise",
    title: "Websites for LA Times, Vedanta, Dabur UK and Prowise",
    line: "Worked with senior designers on major projects and owned smaller ones end to end: user flows and interfaces for e-commerce and corporate websites.",
    chips: [],
    media: "[Screens from one of the sites]",
    s: at(2022, 3),
    e: at(2023, 12),
    href: "/about",
    cta: "Read the backstory",
  },
  {
    id: "pickup",
    company: "lenskart",
    short: "Pickup in store",
    title: "Pickup in store",
    line: "Buy online, pick up in store. The first version cost conversions; the second shrank the choice to two lines on the cart.",
    chips: ["23% of online orders", "2.5× fewer returns"],
    media: "[6-second loop: the two-line pickup choice on the cart]",
    s: at(2024, 2),
    e: at(2024, 8),
    approx: true,
    href: "/work/pickup-in-store",
    cta: "Watch the cut",
  },
  {
    id: "ai",
    company: "lenskart",
    short: "AI progressive measurements",
    title: "AI progressive measurements",
    line: "Sole designer of an iPad flow that lets any store staff member take progressive-lens measurements.",
    chips: ["70% faster", "15–20 min → 3–5 min", "Live nationwide"],
    media: "[6-second loop: lining up the pupil marker with the loupe]",
    s: at(2024, 8),
    e: at(2025, 4),
    approx: true,
    href: "/work/ai-progressive-measurements",
    cta: "Watch the cut",
  },
  {
    id: "cashback",
    company: "lenskart",
    short: "Claim Cashback",
    title: "Claim Cashback",
    line: "Owned the design of Claim Cashback: rewards that are easier to find, and faster app adoption through redemption online and in store.",
    chips: [],
    media: "[6-second loop: claiming cashback]",
    s: at(2025, 4),
    e: at(2025, 10),
    approx: true,
  },
  {
    id: "pos",
    company: "lenskart",
    short: "Handheld POS",
    title: "Handheld POS for store staff",
    line: "Owned the end-to-end design of a handheld point-of-sale for store staff.",
    chips: [],
    media: "[Photo: the handheld POS in use]",
    s: at(2025, 10),
    e: at(2026, 3),
    approx: true,
  },
  {
    id: "now",
    company: "freelance",
    short: "Freelance product design",
    title: "Freelance product design",
    line: "Freelancing since March 2026, and open to the next full-time team from [MONTH].",
    chips: [],
    media: "[Current project, or a photo of your desk]",
    s: at(2026, 3),
    e: TOTAL,
    href: "/now",
    cta: "What I’m doing now",
  },
];

export const experiments: Experiment[] = [
  { id: "yt", short: "YT × Maps", title: "YouTube × Google Maps", line: "Liked a place while watching a video? Save it straight to Google Maps.", when: "≈ EARLY 2023", s: at(2023, 1), e: at(2023, 7), row: 0, approx: true, href: "/lab" },
  { id: "swiggy", short: "Swiggy", title: "Swiggy Ad Discount", line: "Watch a short ad, answer a question, get a discount on your order.", when: "≈ MID 2023", s: at(2023, 3), e: at(2023, 8), row: 1, approx: true, href: "/lab" },
  { id: "noon", short: "Noon AI", title: "Noon AI Search", line: "Type what you need, and AI builds your shopping list.", when: "≈ LATE 2023", s: at(2023, 7), e: at(2023, 12), row: 0, approx: true, href: "/lab" },
  { id: "cred", short: "CRED", title: "CRED Milestones", line: "Track every credit card milestone and redeem them in one place.", when: "≈ LATE 2023", s: at(2023, 8), e: at(2023, 12), row: 1, approx: true, href: "/lab" },
  { id: "fidle", short: "Fidle.app", title: "Fidle.app", line: "A visual-effects playground, vibe-coded with Claude Code. Copy, embed and go in Framer.", when: "≈ 2025–26", s: at(2025, 10), e: at(2026, 5), row: 0, approx: true, href: "/lab" },
];

export const EMAIL = "paunikarsuhas@gmail.com";

export const monthLabel = (v: number) =>
  `${MONTHS[(((v - INTRO) % 12) + 12) % 12]} ${START_YEAR + Math.floor((v - INTRO) / 12)}`;

export const dateAt = (v: number) => (v < INTRO ? "INTRO" : v >= TOTAL ? "NOW" : monthLabel(v));

export const rangeOf = (c: Span) =>
  `${c.approx ? "≈ " : ""}${monthLabel(c.s)} – ${c.e >= TOTAL ? "NOW" : monthLabel(c.e - 1)}`;

export const isLive = (c: Span, pos: number) => pos >= c.s && (pos < c.e || (c.e >= TOTAL && pos >= TOTAL));

export const companyName = (id: CompanyId) => companies.find((c) => c.id === id)?.name ?? "";

export interface Frame {
  pos: number;
  isIntro: boolean;
  year: number | null;
  company: Company | null;
  work: WorkItem | null;
  experiment: Experiment | null;
}

/** What is "on screen" at a timeline position. */
export function frameAt(pos: number): Frame {
  const isIntro = pos < INTRO;
  if (isIntro) return { pos, isIntro, year: null, company: null, work: null, experiment: null };
  const live = experiments.filter((x) => isLive(x, pos));
  return {
    pos,
    isIntro,
    year: START_YEAR + Math.floor((Math.min(pos, TOTAL - 1) - INTRO) / 12),
    company: companies.find((c) => isLive(c, pos)) ?? null,
    work: work.find((w) => isLive(w, pos)) ?? null,
    // When two experiments overlap, show the one that started most recently.
    experiment: live.length ? live.reduce((a, b) => (b.s > a.s ? b : a)) : null,
  };
}

/** Every clip start, for previous/next navigation. */
export const clipStarts: number[] = Array.from(
  new Set([0, ...companies.map((c) => c.s), ...work.map((w) => w.s), ...experiments.map((x) => x.s)]),
).sort((a, b) => a - b);

export const nextStart = (pos: number) => clipStarts.find((v) => v > pos) ?? TOTAL;
export const prevStart = (pos: number) => [...clipStarts].reverse().find((v) => v < pos) ?? 0;

export function describe(frame: Frame) {
  if (frame.isIntro) return "Intro: Suhas Paunikar";
  return [
    dateAt(frame.pos),
    frame.company?.name,
    frame.work?.title,
    frame.experiment ? `experiment: ${frame.experiment.title}` : undefined,
  ]
    .filter(Boolean)
    .join(", ");
}
