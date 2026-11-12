# Content

Every word on the site lives here. Edit a file, push, and the site rebuilds. Run `npm run lint:content` first: it catches most mistakes before the build does.

```
settings/site.yml       name, contact, partners, endorsers, nav, footer
settings/downloads.yml  written by `npm run sync:downloads`; never edit by hand
pages/<slug>.md         one page each: home.md is /, method.md is /method
deployments/<id>.md     one deployment each: /deployments/<id>
resources/<id>.md       one toolbox item each
guide/<slug>.md         the data collection guide: index.md is /guide, accounts.md is /guide/accounts
```

The types are in `src/lib/types.ts`. If you change the shape of anything, update that file, the section component, `src/components/sections/SectionRenderer.tsx`, `scripts/validate-content.mjs` and this README together.

## Rules

- **Facts come from the sources** (`~/code/risa-dashboard/ref/`: SOP v3, the annexes, Brief v3, the Lyon workshop notes). If a source is silent or undecided, say so and mark it TBC. Never invent names, figures, dates or URLs.
- **No credentials, ever**: no usernames, passwords, tokens or the old shared server URL. Never use or link `ref/kobo for dummies.docx.pdf`. `lint:content` scans for them.
- **Status words** are the template's: Working, Partly working, Not working, Can't see. For access points (routes, choke points), say Passable, Restricted, Blocked.
- Plain English, short sentences, sentence-case headings. British spelling.

## Markdown

Markdown files have YAML front matter between `---` lines, then an optional Markdown body. **In front matter, every field named `body` is Markdown too**, so use a YAML block scalar for anything longer than a line:

```yaml
body: |
  First paragraph, with a [link](/guide).

  - a list
```

Other text fields (`title`, `intro`, `lead`, `summary`…) are plain text.

Besides ordinary Markdown (headings, lists, tables, links, `code`), these work in any Markdown:

| Write | Get |
|---|---|
| `{tbc}` or `{tbc: dates to be confirmed}` | a TBC marker, inline |
| `:::failure Common failure` … `:::` | a callout. Tones: `failure`, `tip`, `kobo-mcp`, `note`. The title is optional |
| `:::tabs`, then `::tab Label` (or `::tab Label \| recommended`) before each tab's content, then `:::` | tabs; the text after `\|` is a badge. Without JavaScript, the tabs show one after another |
| ` ```prompt tool=deploy_form ` … ` ``` ` | a copyable prompt for an AI assistant, with the kobo-mcp tool it uses (optional) |
| `{{download-card}}`, `{{codebook}}`, `{{status-scale}}`, `{{guide-pages}}` on a line of their own | the template download card, the searchable codebook, the status legend, the list of guide pages |

`##` headings make the page's contents list (on guide and deployment pages). Use `###` below them.

Links inside the site start with `/` (`/guide/adapt`). Downloads are `/files/...`.

## settings/site.yml

| Field | |
|---|---|
| `name` | The full name. The logo wordmark and the home page read it |
| `nameStatus` | `pending` shows "name pending sign-off" beside it; `agreed` hides that |
| `shortName` | RISA |
| `description` | The default page description |
| `contact`, `contactTbc` | The forms' email address (their fallback), and whether it's still to be confirmed |
| `formEndpoint` | The contact-form function's URL; empty means the forms open an email |
| `dashboardUrl` | The RISA dashboard |
| `partners[]`, `endorsers[]` | `id`, `name`, `role`, `note`, `tbc` |
| `nav[]`, `cta` | The header links and the header button (`label`, `href`) |
| `footer` | `owners` line, `note`, `links[]` |

## pages/*.md

```yaml
---
title: Method
description: For search results and link previews.
toc: true          # Handbook layout: contents list beside the reading column
sections:
  - type: hero
    kicker: RISA handbook
    lead: …
  - type: prose
    id: why
    title: Why RISA
    body: |
      …
---
```

With `toc: true`, everything after the opening `hero` goes in the reading column, and every section with an `id` and a `title` gets a contents entry (`short` replaces the title there).

Every section takes `id`, `title`, `short`, `intro` (a plain paragraph under the title), `hidden: true` (not rendered) and `tbc: true` (a TBC marker by the title).

| `type` | Fields |
|---|---|
| `hero` | `kicker`, `title` or `siteName: true` (the site name, with its sign-off note), `lead`, `questions[]`, `links[]` |
| `prose` | `body` |
| `audiences` | `items[]`: `who`, `examples`, `question`, `gets[]`, `link`, `lead` |
| `rows` | `items[]`: `term`, `detail` (mono, e.g. `~5 cm`), `body`, `tbc`; then `body` |
| `steps` | numbered: `items[]`: `title`, `body`, `failure` (how this step most often fails); then `body` |
| `table` | `columns[]`, `rows[][]` (plain text cells), `caption`; then `body` |
| `timeline` | `items[]`: `when`, `title`, `body`; then `body` |
| `status-scale` | the four statuses and their access wording, with the legend; then `body` |
| `product` | the sample product: `pages[]` (`map`, `findings`, `hotspot`), `body`, `links[]` |
| `cards` | `items[]`: `title`, `kicker`, `body`, `link`, `tbc`; then `body` |
| `cta` | `body`, `links[]` (on a dark band) |
| `owners` | the owners strip, from site.yml |
| `stats` | `items[]`: `value`, `label`, `tbc` |
| `toolbox` | the whole toolbox, filterable: `feature` (a resource id for the feature card), `body` |
| `resource-list` | `items[]` (resource ids), `body`, `links[]` |
| `deployments` | `map` (world map), `limit`, `body`, `links[]` |
| `governance` | `layers[]`: `id`, `name`, `short`, `text`, `hidden`, `tbc`, `members[]` (`name`, `full`, `role`, `tbc`); then `body` |
| `partners` | the partners and endorsers from site.yml; `body` |
| `form` | `kind` (`adopt`, `feedback`), `subject` (for the email fallback), `fields[]` (`name`, `label`, `type`: text/email/textarea/select, `options[]`, `required`, `hint`, `param`), `submit`, `body`. Answers go to the KoboToolbox form through the contact-form function when `formEndpoint` is set, otherwise to an email to `contact`. `param` prefills a field from the link's query string. **After changing fields, rebuild the Kobo form** (`contact-form/README.md`); `kind`, `page` and `website` are reserved |
| `guide-pages` | the guide's pages, in order; `body` |
| `callout` | `tone`, `body` |

Links (`links[]`, `link`) are `label`, `href` and `variant` (`primary`, `secondary` or `link`, the default).

## deployments/*.md

The file name is the id and the URL.

```yaml
---
title: Mozambique floods SIMEX
kind: exercise        # response | exercise | training | workshop | event | pilot
status: done          # done | active | planned
mode: deployed        # deployed | remote | both (optional)
scenario: full        # full | hybrid | rapid (optional)
place: Mozambique
countries: [Mozambique]
iso3: [MOZ]
locations: [{ name: Maputo, lat: -25.97, lon: 32.57 }]   # optional; else the country centre
hazard: Floods
start: 2026-01-26     # yyyy-mm-dd, yyyy-mm, yyyy or yyyy-Qn
end: 2026-02-08
partners: [atlas, mapaction, kobo]   # site.yml partner and endorser ids
summary: One or two sentences, for the list.
facts:                # optional key facts box
  - { label: Form, value: English and Portuguese, repeat-based }
products: [ … ]
lessons: [ … ]
resources: [sop, xlsform]   # resource ids
note: Anything still to check.
tbc: true
---
## The situation

Markdown body.
```

## resources/*.md

The file name is the id. Front matter only.

| Field | |
|---|---|
| `order` | Position in the toolbox |
| `category` | `sop`, `forms`, `gis`, `training`, `comms` |
| `code` | Short label: `SOP`, `Annex A` |
| `title`, `version`, `owner`, `format`, `languages[]`, `updated`, `summary`, `details[]`, `note`, `tbc` | |
| `status` | `available`, `draft`, `in-progress`, `planned`. **Only `available` shows downloads** |
| `follows` | Take another resource's status (the codebook follows `xlsform`) |
| `files[]` | `label`, `path` (`/files/...`; must exist in `public/files/`) |
| `link` | Read it online: `label`, `href` |

## guide/*.md

```yaml
---
title: Accounts and ownership
order: 5              # unique; sets the order and the previous/next links
annexRef: Annex F §2, SOP §3.7
summary: One sentence, for the guide's contents.
lastChecked: 2026-11-12   # the date this page was last checked against the annexes
---
```

Then the page in Markdown. Each page explains what, why and how; ends its main part with a `:::failure Common failure` box; and links to the official Kobo and ODK documentation rather than repeating it. When the annexes change, update the guide and its `lastChecked` dates.
