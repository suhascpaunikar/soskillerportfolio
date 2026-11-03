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

- `/` is the home page, an edit suite.
  - **Desktop:** a program monitor and a timeline that runs by year. The timeline has three layers: experiments on top, work in the middle, companies at the bottom. Drag along the year ruler to scrub; the monitor cross-dissolves layer by layer. Click a clip to open its page.
  - **Highlighted clips:** the two finished case studies (Pickup in store, AI progressive measurements) carry a "Case study" tag, and they, Lenskart and every experiment get a brighter fill. Set `caseStudy` on a work item or `focus` on a company in `lib/career.ts` to change which.
  - **Phone:** the same three layers. The playhead stays fixed in the middle and you swipe the timeline under it.
- `/playground` holds the 21st.dev Liquid Metal Button demo. The liquid metal is off everywhere else for now.
- `/work/pickup-in-store`, `/work/ai-progressive-measurements`, `/lab`, `/about`, `/now` and `/resume` are placeholders until those pages are built.

## Structure

```
app/                      routes; every page is prerendered as static HTML
components/ui/            shadcn-style primitives
  button.tsx              Diffusion Studio's button (MPL-2.0), ported to React
  ds-icon.tsx             Diffusion Studio icons (MPL-2.0)
  liquid-metal-button.tsx the 21st.dev Liquid Metal Button, patched; only used on /playground
  liquid-metal.tsx        shared shader hook plus MetalButton, MetalLink and MetalShell; currently unused
components/edit-suite/    the home page: state, monitor, desktop and phone timelines, clip styles, export dialog
lib/career.ts             timeline data: companies, work, experiments and their dates (≈ marks an estimate)
hooks/                    media-query hooks
components.json           shadcn config: components in @/components/ui, cn() in @/lib/utils
```

## Notes

- **Content:** edit the career data, copy and dates in `lib/career.ts`.
- **Fonts:** self-hosted from npm (`@fontsource`), so builds don't depend on Google Fonts. Inter for UI, Instrument Serif for titles, JetBrains Mono for timecodes.
- **Diffusion Studio:** the look follows the [Diffusion Studio editor](https://github.com/diffusionstudio/editor): its dark theme colours, Inter, the button variants, the icons, and the timeline's sizes, clip colours and playhead knob. Their editor is SolidJS with a canvas timeline, so nothing is imported; the pieces were ported to React. Diffusion Studio is MPL-2.0, so the ported files (`components/ui/button.tsx`, `components/ui/ds-icon.tsx`, `components/edit-suite/clip-styles.ts`) keep the MPL-2.0 header and stay under that licence.
- **Liquid metal:** switched off for now. The components are still in `components/ui/` and on `/playground` if you want it back.
- **shadcn:** the component registry (ui.shadcn.com) wasn't reachable from the environment this was set up in, so `components.json` and `lib/utils.ts` were written by hand. `npx shadcn@latest add <component>` works from any machine that can reach the registry.
