# RISA website

The website for RISA (Rapid Infrastructures & Services Assessment, name pending sign-off), at **https://risa.kobolabs.dev**. It's the RISA handbook online: the method, the product, the toolbox, a data collection guide with the form template downloads, the deployments, and the Adopt RISA and feedback forms.

It uses React 19, Mantine 9, React Router 8 and Vite 8, prerendered to static HTML, the same stack as hda-website and kobo.ngo. The design is Theme G, Handbook, with logo 10b, as chosen in the design review ([`DESIGN.md`](DESIGN.md)). The build plan and its progress are in [`plans/website-build.md`](plans/website-build.md).

The design review that came before it is kept, unchanged, at **[/designs/](https://risa.kobolabs.dev/designs/)** (see [below](#the-design-review-designs)).

## Run it

Node 22.

```sh
npm install
npm run dev            # http://localhost:5173, with hot reload
npm run lint:content   # check everything in content/
npm run build          # type-check, build and prerender to dist/
npm run preview        # serve dist/ at http://localhost:4173, as the host will
```

`npm run build` writes one HTML file per page (29 at the moment), a `404.html` that forwards old review-site links, `sitemap.xml` and `robots.txt`. Set `NOINDEX=true` to keep search engines out (the live draft does) and `SITE_URL` for canonical links.

Screenshots: `scripts/shot.sh <path> <out.png> [width] [height]` renders a page from `npm run preview` with headless Chrome. Phone widths (under 500px) are rendered in an iframe, because Chrome won't make a window that narrow.

## What's where

```
content/            every word on the site (format: content/README.md)
  pages/            home, method, product, toolbox, deployments, about, adopt, feedback
  deployments/      one file per deployment: /deployments/<id>
  resources/        one file per toolbox item
  guide/            the data collection guide: /guide, /guide/<slug>
  settings/         site.yml (name, contact, partners, nav), downloads.yml (written by the sync)
src/
  components/       layout, sections (one per section type), brand (logo, status, maps, product), guide, library
  lib/              content loading, types, status, logo, site map, world map, QR codes, formatting
  theme/            Mantine theme and global CSS
  pages/            page templates: content pages, deployment profiles, guide pages, not found
public/
  designs/          the design review site (plain HTML, no build), served at /designs/
  files/            downloads, copied from risa-dashboard: never edit them here
  favicon.svg       generated from the logo (node scripts/favicon.mjs)
scripts/
  markdown.mjs      Markdown and front matter to data, at build time (used by Vite and the validator)
  validate-content.mjs, prerender.mjs, credentials.mjs, sync-downloads.sh, favicon.mjs, shot.sh
  build-pages.py    for the review site at public/designs/ only
.do/app.yaml        the DigitalOcean App Platform spec
```

Copy lives only in `content/`. Pages are YAML front matter drawn by a section renderer. Guide and deployment pages also have Markdown bodies, which are rendered at build time, so the browser never parses Markdown. The format, including callouts, tabs, AI prompts and TBC markers, is in [`content/README.md`](content/README.md).

## The form template downloads

The XLSForm template, its codebook and the legacy code mapping live in the risa-dashboard repo (`templates/xlsform/`). This site serves copies:

```sh
npm run sync:downloads                              # from ../risa-dashboard
DASHBOARD=~/code/risa-dashboard npm run sync:downloads
```

The sync copies the newest `RISA_template_<version>.xlsx`, `codebook.md` and `legacy_codes.csv` into `public/files/`, removes older templates, and writes `content/settings/downloads.yml` (the version, the file names and sizes, and the date). The download card and the searchable codebook on `/guide/template` read from those. Commit the result.

The template is offered on the guide as a **test version**, until the `xlsform` resource is marked `available` (`content/resources/xlsform.md`). Then the toolbox shows its download buttons too.

**Keeping the guide in step.** The guide's text is written from Annex A and Annex F (`risa-dashboard/ref/`) but lives here. When the annexes change, update `content/guide/` and each page's `lastChecked` date.

## Deploy

The site is the DigitalOcean App Platform app `risa-website` (region `fra`), on `risa.kobolabs.dev`. Every push to `main` deploys, so work on a branch.

The spec in `.do/app.yaml` builds with `npm run lint:content && npm run build` and serves `dist/`, with `404.html` as the error page. **Changing the file does nothing on its own: it has to be applied, and applying it replaces the live spec**:

```sh
doctl apps spec get e7104cd6-e15f-4f06-8ce5-afd75e5afd64   # compare with .do/app.yaml first
doctl apps update e7104cd6-e15f-4f06-8ce5-afd75e5afd64 --spec .do/app.yaml
```

**The first deploy of this site needs the spec and the merge together.** The live spec still serves `source_dir: site` with no build. That folder is now `public/designs/`, so merging `website-build` without applying the new spec breaks the deploy, and applying it before the merge breaks the old site. Apply it right after the merge.

## Old links

Reviewers pasted links such as `risa.kobolabs.dev/themes/handbook/index.html?logo=gridtrack-layers` into the voting doc. The 404 page sends them on before anything loads (`legacyRedirect()` in `src/lib/url.ts`, inlined by `scripts/prerender.mjs`; `NotFound` does the same on the dev server):

| Old | New |
|---|---|
| `/themes/…`, `/logos/…`, `/palettes/…`, `/results/…`, `/assets/…`, `/downloads/…` | the same path under `/designs/`, with the query string and hash |
| `/downloads/RISA_template.xlsx`, `/downloads/RISA_codebook.md` | the current files in `/files/` |
| `/deployment.html?d=<id>` | `/deployments/<id>` |

## The design review (`/designs/`)

`public/designs/` is the review site, moved here with `git mv` from `site/`, history kept. It's the record of the review (nine directions, eleven logo concepts, the logo studio, the results tally), so don't edit it for website work. Vite copies it to `dist/designs/` unchanged. Every page carries `noindex`, and `robots.txt` disallows `/designs/`.

To preview it on its own: `cd public/designs && python3 -m http.server 8787`. All of its paths are relative. `scripts/build-pages.py` regenerates its toolbox and deployment pages, and is for the review site only. The logo studio (`/designs/logos/studio.html`) still makes `?gt=` codes. If the team sends one, put its values into `LOGO_GEOMETRY` in `src/lib/logo.ts`, then run `node scripts/favicon.mjs`.
