# Suhas Paunikar — portfolio redesign

Research, references and structure for redoing [suhaspaunikar.framer.website](https://suhaspaunikar.framer.website). Nothing is built yet. This repo holds the thinking, so the build can be fast and deliberate.

**Visual research board:** https://claude.ai/artifact/Mezm3fqLAsq7QQVMtTYsPD (private to you; source in [`research/board/index.html`](research/board/index.html)). It includes playable demos of the three concept directions: scrub the timeline, fill the cart, tidy the desk.

## Status

- **Direction chosen (2 Nov 2026): Director's Cut.**
- **The home is the editing app.** The landing screen is a full-screen edit suite: project bin, program monitor, inspector, and a timeline with three tracks (V2 Lab, V1 Work, A1 Life). Hover or focus a clip to preview it; click it to open its page. Testimonials are review notes pinned to the ruler, and *Export · Hire me* opens the contact sheet. On phones it becomes a phone video editor: tap a clip to preview it, then *Watch the cut*.
- **Wireframes:** https://claude.ai/artifact/5uejqo3LrvrWH5CeczA2Qw (private design canvas). Clickable mid-fidelity wireframes with real copy:
  - **Desktop pages:** Home (the edit suite), Pickup in store, AI progressive measurements, About ("Previously on…"), Lab, Now, Résumé and a 404.
  - **Phone:** home (the phone editor), a case study and the menu.
  - **Shared components:** Navigation and End credits.
  - **What works in Play:** clips and bin items (hover to preview, click to open), review notes, the Export dialog, nav links, the 30-sec / Director's cut toggle, the U · U/A · A motion certificate, the lab filter, the playable V1/V2 cart, the pupil-marker loupe and the 404 jump-cut puzzle.
- **Still open:** platform (Framer or code), target market, asset rights and testimonials. See the questions below.

---

## TL;DR

1. **Your content is strong; your container is generic.** Real numbers (23 in 100 orders → pickup, 2.5× fewer returns, +20 NPS, 70% faster, live in every Lenskart store), an honest V1-failed story, AI with humans in charge, and a rare backstory (film editor for Netflix, Prime and Zakir Khan → Saoji cloud-kitchen founder → product designer). But the site looks like a default Framer template, says nothing specific in its first 10 seconds, and its case studies are ~12,600px of dense text. → [`01-current-site-audit.md`](research/01-current-site-audit.md)
2. **Reviewers skim.** About 10–15 seconds on a homepage and ~55 seconds per portfolio. 78% judge role fit mainly by the portfolio. Top red flags: confusing structure (48%), long/dense content (42%), obvious AI overuse (43%). "All style, no substance" is the #1 executive critique. **Fun has to make you *faster* to understand, not slower.** → [`02-hiring-insights.md`](research/02-hiring-insights.md)
3. **2026 rewards the human and the specific.** With AI making polished sameness free, the trends that matter are *imperfect by design*, whimsy, expressive type, one strong concept, portfolios as playgrounds, catalogue/trinket and blueprint aesthetics, mono metadata, and grain. Avoid preloaders, generic bento and AI imagery. → [`03-design-trends-2026.md`](research/03-design-trends-2026.md)
4. **Recommended concept: "Director's Cut".** Your portfolio *is an edit*. Case studies become rough cut → test screening → re-edit → box office (your BOPIS story already has exactly that shape). The home is the editing app itself: click a clip on the timeline to open that project (on phones, a phone video editor); the footer rolls real credits. Close second: **"Checkout"**, your portfolio as a beautifully designed store, from the person who designed Lenskart's pickup checkout. → [`06-concept-directions.md`](research/06-concept-directions.md)
5. **Signature ideas that work in any direction:** a **30-second cut / Director's cut** toggle on every case study; a **🌶 Spice level** motion control (Mild = recruiter mode, Saoji = full chaos), which tells your cloud-kitchen story and doubles as accessibility; **playable slices** of your real work (V1 vs V2 cart; align the pupil marker with the loupe); **end-credits footer** with your real collaborators; ⌘K; `llms.txt` for AI screeners. → [`05-interaction-ideas.md`](research/05-interaction-ideas.md)
6. **Structure:** a one-screen home, the edit suite (title card, proof, the timeline as the project index, review notes, *Export · Hire me*), two "Cut" case studies, lab, about, /now, résumé, colophon, a 404 game. The home regions, wireframes and both case studies are mapped in → [`07-site-structure.md`](research/07-site-structure.md)
7. **Build:** Framer if you need to launch in ~2 weeks; **code (Astro + GSAP + islands, on Vercel) in this repo** if you can give it 3–5 weeks, which also signals "designer who builds". Budgets: LCP < 2s on mid-range Android, no preloader, reduced-motion by default. → [`08-build-plan.md`](research/08-build-plan.md)

References with "what to steal" → [`04-references.md`](research/04-references.md) · All sources → [`sources.md`](research/sources.md)

---

## Questions for you (these decide the next step)

1. ~~**Direction**~~: answered, Director's Cut.
2. **Platform:** stay on **Framer**, or build in **code in this repo**? (And roughly when do you need it live?)
3. **Target:** which roles and market? India (Bengaluru?), US, or remote? Commerce, AI products, or both? Your Framer account is set to a New York time zone. Are you based there now?
4. **Rights and assets:** can you show Lenskart screens and recordings publicly? Do you have any OML editing work you're allowed to show (even 20 seconds)?
5. **Social proof:** could you get 2–3 short quotes from PMs or engineers you worked with (e.g., Piyush, Vikraman, Rahul, Shivesh)?
6. **Ting:** is there a shipped Ting project strong enough to be a third case study?
7. **Name and domain:** do you own a custom domain? And is "soskiller" a handle you want to use on the site?

---

## Repo layout

```
README.md                          ← you are here
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
