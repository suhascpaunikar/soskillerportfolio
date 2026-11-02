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

## What's here

- `/` is the home page, an edit suite.
  - **Desktop:** an assets panel, a program monitor and a timeline that runs by year. The timeline has three layers: experiments on top, work in the middle, companies at the bottom. Drag along the year ruler to scrub; the monitor cross-dissolves layer by layer. Click a clip to open its page.
  - **Phone:** the same three layers. The playhead stays fixed in the middle and you swipe the timeline under it.
- `/playground` holds the 21st.dev Liquid Metal Button demo.
- `/work/pickup-in-store`, `/work/ai-progressive-measurements`, `/lab`, `/about`, `/now` and `/resume` are placeholders until those pages are built.

## Structure

```
app/                      routes; every page is prerendered as static HTML
components/ui/            shadcn-style primitives
  liquid-metal-button.tsx the 21st.dev Liquid Metal Button, patched (see the note at the top of the file)
  liquid-metal.tsx        shared shader hook plus MetalButton, MetalLink and MetalShell
components/edit-suite/    the home page: state, monitor, desktop and phone timelines, assets panel, export dialog
lib/career.ts             timeline data: companies, work, experiments and their dates (≈ marks an estimate)
hooks/                    media-query hooks
components.json           shadcn config: components in @/components/ui, cn() in @/lib/utils
```

## Notes

- **Content:** edit the career data, copy and dates in `lib/career.ts`.
- **Fonts:** self-hosted from npm (`@fontsource`), so builds don't depend on Google Fonts. Hanken Grotesk for UI, Instrument Serif for titles, JetBrains Mono for timecodes.
- **Liquid metal:** the shader (`@paper-design/shaders` 0.0.82) runs live on at most six elements per page: Hire me, Play, the main button under the monitor, and the rings that follow the clip under the playhead. Other controls use a still chrome rim. The shader freezes when the visitor prefers reduced motion.
- **shadcn:** the component registry (ui.shadcn.com) wasn't reachable from the environment this was set up in, so `components.json` and `lib/utils.ts` were written by hand. `npx shadcn@latest add <component>` works from any machine that can reach the registry.
