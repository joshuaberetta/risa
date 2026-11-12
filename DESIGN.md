# Design system

The RISA website uses **Theme G, Handbook**, from the design review (`public/designs/themes/handbook/`), with **logo 10b, Grid track, layered**. Both were chosen by the team vote (Nov 2026). Handbook is plain documentation: black text on white, one link blue (Kobo dark blue), greys, square corners, no shadows, and a contents list beside a reading column. Text, tables and lists do the work.

The page structure follows hda-website (`~/Desktop/work/repos/hda-website/DESIGN.md`), so the sites are built the same way. Handbook's CSS was re-expressed here, not reused.

- **Tokens** live in [`src/theme/theme.ts`](src/theme/theme.ts) (the Mantine theme and the `--risa-*` variables) and [`src/theme/global.css`](src/theme/global.css) (links, focus, the dark band, TBC markers).
- **Status** lives in [`src/lib/status.ts`](src/lib/status.ts): the four statuses, their labels and their colours.
- **Brand components** live in [`src/components/brand/`](src/components/brand/):
  - the logo (`Logo`, `LogoMark`, from `src/lib/logo.ts`);
  - `StatusPill` and `StatusLegend`;
  - the sample `SiteMap` (`src/lib/sitemap.ts`);
  - the deployments `WorldMap` (`src/lib/world.ts`);
  - the sample `Product` pages;
  - `Qr` codes.

  All of them are ported from the review site's `assets/*.js` with the same geometry, and they're deterministic, so the server and the browser draw the same thing.

## Principles

1. **Handbook's palette only.** Use the theme colours (`blue.7`, `ink.6`) or `var(--risa-*)`, never hex values in components. The exceptions are the map's own colours (`sitemap.css`, `Product.module.css`), which are a printed product's, not the site's.
2. **One blue.** Kobo dark blue (#00599D) is for links, focus and the primary button. Nothing else is coloured.
3. **Status colours are reserved.** Green, amber, red and grey mean Working, Partly working, Not working and Can't see, and nothing else. No brand element is red, amber or green. Only `StatusPill`, `StatusLegend`, the site map and the product use them. Status is always shown twice, by colour and by shape (filled, half, crossed, outline; solid, dashed, dotted), so it survives greyscale printing and colour-vision differences.
4. **Plain, not decorated.** Square corners, no shadows, rules instead of boxes. Callouts and feature panels are a grey panel with a 4–5px rule at the inline start.
5. **AA everywhere.** Text meets WCAG AA (4.5:1, or 3:1 for large text). See [Contrast](#contrast-checked).
6. **Works without JavaScript.** Every page is prerendered. Tabs show one after another, the menu and the contents list are `<details>`, and the forms fall back to a `mailto:` form.

## Colour

| Scale | Key shades | Use |
|---|---|---|
| `ink` | `9` #0B0C0C ink, `6` #505A5F secondary text, `3` #B1B4B6 rule, `2` #DDDDDD soft rule, `0` #F3F2F1 surface | Text, rules, the footer, callouts, dark bands (`9`) |
| `blue` | `7` #00599D Kobo dark blue, `8` #00467C hover, `3` #8FC1EA on dark | Links, focus ring, primary button |

`--risa-*` variables: `paper`, `surface`, `ink`, `ink-2`, `line`, `line-soft`, `link`, `link-hover`, `font-mono`, `header-height`, `rule` (the callout rule). The `.risa-dark` class (the CTA band) swaps them for ink backgrounds, as Handbook's `.inverse` did.

**Logo colours.** `--logo-a` (grid and drone, blue), `--logo-b` (flight path and layers, ink), `--logo-ink` (wordmark) and `--logo-bg` (the knock-out). `.risa-dark` switches them.

### Status

| Status | Service label | Access label | Symbol and line | Fill | Text |
|---|---|---|---|---|---|
| `ok` | Working | Passable | Filled; solid | #1F9A62 | #146B44 |
| `partial` | Partly working | Restricted | Half-filled; dashed | #E9A23B | #8C5C0F |
| `no` | Not working | Blocked | Crossed out; dotted | #A8281A | #A8281A |
| `unknown` | Can't see | Can't see | Grey outline (not assessed) | #8C939C | #5E656E |

The labels are the RISA template's (`codebook.md`, the `status` list). `--risa-st-<status>` is the fill, for symbols and lines. `--risa-st-<status>-text` is the AA-safe shade, for labels.

### Contrast (checked)

| Pair | Ratio |
|---|---|
| Ink #0B0C0C on white / surface #F3F2F1 | 19.6 / 17.5 |
| Secondary #505A5F on white / surface | 7.1 / 6.3 |
| Link #00599D on white / surface | 7.2 / 6.4 |
| White on the primary button #00599D / hover #00467C | 7.2 / 9.7 |
| White on ink (dark band, product band) | 19.6 |
| #C5C9CB text on ink / on #1D1F20 | 11.7 / 9.9 |
| Link #8FC1EA on ink | 10.2 |
| Hints and descriptions (`--mantine-color-dimmed` → #505A5F) on white | 7.1 |
| Placeholders (#6F777B) on white | 4.6 |
| TBC marker (#505A5F) on white / surface | 7.1 / 6.3 |
| Status pill text on white: Working / Partly working / Not working / Can't see | 6.5 / 5.7 / 7.0 / 5.9 |
| The same on surface #F3F2F1 (pills have a white fill, but checked anyway) | 5.8 / 5.1 / 6.3 / 5.3 |
| Status fills against white (non-text, 3:1): Working / Not working / Can't see | 3.6 / 7.0 / 3.1 |
| Amber fill #E9A23B against white | 2.2: always paired with an outline and the half-filled shape, and ink text on it is 9.0 |

## Typography

| Role | Font | Size / weight |
|---|---|---|
| h1 (hero) | Source Sans 3 | 2.2–3rem fluid / 700 / 1.15 |
| h2 (section) | Source Sans 3 | 2rem / 700 |
| h3 | Source Sans 3 | 1.25–1.35rem / 700 |
| Body | Source Sans 3 | 18px / 400 / 1.55 |
| Hero lead | Source Sans 3 | 1.3rem |
| Kicker | Source Sans 3 | 18px / 400, secondary ink, sentence case (Handbook has no uppercase labels) |
| Data labels: codes, field names, coordinates, versions | IBM Plex Mono | 0.88em, on the surface grey |
| Wordmark | Public Sans | 800 (RISA) and 600 uppercase (the name), as in 10b |

All three are self-hosted with `@fontsource` (no Google Fonts).

## Layout

- **Container:** 1080px, as Handbook.
- **Header:** 72px. Logo, links, then the "Adopt RISA" button. Hovered and current links get a 3px underline. Below `md`, the links fold into a "Menu" `<details>`. Below 30em, the wordmark drops its two-line name.
- **Hero:** the kicker, the h1, a lead and (on the home page) the three questions, ending on a rule.
- **Reading layout** (`HandbookLayout`): a 14rem sticky contents list, a 4rem gap and a 44rem reading column. Below 56em, the contents fold into a "Contents" `<details>` above the text. Pages turn it on with `toc: true`; guide and deployment pages always use it. Guide pages add the guide's page list under the contents, and previous/next links at the foot.
- **Sections** are 3.2rem apart. Lists of things (audiences, resources, deployments, governance members) are rows between rules, not cards.

### Patterns

| You want to… | Use |
|---|---|
| Open a page | `hero` |
| Explain something | `prose` (Markdown, with callouts) |
| Define terms side by side | `rows` |
| Number a procedure | `steps`, with `failure` for how each step goes wrong |
| Show the statuses | `status-scale`, or `{{status-scale}}` in Markdown |
| Show the product | `product` |
| Warn about a common failure | `:::failure` in Markdown |
| Give a copyable AI prompt | ` ```prompt tool=… ` in Markdown |
| Offer two ways to do one thing | `:::tabs` in Markdown |
| Close a page with an action | `cta` (dark band) |

## Components

- **Buttons** (`LinkButton`): `primary` is a blue filled button with →. `secondary` is a 2px ink outline. `link` is a plain underlined link. Off-site links show ↗ and open in a new tab.
- **Links** are always underlined. The underline thickens to 3px on hover.
- **Callouts** (`Callout`): a grey panel with a 4px rule. `failure` has an ink rule, `kobo-mcp` a blue one, and `tip` and `note` a grey one.
- **Prompts:** a 2px ink frame, the prompt text, then a grey footer with the kobo-mcp tool in mono and a Copy button.
- **Tabs:** underlined labels. The current one is ink with a 4px underline. Arrow keys move between tabs.
- **Filters** (toolbox, deployments): plain underlined buttons. The current one is bold ink. They hide without JavaScript, and everything shows.
- **TBC marker** (`<Tbc>`, `{tbc}` in Markdown): a dashed grey outline. Use it for anything waiting on the team.
- **Status pill:** mono text in the status's text shade, a symbol in its shape, a 1.5px outline, on white.

## Motion

None, beyond hover states. `prefers-reduced-motion` turns off all transitions anyway (`global.css`).

## Deviations

| Handbook (review site) | Here | Why |
|---|---|---|
| Status labels "Open / working", "Restricted / partly working", "Closed / not working", "Not assessed" | Working, Partly working, Not working, Can't see; Passable, Restricted, Blocked for access points | The template's status scale (codebook.md), so the form, the map and the site use the same words |
| Amber pill text #9A6510 | #8C5C0F | #9A6510 is 4.4:1 on the surface grey; #8C5C0F is 5.1:1 |
| "Rapid Infrastructure and Service Assessment" | "Rapid Infrastructures & Services Assessment", from `site.yml`, with a "pending sign-off" note | The Lyon workshop's name; one setting, which the wordmark reads too |
| "HI/Atlas Logistique", consortium lead | "Atlas Logistique", one of three equal partners | SOP v3, and workshop decision 1 (joint initiative, equal share) |
| Google Fonts, with every review typeface | Self-hosted Source Sans 3, IBM Plex Mono and Public Sans | Privacy, speed, and offline use |
| Logo tweakable in the studio (`?gt=`) | Frozen at `GT_DEFAULTS` | The build needs one logo; the studio stays at `/designs/logos/studio.html` |
| Product: "interactive viewer led by MapAction" mock-up | The RISA dashboard, linked, and two QR codes and counts on page 1 | SOP v3 §2.5: the online view is the source of truth; the dashboard MVP exists |
| Product band in the theme's primary colour | Ink, with a blue version chip | Handbook's primary is ink |
| Toolbox and deployments drawn in the browser (`library.js`) | Prerendered from `content/`, with filters on top | Readable without JavaScript, and editable as files |
| Mantine's default hint grey (#868E96, 3.3:1) | #505A5F | AA |

## Adding or changing styles

- Put styles in a CSS module next to the component. Reference tokens as `var(--mantine-color-*)`, `var(--mantine-spacing-*)` or `var(--risa-*)`.
- Use logical properties (`margin-inline-start`, `border-block-end`), so translations can come later without rewriting CSS.
- Check any new text and background pair against AA, and add it to the contrast table.
- Code must be SSR-safe: anything that reads `window` goes in an effect. Graphics must be deterministic (seeded).
