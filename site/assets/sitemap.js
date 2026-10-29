/*
 * Sample site map: one fictional displacement site, drawn as inline SVG.
 * Used by the home pages, the product page, slides and the brief, so every
 * theme shows the same data.
 *
 *   <div data-graphic="site"></div>
 *   data-mode    map (default) | ortho (drone imagery look) | sat (blurred pre-event imagery)
 *   data-time    after (default) | before (no flood, no debris, everything open)
 *   data-view    full (default) | zoom (the flooded hotspot, blocks B1 and B2)
 *   data-layers  comma list to show; default depends on mode
 *                imagery, hazards, roads, routes, blocks, services, labels, grid, furniture
 *   data-fit     slice (default, fills the box) | meet (shows the whole view)
 *
 * Status colours come from the reserved set in base.css (--st-ok, --st-partial,
 * --st-no, --st-unknown). Status is always also shown by shape or line style,
 * so the map still reads in greyscale.
 */
(function () {
  const W = 1000, H = 640;
  const VIEWS = { full: [0, 0, W, H], zoom: [196, 372, 420, 269] };

  // ---- data ----------------------------------------------------------------
  const BOUNDARY = 'M222 112 L864 110 L870 488 L724 486 L560 500 L386 512 L228 512 Z';
  const BLOCKS = [
    ['A1', 232, 124, 140, 172], ['A2', 392, 124, 140, 172], ['A3', 552, 124, 140, 172], ['A4', 712, 124, 142, 172],
    ['B1', 236, 326, 136, 176], ['B2', 392, 326, 140, 172], ['B3', 552, 326, 140, 158], ['B4', 712, 326, 142, 150],
  ];
  // id, label, path, status, note
  const ROUTES = [
    ['R1a', 'R1', 'M0 298 C 50 294 96 304 146 306', 'ok', 'West access road, open to all vehicles'],
    ['R1b', '', 'M146 306 L222 310', 'partial', 'Debris, light vehicles only'],
    ['R2', 'R2', 'M468 0 C 474 40 478 78 480 112', 'no', 'Washed out 2 km north of the site'],
    ['R3', 'R3', 'M1000 342 C 950 338 904 332 868 330', 'ok', 'East access road, open'],
    ['R4', 'R4', 'M632 640 C 630 600 626 552 620 500', 'no', 'Bridge flooded'],
  ];
  const STREETS = 'M222 310 H868 M382 112 V510 M542 112 V500 M702 112 V486';
  // type, x, y, status, id
  const SERVICES = [
    ['water', 300, 312, 'ok', 'WP-01'], ['water', 462, 312, 'partial', 'WP-02'], ['water', 622, 312, 'no', 'WP-03'], ['water', 782, 312, 'ok', 'WP-04'],
    ['water', 470, 440, 'no', 'WP-05'],
    ['latrine', 252, 140, 'ok', 'LT-01'], ['latrine', 840, 140, 'partial', 'LT-02'], ['latrine', 300, 482, 'no', 'LT-03'], ['latrine', 640, 460, 'ok', 'LT-04'],
    ['latrine', 410, 482, 'no', 'LT-05'],
    ['hand', 340, 200, 'ok', 'HW-01'], ['hand', 660, 150, 'partial', 'HW-02'],
    ['health', 622, 214, 'ok', 'HP-01'],
    ['cfs', 782, 420, 'ok', 'CFS-01'],
    ['dist', 252, 344, 'partial', 'DP-01'],
    ['storage', 110, 228, 'ok', 'WH-01'],
  ];
  const TYPES = {
    water: ['W', 'Water point'], latrine: ['L', 'Latrine block'], hand: ['H', 'Handwashing station'],
    health: ['+', 'Health post'], cfs: ['C', 'Child-friendly space'], dist: ['D', 'Distribution point'], storage: ['S', 'Storage'],
  };
  const STATUS = {
    ok: ['Open / working', 'Solid line · filled symbol'],
    partial: ['Restricted / partly working', 'Dashed line · half-filled symbol'],
    no: ['Closed / not working', 'Dotted line · crossed-out symbol'],
    unknown: ['Not assessed', 'Grey'],
  };
  const FLOOD = 'M0 516 C 90 508 170 492 262 470 C 330 454 392 452 452 462 C 540 478 600 512 700 524 C 820 538 900 520 1000 506 L1000 640 L0 640 Z';
  const RIVER = 'M0 586 C 180 562 320 602 480 582 S 760 560 1000 592';
  const DEBRIS = 'M128 284 L204 288 L214 334 L140 336 Z';
  const POP = { people: 1900, households: 390, shelters: 0 };

  // ---- helpers -------------------------------------------------------------
  function rng(seed) {
    let s = seed >>> 0 || 1;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }
  let uid = 0;

  // Tents laid out in rows inside each block, with some gaps and jitter.
  function shelters(mode, time) {
    const r = rng(11);
    const tarps = ['#EEF1F3', '#C9D7E4', '#E3DACB', '#F6F6F2', '#9FB7CF'];
    let out = '', n = 0;
    const per = {};
    BLOCKS.forEach(([id, x, y, w, h]) => {
      per[id] = 0;
      for (let ty = y + 8; ty < y + h - 14; ty += 17) {
        for (let tx = x + 8; tx < x + w - 18; tx += 22) {
          const roll = r();
          if (roll < 0.1) continue;
          if (time === 'before' && roll < 0.42) continue; // the site was smaller before the latest arrivals
          const jx = (r() - 0.5) * 3, jy = (r() - 0.5) * 2.5;
          const fill = mode === 'map' ? '' : ` fill="${tarps[Math.floor(r() * tarps.length)]}"`;
          out += `<rect x="${(tx + jx).toFixed(1)}" y="${(ty + jy).toFixed(1)}" width="16" height="10" rx="1"${fill}/>`;
          n++; per[id]++;
        }
      }
    });
    if (time !== 'before') { POP.shelters = n; POP.perBlock = per; }
    return out;
  }

  function symbol(type, x, y, status, s = 1, id = '') {
    const [g] = TYPES[type];
    const R = 11 * s;
    const g0 = `<g class="sm-sym" transform="translate(${x} ${y})"${id ? ` data-id="${id}"` : ''}>`;
    const glyph = (fill) => `<text y="${(4.4 * s).toFixed(1)}" text-anchor="middle" font-size="${(12.5 * s).toFixed(1)}" font-weight="700" fill="${fill}">${g}</text>`;
    if (status === 'ok') {
      return `${g0}<circle r="${R}" fill="var(--st-ok)" stroke="#fff" stroke-width="${2 * s}"/>${glyph('#fff')}</g>`;
    }
    if (status === 'partial') {
      return `${g0}<circle r="${R}" fill="#fff" stroke="var(--st-partial)" stroke-width="${3 * s}"/>
        <path d="M${-R} 0 A${R} ${R} 0 0 0 ${R} 0 Z" fill="var(--st-partial)"/>${glyph('var(--st-ink)')}</g>`;
    }
    if (status === 'no') {
      return `${g0}<circle r="${R}" fill="#fff" stroke="var(--st-no)" stroke-width="${3 * s}"/>${glyph('var(--st-no)')}
        <path d="M${-R * 0.72} ${R * 0.72} L${R * 0.72} ${-R * 0.72}" stroke="var(--st-no)" stroke-width="${3 * s}"/></g>`;
    }
    return `${g0}<circle r="${R}" fill="#fff" stroke="var(--st-unknown)" stroke-width="${2.4 * s}"/>${glyph('var(--st-unknown)')}</g>`;
  }

  // Route line: casing plus a status line. Solid, dashed or dotted.
  function routeLine(d, status, w = 7) {
    const dash = { ok: '', partial: ` stroke-dasharray="${w * 2} ${w}"`, no: ` stroke-dasharray="0.1 ${w * 1.7}" stroke-linecap="round"` }[status] || '';
    const width = status === 'no' ? w * 1.15 : w;
    return `<path d="${d}" class="sm-casing" stroke-width="${w + 5}"/><path d="${d}" stroke="var(--st-${status})" stroke-width="${width}"${dash}/>`;
  }

  // ---- layers --------------------------------------------------------------
  function render(el) {
    const mode = el.dataset.mode || 'map';
    const time = el.dataset.time || 'after';
    const view = VIEWS[el.dataset.view] || VIEWS.full;
    const id = `sm${++uid}`;
    const defaults = mode === 'map'
      ? 'hazards,roads,routes,blocks,services,labels,grid,furniture'
      : 'imagery,hazards,roads,routes,blocks,services,labels,furniture';
    const show = new Set((el.dataset.layers || defaults).split(',').map((s) => s.trim()));
    const after = time !== 'before';
    const imagery = mode !== 'map';

    const defs = `<defs>
      <filter id="${id}-g" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="5" seed="4" result="n"/>
        <feColorMatrix in="n" type="matrix" values="0 0 0 .42 .3  0 0 0 .38 .28  0 0 0 .26 .17  0 0 0 0 1"/>
      </filter>
      <filter id="${id}-v" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter>
      <filter id="${id}-s"><feGaussianBlur stdDeviation="${mode === 'sat' ? 2.2 : 0}"/></filter>
      <pattern id="${id}-fl" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="10" height="10" fill="var(--hz-flood-fill)"/><path d="M0 0V10" stroke="var(--hz-flood)" stroke-width="2.4"/></pattern>
      <pattern id="${id}-db" width="9" height="9" patternUnits="userSpaceOnUse">
        <path d="M0 0L9 9M9 0L0 9" stroke="var(--hz-debris)" stroke-width="1.4"/></pattern>
      <clipPath id="${id}-c"><rect width="${W}" height="${H}"/></clipPath>
    </defs>`;

    // Base: paper map or imagery.
    let base;
    if (imagery) {
      const r = rng(5);
      let veg = '';
      for (let k = 0; k < 26; k++) {
        const x = r() * W, y = r() * H;
        if (x > 200 && x < 880 && y > 100 && y < 520) continue; // cleared ground inside the site
        veg += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${(30 + r() * 60).toFixed(0)}" ry="${(20 + r() * 40).toFixed(0)}"/>`;
      }
      base = `<g data-layer="imagery" filter="url(#${id}-s)">
        <rect width="${W}" height="${H}" filter="url(#${id}-g)"/>
        <g fill="#3E5233" opacity=".75" filter="url(#${id}-v)">${veg}</g>
        <path d="${BOUNDARY}" fill="#C9B48E" opacity=".55" filter="url(#${id}-v)"/>
        <path d="${RIVER}" fill="none" stroke="#4E5A48" stroke-width="30" stroke-linecap="round"/>
        <path d="${RIVER}" fill="none" stroke="#5F6B57" stroke-width="16" stroke-linecap="round"/>
        ${after ? `<path d="${FLOOD}" fill="#7A6E52" opacity=".82"/>` : ''}
      </g>`;
    } else {
      base = `<g data-layer="base">
        <rect width="${W}" height="${H}" class="sm-paper"/>
        <path d="${BOUNDARY}" class="sm-site"/>
        <path d="${RIVER}" class="sm-river" stroke-width="22"/>
      </g>`;
    }

    const grid = (() => {
      let g = '';
      const cols = 'ABCDEFGHIJ';
      for (let x = 100; x < W; x += 100) g += `<path d="M${x} 0V${H}"/>`;
      for (let y = 100; y < H; y += 100) g += `<path d="M0 ${y}H${W}"/>`;
      let labels = '';
      for (let i = 0; i < 10; i++) labels += `<text x="${i * 100 + 50}" y="14" text-anchor="middle">${cols[i]}</text>`;
      for (let j = 0; j < 7; j++) labels += `<text x="8" y="${j * 100 + 54}">${j + 1}</text>`;
      return `<g data-layer="grid" class="sm-grid"><g fill="none">${g}</g><g class="sm-grid-labels">${labels}</g></g>`;
    })();

    const hazards = `<g data-layer="hazards">
      ${after ? `<path d="${FLOOD}" fill="url(#${id}-fl)" class="sm-flood"/>` : ''}
      ${after ? `<path d="${DEBRIS}" fill="url(#${id}-db)" class="sm-debris"/>` : ''}
    </g>`;

    const roads = `<g data-layer="roads" fill="none">
      <path d="${STREETS}" class="sm-street"/>
      <path d="${BOUNDARY}" class="sm-fence"/>
    </g>`;

    const routes = `<g data-layer="routes" fill="none">${ROUTES.map(([, , d, st]) => routeLine(d, after ? st : 'ok')).join('')}
      ${after ? '<g class="sm-cut"><path d="M462 52l14 14M476 52l-14 14"/><path d="M618 548l14 14M632 548l-14 14"/></g>' : ''}
    </g>`;

    const blocks = `<g data-layer="blocks"><g class="sm-tents">${shelters(mode, time)}</g></g>`;

    const services = `<g data-layer="services" class="sm-services">
      ${SERVICES.map(([type, x, y, st, sid]) => symbol(type, x, y, after ? st : 'ok', 1, sid)).join('')}
      <g class="sm-gate">${[[222, 310], [480, 112], [868, 330]].map(([x, y]) => `<rect x="${x - 7}" y="${y - 7}" width="14" height="14" transform="rotate(45 ${x} ${y})"/>`).join('')}</g>
      <g class="sm-lz" transform="translate(940 196)"><circle r="17"/><text y="6" text-anchor="middle">H</text></g>
      ${after ? '<g class="sm-choke" transform="translate(146 306)"><path d="M0 -15 L14 10 L-14 10 Z"/><text y="7" text-anchor="middle">!</text></g>' : ''}
    </g>`;

    const lbl = (x, y, t, cls = '') => `<text x="${x}" y="${y}" class="${cls}">${t}</text>`;
    const labels = `<g data-layer="labels" class="sm-labels">
      ${BLOCKS.map(([b, x, y, w, h]) => lbl(x + w / 2, y + h / 2 + 8, b, 'sm-block-label')).join('')}
      ${lbl(30, 286, 'R1', 'sm-road-label')}${lbl(488, 40, 'R2', 'sm-road-label')}${lbl(950, 326, 'R3', 'sm-road-label')}${lbl(642, 616, 'R4', 'sm-road-label')}
      ${lbl(110, 262, 'Logistics hub', 'sm-place')}${lbl(940, 236, 'Landing zone', 'sm-place')}
      ${lbl(820, 600, 'Rio Muanza', 'sm-water')}
      ${after ? lbl(300, 548, 'Flooded area', 'sm-hazard-label') : ''}
    </g>`;

    const furniture = (() => {
      const [vx, vy, vw, vh] = view;
      const s = vw / W; // keep furniture the same size on screen when zoomed
      const metres = el.dataset.view === 'zoom' ? 50 : 100;
      const len = (metres * 2) / s; // 1 map unit = 0.5 m
      return `<g data-layer="furniture" class="sm-furniture">
        <g transform="translate(${vx + vw - 34 * s} ${vy + 40 * s}) scale(${s})"><path d="M0 -24 L9 6 L0 0 L-9 6 Z" class="sm-north"/><text y="22" text-anchor="middle">N</text></g>
        <g transform="translate(${vx + vw - (len + 30) * s} ${vy + vh - 22 * s}) scale(${s})">
          <rect width="${len / 2}" height="6" class="sm-scale-a"/><rect x="${len / 2}" width="${len / 2}" height="6" class="sm-scale-b"/>
          <text y="-6">0</text><text x="${len}" y="-6" text-anchor="end">${metres} m</text></g>
      </g>`;
    })();

    const parts = { hazards, roads, routes, blocks, services, labels, grid, furniture };
    const order = ['grid', 'roads', 'blocks', 'hazards', 'routes', 'services', 'labels', 'furniture'];
    const layered = order.map((k) => parts[k]).join('');
    el.innerHTML = `<svg class="sitemap sitemap--${mode}" viewBox="${view.join(' ')}" preserveAspectRatio="xMidYMid ${el.dataset.fit === 'meet' ? 'meet' : 'slice'}" role="img"
        aria-label="Sample site map${after ? '' : ' before the flood'}: shelter blocks, access routes by status, services by status${after ? ' and the flooded area' : ''}. Fictional data.">
      ${defs}<g clip-path="url(#${id}-c)">${base}${layered}</g></svg>`;
    el.querySelectorAll('[data-layer]').forEach((g) => {
      if (g.dataset.layer !== 'base') g.classList.toggle('is-off', !show.has(g.dataset.layer));
    });
  }

  // Summary numbers for the product page, derived from the same data.
  function summary() {
    if (!POP.perBlock) shelters('map', 'after');
    const byType = {};
    SERVICES.forEach(([type, , , st]) => {
      byType[type] = byType[type] || { ok: 0, partial: 0, no: 0, unknown: 0 };
      byType[type][st]++;
    });
    return { byType, routes: ROUTES, services: SERVICES, pop: POP };
  }

  function hydrate(root = document) {
    root.querySelectorAll('[data-graphic="site"]').forEach(render);
  }

  window.RISASite = { render, hydrate, summary, symbol, routeLine, TYPES, STATUS };
  document.addEventListener('DOMContentLoaded', () => hydrate());
})();
