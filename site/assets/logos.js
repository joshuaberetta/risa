/*
 * RISA logo concepts.
 *
 * Every mark is drawn with CSS custom properties so it can be re-coloured by
 * whatever theme it sits in:
 *   --logo-a                 the one brand highlight
 *   --logo-b                 the main mark colour (usually the ink)
 *   --logo-c, --logo-d       supporting colours (only where a concept needs them)
 *   --logo-ink               wordmark / primary ink
 *   --logo-bg                background (used for knock-outs)
 *
 * No concept uses the reserved status colours (see base.css): on a map, red,
 * amber and green always mean status, never brand.
 */
(function () {
  const A = 'var(--logo-a, #2160D8)';
  const B = 'var(--logo-b, #132A45)';
  const C = 'var(--logo-c, #5C7A99)';
  const D = 'var(--logo-d, #9DB2C8)';
  const BG = 'var(--logo-bg, #FFFFFF)';
  const svg = (inner) => `<svg class="risa-mark" viewBox="0 0 64 64" aria-hidden="true">${inner}</svg>`;

  // --- 1. Reticle: a crosshair over one site block, the nadir view ---------
  const reticle = () => svg(`
    <circle cx="32" cy="32" r="20" fill="none" stroke="${B}" stroke-width="5"/>
    <path d="M32 3v14M32 47v14M3 32h14M47 32h14" stroke="${B}" stroke-width="5"/>
    <rect x="25" y="25" width="14" height="14" rx="1.5" fill="${A}"/>`);

  // --- 2. Confluence: three inputs meet at one point -----------------------
  const confluence = () => svg(`
    <g fill="none" stroke-width="7" stroke-linecap="round">
      <path d="M9 10Q22 27 32 33" stroke="${C}"/>
      <path d="M55 10Q42 27 32 33" stroke="${D}"/>
      <path d="M32 59V33" stroke="${B}"/>
    </g>
    <circle cx="32" cy="32" r="8.5" fill="${A}" stroke="${BG}" stroke-width="3"/>`);

  // --- 3. Overlap: survey tiles offset like 80/70 photo overlap -------------
  const overlap = () => svg(`
    <g stroke="${BG}" stroke-width="2.6" stroke-linejoin="round">
      <rect x="5" y="5" width="30" height="30" rx="3" fill="${D}"/>
      <rect x="17" y="17" width="30" height="30" rx="3" fill="${B}"/>
      <rect x="29" y="29" width="30" height="30" rx="3" fill="${A}"/>
    </g>
    <path d="M29 29h18v18" fill="none" stroke="${BG}" stroke-width="1.6" stroke-dasharray="2.4 2"/>`);

  // --- 4. Route: an access road, open then restricted, to one destination --
  // Status is shown by line style alone (solid, dashed), so it holds in one colour.
  const route = () => svg(`
    <g fill="none" stroke="${B}" stroke-width="6.5">
      <path d="M6 57C20 57 21 41 31 37"/>
      <path d="M31 37C41 33 42 22 47 18" stroke-dasharray="5.2 3.6"/>
    </g>
    <circle cx="52" cy="13" r="7.5" fill="${A}"/>
    <circle cx="52" cy="13" r="2.6" fill="${BG}"/>`);

  // --- 5. Flight line: a lawnmower flight plan over the site ---------------
  const flightline = () => svg(`
    <path d="M10 13H48a6.5 6.5 0 0 1 0 13H16a6.5 6.5 0 0 0 0 13H48a6.5 6.5 0 0 1 0 13H22"
      fill="none" stroke="${B}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="5" y="8" width="10" height="10" rx="1.5" fill="${B}"/>
    <circle cx="17" cy="52" r="6.5" fill="${A}"/>`);

  // --- 6. Seal: a stamp of method, with room for an adopting authority -----
  let sealN = 0;
  function seal() {
    const id = `risa-seal-${++sealN}`;
    return svg(`
      <defs><path id="${id}" d="M32 32m-23.4 0a23.4 23.4 0 1 1 46.8 0a23.4 23.4 0 1 1-46.8 0"/></defs>
      <circle cx="32" cy="32" r="30" fill="none" stroke="${B}" stroke-width="2.6"/>
      <circle cx="32" cy="32" r="17.6" fill="none" stroke="${B}" stroke-width="1.4"/>
      <text font-size="5.2" font-weight="700" fill="${B}" style="font-family:'Inter','Public Sans',system-ui,sans-serif">
        <textPath href="#${id}" startOffset="0" textLength="145" lengthAdjust="spacingAndGlyphs">RAPID INFRASTRUCTURE · SERVICE ASSESSMENT ·</textPath></text>
      <path d="M32 17.5v8M32 38.5v8M17.5 32h8M38.5 32h8" stroke="${B}" stroke-width="2.6"/>
      <rect x="27.5" y="27.5" width="9" height="9" rx="1" fill="${A}"/>`);
  }

  // --- 7. Grid square: one map grid cell, confirmed on the ground -----------
  const gridsquare = () => svg(`
    <g fill="none" stroke="${B}">
      <rect x="7" y="7" width="50" height="50" rx="2" stroke-width="4"/>
      <path d="M23.7 7v50M40.3 7v50M7 23.7h50M7 40.3h50" stroke-width="2.4"/>
    </g>
    <rect x="23.7" y="23.7" width="16.6" height="16.6" fill="${A}"/>
    <path d="M27 32.4l3.6 3.6 6.6-7.4" fill="none" stroke="${BG}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>`);

  // --- 8. Wordmark: type only, with an R tile for favicons -----------------
  const wordmark = () => svg(`
    <rect x="5" y="5" width="54" height="54" rx="9" fill="${B}"/>
    <text x="30" y="47.5" text-anchor="middle" font-size="40" font-weight="800" fill="${BG}" style="font-family:var(--font-head,'Public Sans'),system-ui,sans-serif">R</text>
    <rect x="45" y="40" width="7.5" height="7.5" fill="${A}"/>`);

  const LOGOS = [
    {
      id: 'reticle', num: 1, name: 'Reticle', draw: reticle, wm: 'wm-public',
      summary: 'A crosshair over one site block.',
      rationale: 'The view from the drone, straight down. The crosshair says “we looked at this exact place”, and the block at its centre is the site itself: the shelters, water points and roads RISA describes. It is the plainest of the concepts, reads at 16 px and works in one colour on a photocopied map.',
    },
    {
      id: 'confluence', num: 2, name: 'Confluence', draw: confluence, wm: 'wm-sora',
      summary: 'Three inputs meet at one point.',
      rationale: 'Aerial imagery, field observation and GIS arrive from different directions and meet at one product. The three lines are equal, which also stands for the three owners (Atlas, Kobo and MapAction) without naming any of them.',
    },
    {
      id: 'overlap', num: 3, name: 'Overlap', draw: overlap, wm: 'wm-grotesk',
      summary: 'Survey tiles offset like overlapping drone photos.',
      rationale: 'Drone photos are flown with 80% forward and 70% side overlap so they can be stitched into one orthomosaic. The mark is three tiles stitching into one picture. It is modular and technical, and the dashed corner is the overlap itself.',
    },
    {
      id: 'route', num: 4, name: 'Route', draw: route, wm: 'wm-barlow',
      summary: 'An access road, open then restricted, to one destination.',
      rationale: 'The first question RISA answers is “can we reach people?”. The road changes from a solid line (open) to a dashed one (restricted), the same line styles used on the map, and ends at the site. Because it uses line style rather than colour, it works on the photocopier.',
    },
    {
      id: 'flightline', num: 5, name: 'Flight line', draw: flightline, wm: 'wm-barlow',
      summary: 'A lawnmower flight plan over the site.',
      rationale: 'The back-and-forth pattern every mapping drone flies, from take-off (the square) to the drone (the dot). Anyone who has planned a flight recognises it, and it is easy to animate on screens.',
    },
    {
      id: 'seal', num: 6, name: 'Seal', draw: seal, wm: 'wm-fraunces',
      summary: 'A stamp of method, with room for an adopting authority.',
      rationale: 'RISA is a standard, not an organisation, so the mark behaves like a seal: something a national authority applies to its own product to say “made with the RISA method”. Its centre is a small reticle. The ring of text is for print sizes; at small sizes the centre alone is used.',
    },
    {
      id: 'gridsquare', num: 7, name: 'Grid square', draw: gridsquare, wm: 'wm-archivo',
      summary: 'One map grid cell, confirmed on the ground.',
      rationale: 'Maps are read cell by cell. The highlighted square with a tick is ground truth: one place that someone has actually checked. It is bold, simple and unmistakably cartographic.',
    },
    {
      id: 'wordmark', num: 8, name: 'Wordmark', draw: wordmark, wm: 'wm-public', wordOnly: true,
      summary: 'Type only, with an R tile for favicons.',
      rationale: 'The quietest option, and the easiest to hand over. The name does the work; the small square on the R tile is the one point of colour. It sits under a national authority’s logo without competing with it.',
    },
  ];

  const byId = Object.fromEntries(LOGOS.map((l) => [l.id, l]));
  const WORDS = '<b>RISA</b><small>Rapid Infrastructure <br>and Service Assessment</small>';

  /**
   * layout: 'horizontal' | 'stacked' | 'mark'
   */
  function render(id, layout = 'horizontal') {
    const logo = byId[id] || LOGOS[0];
    if (layout === 'mark') {
      return `<span class="risa-lockup risa-lockup--mark" data-logo-id="${logo.id}">${logo.draw()}</span>`;
    }
    const mark = logo.wordOnly && layout === 'horizontal' ? '' : logo.draw();
    return `<span class="risa-lockup risa-lockup--${layout} ${logo.wm}${logo.wordOnly ? ' is-word' : ''}" data-logo-id="${logo.id}">
      ${mark}<span class="risa-wordmark">${WORDS}</span></span>`;
  }

  function hydrate(root = document, id) {
    root.querySelectorAll('[data-risa-logo]').forEach((el) => {
      const logoId = el.dataset.logoFixed || id || el.dataset.logoDefault || LOGOS[0].id;
      el.innerHTML = render(logoId, el.dataset.risaLogo || 'horizontal');
      if (!el.hasAttribute('aria-label') && el.tagName === 'A') {
        el.setAttribute('aria-label', 'RISA, home');
      }
    });
  }

  const css = `
  .risa-lockup{display:inline-flex;align-items:center;gap:.6em;color:var(--logo-ink,#132A45);line-height:1;vertical-align:middle;text-decoration:none}
  .risa-lockup .risa-mark{height:2.5em;width:auto;flex:none;display:block;overflow:visible}
  .risa-lockup--mark{height:100%;width:100%;justify-content:center}.risa-lockup--mark .risa-mark{height:100%;width:auto}
  .risa-wordmark{display:flex;align-items:center;gap:.6em;white-space:nowrap}
  .risa-wordmark b{font-size:1.72em;line-height:.8;font-weight:800;letter-spacing:.01em}
  .risa-wordmark small{font-size:.5em;line-height:1.3;font-weight:600;letter-spacing:.05em;text-transform:uppercase;padding-left:.75em;border-left:1.5px solid currentColor}
  .risa-lockup--stacked{flex-direction:column;gap:.55em;text-align:center}
  .risa-lockup--stacked .risa-mark{height:3.8em}
  .risa-lockup--stacked .risa-wordmark{flex-direction:column;gap:.45em}
  .risa-lockup--stacked .risa-wordmark small{border-left:0;padding-left:0}
  .risa-lockup--stacked .risa-wordmark small br{display:none}
  .wm-public .risa-wordmark{font-family:'Public Sans',system-ui,sans-serif}
  .wm-sora .risa-wordmark{font-family:'Sora',system-ui,sans-serif}.wm-sora .risa-wordmark b{font-weight:700;letter-spacing:-.02em}
  .wm-grotesk .risa-wordmark{font-family:'Space Grotesk',system-ui,sans-serif}.wm-grotesk .risa-wordmark b{font-weight:700;letter-spacing:-.01em}
  .wm-barlow .risa-wordmark{font-family:'Barlow Condensed','Barlow',system-ui,sans-serif}.wm-barlow .risa-wordmark b{font-size:2em;font-weight:700;letter-spacing:.06em}.wm-barlow .risa-wordmark small{font-size:.56em;letter-spacing:.08em}
  .wm-fraunces .risa-wordmark{font-family:'Fraunces',Georgia,serif}.wm-fraunces .risa-wordmark b{font-weight:600;letter-spacing:.02em}.wm-fraunces .risa-wordmark small{font-family:'Inter',system-ui,sans-serif}
  .wm-archivo .risa-wordmark{font-family:'Archivo',system-ui,sans-serif}.wm-archivo .risa-wordmark b{font-weight:800;letter-spacing:-.01em}
  .risa-lockup.is-word .risa-wordmark b{font-size:2.1em}
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  window.RISALogos = { list: LOGOS, byId, render, hydrate };
})();
