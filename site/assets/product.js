/*
 * The RISA product: the three-page output and a mock of the interactive
 * version. Renders into <main id="pd">. Every page is a .pd-doc at A-series
 * landscape proportions; type is set in em off a container-unit base, so the
 * layout scales with the width it is shown at.
 *
 * All numbers come from the sample site in sitemap.js and are fictional.
 */
(function () {
  const body = document.body;
  const root = body.dataset.root || '../../';
  const theme = window.RISAThemes.find((t) => t.id === body.dataset.themeId);
  const icon = (id) => `<svg aria-hidden="true"><use href="${root}assets/icons.svg#${id}"/></svg>`;
  const S = window.RISASite;
  const D = S.summary();
  const fmt = (n) => n.toLocaleString('en-GB');

  const SITE = 'Sample site 07';
  const PLACE = 'Riverside district · Fictional data';
  const DATE = '28/10/2026 14:00';
  const VERSION = 'Initial assessment · Day 4 · v1.0';
  const SOURCES = 'Imagery: drone orthomosaic, DJI Mini 4 Pro, 120 m AGL, 4.3 cm/px, 27/10/2026. Field data: KoboCollect direct observation, 46 points, 27–28/10/2026. Base: OpenStreetMap contributors.';
  const DISCLAIMER = 'The boundaries and names shown on this map do not imply official endorsement or acceptance.';

  // ---- shared pieces -------------------------------------------------------
  const pill = (st, label) => `<span class="st-pill st-pill--${st}">${label || S.STATUS[st][0].split(' / ')[0]}</span>`;
  const doc = (inner, cls = '') => `<div class="pd-doc"><div class="pd-page ${cls}">${inner}</div></div>`;
  const fig = (content, caption, id) => `<figure class="pd-fig"${id ? ` id="${id}"` : ''}>${content}<figcaption>${caption}</figcaption></figure>`;
  const nema = () => `<span class="pd-nema"><i></i><b>National Disaster<br>Management Authority</b></span>`;
  const band = (title, n) => `<header class="pd-band">
      ${nema()}
      <div class="pd-band-title"><h1>${title}</h1><p>${SITE} · ${PLACE}</p></div>
      <div class="pd-band-meta"><b>${VERSION}</b><span>${DATE}</span><span>Page ${n} of 3</span></div>
    </header>`;
  const foot = (extra = '') => `<footer class="pd-foot">
      <p class="pd-src">${SOURCES} ${extra}</p>
      <div class="pd-credit"><small>Produced with the</small><span data-risa-logo="horizontal"></span></div>
      <div class="pd-credit"><small>Technical support</small><b>HI/Atlas Logistique · MapAction · Kobo</b></div>
    </footer>`;

  const legend = () => `<div class="pd-legend">
      <h3>Access routes</h3>
      ${['ok', 'partial', 'no'].map((st) => `<p><svg viewBox="0 0 60 14" aria-hidden="true">${S.routeLine('M2 7H58', st, 5)}</svg>${S.STATUS[st][0].split(' / ')[0]}</p>`).join('')}
      <h3>Services</h3>
      <div class="pd-legend-sym">${Object.entries(S.TYPES).map(([k, [g, name]]) => `<p><svg viewBox="-13 -13 26 26" aria-hidden="true">${S.symbol(k, 0, 0, 'ok')}</svg>${name}</p>`).join('')}</div>
      <p class="pd-legend-st"><svg viewBox="-13 -13 26 26" aria-hidden="true">${S.symbol('water', 0, 0, 'ok')}</svg>Working
        <svg viewBox="-13 -13 26 26" aria-hidden="true">${S.symbol('water', 0, 0, 'partial')}</svg>Partly
        <svg viewBox="-13 -13 26 26" aria-hidden="true">${S.symbol('water', 0, 0, 'no')}</svg>Not working</p>
      <h3>Hazards and site</h3>
      <p><i class="pd-hz pd-hz--flood"></i>Flooded area</p>
      <p><i class="pd-hz pd-hz--debris"></i>Debris</p>
      <p><svg viewBox="-16 -16 32 28" aria-hidden="true"><g class="sm-choke"><path d="M0 -15 L14 10 L-14 10 Z"/><text y="7" text-anchor="middle">!</text></g></svg>Choke point</p>
      <p><svg viewBox="-10 -10 20 20" aria-hidden="true"><g class="sm-gate"><rect x="-6" y="-6" width="12" height="12" transform="rotate(45)"/></g></svg>Gate · <i class="pd-tent"></i>Shelter</p>
    </div>`;

  // Counts by status across all services of one type.
  const svc = (type) => D.byType[type] || { ok: 0, partial: 0, no: 0, unknown: 0 };
  const total = (c) => c.ok + c.partial + c.no + c.unknown;
  const water = svc('water');
  const routesOpen = D.routes.filter(([id, label, , st]) => label && st === 'ok').length;
  const routesAll = D.routes.filter(([, label]) => label).length;

  // ---- page 1: the map -----------------------------------------------------
  function page1() {
    const glance = [
      [fmt(D.pop.people), 'people (estimate)', 'tbc'],
      [fmt(D.pop.shelters), 'shelters counted on imagery'],
      [`${water.ok} of ${total(water)}`, 'water points working'],
      [`${routesOpen} of ${routesAll}`, 'access routes open'],
    ];
    return doc(`
      ${band('Common Operational Picture', 1)}
      <div class="pd-p1">
        <div class="pd-map"><div data-graphic="site" data-fit="meet"></div></div>
        <aside class="pd-side">
          <div class="pd-key-msg"><h2>Key message</h2><p>Blocks B1 and B2 are flooded. Use R1 (light vehicles) or R3. R2 and R4 are closed.</p></div>
          <div class="pd-glance">${glance.map(([b, s, t]) => `<div><b>${b}</b><span>${s}${t ? ' <em class="tbc">TBC</em>' : ''}</span></div>`).join('')}</div>
          ${legend()}
        </aside>
      </div>
      ${foot(DISCLAIMER)}`, 'pd-page--1');
  }

  // ---- page 2: key findings ------------------------------------------------
  function page2() {
    const routeRows = D.routes.map(([id, label, , st, note]) => `<li>${pill(st)}<b>${label || 'R1'}</b><span>${note}</span></li>`).join('');
    const svcRows = Object.entries(S.TYPES).filter(([k]) => D.byType[k]).map(([k, [, name]]) => {
      const c = svc(k);
      return `<tr><th scope="row">${name}</th><td>${total(c)}</td><td class="ok">${c.ok || '–'}</td><td class="partial">${c.partial || '–'}</td><td class="no">${c.no || '–'}</td></tr>`;
    }).join('');
    const per = D.pop.perBlock || {};
    const max = Math.max(...Object.values(per), 1);
    const blocks = Object.entries(per).map(([b, n]) => `<div class="${b === 'B1' || b === 'B2' ? 'is-hot' : ''}"><span>${b}</span><i style="--v:${(n / max) * 100}%"></i><b>${n}</b></div>`).join('');
    const gaps = [
      ['no', 'Flooding in blocks B1 and B2', 'About 300 people in standing water. Relocate to the higher ground east of B4.', 'Site management · CCCM'],
      ['no', 'Water: 2 of 5 points not working', 'WP-03 and WP-05 are dry or flooded. Truck water to B1–B3 until repaired.', 'WASH cluster'],
      ['partial', 'Sanitation in the south of the site', 'LT-03 and LT-05 are flooded and overflowing. Close them and add temporary latrines in A1.', 'WASH cluster'],
      ['partial', 'West gate access', 'Debris on the last 80 m of R1. Clearing it reopens the site to trucks.', 'Logistics cluster'],
    ];
    return doc(`
      ${band('Key findings', 2)}
      <div class="pd-p2">
        <section class="pd-q">
          <h2><span>1</span>Can we reach people?</h2>
          <p class="pd-verdict">${pill('partial', 'Restricted')} ${routesOpen} of ${routesAll} access routes open</p>
          <ul class="pd-routes" role="list">${routeRows}</ul>
          <div class="pd-callout"><b>Use R3 from the east</b> for trucks until the west gate is cleared.</div>
          <h3 class="pd-h3">Logistics conditions</h3>
          <ul class="pd-logs" role="list">
            <li>${pill('ok', 'Working')}<b>Storage</b><span>WH-01 at the logistics hub, about 400 m² dry space</span></li>
            <li>${pill('ok', 'Usable')}<b>Landing zone</b><span>East of the site, firm ground, no obstructions</span></li>
            <li>${pill('partial', 'Restricted')}<b>West gate</b><span>Choke point: single lane, queues at distribution times</span></li>
            <li>${pill('unknown', 'Not assessed')}<b>Fuel</b><span>No supply observed on site</span></li>
          </ul>
        </section>
        <section class="pd-q">
          <h2><span>2</span>Which services still work?</h2>
          <table class="pd-svc"><thead><tr><th scope="col">Service</th><th scope="col">Total</th><th scope="col">Working</th><th scope="col">Partly</th><th scope="col">Not</th></tr></thead><tbody>${svcRows}</tbody></table>
          <h3 class="pd-h3">Shelters by block <small>counted on imagery</small></h3>
          <div class="pd-blocks">${blocks}</div>
          <p class="pd-pop"><b>${fmt(D.pop.people)}</b> people · <b>${fmt(D.pop.households)}</b> households <em class="tbc">Estimate, TBC</em></p>
        </section>
        <section class="pd-q pd-q--gaps">
          <h2><span>3</span>Where do we act first?</h2>
          <ol class="pd-gaps" role="list">${gaps.map(([st, h, p, who], i) => `<li><b class="pd-rank">${i + 1}</b><div><h3>${h}</h3><p>${p}</p><small>${pill(st, i < 2 ? 'Urgent' : 'High')} ${who}</small></div></li>`).join('')}</ol>
        </section>
      </div>
      ${foot()}`, 'pd-page--2');
  }

  // ---- page 3: hotspot -----------------------------------------------------
  function page3() {
    return doc(`
      ${band('Hotspot: blocks B1 and B2', 3)}
      <div class="pd-p3">
        <div class="pd-pair">
          <figure><div data-graphic="site" data-mode="sat" data-time="before" data-view="zoom" data-layers="imagery,blocks,furniture"></div><figcaption><b>Before</b> Satellite, 12/10/2026, 50 cm/px</figcaption></figure>
          <figure><div data-graphic="site" data-mode="ortho" data-view="zoom" data-layers="imagery,blocks,hazards,services,labels,furniture"></div><figcaption><b>After</b> Drone, 27/10/2026, 4.3 cm/px</figcaption></figure>
        </div>
        <div class="pd-story">
          <div><h2>What changed</h2>
          <p>Since 12 October, the river has risen into the south of the site. Around 60 shelters in B1 and B2 are in standing water, and two latrine blocks and one water point are flooded. People are moving north into A1 and A2, which are already crowded.</p>
          </div><div><h2>Recommended actions</h2>
          <ol class="pd-actions" role="list">
            <li><b>Relocate</b> households from the south of B1 and B2 to the higher ground east of B4.<small>Site management · within 48 h</small></li>
            <li><b>Decommission</b> LT-03 and LT-05 and add temporary latrines in A1.<small>WASH · within 72 h</small></li>
            <li><b>Truck water</b> to B1–B3 until WP-03 and WP-05 are repaired.<small>WASH · from today</small></li>
            <li><b>Re-fly</b> the south of the site after the next rain to update the flood extent.<small>RISA team · +1 week</small></li>
          </ol></div>
        </div>
      </div>
      ${foot()}`, 'pd-page--3');
  }

  // ---- interactive mock ----------------------------------------------------
  const LAYERS = [['hazards', 'Hazards'], ['routes', 'Access routes'], ['blocks', 'Shelters'], ['services', 'Services'], ['labels', 'Labels'], ['grid', 'Map grid']];
  function app() {
    return `<div class="pd-app" data-mode="map" data-time="after">
      <header class="pd-app-top">
        <span data-risa-logo="horizontal"></span>
        <span class="pd-app-site"><b>${SITE}</b> · ${PLACE}</span>
        <span class="pd-app-actions"><button type="button">${icon('i-print')} Print 3-page PDF</button><button type="button">${icon('i-download')} GeoPackage</button><button type="button" class="is-primary">${icon('i-link')} Share view</button></span>
      </header>
      <div class="pd-app-body">
        <aside class="pd-app-panel">
          <h3>Assessment</h3>
          <div class="pd-seg" role="group" aria-label="Assessment round"><button type="button" data-time="before">Before</button><button type="button" data-time="after" aria-pressed="true">Day 4</button><button type="button" disabled title="Planned">Day 11</button></div>
          <h3>Base map</h3>
          <div class="pd-seg" role="group" aria-label="Base map"><button type="button" data-mode="map" aria-pressed="true">Map</button><button type="button" data-mode="ortho">Drone</button><button type="button" data-mode="sat">Satellite</button></div>
          <h3>Layers</h3>
          ${LAYERS.map(([k, n]) => `<label class="pd-check"><input type="checkbox" data-layer="${k}" checked> ${n}</label>`).join('')}
          <p class="pd-app-note">${icon('i-eye')} Works offline once loaded. Last sync ${DATE}.</p>
        </aside>
        <div class="pd-app-map"><div data-graphic="site"></div>
          <div class="pd-app-pop" role="note"><b>WP-03 · Water point</b>${pill('no', 'Not working')}<span>Pump damaged, no water since 26/10. Observed 14:20 by team 2.</span></div>
        </div>
        <aside class="pd-app-find">
          <h3>Key findings</h3>
          <div class="pd-app-stat"><b>${water.ok}/${total(water)}</b><span>water points working</span></div>
          <div class="pd-app-stat"><b>${routesOpen}/${routesAll}</b><span>access routes open</span></div>
          <div class="pd-app-stat"><b>~300</b><span>people in flooded blocks <em class="tbc">TBC</em></span></div>
          <h3>Priorities</h3>
          <ol role="list"><li>${pill('no', 'Urgent')} Flooding, B1–B2</li><li>${pill('no', 'Urgent')} Water supply</li><li>${pill('partial', 'High')} Sanitation, south</li><li>${pill('partial', 'High')} West gate debris</li></ol>
        </aside>
      </div>
    </div>`;
  }

  function wireApp(el) {
    const map = el.querySelector('.pd-app-map > [data-graphic]');
    const draw = () => {
      const on = [...el.querySelectorAll('[data-layer]:checked')].map((c) => c.dataset.layer);
      const mode = el.dataset.mode;
      map.dataset.mode = mode;
      map.dataset.time = el.dataset.time;
      map.dataset.layers = (mode === 'map' ? ['roads'] : ['imagery', 'roads']).concat(on, ['furniture']).join(',');
      S.render(map);
      // Pin the popup to WP-03, wherever the map has been cropped to.
      const pop = el.querySelector('.pd-app-pop');
      const sym = map.querySelector('[data-id="WP-03"]');
      pop.hidden = !sym || !on.includes('services');
      if (!pop.hidden) {
        const a = sym.getBoundingClientRect(), b = map.getBoundingClientRect();
        pop.style.left = `${a.left + a.width / 2 - b.left}px`;
        pop.style.top = `${a.top - b.top}px`;
      }
    };
    window.addEventListener('resize', draw);
    el.addEventListener('click', (e) => {
      const b = e.target.closest('.pd-seg button');
      if (!b || b.disabled) return;
      const key = b.dataset.mode ? 'mode' : 'time';
      el.dataset[key] = b.dataset[key];
      b.parentElement.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      draw();
    });
    el.addEventListener('change', draw);
    draw();
  }

  // ---- page ---------------------------------------------------------------
  const intro = () => `
    <header class="sg-intro">
      <div class="container">
        <p class="sg-kicker">Theme ${theme.letter} · Product</p>
        <h1>The RISA product</h1>
        <p class="sg-lede">Three pages a coordinator can brief from in under a minute, and the interactive version being piloted alongside them.</p>
        <div class="sg-intro-grid">
          <div><h2>About these mock-ups</h2><p>Every page uses the same fictional site and is shown at A3 landscape proportions (pages 2 and 3 also print on A4). Status colours and symbols are the same in every theme; only the frame, type and logo change. The national authority leads: its logo goes first, and RISA is credited as the method. Change the logo in the review bar and every page updates.</p></div>
          <div><h2>Also for ${theme.name}</h2><p><a class="link-arrow" href="index.html">Home page ${icon('i-arrow')}</a></p><p style="margin-top:.6rem"><a class="link-arrow" href="style-guide.html#symbology">Map symbology ${icon('i-arrow')}</a></p><p style="margin-top:.6rem"><a class="link-arrow" href="collateral.html">Brief, slides and field kit ${icon('i-arrow')}</a></p></div>
        </div>
      </div>
    </header>`;

  const section = (n, id, h, p, inner, alt) => `
    <section class="sg-section${alt ? ' sg-alt' : ''}" id="${id}">
      <div class="container">
        <div class="sg-head"><span>${n}</span><h2>${h}</h2><p>${p}</p></div>
        ${inner}
      </div>
    </section>`;

  function init() {
    const pd = document.getElementById('pd');
    pd.innerHTML = intro()
      + section('01', 'page-1', 'Page 1 · The map', 'The whole site on one page: shelter blocks, access routes by status, services by status, hazards and logistics points. The side panel answers the three questions in numbers before anyone reads the map.', fig(page1(), 'Common Operational Picture · A3 landscape'))
      + section('02', 'page-2', 'Page 2 · Key findings', 'Access, essential services and priority gaps, one column per question. Each gap names who should act.', fig(page2(), 'Key findings · A3 or A4 landscape'), true)
      + section('03', 'page-3', 'Page 3 · Hotspot', 'Optional. A close-up of the most urgent area with before and after imagery and recommended actions, for coordination briefings, donor reports and advocacy.', fig(page3(), 'Hotspot · A3 or A4 landscape'))
      + section('04', 'interactive', 'Interactive version', 'A pilot, led by MapAction, for when there’s a connection. The same layers and symbols as the printed product, with base maps and layers you can switch. Try the controls: they work. The print stays the reference for low-connectivity settings.', fig(app(), 'Web viewer · mock-up, not a working product'), true);
    S.hydrate(pd);
    pd.querySelectorAll('.pd-app').forEach(wireApp);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
