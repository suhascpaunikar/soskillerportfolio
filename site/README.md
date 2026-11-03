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
- `/work/pickup-in-store`, `/work/ai-progressive-measurements`, `/lab`, `/about`, `/now` and `/resume` are placeholders until those pages are built.

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
