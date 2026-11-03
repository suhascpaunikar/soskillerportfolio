# Suhas Paunikar — portfolio redesign

Research, references and structure for redoing [suhaspaunikar.framer.website](https://suhaspaunikar.framer.website). Nothing is built yet. This repo holds the thinking, so the build can be fast and deliberate.

**Visual research board:** https://claude.ai/artifact/Mezm3fqLAsq7QQVMtTYsPD (private to you; source in [`research/board/index.html`](research/board/index.html)). It includes playable demos of the three concept directions: scrub the timeline, fill the cart, tidy the desk.

## Status

- **Direction (2 Nov 2026): Director's Cut.**
- **Platform (2 Nov 2026): code, in this repo.** The site lives in [`site/`](site/): Next.js 16, TypeScript, Tailwind CSS v4 and the shadcn/ui structure. To run it: `cd site && npm install && npm run dev`.
- **Built so far:** the home page, desktop and phone.
  - **Desktop:** an edit suite in the style of the Diffusion Studio editor: a program monitor and a timeline that runs by year. The intro comes first, then three layers: companies at the bottom, the work done there in the middle, and experiments from the same period on top.
  - **Scrubbing:** drag along the years and the monitor cross-dissolves layer by layer. Click a clip to open its page.
  - **Phone:** the playhead stays fixed in the middle and you swipe the timeline under it.
  - **Buttons:** Hire me, Play and the main button use the 21st.dev Liquid Metal Button shader, as do the rings that follow the clip under the playhead.
  - **Other pages** (case studies, Lab, About, Now, Résumé) are placeholders for now.
- **Wireframes:** https://claude.ai/artifact/5uejqo3LrvrWH5CeczA2Qw (private design canvas). It has the home (desktop and phone, in plastic and liquid-metal versions), both case studies, About, Lab, Now, Résumé, a 404 and the shared components.
- **Still open:**
  - real dates for the Lenskart projects and the experiments (marked ≈);
  - a line on Saoji Spice and the month you're available from;
  - testimonials, asset rights and target market;
  - deploying (Vercel is connected to your account).

---

## TL;DR

1. **Your content is strong; your container is generic.** Real numbers (23 in 100 orders → pickup, 2.5× fewer returns, +20 NPS, 70% faster, live in every Lenskart store), an honest V1-failed story, AI with humans in charge, and a rare backstory (film editor for Netflix, Prime and Zakir Khan → Saoji cloud-kitchen founder → product designer). But the site looks like a default Framer template, says nothing specific in its first 10 seconds, and its case studies are ~12,600px of dense text. → [`01-current-site-audit.md`](research/01-current-site-audit.md)
2. **Reviewers skim.** About 10–15 seconds on a homepage and ~55 seconds per portfolio. 78% judge role fit mainly by the portfolio. Top red flags: confusing structure (48%), long/dense content (42%), obvious AI overuse (43%). "All style, no substance" is the #1 executive critique. **Fun has to make you *faster* to understand, not slower.** → [`02-hiring-insights.md`](research/02-hiring-insights.md)
3. **2026 rewards the human and the specific.** With AI making polished sameness free, the trends that matter are *imperfect by design*, whimsy, expressive type, one strong concept, portfolios as playgrounds, catalogue/trinket and blueprint aesthetics, mono metadata, and grain. Avoid preloaders, generic bento and AI imagery. → [`03-design-trends-2026.md`](research/03-design-trends-2026.md)
4. **Recommended concept: "Director's Cut".** Your portfolio *is an edit*. Case studies become rough cut → test screening → re-edit → box office (your BOPIS story already has exactly that shape). The home is the editing app itself: click a clip on the timeline to open that project (on phones, a phone video editor); the footer rolls real credits. Close second: **"Checkout"**, your portfolio as a beautifully designed store, from the person who designed Lenskart's pickup checkout. → [`06-concept-directions.md`](research/06-concept-directions.md)
5. **Signature ideas that work in any direction:** a **30-second cut / Director's cut** toggle on every case study; a **🌶 Spice level** motion control (Mild = recruiter mode, Saoji = full chaos), which tells your cloud-kitchen story and doubles as accessibility; **playable slices** of your real work (V1 vs V2 cart; align the pupil marker with the loupe); **end-credits footer** with your real collaborators; ⌘K; `llms.txt` for AI screeners. → [`05-interaction-ideas.md`](research/05-interaction-ideas.md)
6. **Structure:** a one-screen home, the edit suite (title card, proof, the timeline as the project index, review notes, *Export · Hire me*), two "Cut" case studies, lab, about, /now, résumé, colophon, a 404 game. The home regions, wireframes and both case studies are mapped in → [`07-site-structure.md`](research/07-site-structure.md)
7. **Build: decided, code in this repo** ([`site/`](site/)). The research suggested Astro; Next.js won because the components you're pulling in (shadcn, 21st.dev) are React, and every page still prerenders as static HTML. Budgets stay the same: LCP < 2s on mid-range Android, no preloader, reduced motion respected. → [`08-build-plan.md`](research/08-build-plan.md)

References with "what to steal" → [`04-references.md`](research/04-references.md) · All sources → [`sources.md`](research/sources.md)

---

## Questions for you (these decide the next step)

1. ~~**Direction**~~: answered, Director's Cut.
2. ~~**Platform**~~: answered, code in this repo ([`site/`](site/)). Still useful to know: roughly when do you need it live?
3. **Target:** which roles and market? India (Bengaluru?), US, or remote? Commerce, AI products, or both? Your Framer account is set to a New York time zone. Are you based there now?
4. **Rights and assets:** can you show Lenskart screens and recordings publicly? Do you have any OML editing work you're allowed to show (even 20 seconds)?
5. **Social proof:** could you get 2–3 short quotes from PMs or engineers you worked with (e.g., Piyush, Vikraman, Rahul, Shivesh)?
6. **Ting:** is there a shipped Ting project strong enough to be a third case study?
7. **Name and domain:** do you own a custom domain? And is "soskiller" a handle you want to use on the site?

---

## Repo layout

```
README.md                          ← you are here
site/                              the portfolio in code (Next.js 16 · TypeScript · Tailwind · shadcn)
  app/                             routes: / (the edit suite), /playground, placeholders for the other pages
  components/edit-suite/           the home page: monitor, timelines, export dialog
  components/ui/                   the 21st.dev Liquid Metal Button (patched) and the shared liquid-metal module
  lib/career.ts                    timeline data: companies, work, experiments and dates
research/
  01-current-site-audit.md         what works / what doesn't today
  02-hiring-insights.md            how reviewers actually read portfolios (2026 data)
  03-design-trends-2026.md         trends with use / careful / avoid verdicts
  04-references.md                 curated references + what to steal
  05-interaction-ideas.md          catalogue of interactions (effort / risk)
  06-concept-directions.md         3 directions + weighted scorecard + recommendation
  07-site-structure.md             sitemap, wireframes, case-study template, copy, content gaps
  08-build-plan.md                 Framer vs code, stack, budgets, 5-week roadmap
  sources.md                       every source used
  board/index.html                 visual research board with interactive concept demos
  board/assets/                    screenshots of the current site (from Framer)
```
