# RISA: design options

A static review site for the RISA (Rapid Infrastructure and Service Assessment) brand identity, live at **https://risa.kobolabs.dev**. It compares several design directions across a website, a style guide, the three-page RISA product and collateral, and lets the consortium rank favourites by link. It is modelled on the HDA review site (`~/Desktop/work/repos/hda-website`) and reuses its review bar, rank-by-link results page and token system.

The plan, decisions and open questions are in [`plans/risa-design-site.md`](plans/risa-design-site.md).

No build step and no dependencies. Plain HTML, CSS and JS in `site/`.

## Preview locally

```sh
cd site
python3 -m http.server 8787
# open http://localhost:8787
```

Any static server works. Pages use relative paths.

## What's in it

| Path | What |
|---|---|
| `site/index.html` | Review hub: brief, how to review, direction cards, logo overview, design principles |
| `site/themes/<id>/index.html` | Home page: the RISA methodology site, in six directions: `briefing` (A), `groundtruth` (B), `overhead` (C), `streams` (D), `sharedground` (E), `first72` (F) |
| `site/themes/<id>/style-guide.html` | Logo use (incl. co-branding with a national authority), colour, **reserved status colours**, type, components, **map symbology**, graphics, voice |
| `site/themes/<id>/product.html` | The three-page RISA product (map, key findings, hotspot) and a working mock of the interactive viewer |
| `site/themes/<id>/collateral.html` | RISA in Brief (A4 two-pager), ToT/SIMEX slides, workshop stand, field kit (ADAK case label, ID card, hi-vis tabard, KoboCollect form), badge, social posts, ToT certificate, email signature |
| `site/logos/index.html` | Eight logo concepts with rationale, greyscale and one-colour tests, imagery, and co-branding |
| `site/palettes/index.html` | The reserved status set with greyscale and colour-vision simulations, partner colours, theme palettes with WCAG contrast |
| `site/results/index.html` | Organisers only (not linked from the hub): paste the review doc to tally everyone's top three picks |

### Review bar

Every themed page has a toolbar that switches **theme**, **page (Home / Style guide / Product / Collateral)** and **logo (1–8)**. Only themes marked `ready: true` in `assets/themes.js` appear in it.

- The logo choice is remembered across pages.
- Share a combination with `?logo=<id>`. **Copy link** always writes the explicit logo id.
- `?logo=default` resets to the theme's paired logo.
- On collateral pages, `?slides=all` shows every slide in a grid.
- `?clean` starts with the bar collapsed; `?shot` hides it completely.

### Running a review round

Same as HDA. Reviewers paste their top three **Copy link** URLs under their name in a shared doc:

```
Name — Organisation
1. https://risa.kobolabs.dev/themes/briefing/product.html?logo=route
2. …
3. …
Comments: optional
```

Then paste the doc into `results/index.html` (`?example` shows the format). It tallies themes, logos, combinations and theme × logo pairings, scores rank 1/2/3 as 3/2/1 by default, and can weight organisations equally. **Download recipes.json** exports everything.

### How it's built

- **Status colours:** `assets/base.css` defines `--st-ok`, `--st-partial`, `--st-no`, `--st-unknown` and the hazard colours once, for every theme. Brands must not use red, amber or green. Status is always shown twice, by colour and by line style or symbol shape.
- **Sample site:** `assets/sitemap.js` draws one fictional displacement site as inline SVG (`data-graphic="site"`), in map, drone (`data-mode="ortho"`) or blurred satellite (`sat`) style, before or after the flood (`data-time`), full or zoomed on the hotspot (`data-view`), with switchable layers (`data-layers`). `RISASite.summary()` gives the counts the product page uses, so numbers always match the map.
- **Tokens:** `themes/<id>/tokens.css` defines colours, fonts and radius scoped to `[data-theme="<id>"]`. `.inverse` holds the dark-section overrides.
- **Theme styles:** `themes/<id>/theme.css` contains the page layout and the shared component classes (`.btn`, `.tag`, `.card`, `.input`, `.link-arrow`, `.eyebrow`).
- **Logos:** `assets/logos.js` draws each mark as inline SVG coloured by `--logo-a` to `--logo-d`, `--logo-ink` and `--logo-bg`. Add `data-risa-logo="horizontal|stacked|mark"` to an element to render one.
- **Product:** `assets/product.js` and `product.css` render the three pages at A3 landscape proportions, scaled in container units, plus the interactive mock.
- **Collateral:** `assets/collateral.js` renders every collateral piece from one template; a `FLAVOUR` entry per theme picks the cover style, artwork and texture.
- **Theme metadata:** `assets/themes.js` holds names, rationale, swatches and the `ready` flag.

### Adding a direction

1. Copy `site/themes/briefing/` to `site/themes/<id>/` and change `data-theme`, `data-theme-id` and the titles.
2. Write its `tokens.css` and `theme.css`.
3. Add a `FLAVOUR` entry in `assets/collateral.js`, fill `swatches` and set `ready: true` in `assets/themes.js`, and add its tokens to `palettes/index.html`.
4. Regenerate its hub thumbnail (below).

### Regenerating hub thumbnails

With the local server running (needs Google Chrome):

```sh
for id in briefing groundtruth overhead streams sharedground first72; do
  scripts/shot.sh "themes/$id/index.html?shot&logo=default" /tmp/$id.png 1440 900
  sips -Z 960 -s format jpeg -s formatOptions 78 /tmp/$id.png --out site/assets/thumbs/$id.jpg
done
```

## Deployment

The site is hosted on DigitalOcean App Platform as a static site (app `risa-website`, region `fra`, source directory `site`, no build command), the same setup as HDA. It is live at **https://risa.kobolabs.dev**. The DNS record lives in the `kobolabs.dev` zone on DigitalOcean.

**Every push to `main` deploys automatically.**

Pages carry `<meta name="robots" content="noindex">`. Keep that while the site is a review site.

## Content notes

- Copy follows RISA SOP v2 and RISA in Brief v2 (observation-only field data, six steps), from the Notion workstream page.
- HOT is not named in round one while its role is agreed.
- All maps and figures use a fictional sample site and are marked as such. Dates and figures marked **TBC** are placeholders.
- Partner names appear as text; official logos would be swapped in once a direction is chosen.
- Partner colours were sampled in October 2026: HI/Atlas Logistique from hi.org, MapAction from its site stylesheet and logo, Kobo from its `colors.scss`. Themes use the shared cool families (navy, blue, teal, indigo) and HI sand. HI orange and yellow and MapAction red are held back because they read as status. None of this is an official brand specification.
