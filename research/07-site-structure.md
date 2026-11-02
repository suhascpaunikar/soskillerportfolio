# 07 — Site structure (IA, wireframes, case-study template, content)

Written for the recommended **Direction A, "Director's Cut"**. The skeleton is shared by all three directions; only the labels and skin change (see the mapping tables in `06-concept-directions.md`).

---

## 1. Sitemap

```
/                         Home: the edit suite (one screen; every clip opens its page)
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

**Global elements:** nav (wordmark · Work · Lab · About · Now · Résumé · ⌘K · motion certificate · *Copy email*; on the home it is the editor's header, with *Export · Hire me*), availability and local time (the status bar on the home), an end-credits footer on inside pages, a theme ("grade") switcher and a skip link.

Redirect `/bopis` → `/work/pickup-in-store` and `/progressive-measurements` → `/work/ai-progressive-measurements` so old links keep working. Retire `/old-home`.

---

## 2. Home: the edit suite

*Updated 2 Nov 2026, after the first wireframe review.* The landing screen **is** the editing app. There is no long scrolling home page: the whole pitch fits on one screen, and every clip on the timeline is a door to its page.

| Region | Job | Content | Interaction |
|---|---|---|---|
| **Header** | Identity and exits | REC dot · `Suhas Paunikar.prproj` · Work · Lab · About · Now · Résumé · ⌘K · U · U/A · A certificate · **Export · Hire me** | Export opens the contact sheet |
| **Project bin** (left) | Browse as a list | Three bins: Shipped (2), Lab (5), Seasons (7) | Hover or focus previews; click opens the page |
| **Program monitor** (centre) | Pass the 10-second test | Default: the title card, *"I used to cut films. Now I cut checkout flows."*, plus the positioning line. Previewing: the clip's track, title, logline, one metric and *Watch the cut →* | Transport: timecode, previous / next clip; *Title card* resets |
| **Inspector** (right) | Proof at a glance | Default: status (open to roles, from when, where), three proof numbers (23 in 100 · 2.5× · 3–5 min) and specialism. Previewing: track, status, role, team and result | Follows the preview |
| **Timeline** (bottom) | The project index | V2 · Lab: Fidle.app + 4 concepts · V1 · Work: Pickup in store, AI progressive measurements · A1 · Life: seasons S1–S7 · playhead | Hover or focus previews; click opens: V1 → its case study, V2 → Lab, S1–S6 → About, S7 → Now |
| **Review notes** (on the ruler) | Social proof, in context | Yellow markers above the work each quote is about: real quotes from PMs and engineers (to collect) | Click shows the note in the monitor and inspector |
| **Status bar** | Availability | READY · open to roles from {month} · {city} · {local time} · "2 shipped · 5 lab · 7 seasons" | Copy email |
| **Export · Hire me** (dialog) | Convert | "Export settings": Format = Product designer · Preset = {full-time or contract} · Destination = {city} or remote · Available = from {month} | Copy email · Book a 20-min call · Résumé; Esc closes |

**Where the old home sections went:**

| Was | Now |
|---|---|
| Hero | The monitor's title card, shown until someone previews a clip |
| Timeline index | The timeline itself, which is now the main navigation |
| Featured cut ("box office" strip) | The Pickup clip's metric in the monitor and its result in the inspector |
| Lab cards | The V2 track and the Lab bin |
| "Previously on…" strip | The A1 track and the Seasons bin |
| Reviews | Review-note markers on the ruler |
| Contact | The *Export · Hire me* dialog and the status bar |
| End credits | The foot of every inside page (the home is a single screen) |

### Desktop wireframe (1440)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ ● REC  Suhas Paunikar.prproj   Work Lab About Now Résumé   ⌘K [U|U/A|A]  [Export · Hire me]  │
├───────────────────┬──────────────────────────────────────────────────┬───────────────────────┤
│ PROJECT BIN       │ PROGRAM MONITOR · TITLE CARD                     │ INSPECTOR             │
│                   │                                                  │                       │
│ ▾ Shipped       2 │                                                  │ STATUS                │
│   Pickup in store │     I used to cut films.                         │ ● Open to roles       │
│   AI measurements │     Now I cut checkout flows.                    │   from {month}        │
│ ▾ Lab           5 │                                                  │ PROOF                 │
│   Fidle.app       │     Product designer · commerce, retail and      │ 23 in 100 → pickup    │
│   4 concepts      │     AI tools · ex-Lenskart                       │ 2.5× fewer returns    │
│ ▾ Seasons       7 │                                                  │ 3–5 min measurement   │
│   S1 … S7         │ ──────────────────────────────────────────────── │ SPECIALISM            │
│                   │ 00:00:00:00   |◀  ▶|   [Title card]              │ Checkout · in-store   │
│                   │ Hover a clip to preview · click to open          │ tools · AI + humans   │
├───────────────────┴──────────────────────────────────────────────────┴───────────────────────┤
│ NOTES      ───────────◆──────────────────────────────────────◆──────────────────◆──────────  │
│ V2 · LAB   ▕  Fidle.app  ▏ ▕ YT × Maps  ▏ ▕   Swiggy    ▏▕   Noon AI   ▏ ▕    CRED    ▏      │
│ V1 · WORK  ▕████████ Pickup in store ████████▏   ▕████ AI progressive measurements ████▏     │
│ A1 · LIFE  ▕  S1  ▏▕  S2  ▏▕   S3 OML   ▏▕S4 Saoji▏▕ S5 Ting ▏▕     S6 Lenskart     ▏▕ S7 ▏  │
│            ▲ playhead     ◆ = review note (a real quote, pinned to the work it is about)     │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ ● READY · Open from {month} · {city} · {time}   2 shipped · 5 lab · 7 seasons   [Copy email] │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Interaction rules for the home

- **Preview is not navigation.** Hover or keyboard focus previews a clip in the monitor and inspector; a click, tap or Enter opens its page. A short hover delay (around 100 ms) stops the monitor flickering as the cursor crosses the timeline.
- **Every clip and bin item is a real link**, so the home works with a keyboard, a screen reader and without JavaScript (it then reads as a list of projects under the title card).
- **Keyboard (in the build):** Tab moves through clips · ← → step between clips · J K L scrub · Space plays the preview loop · Esc returns to the title card or closes Export.
- **Nothing important hides behind interaction.** The title card, proof numbers and status pass the 10-second test before anyone touches anything. Repeat each review-note quote on the case study it's pinned to.
- **Motion certificate:** U = no motion (the default when the OS asks to reduce motion), U/A = tasteful, A = everything on.
- **Narrow screens** (tablet portrait and phones) get the phone editor below.

### Mobile wireframe (390): the phone editor

```
┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐
│ ● REC Suhas ⋯ [Export]│   │ ● REC Suhas ⋯ [Export]│   │ ● REC Suhas ⋯ [Export]│
│┌─────────────────────┐│   │┌─────────────────────┐│   │ ░░░░░░░░░░░░░░░░░░░░░ │
││ TITLE CARD          ││   ││ V1 · SHIPPED        ││   │ ░░░░░░░░░░░░░░░░░░░░░ │
││ I used to cut films.││   ││ Pickup in store     ││   │ ░░░░░░░░░░░░░░░░░░░░░ │
││ Now I cut checkout  ││   ││ 23 in 100 → pickup  ││   │ ░░░░░░░░░░░░░░░░░░░░░ │
││ flows.              ││   ││ · 2.5× fewer returns││   │┌─────────────────────┐│
││ PD · commerce · AI  ││   ││ [Watch the cut →]   ││   ││ Export settings   × ││
│└─────────────────────┘│   │└─────────────────────┘│   ││ FORMAT              ││
│ 00:00:00:00   |◀  ▶|  │   │ 00:00:00:00   |◀  ▶|  │   ││ Product designer    ││
│ V2 ▕Fidle.app▏▕YT×Ma› │   │ V2 ▕Fidle.app▏▕YT×Ma› │   ││ PRESET              ││
│ V1 ▕██ Pickup in sto› │   │ V1 ▕▓▓ Pickup in sto› │   ││ [Full-time/contract]││
│ A1 ▕S1▏▕S2▏▕ S3 OML › │   │ A1 ▕S1▏▕S2▏▕ S3 OML › │   ││ AVAILABLE  {month}  ││
│ tap to preview · swipe│   │ tap to preview · swipe│   ││ [Copy email]        ││
│ ● Open to roles {mo}  │   │ ● Open to roles {mo}  │   ││ [Book a 20-min call]││
│ Work Lab About Now CV │   │ Work Lab About Now CV │   │└─────────────────────┘│
└───────────────────────┘   └───────────────────────┘   └───────────────────────┘
 1 · Landing                 2 · Tap a clip              3 · Export
```
A phone video editor: monitor on top, a timeline that scrolls sideways (native horizontal scroll; vertical page scroll is never hijacked) and tools in thumb reach at the bottom. With no hover on touch, a **tap previews** a clip and *Watch the cut →* opens it. *Export* opens a bottom sheet; ⋯ opens the menu with the motion certificate. Inside pages are normal vertical pages; case studies keep the 30-sec cut on top and fold the chapters into a list.

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
