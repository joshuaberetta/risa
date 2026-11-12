# AGENTS.md

The RISA website (risa.kobolabs.dev). It uses React 19, Mantine 9, React Router 8 and Vite 8, prerenders to static HTML, and deploys to DigitalOcean App Platform (`.do/app.yaml`). The structure follows `~/Desktop/work/repos/hda-website`. The build plan, with progress, is `plans/website-build.md`. The design review site lives unchanged in `public/designs/` (plain HTML/JS, no build) and is served at `/designs/`.

- **Copy lives only in `content/`**, never in components. The format is in `content/README.md`. Any content-shape change must update all of these together:
  - `src/lib/types.ts`
  - the section component, plus `src/components/sections/SectionRenderer.tsx`
  - `scripts/validate-content.mjs`
  - `content/README.md`
- **Markdown is rendered at build time** by `scripts/markdown.mjs`, through the Vite plugin in `vite.config.ts`. Every front-matter field named `body` is Markdown. Callouts, tabs, prompts, `{tbc}` and `{{components}}` are directives there. The browser gets HTML blocks (`src/components/Blocks.tsx`), never a Markdown parser.
- **Facts come from the sources** in `~/code/risa-dashboard/ref/`: SOP v3, Annexes A and F, Brief v3, and the Lyon workshop notes. Where they're silent or undecided, mark it TBC (`tbc: true`, `<Tbc>`, `{tbc}`). Never present invented facts (names, figures, dates, URLs) as real.
- **No credentials, ever.** Never open, use or link `ref/kobo for dummies.docx.pdf`: it contains a shared login. `lint:content` scans content and downloads, and `prerender.mjs` scans every page (`scripts/credentials.mjs`).
- **Design system:** see `DESIGN.md`. It is Theme G, Handbook, with logo 10b. Tokens are in `src/theme/theme.ts`.
  - Use theme colours (`blue`, `ink`) or `var(--risa-*)`, never hex values in components.
  - Keep text at WCAG AA, and add new pairs to the table in `DESIGN.md`.
  - Use logical CSS properties.
- **Status colours are reserved** for Working, Partly working, Not working and Can't see (Passable, Restricted, Blocked for access points). They come from `src/lib/status.ts` and are used only by `StatusPill`, `StatusLegend`, the site map and the product.
- **Downloads** in `public/files/` are copied from `../risa-dashboard` by `npm run sync:downloads`. Don't edit them here.
- **Code must be SSR-safe**, because `scripts/prerender.mjs` renders every route with `renderToString`. Don't touch `window`/`document` outside effects. Graphics (`src/lib/logo.ts`, `sitemap.ts`, `world.ts`, `qr.ts`) stay deterministic.
- **Pages must read without JavaScript:** prerendered HTML, `<details>` for menus, tabs that stack (`html:not(.js)`), and forms that fall back to `mailto:`.
- **Don't edit `public/designs/`** for website work: it's the record of the design review. Old review links (`/themes/…`, `/downloads/…`) are forwarded by `legacyRedirect()` in `src/lib/url.ts`, which the 404 page inlines.
- **Deploys:** every push to `main` deploys. Work on a branch. Changing `.do/app.yaml` does nothing until it's applied with `doctl`, and applying it replaces the live spec: ask first.
- **Before finishing:** run `npm run lint:content` and `npm run build`. To check a page in a browser, run `npm run preview` (it serves `dist/` the way the host does), then `scripts/shot.sh`.
- **Mantine 9 API notes:** `Grid` uses `gap`, not `gutter`. Polymorphic `component` props are spread with `linkProps()` from `SmartLink.tsx`.
