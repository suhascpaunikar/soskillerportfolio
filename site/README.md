# site

Suhas Paunikar's portfolio, built in code: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 and the shadcn/ui project structure.

## Run it

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:3000. For a production build:

```bash
npm run build && npm start
```

Checks before pushing: `npx tsc --noEmit`, `npm run lint` and `npm run build`.

## Live site (GitHub Pages)

Every push to `main` runs `.github/workflows/pages.yml`, which builds a static export and publishes it to https://suhascpaunikar.github.io/soskillerportfolio/. To try the Pages build locally:

```bash
PAGES_BASE_PATH=/soskillerportfolio npx next build
```

The files land in `out/`. Setting `PAGES_BASE_PATH` turns on static export and the repo path prefix, and turns off Cache Components and Partial Prefetching, which static export can't use. Without it, the build is a normal Next.js build (for Vercel or `npm start`).

## What's here

- `/` is the home page, an edit suite. Space plays and pauses the reel from anywhere on the page.
  - **Desktop:** a program monitor and a timeline that runs by year. The timeline has three layers: experiments on top, work in the middle, companies at the bottom. Drag along the year ruler to scrub; the monitor cross-dissolves layer by layer. Click a clip to open its page.
  - **Highlighted clips:** the two finished case studies (Pickup in store, AI progressive measurements) carry a "Case study" tag, and they, Lenskart and every experiment get a brighter fill. Set `caseStudy` on a work item or `focus` on a company in `lib/career.ts` to change which.
  - **Zoom:** pinch to zoom the timeline (two fingers on touch screens, trackpad pinch, or Ctrl/⌘ + scroll). On desktop there are also − / % / + buttons and the + − 0 keys; a plain mouse wheel pans a zoomed timeline. The ruler adds month ticks and names as you zoom in.
  - **Phone:** the same three layers, filling the strip edge to edge. Swiping scrubs: the playhead travels from the left edge at the intro to the right edge at "now", while the timeline scrolls with it. Drag along the ruler to put the playhead under your finger.
- `/playground` holds the 21st.dev Liquid Metal Button demo. The liquid metal is off everywhere else for now.
- `/work/pickup-in-store` and `/work/ai-progressive-measurements` are the two case studies (see below).
- `/lab`, `/about`, `/now` and `/resume` are placeholders until those pages are built.

## Case studies

Both case studies are content files rendered by one template, so they share a skeleton: title card, the 30-second cut, chapters, credits, next feature.

- **Content:** `lib/case-studies/pickup-in-store.ts` and `lib/case-studies/ai-progressive-measurements.ts`. The shape is documented in `lib/case-studies/types.ts`. Chapter labels ("Rough cut", "Box office") and headings are one string each.
- **Pictures:** every picture is a `shot`. Until it has a `src`, the page shows a placeholder that says "This image will come here" (or "This video will come here"), with what belongs there (`label`) and where it is today (`source`). To fill a slot, put the file in `public/work/<slug>/` and add `src: "/work/<slug>/cart.png"` to that shot; set `ratio` to match the picture. A video takes a path too, plus an optional `poster`.
- **To add:** blocks of type `todo` show as dashed "To add" notes. They mark things only Suhas can supply (customer quotes, the period behind the numbers, what he would do differently). Replace each with a `text` block, or delete it.
- **Dates** come from the matching clip in `lib/career.ts` (`workId`), so they are edited in one place.
- **Template:** `components/case-study/` (page, blocks, picture slot, chapter list). The header and footer shared with future pages are in `components/site/`.
- **A third study:** add a content file, list it in `lib/case-studies/index.ts`, and add a route in `app/work/<slug>/page.tsx` like the existing two.

## Structure

```
app/                      routes; every page is prerendered as static HTML
components/ui/            shadcn-style primitives
  button.tsx              pill buttons: dark, white (main call to action) and ghost
  liquid-metal-button.tsx the 21st.dev Liquid Metal Button, patched; only used on /playground
  liquid-metal.tsx        shared shader hook plus MetalButton, MetalLink and MetalShell; currently unused
components/edit-suite/    the home page: state, monitor, desktop and phone timelines, clip styles, export dialog
lib/career.ts             timeline data: companies, work, experiments and their dates (≈ marks an estimate)
hooks/                    media-query hooks
components.json           shadcn config: components in @/components/ui, cn() in @/lib/utils
```

## Notes

- **Content:** edit the career data, copy and dates in `lib/career.ts`.
- **Fonts:** self-hosted from npm (`@fontsource`), so builds don't depend on Google Fonts. Hanken Grotesk for UI, Instrument Serif for titles, JetBrains Mono for timecodes.
- **Liquid metal:** switched off for now. The components are still in `components/ui/` and on `/playground` if you want it back.
- **shadcn:** the component registry (ui.shadcn.com) wasn't reachable from the environment this was set up in, so `components.json` and `lib/utils.ts` were written by hand. `npx shadcn@latest add <component>` works from any machine that can reach the registry.
