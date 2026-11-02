# 07 — Site structure (IA, wireframes, case-study template, content)

Written for the recommended **Direction A, "Director's Cut"**. The skeleton is shared by all three directions; only the labels and skin change (see the mapping tables in `06-concept-directions.md`).

---

## 1. Sitemap

```
/                         Home: the 10-second pitch + the timeline index
├── /work/pickup-in-store            Case study (flagship 1)
├── /work/ai-progressive-measurements Case study (flagship 2)
├── /work/<3rd-project>              Optional: a Ting project, if one is strong enough
├── /lab                             Vibe-coded tools + concepts (Fidle.app first)
│   └── /lab/<slug>                  Short format (problem → idea → prototype)
├── /about                           "Previously on…": the season-by-season story
├── /now                             What I'm doing / learning / looking for (updated monthly)
├── /resume                          Web résumé + PDF download
├── /colophon                        How this site was made (tools, fonts, Claude Code)
├── /404                             "Scene missing" mini-game
├── /llms.txt                        Machine-readable summary for AI screeners and agents
└── /sitemap.xml, /og/*.png          SEO + share cards for every page
```

**Global elements:** nav (wordmark · Work · Lab · About · ⌘K · motion control · *Copy email*), status pill (availability + local time), end-credits footer, theme ("grade") switcher, skip link.

Redirect `/bopis` → `/work/pickup-in-store` and `/progressive-measurements` → `/work/ai-progressive-measurements` so old links keep working. Retire `/old-home`.

---

## 2. Home: section by section

| # | Section | Job | Content |
|---|---|---|---|
| 1 | **Program monitor (hero)** | Pass the 10-second test | Title card (headline + 1-line positioning) · 2 proof numbers · availability · CTAs: *Watch the 30-sec cut*, *Copy email*, *Résumé* · looping 6s clip |
| 2 | **Timeline (project index)** | Browse in seconds | V1 = shipped (BOPIS, AI measurements) · V2 = lab (Fidle.app, concepts) · A1 = life story waveform. Drag / J-K-L / ← → / click. Each clip shows title, logline and 1 metric |
| 3 | **Featured cut** | Depth for skimmers | The BOPIS "box office" strip: 23 in 100 · 2.5× · +20 NPS → *Open the cut* |
| 4 | **Lab** | Builder signal | Fidle.app as a live embed or GIF, plus 4 concept cards (YouTube × Maps, Swiggy, Noon, CRED) labelled *Concept* |
| 5 | **Previously on…** | Memorability | A 6-season recap strip (one line each) → *Full story* (/about) |
| 6 | **Reviews** | Social proof | 2–3 real quotes from PMs and engineers (to collect) |
| 7 | **Contact** | Convert | "Let's make the next cut." Copy email · book a 20-min call · LinkedIn · availability · city/time zone |
| 8 | **End credits (footer)** | Delight + warmth | Real collaborators per project roll by; links; colophon; secrets found 0/7; post-credits scene |

### Desktop wireframe (1440)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ● REC  SUHAS PAUNIKAR   00:00:09:14     Work  Lab  About   ⌘K  [U|U/A|A] [Copy email] │
├──────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────── PROGRAM MONITOR (16:9, muted loop) ────────────┐  STATUS     │
│  │                                                                │  ● Open to  │
│  │   I used to cut films.                                         │    roles    │
│  │   Now I cut checkout flows.                                    │  Dec 2026   │
│  │                                                                │  ─────────  │
│  │   Product designer · commerce, retail & AI tools · ex-Lenskart │  23 in 100  │
│  └────────────────────────────────────────────────────────────────┘  orders →   │
│   [▶ Watch the 30-sec cut]  [Copy email]  [Résumé ↓]                 pickup     │
├──────────────────────────────────────────────────────────────────────────────┤
│ V2 LAB   ▕Fidle.app▏ ▕YT×Maps▏ ▕Swiggy▏ ▕Noon AI▏ ▕CRED▏                         │
│ V1 WORK  ▕████ Pickup in store ████▏▕██████ AI progressive measurements ██████▏ │
│ A1 LIFE  ~~Event Capital~~Pinstorm~~OML·Netflix·Prime~~Saoji~~Ting~~Lenskart~~▶ │
│               ▲ playhead (drag · J/K/L · ←/→ · click a clip)                    │
├──────────────────────────────────────────────────────────────────────────────┤
│  BOX OFFICE ▸ Pickup in store    23 in 100 │ 2.5× fewer returns │ +20 NPS      │
├──────────────────────────────────────────────────────────────────────────────┤
│  PREVIOUSLY ON…  S1 Ops intern ▸ S2 Marketing ▸ S3 Film editor ▸ S4 Founder ▸…  │
├──────────────────────────────────────────────────────────────────────────────┤
│  REVIEWS  "…" — PM, Lenskart        "…" — iOS lead, Lenskart                     │
├──────────────────────────────────────────────────────────────────────────────┤
│  LET'S MAKE THE NEXT CUT.   [Copy email] [Book 20 min] [LinkedIn]               │
├──────────────────────────────────────────────────────────────────────────────┤
│  END CREDITS (rolling) … Piyush Gupta · Vikraman Sridharan · Rahul Rupani …     │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Mobile wireframe (390): "Reels"

```
┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐
│ ● REC  SUHAS     ⌘ ☰  │   │ V1 · SHIPPED      2/7 │   │ PREVIOUSLY ON…        │
│                       │   │ [full-bleed clip]     │   │ S3 Film editor        │
│ I used to cut films.  │   │                       │   │ Netflix · Prime ·     │
│ Now I cut checkout    │   │ Pickup in store       │   │ Zakir Khan            │
│ flows.                │   │ 23 in 100 orders →    │   │ S4 Founder            │
│ PD · commerce · AI    │   │ pickup · 2.5× fewer   │   │ Saoji Spice           │
│ ● Open to roles       │   │ returns               │   │ …                     │
│ [▶ 30-sec cut]        │   │ [Watch the cut →]     │   │                       │
│ [Copy email] [CV]     │   │      swipe ↑          │   │      swipe ↑          │
└───────────────────────┘   └───────────────────────┘   └───────────────────────┘
```
Full-height snap sections with **vertical** swipe (native scroll + CSS scroll-snap, not hijacked), a bottom thumb-zone CTA bar, and the motion control in the menu.

---

## 3. Case-study template: "The Cut"

Every case study follows the same skeleton so reviewers learn it once.

```
┌──────────────────────────────────────────────────────────────┐
│ TITLE CARD                                                   │
│ Pickup in store · Lenskart · {year} · iOS + Android app      │
│ Logline (1 sentence, outcome-first)                          │
│ [23 in 100] [2.5× fewer returns] [+20 NPS]   ● Shipped/Live  │
│ Role: Sole designer · Team: 2 PMs, Android lead, iOS lead    │
│ [ 30-sec cut | Director's cut ]   🎧 2-min commentary         │
├──────────────────────────────────────────────────────────────┤
│ 30-SEC CUT (always visible)                                  │
│ • Problem & stakes   • Key decision   • Result               │
│ + one hero visual or the playable slice                      │
├──────────────────────────────────────────────────────────────┤
│ DIRECTOR'S CUT (expands)                                     │
│ 1 Cold open (context + why it mattered to the business)      │
│ 2 The script (objective, constraints, principles)            │
│ 3 Casting (who the users are, what they need)                │
│ 4 Rough cut (explorations + V1)       ↳ Deleted scenes       │
│ 5 Test screening (what the data/users said)                  │
│ 6 Re-edit (the key decision + trade-offs) ↳ PLAYABLE SLICE   │
│ 7 Final cut (the shipped flow)                               │
│ 8 Box office (results)                                       │
│ 9 Director's commentary (what I'd do differently)            │
│ 10 Credits (team)                                            │
├──────────────────────────────────────────────────────────────┤
│ NEXT FEATURE →  AI progressive measurements                  │
└──────────────────────────────────────────────────────────────┘
```

A sticky mini-timeline on the side shows progress through the cut (chapter markers) and works as jump links.

### 3a. Pickup in store, mapped (from your existing content)

**Logline:** *Lenskart had tried store pickup before and pulled it. I redesigned how checkout offers it: now 23 in 100 online orders are picked up in store, with 2.5× fewer returns.*

**30-sec cut:**
- **Problem:** Pickup cuts returns and drives footfall, but the last attempt hurt NPS, and checkout is the most fragile step in the funnel.
- **What happened:** V1 (a dedicated delivery-or-pickup step) went to 10% of users: 10–12% adoption, but **−10% checkout conversion**. User calls showed part of that "drop" was people walking into stores instead.
- **Key decision:** make the choice *lighter, not louder*. V2 shrank it to a two-line widget on the cart, with the ₹50 pickup saving shown live (₹2000 → ₹1950).
- **Result:** adoption **23–25%** at full rollout, conversion fully recovered, **2.5× fewer returns**, **+20 NPS** among pickup customers.

| Chapter | Your content |
|---|---|
| Cold open | "A second attempt at a flow that had failed before" |
| The script | Business objective (margin lever, not convenience), the four benefits, constraints (no COD for pickup, room for a promo tag) |
| Casting | Working professionals collecting after 5pm on weekdays |
| Rough cut | Competitor study (Decathlon, Shoppers Stop, Uniqlo, Lifestyle), explorations, Option 4 → V1 · **Deleted scenes:** options 1–3 |
| Test screening | 10% rollout · −10% conversion · user calls · "the drop wasn't the whole story" |
| Re-edit | Compact address widget, live incentive, skip the address step · **Playable: V1 vs V2 cart toggle** |
| Final cut | Address page, store selection with distances, staged order-tracking cards |
| Box office | 23 in 100 · 2.5× · ₹ saved on shipping and returns · +20 NPS |
| Director's commentary | What you learned about adding a decision to checkout |
| Credits | Piyush Gupta (PM), Vikraman Sridharan (PM), Shivesh Mehta (Android lead), Shubham (iOS lead) |

### 3b. AI progressive measurements, mapped

**Logline:** *Measuring for progressive lenses took a trained specialist 15–20 minutes, and weekend queues built up for it. I designed an iPad flow that lets any staff member do it in 3–5.*

**30-sec cut:**
- **Problem:** A skill bottleneck: few staff per store could take progressive measurements, and 5–6 customers queued on weekends.
- **Key decisions:** a two-device workflow (sales iPad → measurement station) · **a QR scan gate**, because a measurement is only true for one frame on one face · camera guides that turn red when the customer drifts · a zoom loupe for pixel-level markers · AI and manual values side by side, with staff making the call.
- **Result:** **70% faster** (15–20 → 3–5 min), minimal training, **live in every Lenskart store in India**. The pilot hit 85% AI–manual parity (target 98%), so manual stayed the source of truth and every paired capture became training data.

| Chapter (TV framing works well here) | Your content |
|---|---|
| Cold open | Weekend queues; "democratize the skill" |
| The rules of this world | *"A progressive measurement is only true for one frame on one face"* |
| Two-camera setup | Salesperson iPad + measurement station |
| Continuity check | QR scan verifies the physical frame; manual PID fallback |
| On set | Front and side capture, red guides, reference thumbnail · **Playable: align the pupil marker with and without the loupe** |
| The pilot | 1 month, Indiranagar + HSR Layout, 85% parity |
| Renewed for the full season | Live nationwide; parity closing toward 98% |
| Director's commentary | Designing for an imperfect AI: appropriate reliance, override, provenance |
| Credits | Rahul Rupani (PM), Shubham (iOS lead) |

---

## 4. About: "Previously on Suhas…"

| Season | Years | Line | Suggested lesson (placeholder; rewrite in your own words) |
|---|---|---|---|
| S1 | 2016 | Operations intern, Event Capital | How live operations break, and how to keep them running |
| S2 | 2018 | Digital marketing intern, Pinstorm | Attention is earned in seconds |
| S3 | 2019–21 | Freelance video editor, OML: edited for Netflix, Prime, Zakir Khan | Pacing, story, cutting anything that doesn't serve the scene |
| S4 | 2021–22 | Founded **Saoji Spice**, a cloud kitchen | Unit economics; delivery apps from the merchant's side |
| S5 | 2022–23 | UX designer at Ting, then freelance | (to fill) |
| S6 | 2024–26 | Product designer, Lenskart | Checkout, in-store tools, AI with humans in the loop |
| S7 | Now | Vibe-coding tools (Fidle.app) and looking for the next team | — |

End with *"How I work"* (3 principles), *"How I use AI"* (tools + a real example), a real photo, and contact.

---

## 5. Copy drafts

**Headline options (pick one):**
1. *I used to cut films. Now I cut checkout flows.*
2. *Former film editor. Product designer. I edit flows until they feel inevitable.*
3. *I've edited for Netflix, Prime and Zakir Khan. Now I edit checkouts. 23 in 100 Lenskart orders are now picked up in store.*

**Positioning line:** *Product designer · commerce, retail and AI tools · 4+ years · ex-Lenskart · open to roles from {month}.*

**Meta description (≈155 chars):** *Suhas Paunikar is a product designer working across commerce, retail and AI tools. Ex-Lenskart: store pickup at checkout and an AI measurement tool now in every store.*

---

## 6. Content inventory: what you have vs. what you need

| Need | Have? | Action |
|---|---|---|
| 2 flagship case studies | ✅ (long) | Restructure into "The Cut"; write the 30-sec cuts (drafts above) |
| Short looping clips per project (6–10s) | Partly (videos exist) | Export H.264/WebM loops < 1.5 MB each with poster frames |
| Playable slices | ❌ | Build 2 (BOPIS cart toggle, pupil-marker loupe) |
| Testimonials | ❌ | Ask 3 people: one PM, one engineer, one design lead |
| Real photo(s) of you | ? | 2–3 candid shots (human touch) |
| OML editing work | ? | 20–30s showreel *if rights allow*; otherwise a still and a credit line |
| Résumé PDF | ✅ | Update; also make a web version |
| Lab entries | ✅ | Lead with Fidle.app (live); label the others *Concept* |
| /now, colophon | ❌ | Write (short) |
| OG images | ❌ | One per page (auto-generate) |
| Custom domain | ❌ | Recommended (cheap, reads more senior) |
| `llms.txt` + JSON-LD Person | ❌ | Generate from the content |
