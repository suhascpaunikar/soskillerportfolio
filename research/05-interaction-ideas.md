# 05 — New ways to interact with the site (catalogue)

Effort: **S** = an afternoon · **M** = 1–3 days · **L** = a week or more. "Framer" means doable with canvas + code components/overrides; "Code" means natural in a custom build.

---

## Guardrails (from the hiring research)

1. Every playful thing must be **skippable** and must **never block** the 10-second pitch.
2. Fun lives in **interaction and copy**, not in hiding content.
3. **Reduced motion is respected by default**; a visible control lets people opt in or out.
4. **One signature interaction** that people talk about, a handful of supporting micro-interactions, and easter eggs for the curious. Don't stack ten effects.

---

## ★ Signature interactions (pick one or two)

### 1. 🌶 "Spice level": a motion-intensity knob with a story
A three-step control in the nav: **Mild · Medium · Saoji**.
- **Mild** = recruiter mode: no motion, sound off, compact 30-second case studies, everything visible. Auto-selected when the OS has *reduce motion* on.
- **Medium** = default: tasteful motion.
- **Saoji** = full experience: physics, cursor play, sound, shaders, easter eggs unlocked.
- Tooltip: *"Saoji is a fiery Nagpur cuisine with 30+ spices. I once ran a Saoji cloud kitchen. Choose wisely."*
- **Why it works:** accessibility, personalisation, a recruiter mode and your backstory in one control. There's precedent for the *function* (Animal Crossing's site has a remembered motion toggle; Comcast and Discord offer in-app motion settings), but the framing is uniquely yours.
- **Effort:** S–M. Framer: a code override writes a class on `<html>` and saves to `localStorage`; variants react. Code: a CSS custom property `--spice: 0|1|2` plus `gsap.matchMedia()`.
- *Film-metaphor variant (Direction A):* an Indian **CBFC-style certificate card**: **U** (calm) · **U/A** (some motion) · **A** (full chaos). Every Indian moviegoer recognises it instantly.

### 2. ✂️ "30-second cut / Director's cut": two depths for every case study
A segmented toggle at the top of each case study. The **30-second cut** shows logline, role, the one key decision, metrics, and one hero visual or prototype. The **Director's cut** is the full story.
- **Why:** reviewers give ~55 seconds, and "overly long/dense content" is flagged by 42% of hiring managers. This makes the fix feel intentional and on-brand (it comes from your editing past).
- **Effort:** S (Framer variants or CMS fields; or `<details>` plus state in code). Track which cut people choose. That data is interesting in itself.

### 3. 🎞 Timeline scrubber as the project index (Direction A)
The home page has a draggable **playhead** over tracks (V1 = shipped work, V2 = lab, A1 = life story). Scrubbing previews each project in a "program monitor"; **J / K / L** and **← →** jump between clips like a real editor; **Space** plays and pauses the preview.
- **Why:** turns browsing into something tactile and satisfying; the timeline doubles as your career story.
- **Must:** don't hijack vertical scroll. The scrubber is a separate control with buttons and links as alternatives ([NN/g](https://www.nngroup.com/articles/scrolljacking-101/)).
- **Effort:** M. References: [Filmstrip Scrub](https://21st.dev/@rmahammad/components/filmstrip-scrub), [CUTT template](https://www.framer.com/community/marketplace/templates/cutt/).

### 4. 🕹 Playable slices of your real work (the strongest proof you can show)
Recreate *the actual mechanic you designed* as a small interactive piece inside the case study:
- **BOPIS:** a mini cart where the visitor toggles **V1** (a full delivery screen) vs **V2** (the two-line delivery/pickup widget) and watches the total update ₹2000 → ₹1950. Show the A/B outcome next to it.
- **AI measurements:** the visitor tries to **align a pupil marker** on a sample face, first without the zoom loupe and then with it. The face guide turns red when they drift. They feel why the loupe exists.
- **Why:** "the portfolio is becoming a playground"; builders get noticed; it proves craft in seconds.
- **Effort:** M each (code component in Framer, or React/Svelte islands in code). Use illustrated or anonymised assets if real screens are under NDA.

### 5. 🛒 Shortlist cart (Direction B)
"Add to cart" on any case study → a cart drawer → **Checkout** opens a contact form pre-filled with the projects they picked ("I'd like to talk about: Pickup in store, AI measurements"). After sending, an **order-tracking card**: *Message received → Suhas is reading → Reply on the way (usually within 24h)*. That last bit is your own BOPIS order-card pattern.
- **Effort:** M. State in `localStorage`; form via Framer forms, Formspree or a serverless function.

### 6. 🧹 "Tidy the desk" (Direction C)
Home is a messy desk of objects you can drag. One button **snaps everything into a neat, scannable index list**. Chaos to order in one click, which *is* systems thinking.
- **Effort:** L for physics plus the transition (Matter.js or the Framer Physics components); M if objects are draggable without physics.

---

## Supporting micro-interactions

| Idea | Notes | Effort |
|---|---|---|
| **Before/after scrubber** | Drag between V1 and V2 screens | S |
| **Hover-to-play project previews** | Muted loops on hover (desktop), tap to play (touch); always with poster frames | S |
| **Kinetic title cards** | Split-text reveal on case-study titles; variable-font weight on hover. Max 2–3 per page | S |
| **Metric counters that mean something** | "23 in 100" fills a 10×10 dot grid of orders, with 23 lit as "pickup" | S |
| **Sticky device walkthrough** | Pinned iPad or phone; screens change as the story advances (no scroll hijack) | M |
| **Colour grade switcher** | Themes as film LUTs: *Daylight* (light), *Night shoot* (dark), *Bleach bypass* (high contrast) | S |
| **Credits-roll footer** | Real collaborators from each project (PMs, engineers) roll like film credits; pause on hover; static list in reduced motion | S |
| **Command palette (⌘K)** | Jump to any project, copy your email, download your résumé, switch theme | S–M |
| **Status pill** | "Available from Dec 2026 · 9:41 pm in Bengaluru" (or wherever you are) | S |
| **Copy-email button** | Click → "Copied ✓" toast. Most recruiters want this, not a form | S |
| **Opt-in UI sound** | Tiny tactile clicks and a "whoosh" on cuts; off by default; remembers the choice | S |
| **Grain overlay** | Procedural SVG noise, very subtle; disabled in Mild | S |

## Easter eggs (cheap, memorable, shareable)

| Trigger | Payoff |
|---|---|
| Type **"saoji"** anywhere | Spice level jumps to max; a little 🌶 rain; tooltip with the cloud-kitchen story |
| **Konami code** | "Blooper reel": the explorations that didn't ship, with funny captions |
| Scroll to the very end of the credits | **Post-credits scene**: a 5-second teaser of what you're building next |
| Visit **/404** | "Scene missing": a tiny game to find the missing frame in a filmstrip |
| Open DevTools console | A hello: "Looking under the hood? I vibe-code too → fidle.app" plus a link to the repo |
| Find all of them | A counter in the footer ("3/7 secrets found"). This is the only gamification layer |

## AI-native ideas (use carefully)

| Idea | Notes | Effort |
|---|---|---|
| **"Ask the director"** | Q&A grounded *only* in your case studies, with citations ("from: Pickup in store → Test results"); refuses off-topic questions. Toby Godden's "interrogate my portfolio" is the reference | M–L |
| **2-minute director's commentary** | An audio track per case study. Record it in **your own voice** (more human than a NotebookLM AI podcast, and on-trend) | S |
| **`llms.txt` + JSON-LD** | A clean, machine-readable summary of you, your roles and your case studies, so AI screeners and agents read you correctly ([example](https://brianlovin.com/llms.txt)) | S |

## Personal-web touches

- **/now** (what you're doing, learning, looking for) · **/colophon** (how the site was built: tools, fonts, Claude Code, the "behind the scenes") · **/uses** optional.
- **Guestbook or "leave a review"**: visitors stamp the credits ("Seen by 1,204 people"). Optional, M.
- **Live presence**: "3 people watching this cut" with soft cursors ([PartyKit Cursor Party](https://blog.partykit.io/posts/cursor-party)). Optional, M; only in Saoji mode.

---

## If you only build five things

1. **30-second cut / Director's cut** on every case study
2. **Spice level** (or the CBFC certificate) motion control
3. **One playable slice per flagship case study**
4. **The signature home interaction** of whichever direction you pick (scrubber, cart or desk)
5. **Credits footer + three easter eggs**
