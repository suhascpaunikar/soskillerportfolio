# 08 — Build plan

## 1. Framer or code?

| | **Stay on Framer** | **Build in code (this repo)** |
|---|---|---|
| Speed to launch | ✅ Fastest. You're fluent and already own components (Liquid Glass, Video, pill nav) | Slower at first; Claude Code helps a lot |
| Signature interactions | Possible with **code components + overrides** (scrubber, spice level, cart, palette); Framer **shaders** (Mar 2026) cover grain, chromatic aberration and ripple | Full control: GSAP (free), React/Svelte islands, WebGPU if needed |
| Performance control | Good, less tunable | Best (ship near-zero JS on content pages) |
| CMS for case studies | ✅ Framer CMS 3.0 | MDX content collections (Astro); write in Markdown |
| `llms.txt`, redirects, OG images | Framer supports static/well-known files and redirects | Trivial |
| "Designer who builds" signal | Neutral (36% of designer portfolios are Framer) | **Strong**: an open repo plus a colophon showing you built it with Claude Code |
| Maintenance | Easiest | You own updates |

**Recommendation:**
- **If you need to be live fast** (you're interviewing *now*): **Framer**, in a fresh project. Build the 10-second hero, two "Cut" case studies and contact first, then add the signature interactions as code components.
- **If you can give it 3–5 weeks:** **code, in this repo**, deployed on Vercel. It lets you build the playable slices properly, and the repo itself becomes a portfolio piece (like Brian Lovin's open-source site).

I lean towards **code (Astro)**: you already vibe-code, this repo exists for it, and "designers who ship working things" is one of the clearest 2026 hiring signals. But it's your call (see the questions in the README).

**Decision (2 Nov 2026): code, in this repo.** See the update at the top of section 2.

## 2. Suggested stack (code route)

> **Update (2 Nov 2026): what was actually built** (in [`site/`](../site/)). **Next.js 16** (App Router) with React 19, TypeScript, **Tailwind CSS v4** and the **shadcn/ui** structure, instead of Astro. The components being pulled in (shadcn, 21st.dev's Liquid Metal Button) are React, and every route still prerenders as static HTML. Fonts are self-hosted from npm: Hanken Grotesk, Instrument Serif and JetBrains Mono. The liquid-metal shader is `@paper-design/shaders`. Dissolves are CSS transitions; GSAP isn't needed yet. The rest of this table still applies as guidance.

| Layer | Pick | Why |
|---|---|---|
| Framework | **Astro 5** | Content-first, ships almost no JS by default, native View Transitions, MDX content collections for case studies |
| Interactive islands | React (or Svelte) components, hydrated only where needed | Scrubber, playable slices, ⌘K, cart, motion control |
| Animation | **GSAP 3** (free, incl. SplitText/ScrollTrigger) + CSS; `gsap.matchMedia()` for motion levels | Industry standard; reduced-motion logic in one place |
| Page transitions | Cross-document **View Transitions API** (Chrome 126+, Safari 18.2+), instant fallback elsewhere | App-like cuts between pages with zero framework weight |
| Scroll effects | CSS scroll-driven animations as *progressive enhancement* | Chrome + Safari 26; Firefox still flagged |
| 3D (optional, one moment) | Three.js WebGPURenderer (auto WebGL2 fallback), lazy-loaded | Only if a moment truly needs it |
| Vector characters (optional) | Rive | Tiny interactive animations (e.g., a REC-dot mascot) |
| Video | Short H.264 + WebM loops, poster frames, `preload="none"` below the fold | Fast on Indian mobile networks |
| Fonts | Self-hosted, subset WOFF2: Instrument Serif · General Sans or Satoshi (Fontshare) · Geist Mono · Mukta (Devanagari) | ≤ 3 families + Devanagari, `font-display: swap` |
| Forms / contact | Copy-email button + cal.com inline embed; optional serverless form | Recruiters prefer email |
| Hosting | Vercel (already connected to your account) | Preview deploys per branch |
| Analytics | Privacy-friendly (Vercel Analytics or Plausible) + custom events | Measure "30-sec vs Director's cut", résumé downloads, email copies |
| Machine-readable | `llms.txt`, JSON-LD `Person` + `CreativeWork`, sitemap, OG images | For AI screeners and for link previews |

## 3. Component inventory (build list)

**Global:** Nav · Status pill · Motion control (CBFC U / U/A / A *or* spice level) · Grade (theme) switcher · ⌘K palette · Copy-email button + toast · Credits footer · Easter-egg manager (tracks found secrets) · Skip link.
**Home (the edit suite, one screen):** Editor header with *Export · Hire me* · Project bin · Program monitor (title card, clip preview, review note) · Transport · Inspector · Timeline (ruler with review-note markers, tracks, clips as links, playhead, keyboard) · Status bar · Export dialog.
**Case study:** Title card · Cut toggle · 30-sec cut block · Chapter (with sticky mini-timeline) · Metric tile · Before/after scrubber · Playable slice container · Deleted-scenes gallery · Commentary audio player · Credits · Next feature.
**Mobile:** Phone editor (monitor, sideways-scrolling timeline, tap to preview, *Watch the cut* button) · Bottom nav · Export bottom sheet.

## 4. Budgets (non-negotiable)

**Performance** (test on a throttled mid-range Android, 4G):
- LCP **< 2.0s** on home and case studies; **no preloader**
- JS on initial load **< 120 KB** gzipped (islands lazy-hydrate); CLS **< 0.05**; INP **< 200 ms**
- Hero video **< 1.5 MB**, poster first; images AVIF/WebP, sized

**Accessibility:**
- `prefers-reduced-motion` → starts in the calmest motion level (U / Mild) automatically; the visible control can override, and the choice is remembered
- Everything keyboard-operable (timeline: ←/→, J/K/L, Enter; Esc closes overlays); visible focus rings; skip link
- Vertical page scroll is never hijacked; horizontal timeline has button and link alternatives
- Text contrast AA minimum (no body text on glass); captions or transcripts for video and audio; alt text
- Sound is off by default; never autoplays with audio

## 5. Roadmap (part-time, ~5 weeks)

| Week | Focus | Output |
|---|---|---|
| 0 | **Decide**: direction (A/B/C), Framer vs code, target roles and market | Answers to the README questions |
| 1 | **Content first**: rewrite both case studies into "The Cut"; 30-sec cuts; hero copy; About seasons; ask for 3 testimonials | Final copy in Markdown/MDX |
| 2 | **Design system**: type, colour tokens and grades, grain, motion tokens, components; hi-fi of home + case study (desktop + mobile) | Figma or Framer canvas |
| 3 | **Build the skeleton**: the edit-suite home (desktop and phone editor), case-study template, lab, about, now, résumé; deploy previews | Working site, no frills |
| 4 | **Signature layer**: timeline scrubber, motion control, 2 playable slices, credits footer, ⌘K, 3 easter eggs | The "wow" |
| 5 | **Harden and launch**: performance and a11y pass, OG/meta/`llms.txt`, redirects, analytics, custom domain; then test (below) and launch | Live site |

## 6. Validate before launch (you're a researcher, so use it)
- **5-second tests** on the home page (5–8 people): "What does this person do? What are they good at? How would you contact them?"
- **55-second tests** with 2–3 hiring managers or senior designers: watch them skim; note where they click and what they remember a day later.
- Test on a real mid-range Android over mobile data.
- Then write it up in `/colophon`. Testing your own portfolio *is* a product-design story.

## 7. After launch
Submit to Awwwards, Godly, Siteinspire, Wall of Portfolios, the Framer gallery (if on Framer) and Muzli. Post a short "how I built it" thread with a screen recording of the scrubber and the playable slices. Update `/now` monthly.
