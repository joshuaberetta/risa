# Plan: build the RISA website

Status: built on branch `website-build` (12 Nov 2026); waiting for review, the merge and the spec update. See *Progress*. It follows the HDA website rebuild (`~/Desktop/work/repos/hda-website`, `plans/website-build.md`, commit `d692b24`). Read that repo's `AGENTS.md`, `DESIGN.md`, `content/README.md`, `scripts/prerender.mjs`, `src/lib/content.ts` and `src/lib/url.ts` before starting, and copy its structure wherever this plan doesn't say otherwise.

## Decisions so far

| | Choice |
|---|---|
| Design | **Theme G, Handbook** (`site/themes/handbook/`): Source Sans 3 and IBM Plex Mono, ink #0B0C0C, Kobo dark blue #00599D for links and accents, greys, square corners, no shadows, a table-of-contents sidebar beside a reading column. Chosen by the team vote |
| Logo | **10b, Grid track, layered** (`gridtrack-layers` in `site/assets/logos.js`). Freeze the current `GT_DEFAULTS` as the final geometry, unless the team sends a `?gt=` code from the studio before the build (see *Content needed*) |
| Stack | React 19, Mantine 9, React Router 8, Vite 8 and TypeScript, prerendered to static HTML. The same stack as `hda-website` and `kobo.ngo` |
| Scope | Home (the handbook), Method, Product, Toolbox, a **Data collection guide** with downloads, Deployments (list and one page each), About, Adopt RISA, Feedback, 404 |
| Content | The HDA model: copy lives in `content/`. Pages and deployments are YAML front matter drawn by a section renderer. **New in RISA:** guide pages have Markdown bodies. `site/assets/content.js` is migrated, then retired from the main site. English only, structured so that translations and Sveltia CMS can come later |
| Sources | SOP v3, Annex A, the Kobo annex, Brief v3 and the Lyon workshop notes in `~/code/risa-dashboard/ref/`; the XLSForm template in `~/code/risa-dashboard/templates/xlsform/` (see *Sources*) |
| Downloads | Static files in `public/files/`, served as `/files/...` and outside the router (as `asset()` in HDA's `url.ts`). Copied from risa-dashboard by a script; never edited here |
| Forms | Adopt RISA and Feedback use the real form UI. Submit opens a `mailto:` to the contact address (TBC), as in HDA. The Feedback page links to the Kobo feedback form once it exists (Kobo, end of year) |
| Routing | `risa.kobolabs.dev/` serves the new site. The review site moves to `/designs/`, and old links redirect there |
| Name | **"Rapid Infrastructures & Services Assessment"** (Lyon workshop), shown with a pending sign-off note. It is one setting in `content/settings/site.yml`, and the logo wordmark reads the same setting |

## Sources (read these; don't copy files you don't need)

All in `~/code/risa-dashboard/` (a separate repo; read only):

- `ref/RISA_SOP_v3.md`: the method, roles, products, handover and lessons. Its changelog lists every workshop change.
- `ref/RISA_in_Brief_v3.md`: the short version for heads of NDMAs. It is the basis for the home page and About copy.
- `ref/RISA_SOP_Annex_A_XLSForm.md`: the template package, design choices, country checklist, change rules, the dashboard link and the legacy code mapping.
- `ref/RISA_SOP_Annex_Kobo.md` (Annex F): the basis for the data collection guide.
- `ref/RISA Workshop #2 – Consolidated Workshop Notes (28–29 Oct 2026).md`: decisions, actions and open questions.
- `templates/xlsform/`: the template (`RISA_template_<version>.xlsx`), `codebook.md`, `legacy_codes.csv` and `README.md` (rebuilding, kobo-mcp usage, change rules).
- The kobo-mcp tool names and setup are in `~/Desktop/work/repos/kobo-mcp/README.md`.

**Never use or link `ref/kobo for dummies.docx.pdf`.** It contains a shared login. Nothing on the site may show a username, password, token or the old shared server URL.

## 1. Repo restructure

```
risa/
  content/
    pages/              home, method, product, toolbox, deployments, about, adopt, feedback (front matter)
    deployments/        one .md per deployment (from content.js deployments)
    resources/          one .md per toolbox item (from content.js resources)
    guide/              data collection guide pages (front matter + Markdown body)
    settings/site.yml   name, contact, partners, endorsers, nav, footer
  src/
    components/{layout,sections,brand,guide}/
    lib/                content.ts, types.ts, url.ts, logo.ts, status.ts, markdown.ts
    theme/              theme.ts, global.css
    entry-client.tsx, entry-server.tsx, App.tsx
  public/
    designs/            ← today's site/, moved with git mv (history kept)
    files/              template, codebook, SOP and brief downloads (copied in)
    favicon.svg
  scripts/
    prerender.mjs       from hda-website
    validate-content.mjs
    sync-downloads.sh   copies the template files from ../risa-dashboard
    shot.sh             pointed at the Vite preview server
    build-pages.py      stays, for /designs/ only (see below)
  plans/  docs/
  DESIGN.md  AGENTS.md  CLAUDE.md (@AGENTS.md)  README.md
  index.html  vite.config.ts  tsconfig.json  postcss.config.cjs  package.json
```

**The review site at `/designs/`**
- Run `git mv site public/designs`. Vite copies `public/` to `dist/` unchanged, so the review site keeps working with no build step. Check that every path in it is relative (`data-root`, `root` in `library.js`, the hub's thumbnails and the `logos/` and `palettes/` links), and fix any absolute ones.
- The results page parses `/themes/<id>/` anywhere in a path. Check that `/designs/themes/...` links still tally, and update the example URLs.
- Add a line to the hub (`public/designs/index.html`): "The team chose Handbook and logo 10b (Nov 2026). The site is at /." Otherwise, **don't edit `public/designs/`**; it is the record of the review. This includes its stale content.
- `/designs/` pages keep `noindex`, and `robots.txt` disallows `/designs/`.
- `scripts/build-pages.py` now points at `public/designs/themes/`. Say in the README that it is only for the review site.

**Old links keep working.** Reviewers pasted links such as `risa.kobolabs.dev/themes/handbook/index.html?logo=gridtrack-layers` into the voting doc. As in HDA:
- `prerender.mjs` injects a script into `404.html` that sends `^/(themes|logos|palettes|results|assets|downloads)/` to the same path under `/designs/`, keeping the query string and hash.
- `/downloads/RISA_template.xlsx` instead redirects to the current `/files/` template.
- `NotFound` does the same in dev.
- `isRouterLink()` treats `/designs`, `/files` and `/images` as plain links.

## 2. Design system (`DESIGN.md` + `src/theme/theme.ts`)

Re-express Handbook; don't reuse its CSS. Work from `handbook/tokens.css` and `theme.css`, and from the `[data-theme="handbook"]` overrides of the shared `.lib-*`, `.who-*` and `.gov-*` classes (`theme.css` around lines 80–148).

- **Tokens → Mantine.**
  - Scales: `ink` (#0B0C0C), `blue` (#00599D, links, focus and primary buttons), and greys #505A5F, #B1B4B6 and #F3F2F1.
  - Radius 0, no shadows, a 4px left rule on callouts.
  - `--risa-*` CSS variables via `cssVariablesResolver`. The `.inverse` overrides become a `dark` band.
- **Status colours are reserved.** Port `--st-ok`, `--st-partial`, `--st-no` and `--st-unknown` from `designs/assets/base.css` into `src/lib/status.ts` and the theme. Nothing else may use them. They are not brand colours, and no brand element uses red, amber or green.
  - **The labels change to the template's scale: Working, Partly working, Not working, Can't see.** For access points (routes, choke points) the same colours read as Passable, Restricted, Blocked.
  - One `StatusPill` and one `StatusLegend` component carry this everywhere.
- **Type.** Source Sans 3 for headings and body, IBM Plex Mono for data labels (codes, field names, coordinates, versions). Self-host both with `@fontsource`; drop the shared Google Fonts URL.
- **Layouts from Handbook:**
  - the header with brand and nav plus an "Adopt RISA" button;
  - the hero with the three questions;
  - the **TOC sidebar with a reading column** (`.hb-*`): sticky TOC on desktop, a collapsible "Contents" on mobile;
  - numbered steps, plain tables, the owners strip, the footer.
  Guide pages use the same layout, with previous/next links at the foot.
- **Brand components:**
  - `Logo` and `LogoMark` port `gridtrackLayers()` and `GT_DEFAULTS` from `designs/assets/logos.js` into `src/lib/logo.ts`, deterministic and SSR-safe. Layouts are horizontal, stacked and mark. Colours come from `--logo-*`. The wordmark is Public Sans, as in 10b (`wm-public`), and the name comes from `site.yml`.
  - Regenerate `public/favicon.svg` from the frozen geometry.
  - The sample site map graphic (`designs/assets/sitemap.js`) becomes a seeded `SiteMap` component with the new status labels.
  - The world map for deployments (`world.js`) is ported the same way.
- **Rules (as in HDA's `AGENTS.md`):**
  - theme colours and variables only, never hex in components;
  - WCAG AA, with every colour pair in a `DESIGN.md` contrast table; check status pills on white and on #F3F2F1;
  - SSR-safe code;
  - logical CSS properties;
  - invented facts are marked as placeholders (`tbc: true`, `<Tbc>`).
- Add a `## Deviations` table to `DESIGN.md` (`| Handbook (review site) | Here | Why |`). Include the status labels and the name change.

## 3. Content model

```
content/settings/site.yml    name, nameStatus (pending), shortName, contact, partners[], endorsers[], nav[], footer
content/pages/*.md           slug, title, description, sections[] (front matter)
content/deployments/*.md     id, title, kind, status, country, iso3, dates, partners, facts, lessons, products, resources (front matter) + body
content/resources/*.md       id, category, code, title, version, status, owner, format, languages, summary, details[], files[] (front matter)
content/guide/*.md           slug, title, order, annexRef, summary (front matter) + Markdown body
```

| Type | Source | Notes |
|---|---|---|
| hero, stats, steps, table, cards, cta, owners-strip, toc-article | hda-website, restyled | |
| audiences ("Who it's for") | `content.js` `audiences` | five audiences, NDMA heads first |
| method-inputs, scenarios, timeline | `handbook/index.html` | updated to SOP v3 |
| status-scale | new | the four statuses, with access wording and the colour legend |
| product-pages | `designs/assets/product.js` | page 1 map, page 2 key findings (+ hotspot), QR to the online view |
| toolbox | `content.js` `resources` | filters by category and availability; download buttons from `files[]` |
| deployment-list, deployment-profile | `content.js` `deployments` + `library.js` | |
| governance | `content.js` `governance` | only what the workshop confirmed (see section 4) |
| guide-index, guide-page | new | Markdown bodies rendered at build time, with no client-side Markdown parser; callouts for "Common failure", "kobo-mcp" and "Tip" |
| form (adopt, feedback) | `handbook/index.html` form | real UI, `mailto:` on submit |

- **Toolbox status.** Resource `status` (`available | draft | in-progress | planned`) gates downloads, as it does today: only `available` items show a download button.
- **Validation.** `validate-content.mjs` checks:
  - the model;
  - that every `files[]` path exists in `public/files/`;
  - that every deployment's `resources` id exists;
  - that guide `order` values are unique;
  - **that no file contains a credential pattern**: `password`, `undac123`, `atlasdak`, `Token [0-9a-f]{20,}`.

  A change to the content's shape updates `types.ts`, the section component, `SectionRenderer.tsx`, `validate-content.mjs` and `content/README.md` together (the HDA rule).

## 4. Pages, and how the SOP v3 / workshop updates map onto them

Every fact below comes from the sources. If a source is silent or undecided, mark it TBC on the page. Do not fill the gap with invented content.

### `/`: home (the handbook)
In page order:
1. **Hero.** Kicker: "RISA handbook · SOP v3, working draft". H1: the name from `site.yml`, with a small "name pending sign-off" note. The three questions: Can we reach people? Which services still work? Where do we act first? These match page 2's three questions.
2. **Who it's for.**
3. **Why.**
4. **Method:**
   - the three inputs (field observation, drone or aircraft imagery, satellite), with leads;
   - the six steps;
   - **the pilot scope**: displacement camps in the first days, with handover to the cluster or sector lead around week 3. Community needs assessment stays with IOM and the clusters.
   - **timing**: initial product in 3–5 days, follow-up about a week later, handover around week 3.
5. **Scenarios:** Full, Hybrid, Rapid initial.
6. **The product.** A printed map with a QR code to the online view, which is the source of truth (filterable by sector, offline-first). A feedback QR code. Counts on the map. Page 2 key findings.
7. **Toolbox summary**, linking to `/toolbox` and `/guide`.
8. **Training and handover:** in-country mentoring, remote support, webinars and videos. **No ticketed helpdesk**; there is a contact form and no promised response time.
9. **Deployments**, linking to `/deployments`.
10. **Adopt RISA** CTA.
11. **Owners strip:** "A joint initiative of Kobo, MapAction and Atlas Logistique", with "Endorsed by UNDAC / OCHA (clearance pending)" shown only as text until clearance. Logos follow the same rule.

### `/method`
The full method from SOP v3 §1–2, at the level of the main SOP text: the why, and how each step most commonly fails, with no click-level detail.
- Standards: XLSForm, open source and low-tech first, ArcGIS not required.
- Field observation (§2.1) links to `/guide`.
- Imagery: drone ~5 cm; aircraft camera ~10 cm (untested); satellite ~30 cm.
- GIS, products, dissemination and feedback.
- Roles, from SOP §3.2: include the data/Kobo focal point, the remote GIS owner, the host focal point and the handover focal point.

### `/product`
Port `product.js`:
- page 1 (the map), page 2 (key findings, built on the three questions) and the hotspot page;
- the status legend with the new labels;
- the QR code to the online view;
- link "See it working" to the RISA dashboard (https://risa-dash.kobolabs.dev).

Replace the "interactive viewer led by MapAction" copy with the dashboard. The dashboard is built (MVP); confirm who will run it with the team.

### `/toolbox`
The SOP feature card plus resource cards, filterable.

**Resources:**

| id | Title | Status | Files | Change from today |
|---|---|---|---|---|
| `sop` | RISA SOP | v3 working draft | — | Was v2. Owner: all. Status `draft` until the working group signs off; then a PDF in `files/` |
| `brief` | RISA in Brief | v3 working draft | — | Was v2. Audience: heads of NDMAs |
| `xlsform` | Annex A: XLSForm template package | **available** | template xlsx, codebook | Renamed from "Master XLSForm". Owner: Kobo. Links to `/guide/template`. Turn on availability only when the team confirms (see *Content needed*); until then, the guide shows the download as a "test version" |
| `codebook` | Codebook (data dictionary) | follows `xlsform` | codebook | |
| `legacy-codes` | Mapping from earlier forms | follows `xlsform` | `legacy_codes.csv` | New |
| `gis-standards`, `map-layouts` | Annexes B and C | as today | — | Owner: MapAction. A new GIS owner is needed: flag TBC |
| `uav-checklist` | Annex D | as today | — | Owner: Atlas. Printable and kept separate |
| `annex-e` | Annex E | TBC | — | No owner yet: flag it |
| `kobo-annex` | **Annex F: data collection with KoboToolbox** | draft | — | New. The online version is `/guide` |
| `viewer` | RISA dashboard | pilot | — | Was "Interactive viewer (pilot)", owner MapAction, planned. Now links to risa-dash.kobolabs.dev |
| `feedback-form` | Feedback form | planned | — | New. Owner: Kobo, end of year |
| the rest (`tot-deck`, `simex-pack`, `product-template`, `symbols`, `status-tokens`, `deployment-checklist`) | as today | as today | — | Update `symbols` and `status-tokens` to the new status labels |

Annex owners in the fine print: A Kobo; B and C MapAction (owner TBC); D Atlas; E TBC; F Kobo.

### `/guide`: the data collection guide
See section 5.

### `/deployments` and `/deployments/:id`
Port `deployments()` and `profile()`. One `.md` per deployment.

| id | Change |
|---|---|
| `mozambique-floods-2026` | Describe it as a SADC SIMEX (exercise), not a response; Brief v3 says so. Form: English/Portuguese, repeat-based. Lesson: why the template moved to one observation per submission |
| `venezuela-earthquake-2026` | Form: Spanish/English, flat with a sector filter. Lessons from SOP §4 (UAV, imagery, data sharing on hard drives) |
| `lyon-workshop-2026` | Status: done (29–30 Oct). The decisions summary from the workshop notes |
| `durban-workshop-2026` | 23–27 Nov, as in the workshop action list |
| `nairobi-inject-2026` | New: a RISA inject, mid-Nov (workshop actions). Status: planned |
| `bahamas-pilot` | Named as the pilot site to validate the SOP, Oct 2026–Apr 2027. Keep "details TBC" where the sources are vague |
| `tot-pilot`, `hnpw-2027` | Keep. Check them against the workshop notes |

`/deployments/:id` is prerendered for every id. Old `deployment.html?d=<id>` links reach it through the 404 script, which maps `?d=` to the path.

### `/about`
Built from Brief v3 and SOP v3, cut down:
- What RISA is: a joint initiative, **no new organisation**.
- The partners and what each brings: data collection (Kobo), GIS and maps (MapAction), drone imagery (Atlas Logistique).
- Endorsement by UNDAC/OCHA (pending).
- How it relates to MIRA.
- National handover.
- Governance: show only what the workshop confirmed. The advisory board, collaborators (HOT, HeiGIT, IOM, UNHCR, Flying Labs) and funders (Luxembourg, ECHO) from `content.js` are not confirmed by the sources. Keep them, but mark them TBC, or hide the layers (`hidden: true`) until the team confirms.
- Remove "HI/Atlas Logistique, consortium lead". Use "Atlas Logistique", as in SOP v3, and check the exact form with the team.

### `/adopt`, `/feedback`, `/404`
- **Adopt:** the request form, `mailto:` on submit.
- **Feedback:** what the feedback QR code on a printed map leads to. Until the Kobo feedback form exists, it is a short form with `mailto:` that carries `?response=&site=&product=&version=` from the QR link. These are the dashboard's `FEEDBACK_URL` placeholders, so the page must accept them.
- **404:** the redirects and a link to `/designs/`.

## 5. The data collection guide (`/guide`)

This is Annex F (`ref/RISA_SOP_Annex_Kobo.md`) and Annex A as a user guide: what, why, how, and a "common failure" box on each page, linking to official Kobo and ODK docs rather than repeating them. Write it for a data or Kobo focal point who has never seen RISA. Content files go in `content/guide/`, in order:

| slug | Title | From |
|---|---|---|
| `/guide` | Data collection for RISA | an overview: one page explaining what the field team does, the four statuses, the download card, and the two routes to a ready form |
| `/guide/template` | The RISA form | Annex A §1–2: what's in the package, the design choices (one observation per submission, sector → feature type, status, count, location, photos, note) and the field names. It embeds the codebook as a searchable table built from `codebook.md` at build time. **Download card** (see below) |
| `/guide/adapt` | Adapt it to a new emergency | Annex A §3 + Annex F §3, with two tabs: **"With an AI assistant (kobo-mcp)" (recommended)** and **"By hand"** (section 5.1) |
| `/guide/languages` | Add a language | the translation rule (English reference, AI translation, native-speaker review); both routes |
| `/guide/accounts` | Accounts and ownership | Annex F §2, SOP §3.7: organisation-owned project, one account per collector, no shared logins, server choice for data residency, and ownership transfer at handover |
| `/guide/test-and-deploy` | Test, then deploy | Annex F §4 |
| `/guide/devices` | Phones and tablets | Annex F §5: KoboCollect project QR (it carries the password, so one per collector), Enketo offline as a fallback |
| `/guide/collect` | In the field | Annex F §6 and SOP §2.1 principles: observe, don't ask; GPS at the object; photo protection; daily sync |
| `/guide/review` | Daily review and changes | Annex F §7–8: validation status, duplicates, GPS accuracy, feedback to collectors; the change rules (add only, never rename or delete, bump the version) |
| `/guide/data` | Exports, the API and the RISA dashboard | Annex F §9–11 and Annex A §5: connect the form at risa-dash.kobolabs.dev and it maps itself; media and bandwidth |
| `/guide/protection` | Data protection | Annex F §12, SOP §3.8 |
| `/guide/close` | Closing and handover | Annex F §13–14: the feedback form, archiving, and ownership transfer |
| `/guide/troubleshooting` | Troubleshooting | Annex F §16, as a table |

- A **"Download the PDF"** of the whole guide is phase 2.
- The guide footer says: "This guide is Annex F of the RISA SOP (v3 working draft). Source: risa-dashboard `ref/`."

**Download card.** It shows:
- the template version (from the file name, e.g. `2026111201`) and file sizes;
- buttons: **XLSForm template (.xlsx)**, **Codebook (.md, or rendered)** and **Mapping from earlier forms (.csv)**;
- "English only; add your language (see Add a language)";
- "Test version until the working group signs off" while `xlsform` isn't `available`.

### 5.1 Adapting the form: the two routes

**With an AI assistant (kobo-mcp), recommended.** kobo-mcp is an MCP server for KoboToolbox at `https://mcp.kobolabs.dev/mcp`. Steps:
1. Add it to an MCP-capable assistant and sign in with **your own** Kobo account. It never needs a shared login. Link the kobo-mcp README for client set-up.
2. Give it the template file, then ask in plain language. Show each step as a copyable prompt, with the kobo-mcp tool it uses, in mono:
   - "Replace the admin areas with the COD-AB P-codes for <country> (admin 1 and 2) from HDX, and the site list with these camps: …"
   - "Set the organisations to …"
   - "Add a Spanish translation (`label::Español (es)`) for every label, hint and constraint message, and list anything a native speaker should check."
   - "Check the form" (`convert_xlsform`)
   - "Show me the form" (`preview_form`)
   - "Deploy it as RISA_<ISO3>_<site>" (`deploy_form`), or "start from the RISA template project" (`clone_project`; TBC: see *Content needed*)
   - "Create 10 test submissions" (`create_submissions`), then "delete the test data", or mark it Not Approved (`set_validation_status`)
   - "Share it with these collectors, add-submissions only" (`share_project`)
3. During the mission:
   - "Summarise today's submissions by collector" (`summarize_submissions`)
   - "Find duplicates" (`find_duplicates`)
   - "Approve the checked records" (`set_validation_status`)
4. Changes mid-mission: "Add a choice …, bump the version and redeploy" (`deploy_form` with `redeploy`). The assistant must flag any rename or delete, because that breaks data already collected.

**By hand.** Steps:
1. Edit the `.xlsx` in Excel, LibreOffice or Google Sheets, following the `adapt` sheet inside the template.
   - Replace the placeholder `level_1`, `level_2` and `site` lists, keeping the parent columns.
   - Set `org`.
   - Add `label::<Language> (<code>)`, `hint::…` and `constraint_message::…` columns for a new language: all suffixed, never mixed with unsuffixed ones.
   - Bump `version`.
2. Upload it to KoboToolbox, preview, test offline on a device, then deploy. Link the official Kobo articles.
3. **Don't edit the form in Kobo's form builder.** It gives new lists random names (`bp0fd95`), which is how the earlier forms drifted. If someone did edit it there, download the XLSForm and fix the names before the next deployment.

**Both routes end at the same check:** the form ID starts with `risa_obs` and the field names are unchanged. That is what lets the RISA dashboard recognise the form.

### 5.2 Keeping it in step with risa-dashboard

- `scripts/sync-downloads.sh` copies these from `../risa-dashboard/templates/xlsform/` into `public/files/`:
  - the newest `RISA_template_<version>.xlsx`
  - `codebook.md`
  - `legacy_codes.csv`

  It also writes `content/settings/downloads.yml` (version, file names, sizes, date). The download card and the template page read that file.
- The guide copy is written from the annexes but lives here. Add a "Last checked against Annex F" date to each guide page, and a README note: when the annexes change, update the guide.

## 6. Deployment

The DigitalOcean App Platform app `risa-website` (region `fra`) is today a static site with `source_dir: site` and no build command. There is no app spec in the repo. Add `.do/app.yaml`, as in HDA:

```yaml
static_sites:
  - name: site
    environment_slug: node-js
    build_command: npm run lint:content && npm run build
    output_dir: dist
    error_document: 404.html
    envs:
      - { key: SITE_URL, value: https://risa.kobolabs.dev, scope: BUILD_TIME }
      - { key: NOINDEX,  value: "true",                     scope: BUILD_TIME }
```

- First pull the live spec (`doctl apps spec get <id>`) so the domain and other settings are kept.
- **Applying the spec (`doctl apps update`) changes the live app, so ask before doing it.** Every push to `main` deploys, so build on a branch (`website-build`). The merge and the spec update go out together; until the spec is applied, the old `source_dir: site` would break the moment `site/` moves.
- The whole site keeps `noindex` until launch.

## 7. Build order

1. **Scaffold:**
   - branch `website-build`;
   - Vite, React, Mantine and the prerender, copied from hda-website;
   - `git mv site public/designs`, the 404 redirects, and a check that `/designs/` works.
2. **Theme and `DESIGN.md`:**
   - tokens, type, status colours and labels;
   - the contrast table;
   - the deviations table.
3. **Brand components:**
   - Logo 10b port and favicon;
   - `StatusPill` and `StatusLegend`;
   - `SiteMap`, the world map, the TOC article layout.
4. **Content migration:**
   - `content.js` to `content/`;
   - the copy updates in section 4;
   - `validate-content.mjs`.
5. **Pages:** home, method, product, toolbox, deployments, about, adopt, feedback, 404.
6. **The guide:**
   - `sync-downloads.sh`;
   - the download card and codebook table;
   - the 13 guide pages, including the kobo-mcp and by-hand tabs.
7. **Checks:**
   - `npm run lint:content` and `npm run build`;
   - screenshots of every route at 1440 and 390 wide (`scripts/shot.sh`);
   - the AA contrast table;
   - a keyboard pass and a no-JS pass (prerendered pages must read without JS);
   - `/designs/` and old `/themes/...` and `/downloads/...` links;
   - the downloads open, and the xlsx is byte-identical to the dashboard repo's;
   - a credential scan of `dist/`.
8. **Docs and spec:**
   - `README.md` (the new structure, preview, sync, deploy order), `AGENTS.md`, `content/README.md`;
   - `.do/app.yaml`;
   - update `plans/risa-design-site.md` status to "superseded by website-build.md" and record the vote (Handbook, 10b) in its decisions.
   - Then open a PR. Don't merge; the user pushes.

## Content needed from the team

- [ ] Final 10b geometry: a `?gt=` code from `designs/logos/studio.html`, or confirmation that `GT_DEFAULTS` is final.
- [ ] Name sign-off: "Rapid Infrastructures & Services Assessment".
- [ ] UNDAC/OCHA endorsement clearance, and whether their logo may be shown.
- [ ] Partner names and logos as they should appear (Atlas Logistique or HI/Atlas Logistique?).
- [ ] Which governance layers and members are confirmed.
- [ ] Contact address (today `contact@risa-method.org`: confirm it exists).
- [ ] Whether the template download goes live now as a test version, or waits for review of the detail questions by Michael or the Kobo focal point.
- [ ] A public "RISA template" project on an organisation Kobo account, so `clone_project` can start from it. Who owns it?
- [ ] Who runs the RISA dashboard for responses, and whether to link it publicly.
- [ ] Feedback form: owner and link, once Kobo builds it.
- [ ] Bahamas, Nairobi and Durban details that can be published.

## Phase 2 (not in this build)

- Translations (FR, ES, PT), with the same i18n set-up as HDA.
- Sveltia CMS at `/admin/`.
- A PDF of the guide and of the SOP v3 when signed off.
- A "RISA template" button that opens kobo-mcp with the template preloaded.
- A screencast per guide route (the workshop's "videos" item).

## Progress

**Step 1, scaffold: done (12 Nov 2026).**
- Branch `website-build`. Vite, React, Mantine and the prerender from hda-website, English only (no i18n layer yet). Fonts self-hosted: Source Sans 3, IBM Plex Mono, Public Sans (wordmark).
- `git mv site public/designs`. Every path in it was already relative, and the results parser matches `/themes/<id>/` anywhere in a path, so `/designs/themes/...` links tally. Edits to it: the "Decided" note on the hub, and the results page's example URLs now use `/designs/themes/`. Every page already had `noindex`; `robots.txt` disallows `/designs/` (all of `/` while `NOINDEX=true`).
- Old links: one `legacyRedirect()` in `src/lib/url.ts`, inlined into `404.html` by `prerender.mjs` and run by `NotFound` in dev. `/downloads/RISA_template.xlsx` and `/downloads/RISA_codebook.md` go to the current `/files/` copies; other review paths go to `/designs/`; root `deployment.html?d=<id>` goes to `/deployments/<id>`. (Review-site `/themes/<t>/deployment.html?d=` links go to `/designs/`, as the record.) Tested in the built 404 page and the dev server.
- `scripts/sync-downloads.sh` (`npm run sync:downloads`) is in already, since the redirect needs the template's file name: it copies the template, codebook and legacy codes and writes `content/settings/downloads.yml`. The xlsx is byte-identical.
- `validate-content.mjs` checks settings, pages, the `downloads.yml` files and the credential patterns so far.
- `content/settings/site.yml` has the name (pending), contact (TBC), partners, nav and footer. `public/favicon.svg` is the review site's until step 3 regenerates it. Header and footer are placeholders.
- `AGENTS.md` and `CLAUDE.md` added; the README still describes the review site (step 8).

**Steps 2–8: done (12 Nov 2026).**
- **Theme** (`src/theme/theme.ts`, `DESIGN.md`): `ink` and `blue` scales, `--risa-*` variables, the `.risa-dark` band, self-hosted fonts, square corners, no shadows. The contrast and deviations tables are in `DESIGN.md`. Changes from Handbook: the amber pill text darkens to #8C5C0F (#9A6510 was 4.4:1 on the surface grey), and Mantine's hint grey is replaced (3.3:1).
- **Status** (`src/lib/status.ts`): the template's labels (Working, Partly working, Not working, Can't see; Passable, Restricted, Blocked), with one `StatusPill` and one `StatusLegend`.
- **Brand:**
  - `src/lib/logo.ts` ports `gridtrackLayers()` frozen at `GT_DEFAULTS`. A side-by-side render matches the original.
  - The favicon is generated from it (`scripts/favicon.mjs`).
  - `SiteMap` and `WorldMap` are ported from `sitemap.js` and `library.js`.
  - The product pages are React, with page 1 updated to SOP v3 §2.5: counts, a QR code to the dashboard and a feedback QR code that carries `?site=&product=&version=`. The codes are real (`qrcode-generator`).
- **Content model:**
  - Markdown is rendered at build time by `scripts/markdown.mjs`, through a Vite plugin. Every front-matter `body` is Markdown, with directives for callouts, tabs, prompts, `{tbc}` and `{{components}}`.
  - This is a deviation: the plan's `src/lib/markdown.ts` became `scripts/markdown.mjs`, because the validator shares it.
  - `validate-content.mjs` checks:
    - every section's fields (and catches YAML's ", " and ": " traps);
    - enums, partner and resource ids, and country names for the map;
    - unique orders, `files[]` paths and internal links;
    - credentials.
- **Content:** 8 pages, 8 deployments, 17 resources and 13 guide pages. Every page passes the checks.
  - The guide, resources and deployments were drafted by subagents from the sources. Their notes on source conflicts are below.
  - `xlsform` is `in-progress`, not `available`, until the team confirms. The toolbox shows no download buttons yet, and the guide offers the files as a test version.
  - `deployment-checklist` was dropped, because SOP v3 makes it Annex E.
- **The credential pattern** is narrowed to `password\s*[:=]` (the bare word appears in the guide's explanations). `prerender.mjs` also scans every page it writes.
- **Checks:**
  - `lint:content` and `build` pass, and 29 pages and the 404 page are prerendered.
  - No route has a hydration error. `npm run preview` now serves `dist/` like the host (`appType: 'mpa'`). In SPA mode it served the home page's HTML for every path, which looked like a hydration bug.
  - Screenshots of every route at 1440 and 390 wide are fine. `shot.sh` renders phone widths in an iframe, because Chrome's windows can't go below about 500px.
  - The redirects were tested in the built 404 page and on the dev server.
  - The downloads are byte-identical to risa-dashboard's.
  - The credential scan of `dist/` finds one match, a false positive: React's list of input types.
  - Without JavaScript: both tabs show, the menu and contents are `<details>`, the forms fall back to `mailto:`, and the filters hide while everything shows.
  - Not done: a full keyboard pass with a screen reader.
- **Docs and spec:**
  - `README.md`, `AGENTS.md`, `DESIGN.md` and `content/README.md` are written.
  - `.do/app.yaml` comes from the live spec (domain, alerts and region kept), plus the build. It is **not applied**.
  - `plans/risa-design-site.md` is marked superseded, with the vote recorded.

**Source conflicts the content flags (for the team):**
- Lyon's dates: the notes' file name says 28–29 Oct, and the text says 29–30 Oct. The site uses 29–30 Oct.
- Mozambique: Brief v3 and SOP v3 call it a SADC SIMEX, while older records describe a floods response. The site uses SIMEX, with a TBC.
- Venezuela: SOP v3 §4 credits MapAction with the maps, but `content.js` didn't list MapAction. The site keeps Atlas Logistique and Kobo, with a TBC.
- UAV flight defaults: SOP v3 says about 80 m AGL and 80% overlap; the old Annex D says 120 m with 80/70% overlap. Flagged on Annex D.
- Durban: "about six countries" against five named states. Nairobi: 15–27 Nov on the board, "mid-Nov" in the actions.
- The audit log: Annex A says every 10 s; SOP §2.1 says at form events. The guide follows Annex A.

