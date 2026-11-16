/**
 * The positioning behind versions 5 to 7 of the home page:
 * a senior product designer with four years of experience, fluent in AI workflows, who ships measurable results.
 */

export const TITLE = "Senior Product Designer";

/** The four results worth leading with. All from the two Lenskart case studies. */
export const RESULTS = [
  { value: "23 in 100", unit: "", label: "online orders now picked up in store", from: "Pickup in store", href: "/work/pickup-in-store" },
  { value: "2.5×", unit: "", label: "fewer returns on pickup orders than on delivery", from: "Pickup in store", href: "/work/pickup-in-store" },
  { value: "+20", unit: "NPS", label: "among customers who picked up", from: "Pickup in store", href: "/work/pickup-in-store" },
  { value: "70%", unit: "", label: "faster progressive-lens measurements, live in every store", from: "AI progressive measurements", href: "/work/ai-progressive-measurements" },
] as const;

/** How AI sits in the work, one step at a time. */
export const AI_WORKFLOW = [
  { id: "research", step: "Research and writing", body: "I use AI to synthesise research, draft specs and UX copy, and explore options before committing to one.", proof: "On every project" },
  { id: "prototype", step: "Prototyping", body: "I go from an idea to a clickable prototype with AI tools, so the team reacts to something real instead of static mock-ups.", proof: "On every project" },
  { id: "build", step: "Building", body: "I ship working front-end myself with Claude Code, alongside Figma and Framer.", proof: "Fidle.app · this site" },
  { id: "features", step: "Designing AI features", body: "I design products where AI is part of the flow, and people can still check and correct it.", proof: "AI progressive measurements" },
] as const;

/** Product design roles only, newest first. */
export const EXPERIENCE = [
  { company: "Freelance", role: "Product Designer", dates: "Mar 2026 – now", line: "Product design for clients including Balter and Rainbow Hospitals." },
  { company: "Lenskart", role: "Product Designer", dates: "Feb 2024 – Mar 2026", line: "Pickup in store, AI progressive measurements, Claim Cashback and a handheld POS for store staff." },
  { company: "10k Designers", role: "Cohort 8", dates: "Apr 2023 – Jan 2024", line: "A design cohort, alongside side projects for Swiggy, CRED and YouTube." },
  { company: "Ting", role: "UX Designer", dates: "Mar 2022 – Mar 2023", line: "E-commerce and corporate websites for LA Times, Vedanta, Dabur UK and Prowise." },
] as const;

/** The one line the earlier careers get on these pages. */
export const BEFORE = "Before design: film editor at OML, and founder of a cloud kitchen.";
