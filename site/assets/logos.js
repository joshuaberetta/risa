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

  // --- 1. Footprint: a drone and the strip of ground its camera captures ----
  // The dashed lines are the camera's field of view; the tiles are the
  // orthomosaic it stitches together.
  const footprint = () => svg(`
    <path d="M6 7.5h13M45 7.5h13" stroke="${B}" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M12.5 7.5v4.5h39V7.5" fill="none" stroke="${B}" stroke-width="3"/>
    <rect x="24" y="9" width="16" height="8" rx="2.5" fill="${B}"/>
    <path d="M27.5 19L9 47M36.5 19L55 47" stroke="${B}" stroke-width="2.6" stroke-dasharray="3.4 2.6"/>
    <rect x="6" y="47" width="52" height="12" rx="1.5" fill="${A}"/>
    <path d="M19 47v12M32 47v12M45 47v12" stroke="${BG}" stroke-width="1.8"/>`);

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

  // --- 5b. Flight line R: one flight path that draws the R of RISA ----------
  // The white dashes along the line are photo-capture points; they drop out
  // at small sizes, leaving a clean R. In lockups the mark is the R itself.
  const FLIGHT_R = 'M15 57V9H35a12.5 12.5 0 0 1 0 25H23L46 57';
  const flightR = () => svg(`
    <path d="${FLIGHT_R}" fill="none" stroke="${B}" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${FLIGHT_R}" fill="none" stroke="${BG}" stroke-width="2" stroke-dasharray="2.2 5.8"/>
    <rect x="8" y="51" width="14" height="11" rx="1.8" fill="${B}"/>
    <circle cx="48.5" cy="57" r="6.8" fill="${A}"/>`);

  // --- 10. Grid track: logo 7's grid with a flight track drawing the R -------
  // From the October sketches: a 3 x 3 grid, a take-off square, the track up
  // the stem, round the bowl and through an S-bend to the drone. A casing in
  // the background colour keeps the track clear of the grid in one colour.
  const TRACK = 'M12 44V18Q12 12 18 12H30C38 12 41 17 41 22C41 27 37 30 31 30H25C21 30 20 33 21 36C22 39 27 40 31 41L34 42';
  const gtGrid = (o, i) => `<rect width="48" height="48" fill="none" stroke="${A}" stroke-width="${o}"/><path d="M16 0V48M32 0V48M0 16H48M0 32H48" stroke="${A}" stroke-width="${i}"/>`;
  const gtTrack = (w) => `<path d="${TRACK}" fill="none" stroke="${BG}" stroke-width="${w + 3}" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${TRACK}" fill="none" stroke="${B}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="8" y="41" width="8" height="8" rx="1" fill="${B}" stroke="${BG}" stroke-width="1.5"/>`;
  // Flat: the grid with a dashed layer offset behind it.
  const gridtrack = () => svg(`<g transform="translate(5 11)">
    <path d="M6 -6H54V42" fill="none" stroke="${A}" stroke-width="2.2" stroke-dasharray="4 3.2"/>
    <path d="M0 0L6 -6M48 0L54 -6M48 48L54 42" stroke="${A}" stroke-width="2"/>
    ${gtGrid(3.2, 2.2)}${gtTrack(4.6)}<circle cx="36.5" cy="42" r="4.6" fill="${A}" stroke="${BG}" stroke-width="1.5"/></g>`);
  // Layered: the same plate in perspective on a stack of layer outlines.
  // Fully parameterised so it can be tuned in logos/studio.html; the defaults
  // reproduce the sketch. Settings persist in localStorage and can be shared
  // with ?gt=<code> (base64url JSON of the values that differ) or ?gt=reset.
  const GT_DEFAULTS = {
    angle: 45, tilt: 0.577, mirror: false,                 // plate rotation, vertical squash, R reflected
    cells: 3, frameW: 3.6, gridW: 2.4,                     // grid
    trackX: 0, trackY: 0, trackScale: 1, trackW: 5,        // flight path position, size, weight
    leg: 'curve', casing: true, takeoff: 8, dot: 4.6,      // leg shape, casing, take-off square, drone dot
    layers: 2, layerDX: 0, layerDY: 11.5, layerW: 3.2,     // layers: count, offset of each, weight
    layerStyle: 'bracket', tick: 6, connectors: false,     // bracket (open outline) or plates (stacked)
    layerDash: false,
    gridColour: 'A', trackColour: 'B', dotColour: 'A', layerColour: 'B',
  };
  const GT_KEY = 'risa-gridtrack';
  const enc = (o) => btoa(JSON.stringify(o)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const dec = (c) => JSON.parse(atob(c.replace(/-/g, '+').replace(/_/g, '/')));
  const gtDiff = (p) => Object.fromEntries(Object.entries(p).filter(([k, v]) => k in GT_DEFAULTS && GT_DEFAULTS[k] !== v));
  const gtStored = () => { try { return JSON.parse(localStorage.getItem(GT_KEY) || '{}'); } catch { return {}; } };
  try {
    const q = new URLSearchParams(location.search).get('gt');
    if (q === 'reset') localStorage.removeItem(GT_KEY);
    else if (q) localStorage.setItem(GT_KEY, JSON.stringify(gtDiff(Object.assign({}, GT_DEFAULTS, dec(q)))));
  } catch { /* ignore a malformed code */ }
  const PAINT = { A, B, C, D };

  // The R's leg: the sketches' S-bend, or a straight diagonal like a letter R.
  const LEGS = {
    curve: { d: TRACK, end: [36.5, 42] },
    straight: { d: 'M12 44V18Q12 12 18 12H30C38 12 41 17 41 22C41 27 37 30 31 30H23L35 44', end: [37, 46] },
  };
  function gridtrackLayers(params) {
    const p = Object.assign({}, GT_DEFAULTS, params === undefined ? gtStored() : params);
    const leg = LEGS[p.leg] || LEGS.curve;
    const paint = (k) => PAINT[k] || B;
    // Plate transform: rotate, then scale so the default is the classic isometric view.
    const t = (p.angle * Math.PI) / 180, sx = 1.2247, sy = sx * p.tilt;
    const a = sx * Math.cos(t), c = -sx * Math.sin(t), b = sy * Math.sin(t), d = sy * Math.cos(t);
    const P = (x, y) => [a * (x - 24) + c * (y - 24), b * (x - 24) + d * (y - 24)];
    // Flight path transform inside the plate: mirror and scale about the grid centre, then offset.
    const m = p.mirror ? -1 : 1, ts = p.trackScale;
    const T = (x, y) => [24 + p.trackX + m * ts * (x - 24), 24 + p.trackY + ts * (y - 24)];
    const trackT = `translate(${24 + p.trackX} ${24 + p.trackY}) scale(${m * ts} ${ts}) translate(-24 -24)`;

    const corners = [P(0, 0), P(48, 0), P(48, 48), P(0, 48)];
    const f = (n) => n.toFixed(2);
    const lc = paint(p.layerColour);
    const dash = p.layerDash ? ` stroke-dasharray="${(p.layerW * 1.6).toFixed(1)} ${(p.layerW * 1.2).toFixed(1)}"` : '';
    const off = (k) => [p.layerDX * k, p.layerDY * k];
    let layers = '';
    if (p.layerStyle === 'plates') {
      // Stacked plates, drawn back to front so nearer plates hide the ones behind.
      const poly = (k) => corners.map(([x, y]) => { const [ox, oy] = off(k); return [x + ox, y + oy]; });
      const conn = (k) => (p.connectors ? poly(k).map(([x, y], i) => { const [x2, y2] = poly(k + 1)[i]; return `M${f(x)} ${f(y)}L${f(x2)} ${f(y2)}`; }).join('') : '');
      for (let k = p.layers; k >= 1; k--) {
        layers += `<path d="M${poly(k).map(([x, y]) => `${f(x)} ${f(y)}`).join('L')}Z" fill="${BG}" stroke="${lc}" stroke-width="${p.layerW}" stroke-linejoin="round"${dash}/>`;
        const c2 = conn(k - 1);
        if (c2) layers += `<path d="${c2}" stroke="${lc}" stroke-width="${p.layerW}" stroke-linecap="round"/>`;
      }
    } else {
      // Brackets: the outline of the plate's far side from the offset direction, with
      // short ticks back towards the plate at each end (the first sketch).
      const len = Math.hypot(p.layerDX, p.layerDY) || 1, ux = p.layerDX / len, uy = p.layerDY / len;
      // Corners furthest along the offset direction form the visible edge.
      const score = corners.map(([x, y]) => x * ux + y * uy);
      const side = (q) => q[0] * -uy + q[1] * ux; // position across the offset direction
      const ends = [0, 1, 2, 3].sort((i, j) => side(corners[i]) - side(corners[j]));
      const lo = ends[0], hi = ends[3];
      const walk = (dir) => { const out = [lo]; let i = lo; while (i !== hi) { i = (i + dir + 4) % 4; out.push(i); } return out; };
      const [w1, w2] = [walk(1), walk(-1)];
      const sum = (w) => w.reduce((t2, i) => t2 + score[i], 0) / w.length;
      const chain = (sum(w1) >= sum(w2) ? w1 : w2).map((i) => corners[i]);
      for (let k = p.layers; k >= 1; k--) {
        const [ox, oy] = off(k);
        const pts = chain.map(([x, y]) => `${f(x + ox)} ${f(y + oy)}`);
        const [x0, y0] = chain[0], [x1, y1] = chain[chain.length - 1];
        const tx = -ux * p.tick, ty = -uy * p.tick;
        layers += `<path d="M${f(x0 + ox + tx)} ${f(y0 + oy + ty)}L${pts.join('L')}L${f(x1 + ox + tx)} ${f(y1 + oy + ty)}" fill="none" stroke="${lc}" stroke-width="${p.layerW}" stroke-linejoin="round" stroke-linecap="round"${dash}/>`;
      }
    }

    const n = Math.max(1, Math.round(p.cells)), lines = [];
    for (let i = 1; i < n; i++) { const v = f((48 * i) / n); lines.push(`M${v} 0V48M0 ${v}H48`); }
    const g = paint(p.gridColour), tr = paint(p.trackColour);
    const plate = `<g transform="matrix(${f(a)} ${f(b)} ${f(c)} ${f(d)} 0 0)">
        <rect width="48" height="48" transform="translate(-24 -24)" fill="${BG}"/>
        <g transform="translate(-24 -24)">
          <rect width="48" height="48" fill="none" stroke="${g}" stroke-width="${p.frameW}"/>
          ${lines.length ? `<path d="${lines.join('')}" stroke="${g}" stroke-width="${p.gridW}"/>` : ''}
          <g transform="${trackT}">
            ${p.casing ? `<path d="${leg.d}" fill="none" stroke="${BG}" stroke-width="${p.trackW / ts + 3}" stroke-linecap="round" stroke-linejoin="round"/>` : ''}
            <path d="${leg.d}" fill="none" stroke="${tr}" stroke-width="${p.trackW / ts}" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="${12 - p.takeoff / 2}" y="${45 - p.takeoff / 2}" width="${p.takeoff}" height="${p.takeoff}" rx="1" fill="${tr}"${p.casing ? ` stroke="${BG}" stroke-width="1.5"` : ''}/>
          </g>
        </g></g>`;
    const [ex, ey] = P(...T(...leg.end));
    const dot = p.dot > 0 ? `<circle cx="${f(ex)}" cy="${f(ey - 1)}" r="${p.dot}" fill="${paint(p.dotColour)}"${p.casing ? ` stroke="${BG}" stroke-width="1.5"` : ''}/>` : '';

    // Fit the view to the drawing.
    const pad = Math.max(p.frameW, p.layerW) / 2 + 1;
    const all = [];
    for (let k = 0; k <= p.layers; k++) corners.forEach(([x, y]) => { const [ox, oy] = off(k); all.push([x + ox, y + oy]); });
    const xs = all.map((q) => q[0]), ys = all.map((q) => q[1]);
    const x0 = Math.min(...xs, ex - p.dot) - pad, x1 = Math.max(...xs, ex + p.dot) + pad;
    const y0 = Math.min(...ys, ey - p.dot - 1) - pad, y1 = Math.max(...ys, ey + p.dot) + pad;
    return `<svg class="risa-mark" viewBox="${f(x0)} ${f(y0)} ${f(x1 - x0)} ${f(y1 - y0)}" aria-hidden="true">${layers}${plate}${dot}</svg>`;
  }
  // Starting points matching the three sketches.
  const GT_PRESETS = {
    isometric: { label: 'Isometric, layers below (sketch 1)', values: {} },
    flat: { label: 'Flat grid, dashed layer behind (sketch 2)', values: { angle: 0, tilt: 0.8165, layers: 1, layerStyle: 'plates', layerDX: 7, layerDY: -7, connectors: true, layerDash: true, layerColour: 'A', layerW: 2.2 } },
    faceon: { label: 'Face-on, layers behind, mirrored (sketch 3)', values: { angle: 0, tilt: 0.8165, mirror: true, leg: 'straight', layers: 2, layerStyle: 'plates', layerDX: 11, layerDY: -11, connectors: true, layerColour: 'A' } },
  };
  const gridtrackApi = {
    defaults: GT_DEFAULTS, presets: GT_PRESETS, draw: gridtrackLayers,
    get: () => Object.assign({}, GT_DEFAULTS, gtStored()),
    isCustom: () => Object.keys(gtDiff(Object.assign({}, GT_DEFAULTS, gtStored()))).length > 0,
    save: (p) => localStorage.setItem(GT_KEY, JSON.stringify(gtDiff(p))),
    reset: () => localStorage.removeItem(GT_KEY),
    diff: gtDiff, encode: enc, decode: dec,
  };

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
      id: 'footprint', num: 1, name: 'Footprint', draw: footprint, wm: 'wm-public',
      summary: 'A drone and the ground its camera captures.',
      rationale: 'Aerial assessment in one picture: a mapping drone over the strip of ground it photographs, with the camera’s field of view dashed in and the ground drawn as the orthomosaic tiles it stitches together. It says “we flew this site” before anyone reads the name, and the drone-over-ground silhouette still holds at 16 px and in one colour.',
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
      id: 'flightline-r', num: '5b', name: 'Flight line R', draw: flightR, wm: 'wm-barlow', initial: true,
      summary: 'A variation of Flight line: one flight path that draws the R of RISA.',
      rationale: 'The flight line, redrawn as a single path from take-off (the square) up the stem, round the bowl and out along the leg to the drone. The dashes along it are the photo-capture points. In the lockup the mark becomes the first letter, so it reads as RISA rather than a symbol next to a name, and at 16 px it is simply a strong R.',
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
      id: 'gridtrack', num: 10, name: 'Grid track', draw: gridtrack, wm: 'wm-public',
      summary: 'Logos 5 and 7 combined: a flight track drawing the R across a map grid.',
      rationale: 'From the October sketches. The grid square (logo 7) is the site, cell by cell; the flight line (logo 5) becomes one track that draws the R of RISA, from the take-off square up the stem, round the bowl and through an S-bend to the drone. The dashed outline behind is the next layer of data. It reads as a map and as a letter, and holds up in one colour.',
    },
    {
      id: 'gridtrack-layers', num: '10b', name: 'Grid track, layered', draw: gridtrackLayers, wm: 'wm-public',
      summary: 'Grid track as the top of a stack of map layers.',
      rationale: 'The second sketch: the same grid and track on the top plate of a GIS layer stack, seen in isometric view. The layers underneath are the inputs (imagery, field observation, GIS) that the flight builds on. More illustrative than the flat version, so it suits covers, slides and the website more than a 16 px favicon.',
    },
    {
      id: 'wordmark', num: 8, name: 'Wordmark', draw: wordmark, wm: 'wm-public', wordOnly: true,
      summary: 'Type only, with an R tile for favicons.',
      rationale: 'The quietest option, and the easiest to hand over. The name does the work; the small square on the R tile is the one point of colour. It sits under a national authority’s logo without competing with it.',
    },
  ];

  // Keep variants next to their parent: 5, 5b, ... 10, 10b.
  LOGOS.sort((x, y) => parseFloat(x.num) - parseFloat(y.num));
  const byId = Object.fromEntries(LOGOS.map((l) => [l.id, l]));
  const WORDS = '<b>RISA</b><small>Rapid Infrastructure <br>and Service Assessment</small>';

  /**
   * layout: 'horizontal' | 'stacked' | 'mark'
   */
  function render(id, layout = 'horizontal', params) {
    const logo = byId[id] || LOGOS[0];
    if (layout === 'mark') {
      return `<span class="risa-lockup risa-lockup--mark" data-logo-id="${logo.id}">${logo.draw(params)}</span>`;
    }
    if (logo.initial) {
      // The mark stands in for the R of RISA.
      return `<span class="risa-lockup risa-lockup--${layout} ${logo.wm} is-initial" data-logo-id="${logo.id}">
        <span class="risa-wordmark"><b><span class="risa-initial">${logo.draw()}</span>ISA</b><small>Rapid Infrastructure <br>and Service Assessment</small></span></span>`;
    }
    const mark = logo.wordOnly && layout === 'horizontal' ? '' : logo.draw(params);
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
  .risa-lockup.is-initial .risa-wordmark b{display:inline-flex;align-items:flex-end;font-size:2.3em}
  .risa-initial{display:inline-block;line-height:0}
  .risa-lockup .risa-initial .risa-mark{height:.93em;width:auto;margin:0 .02em -.05em -.07em}
  .risa-lockup--stacked.is-initial .risa-wordmark b{font-size:3em}
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  window.RISALogos = { list: LOGOS, byId, render, hydrate, gridtrack: gridtrackApi };
})();
