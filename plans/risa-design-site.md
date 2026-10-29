# Plan: RISA brand identity and design options site

Status: draft, not started.

A static review site, modelled on `~/Desktop/work/repos/hda-website`, where the RISA owners (HI/Atlas Logistique, MapAction, Kobo) can compare several brand directions for RISA, rank their favourites by link, and converge on one in a second round. Source material: the Notion workstream page "Atlas / MapAction / HOT - RISA Methodology and tooling" (summary, RISA in Brief v2, SOP v2, Annex D, 30 Sep call notes).

## 1. What's different from HDA

HDA was a new alliance identity for four orgs. RISA is a **methodology and product brand**, and that changes the brief:

| | HDA | RISA |
|---|---|---|
| What's branded | An alliance (an organisation) | A methodology, a toolbox and an operational product |
| Who wears it | The four members | The three owners now, then **national emergency management authorities (NEMA)**, Flying Labs and others who adopt it. Nothing is patented, and it's meant to be shared and adapted |
| Main surface | Website | The **three-page RISA product** (COP map, key findings, hotspot zoom), read in under 60 seconds, often printed |
| Main audiences | Donors, UN, members | UNDAC/OSOCC coordinators, NEMA, cluster leads, INGOs, then donors (Luxembourg MFA) and ToT trainees |
| Colour | Built from shared member colours | Member colours matter less. **Red, amber and green are reserved for route and service status** on the map, so the brand can't use red as its accent the way HDA did |

Design principles that follow (these go on the hub, like HDA's):

1. **Legible in 60 seconds.** Type, colour and layout serve a coordinator briefing from a printout.
2. **Status colours are sacred.** Open / restricted / closed and working / partial / not working use a reserved, colour-blind-safe set that every theme shares. The brand palette stays clear of it.
3. **Survives the photocopier.** Every logo and the product template work in one colour and in greyscale.
4. **Hand-over-able.** The identity steps back so a national authority's logo can lead. "RISA" reads as a standard, like a stamp of method, not a fifth org brand.
5. **Low bandwidth, offline first.** Static HTML, inline SVG, no heavy imagery, same as HDA.
6. **Plays well with the ecosystem.** Sits next to OCHA, UNDAC, Logistics Cluster (LogIE) and MapAction map products without clashing. Uses OCHA humanitarian icon conventions for map symbology.
7. **Open.** Open-source fonts and a token file any partner or NEMA can reuse in QGIS layouts, Kobo forms and slides.

## 2. Site structure

Same pattern as HDA: plain HTML/CSS/JS in `site/`, no build step, review bar on every themed page.

| Path | What |
|---|---|
| `site/index.html` | Review hub: the brief, how to review, theme cards, logo overview, principles |
| `site/themes/<id>/index.html` | **Home**: the RISA methodology site (see 4) |
| `site/themes/<id>/style-guide.html` | **Style guide**: logo, colour (brand + reserved status set), type, components, **map symbology and legend**, voice |
| `site/themes/<id>/product.html` | **Product** (new, the most important page): the three-page RISA output and a mock of the interactive product |
| `site/themes/<id>/collateral.html` | **Collateral**: brief, slides, training and event pieces, field kit (see 5) |
| `site/logos/index.html` | All logo concepts: rationale, variants, one-colour/greyscale tests, co-branding with partners and with a NEMA |
| `site/palettes/index.html` | Partner colours as observed, the reserved status set (with colour-blind simulation), every theme palette with WCAG contrast |
| `site/results/index.html` | Organisers only: paste the review doc, tally top-three picks (ported from HDA) |

Review bar: **Theme / Page (Home, Style guide, Product, Collateral) / Logo**, plus Copy link. Same URL recipe as HDA (`?logo=<id>`, `?clean`, `?shot`, `?slides=all`).

## 3. Round-one directions (6 themes)

Working names. Each gets tokens, a home page, style guide, product and collateral.

| | Theme | Idea | Best for |
|---|---|---|---|
| A | **Briefing** | Calm, institutional, UN-adjacent. Navy and white, lots of space, sits next to OSOCC products without fuss | Coordinators, UNDAC, donors |
| B | **Ground Truth** | Field-manual utility. Hi-vis yellow on black, condensed stencil-like type, labels that look at home on a Pelican case | Field teams, ToT, kit |
| C | **Overhead** | Aerial-imagery led. Nadir grid, flight lines, 80/70 overlap tiles, crosshairs, a dark imagery-room hero | Technical partners, drone and GIS teams |
| D | **Three Streams** | The three inputs (aerial imagery, field observation, GIS) each get a colour and converge into one product. These line up with the three owners (Atlas, Kobo, MapAction), so colour by input doubles as a fair partner nod | Explaining the method |
| E | **Shared Ground** | Localisation-first. Warm, neutral, minimal, built to be co-branded by any national authority. The RISA mark works as a seal | NEMA, regional bodies (SADC/SHOC) |
| F | **First 72** | Time-critical. Strong timeline motif (trigger, 3-5 days, +1 week, updates), crisp sans and mono, a sense of urgency without alarm | Advocacy, HNPW, donors |

All six share the reserved status set and the same content, so reviewers compare identity, not copy.

## 4. Home page content (same in every theme)

Drawn from the Notion page and RISA in Brief v2:

- Hero: what RISA is, and the three questions it answers (*Can we reach people? Which services are still working? Where do we act first?*)
- The gap: first 72 hours, integration not technology, capacity that doesn't stay
- Three inputs, one product: drone or satellite imagery (Atlas), KoboCollect direct observation (Kobo), GIS integration (MapAction)
- Workflow (SOP six steps: preparation, field collection, processing, GIS integration, dissemination, updating)
- Deployment scenarios: Full, Hybrid, Rapid initial
- The product, with a thumbnail of the three pages
- Toolbox: XLSForm, GIS standards, map layouts, UAV checklist and ADAK kit, SOP (download cards, marked "draft")
- Training: ToT and SIMEX, handover stages (consortium-led, co-led, nationally led)
- Where it's been used: Mozambique (SADC SIMEX), Venezuela earthquake
- Partners and roles, plus "Adopt RISA" for national authorities

**Method definition:** follows SOP v2 and RISA in Brief v2 (observation-only field data, six steps). Key informants appear only as a way to check findings. The hub notes that the concept note uses an older five-step version.

## 5. Product and collateral

**Product page** (the new piece, built by a new `assets/product.js` from one template, like HDA's collateral engine):
- Page 1, A3 landscape: COP map of a sample site (shelter blocks, WASH, health, child-friendly spaces, routes coloured by status, hazard overlay, logistics points, legend, scale, north arrow, date/version/source block, partner and NEMA logo strip)
- Page 2: key findings, infrastructure summary table, population overview, priority gaps
- Page 3: hotspot zoom with before/after imagery and recommended actions
- Interactive mock: the same site with layer toggles (imagery, routes, services, hazards), a findings panel and export button. Static and fake, to show how the brand carries into the dashboard MapAction will lead

The sample site is fictional and procedurally generated (camp grid, road network, orthomosaic-like texture) and labelled "Sample data". No real Mozambique or Venezuela data unless the partners agree.

**Collateral page** (adapted from HDA's `collateral.js`):
- RISA in Brief two-pager (A4)
- ToT / SIMEX slide template (about 10 layouts in a carousel)
- Workshop pieces for Durban (Nov 2026) and HNPW 2027: roll-up banner, name badge, table front
- Field kit: ADAK case label, enumerator ID card, hi-vis tabard back, drone flight log sheet header
- KoboCollect form header and splash
- ToT completion certificate
- Social posts and email signature

## 6. Logo concepts (about 8)

Each drawn as inline SVG coloured by CSS variables (HDA's `logos.js` pattern), so any logo works in any theme.

1. **Reticle**: a crosshair over a site block, the nadir view
2. **Confluence of three**: three lines (imagery, field, GIS) meeting at a pin
3. **Overlap**: survey tiles offset like 80/70 photo overlap, forming an R
4. **Route status**: a road line in three segments, the core map signal
5. **Flight line**: a lawnmower flight pattern that draws the letterform
6. **Seal**: a circular stamp, "RISA · Rapid Infrastructure and Service Assessment", with a slot for the adopting authority
7. **Grid square**: a single map grid cell with a tick, ground truth confirmed
8. **Wordmark only**: a strong, plain wordmark for maximum hand-over-ability

Every concept is tested at favicon size, one colour, greyscale, on imagery, in the product's logo strip next to partner logos, and with a sample NEMA logo leading.

## 7. Reuse from HDA

Port as-is or near as-is: `base.css`, `review.js`/`review.css` (add the Product page), `styleguide.js`/`.css`, `hub.css`, `results/index.html` (rank-by-link tally), `scripts/shot.sh`, the tokens/theme split and component classes (`.btn`, `.tag`, `.card`, `.input`, `.link-arrow`, `.eyebrow`).

Adapt: `logos.js` (new marks, same API), `graphics.js` (keep contours and relief, add camp site map, orthomosaic texture, flight lines, overlap tiles), `collateral.js` (new pieces), `themes.js` (new metadata).

Drop: the Contour studio (bring back a "studio" only if one logo needs tuning in round two).

## 8. Build order

1. **Scaffold**: copy the HDA infrastructure, strip HDA content, rename storage keys (`risa-…`), add the Product page to the review bar. README and deployment notes.
2. **Research**: screenshot and sample partner sites and map products (HI/Atlas, MapAction, Kobo, plus OCHA/UNDAC/LogIE products for context) into `org-websites/`. Define the reserved status set and check it under colour-blind simulation.
3. **Content**: write the shared home-page copy and the sample site data once.
4. **One theme end to end** (A, Briefing): tokens, home, style guide, product, collateral. This proves the templates.
5. **Remaining five themes**: tokens and theme.css only, if the templates hold.
6. **Logos page** and the 8 concepts.
7. **Palettes page** with contrast and colour-blind checks.
8. **Hub**, thumbnails, results page wired to the new ids.
9. **Deploy** to DigitalOcean App Platform as a static site (e.g. `risa.kobolabs.dev`), `noindex`, then share the review doc.

Timing: the Lyon workshop (29-30 Oct) is now, so aim to have round one ready for review ahead of **Durban (Nov 2026)**, where MapAction presents RISA to SHOC and member states. A chosen direction, or a shortlist, would help there.

## 9. Decisions (29 Oct 2026)

- **Brand architecture:** standalone methodology brand, with a "developed by HI/Atlas Logistique, MapAction and Kobo" line. A national authority's logo can lead.
- **HOT:** originally left off round one; now named as a collaborator (see governance below).
- **Governance (29 Oct):** founding members Kobo, MapAction, HI/Atlas Logistique; advisory board (members TBC); collaborators HOT, HeiGIT; humanitarian partners OCHA, UNDAC, IOM, UNHCR; national and local partners (INGD Mozambique, SADC SHOC, Bahamas authority, Flying Labs); funded by Luxembourg and ECHO. Shown on an About page.
- **Audience first (29 Oct):** “Who it’s for” is a central section straight after each home page’s hero; the owners are secondary and appear lower down.
- **Method:** follow SOP v2 (see 4).
- **Hosting:** `risa.kobolabs.dev`, a DigitalOcean App Platform static site like HDA, `noindex`.
- **Partner colours (29 Oct):** themes draw on the colours the owners share. Deep navy (HI #002E43, MapAction #19458D, Kobo #003870), strong blue (HI #0077C8, Kobo #2095F3) and teal/indigo (MapAction #32A4A0, Kobo #1C6D74, HI #06038D). HI orange and yellow and MapAction red are held back because they read as status on the map. Each direction leans on one family: A shared navy, B carbon plus HI navy, C Kobo blues, D one colour per owner, E HI navy and sand, F MapAction blues.

## 10. Still open

- **Reviewers:** consortium partners only, or also UNDAC Canada and a NEMA contact?
- **Source docs:** RISA in Brief, SOP v2 and the Mozambique/Venezuela map outputs are in Drive. Copies in `docs/` would let the product page follow the real layout.
