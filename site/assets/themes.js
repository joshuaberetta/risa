/*
 * Theme metadata shared by the review hub, palettes page, style guides and
 * review toolbar. Colour values live in each theme's tokens.css; this file
 * only says which tokens to show and why.
 *
 * ready: false keeps a direction on the hub as "in progress" and out of the
 * review bar until its pages exist.
 */
window.RISAThemes = [
  {
    id: 'briefing', letter: 'A', name: 'Briefing', defaultLogo: 'reticle', ready: true,
    tagline: 'Calm, institutional and quick to read. Built to sit next to OSOCC and cluster products without fuss.',
    blend: 'A deep navy and a single cobalt blue do all the brand work, on white and a cool stone. There are no reds, ambers or greens in the brand, so the status colours on the map always mean status. Public Sans is a plain, open government typeface. IBM Plex Mono carries coordinates, dates and data labels.',
    fonts: { head: 'Public Sans', body: 'Public Sans', mono: 'IBM Plex Mono' },
    bestFor: 'UNDAC and OSOCC coordinators, cluster leads and donors who need to trust the product at a glance.',
    swatches: [
      ['--c-primary', 'Briefing Navy', 'Headings, navigation, the product title band'],
      ['--c-accent', 'Cobalt', 'Primary actions, links, the brand highlight'],
      ['--c-accent-2', 'Steel', 'Secondary data, supporting graphics'],
      ['--c-surface', 'Stone', 'Section backgrounds, map frame'],
      ['--c-surface-2', 'Mist', 'Cards, info panels'],
      ['--c-ink-2', 'Slate', 'Body copy, secondary text'],
      ['--c-line', 'Rule', 'Borders, dividers, table rules'],
      ['--c-bg', 'White', 'Page and map background'],
    ],
  },
  {
    id: 'groundtruth', letter: 'B', name: 'Ground Truth', defaultLogo: 'route',
    tagline: 'Field-manual utility. Hi-vis yellow on black, condensed type and labels that look at home on a Pelican case.',
    blend: 'Takes its cues from the ADAK kit and safety gear rather than from any partner: signal yellow, carbon black and a cool grey. Barlow Condensed reads at a distance and survives a bad photocopy.',
    fonts: { head: 'Barlow Condensed', body: 'Barlow', mono: 'IBM Plex Mono' },
    bestFor: 'Field teams, ToT and SIMEX, kit and equipment.',
    swatches: [],
  },
  {
    id: 'overhead', letter: 'C', name: 'Overhead', defaultLogo: 'overlap',
    tagline: 'Aerial-imagery led. A nadir grid, flight lines, overlap tiles and crosshairs on a dark imagery-room hero.',
    blend: 'Built around the orthomosaic: dark imagery tones, a cyan survey line and a magenta marker that never appears in the status set.',
    fonts: { head: 'Space Grotesk', body: 'Inter', mono: 'IBM Plex Mono' },
    bestFor: 'Technical partners, drone, GIS and remote sensing teams.',
    swatches: [],
  },
  {
    id: 'streams', letter: 'D', name: 'Three Streams', defaultLogo: 'confluence',
    tagline: 'Three inputs, one product. Imagery, field observation and GIS each get a colour and converge.',
    blend: 'One colour per input, which also means one per owner (Atlas, Kobo, MapAction), so each partner is equally visible without anyone owning a brand colour.',
    fonts: { head: 'Sora', body: 'Inter', mono: 'IBM Plex Mono' },
    bestFor: 'Explaining the method to new audiences and partners.',
    swatches: [],
  },
  {
    id: 'sharedground', letter: 'E', name: 'Shared Ground', defaultLogo: 'seal',
    tagline: 'Localisation first. Warm, neutral and minimal, built so any national authority can put its name first.',
    blend: 'Warm paper, earth and ink. The RISA mark works as a seal of method next to a national authority’s logo.',
    fonts: { head: 'Fraunces', body: 'Inter', mono: 'IBM Plex Mono' },
    bestFor: 'NEMAs and regional bodies (SADC, SHOC) taking ownership.',
    swatches: [],
  },
  {
    id: 'first72', letter: 'F', name: 'First 72', defaultLogo: 'gridsquare',
    tagline: 'Time-critical. A strong timeline from trigger to update, with urgency but no alarm.',
    blend: 'Ink and a deep violet, with a timeline motif that counts the first days of a deployment.',
    fonts: { head: 'Archivo', body: 'Archivo', mono: 'IBM Plex Mono' },
    bestFor: 'Advocacy, HNPW and donors.',
    swatches: [],
  },
];
// Directions with pages to review.
window.RISAThemes.ready = window.RISAThemes.filter((t) => t.ready);
