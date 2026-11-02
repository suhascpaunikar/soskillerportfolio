# 03 — Design trends, late 2026, filtered for you

Most trend lists are vendor blogs, so this file only keeps trends that show up across **multiple independent sources** and gives each a verdict for *your* portfolio.

**The macro story of 2026:** AI made polished, competent, template-shaped design free. Everyone now has the same clean bento grid. So the market started rewarding what AI can't fake: **specificity, personality, imperfection, craft and play.** Several sources name it directly: Canva's 2026 report calls it *"Imperfect by Design"*, Landor calls it *"Anti-AI Crafting"*, Kittl × Savee rank *Naive Design* #1, and there's a whole "whimsical web" movement framed as an antidote to AI slop. A Graphic Design Junction retrospective in August 2026 confirmed that *human-touch design and purposeful asymmetry were everywhere* this year.

---

## Verdicts

### ✅ Use

| Trend | What it is | Why it fits you | Sources |
|---|---|---|---|
| **Expressive, oversized and kinetic type** | Type *is* the layout; split-text, variable-font motion on scroll and hover | Your story is a narrative. Title cards, loglines and credits are all type | [Figma](https://www.figma.com/resource-library/web-design-trends/), [Envato](https://elements.envato.com/learn/web-design-trends), [Wix](https://www.wix.com/blog/web-design-trends) |
| **One strong concept, executed with restraint** | Awwwards winners "commit to one strong visual concept rather than mixing effects" | Pick *one* metaphor and let it organise everything | [Digital Strategy Force](https://digitalstrategyforce.com/journal/why-are-immersive-experiences-dominating-the-2026-awwwards/) |
| **Human touch / imperfection** | Handwritten notes, scribbles, real photos, scans, your own voice | Your process (V1 failed, then user calls) *is* the imperfect, human part | [Campaign India](https://www.campaignindia.in/article/2026-is-the-year-of-imperfect-by-design/506629), [Stills via Creative Boom](https://creativeboom.com/insight/stills-trends-report-demonstrates-how-bold-human-centred-design-is-defining-2026), [GDJ retrospective](https://graphicdesignjunction.com/2026/08/did-the-2026-web-design-trends-predictions-come-true/) |
| **Whimsy and easter eggs** | Small, silly, delightful details that are hard to fake | The cheapest way to be remembered | [The Whimsical Web](https://mxb.dev/blog/the-whimsical-web/), [World Wide Whimsy](https://shalakulkarni.substack.com/p/world-wide-whimsy), [Josh Comeau](https://joshwcomeau.com) |
| **Portfolio as playground** | Working prototypes and small tools instead of static write-ups | You literally vibe-code tools (Fidle.app) | [UX Tools](https://www.uxtools.co/blog/the-portfolio-is-becoming-a-playground) |
| **Mono type for metadata** | Monospace has moved from code into heroes, labels, nav | Timecodes, specs, order IDs, measurements are all naturally mono | [Made Good Designs](https://madegooddesigns.com/font-trends-2026/), [Creative Boom top 50 fonts](https://www.creativeboom.com/tools/top-50-fonts-in-2026/) |
| **Serif revival + "bouba" soft grotesks** | Fraunces / Instrument Serif / Gloock for editorial; General Sans / Cabinet Grotesk / Satoshi for UI | Several of these are from **Indian Type Foundry's Fontshare** (free), an authentic identity detail | [Creative Bloq](https://www.creativebloq.com/design/fonts-typography/breaking-rules-and-bringing-joy-top-typography-trends-for-2026), [ITF Fontshare](https://www.indiantypefoundry.com/news/introducing-fontshare) |
| **Calm base + ONE loud accent + visible texture** | The dominant 2026 colour formula | Easier to own than a rainbow; grain adds analogue warmth cheaply | [Davey & Krista](https://daveyandkrista.com/2026-brand-color-trends/), Pantone 2026 *Cloud Dancer* (#F0EEE9) |
| **Grain / noise texture** | Film grain via tiny procedural SVG noise (no image download) | Filmic, tactile, cheap on performance | [Tuts+ SVG grain](https://webdesign.tutsplus.com/better-web-images-with-svg-grainy-filters--cms-39739t), [Kittl grainy blur](https://www.kittl.com/blogs/grainy-blur-effect-stl/) |
| **Personal-web conventions** | `/now`, `/uses`, `/colophon`, a guestbook or AMA | Signals a real person and a builder | [slashpages.net](https://slashpages.net), [Brian Lovin](https://brianlovin.com/llms.txt) |
| **Catalogue / "trinket" design** | Everyday objects treated as artifacts: scanned, numbered, labelled | Your objects tell the story: spectacles, an order slip, an iPad, a film reel, a spice tin | [Kittl Trinket Design](https://www.kittl.com/blogs/trinket-design-the-archival-aesthetic-taking-over-in-2026/) |
| **Blueprint design** | Deconstructed diagrams, mono labels, connector lines, strict 2-colour | Fits "systems thinking" and annotating flows | [Kittl Blueprint](https://www.kittl.com/blogs/blueprint-graphic-design-trend-stl/) |

### ⚠️ Use carefully

| Trend | Risk | How to use it safely |
|---|---|---|
| **Liquid Glass** (Apple, iOS 26) | Low contrast, readability complaints, will date fast | Only on small floating controls (nav pill, player controls), never behind body text. You already own a component for it. [Wikipedia](https://en.wikipedia.org/wiki/Liquid_Glass), [The web behind glass](https://medienbaecker.com/articles/the-web-behind-glass) |
| **Immersive 3D / WebGL** | Heavy, slow on mid-range Android (your Indian recruiters' phones), and can bury content | **One** moment at most, with a static poster fallback and reduced-motion off-switch. [Utsubo: Three.js 2026](https://www.utsubo.com/blog/threejs-2026-what-changed) |
| **ASCII / dither / pixel** | Can look cluttered and "dev-portfolio" | As a texture or transition, not as the main readable surface. [Codrops: real-time ASCII + dithering](https://tympanus.net/codrops/2026/01/04/efecto-building-real-time-ascii-and-dithering-effects-with-webgl-shaders) |
| **Scroll-driven animation** | Breaks if it hijacks scrolling | Progressive enhancement only. Chrome and Safari 26 support CSS scroll timelines; Firefox is still behind a flag. Never change scroll speed or direction ([NN/g: Scrolljacking 101](https://www.nngroup.com/articles/scrolljacking-101/)) |
| **Horizontal scroll** | Hard for keyboard, screen-reader and motor-impaired users | Only as a *separate control* (a draggable timeline), never as the page's main scroll |
| **Custom cursor** | Contested; bad on touch, can hurt accessibility | Only in a "full experience" mode, never on touch, always on top of the native cursor's usability |
| **Sound** | Can feel tacky; clashes with screen readers | Opt-in, off by default, tiny and tactile (Josh Comeau's [use-sound](https://joshwcomeau.com/react/announcing-use-sound-react-hook/) approach) |
| **Gamification** | Overloading becomes noise | One small layer (e.g., "you found 3 of 7 easter eggs"). Research warns against stacking game elements ([paper](https://dergipark.org.tr/tr/download/article-file/4414345)) |
| **AI chat ("ask my portfolio")** | Hallucination is a liability on a job application | Only if grounded strictly in your own content with citations, like Toby Godden's "interrogate my portfolio" ([Contra](https://contra.com/p/kXmYoRgm-ai-portfolio-guide-retrieval-light-rag-for-a-creative-practice)) |

### ❌ Avoid

| Trend | Why |
|---|---|
| **Preloaders / 0→100 counters** | Delay the 10-second pitch and hurt LCP. |
| **Bento grid as the main layout** | Now the default for SaaS sites; reads as generic ([counter-trend](https://jpthehistorian.substack.com/p/bye-bye-bento)). |
| **Inter-only minimal template look** | The current site's problem: competent and invisible. |
| **AI-generated imagery** | 43% of hiring managers flag obvious AI overuse. |
| **Neo-brutalism as a costume** | Cooling off fast; only works if it's genuinely yours. |

---

## Tech context that changes what's cheap in 2026

- **Framer** (you know it): Framer 3.0 (June 2026) shipped **Agents** and **Branching**; **Shaders** launched March 2026, including interactive Ripple and video shaders; 3D transforms; CMS 3.0. [Framer 3.0](https://www.framer.com/updates/framer-3) · [Shaders](https://www.framer.com/updates/shaders)
- **GSAP is 100% free**, including SplitText, MorphSVG and ScrollTrigger, since April 2025. [Webflow](https://webflow.com/updates/gsap-becomes-free)
- **Cross-document View Transitions** work in Chrome 126+ and Safari 18.2+, which means app-like page transitions with zero framework. [Chrome docs](https://developer.chrome.com/docs/web-platform/view-transitions)
- **Three.js WebGPURenderer** is production-ready with automatic WebGL2 fallback. [Utsubo](https://www.utsubo.com/blog/threejs-2026-what-changed)
- **Rive** state machines for tiny, interactive vector characters and heroes. [Rive](https://rive.app/use-cases/hero-animations)
- **Codrops 2026** has ready techniques for exactly this kind of site: kinetic type with GSAP, scroll-driven "ghost trails", WebGPU text dissolve, WebGL galleries with Astro + Barba, and SEO-friendly WebGL text. [Codrops scroll tag](https://tympanus.net/codrops/tag/scroll/)
