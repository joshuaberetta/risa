/*
 * Toolbox, deployments map and deployment profiles. Renders into
 * <main id="lib"> from assets/content.js, using the current theme's tokens
 * and components, so every theme gets the same pages in its own dress.
 *
 *   <body data-view="toolbox">       resource library with filters
 *   <body data-view="deployments">   world map, filters and the list
 *   <body data-view="deployment">    one profile, from ?d=<id>
 *   <body data-view="about">         what RISA is and its layers of governance
 *   <section data-block="audiences"> "Who it's for", placed on each home page
 *
 * The world outlines (assets/world.js) are pre-projected to Equal Earth;
 * pins use the same projection, as on kobo.ngo.
 */
(function () {
  const C = window.RISAContent;
  const S = window.RISASite;
  const body = document.body;
  const root = body.dataset.root || '../../';
  const view = body.dataset.view;
  const theme = (window.RISAThemes || []).find((t) => t.id === body.dataset.themeId) || {};
  const heroCls = theme.darkHero ? ' inverse' : '';
  const icon = (id) => `<svg aria-hidden="true"><use href="${root}assets/icons.svg#${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]));
  const DEP = byId(C.deployments), RES = byId(C.resources);

  // ---- labels ---------------------------------------------------------------
  const KIND = { response: 'Response', training: 'Training', workshop: 'Workshop', event: 'Event' };
  const STATUS = { completed: 'Completed', active: 'Happening now', planned: 'Planned' };
  const MODE = { deployed: 'In the field', remote: 'Remote support', both: 'In the field and remote' };
  const SCENARIO = { full: 'Full RISA: field team, drone, GIS', hybrid: 'Hybrid RISA: field team, satellite, GIS', rapid: 'Rapid initial RISA: existing imagery' };
  const RSTATUS = { available: 'Available', draft: 'Draft', 'in-progress': 'In progress', planned: 'Planned' };
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function parseDate(s) {
    if (!s) return null;
    const q = /^(\d{4})-Q(\d)$/.exec(s);
    if (q) return { y: +q[1], q: +q[2] };
    const [y, m, d] = s.split('-').map(Number);
    return { y, m, d };
  }
  const fmt = (p, withYear = true) => {
    if (p.q) return `Q${p.q} ${p.y}`;
    if (!p.m) return String(p.y);
    if (!p.d) return `${MONTHS[p.m - 1]} ${p.y}`;
    return `${p.d} ${MONTHS[p.m - 1].slice(0, 3)}${withYear ? ` ${p.y}` : ''}`;
  };
  function dates(d) {
    const a = parseDate(d.start), b = parseDate(d.end);
    if (!a) return 'Dates to be confirmed';
    if (!b) return fmt(a);
    return a.y === b.y && a.d && b.d ? `${fmt(a, false)} – ${fmt(b)}` : `${fmt(a)} – ${fmt(b)}`;
  }
  const sortKey = (d) => d.start || '9999';
  const ordered = () => [...C.deployments].sort((a, b) => {
    const rank = { active: 0, planned: 1, completed: 2 };
    if (rank[a.status] !== rank[b.status]) return rank[a.status] - rank[b.status];
    return a.status === 'planned' ? sortKey(a).localeCompare(sortKey(b)) : sortKey(b).localeCompare(sortKey(a));
  });
  const statusTag = (st) => `<span class="lib-status lib-status--${st}">${STATUS[st]}</span>`;
  const partnerNames = (ids) => (ids || []).map((p) => C.partners[p]?.name).filter(Boolean);
  const list = (items) => items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
  const depHref = (d) => `deployment.html?d=${d.id}`;

  // ---- map ------------------------------------------------------------------
  const W = window.RISAWorld;
  const A1 = 1.340264, A2 = -0.081106, A3 = 0.000893, A4 = 0.003796, M = Math.sqrt(3) / 2;
  function project(lon, lat) {
    const l = (lon * Math.PI) / 180, th = Math.asin(M * Math.sin((lat * Math.PI) / 180));
    const t2 = th * th, t6 = t2 * t2 * t2;
    const x = (l * Math.cos(th)) / (M * (A1 + 3 * A2 * t2 + t6 * (7 * A3 + 9 * A4 * t2)));
    const y = th * (A1 + A2 * t2 + t6 * (A3 + A4 * t2));
    return [W.projection.translate[0] + W.projection.scale * x, W.projection.translate[1] - W.projection.scale * y];
  }
  // world.js is only loaded on the map pages; the toolbox doesn't need it.
  const centroid = W ? Object.fromEntries(W.countries.map((c) => [c.name, c.centroid])) : {};
  function pinsFor(d) {
    if (d.locations?.length) return d.locations.map((l) => ({ d, label: l.name, xy: project(l.lon, l.lat) }));
    const c = d.countries?.[0] && centroid[d.countries[0]];
    return c ? [{ d, label: d.countries[0], xy: c }] : [];
  }
  // Spread pins that land on the same spot.
  function spread(pins) {
    const groups = {};
    pins.forEach((p) => { const k = `${Math.round(p.xy[0] / 8)}:${Math.round(p.xy[1] / 8)}`; (groups[k] = groups[k] || []).push(p); });
    return Object.values(groups).flatMap((g) => g.length === 1 ? g : g.map((p, i) => {
      const a = (2 * Math.PI * i) / g.length - Math.PI / 2;
      return { ...p, xy: [p.xy[0] + 9 * Math.cos(a), p.xy[1] + 9 * Math.sin(a)] };
    }));
  }
  function pinMark(d) {
    const shape = d.kind === 'response'
      ? '<circle r="6.5" class="pin-core"/>'
      : '<rect x="-5.5" y="-5.5" width="11" height="11" rx="1.5" transform="rotate(45)" class="pin-core"/>';
    return `${d.status === 'active' ? '<circle r="10" class="pin-pulse"/>' : ''}${shape}<circle r="15" fill="transparent"/>`;
  }
  function worldMap(items, { focus } = {}) {
    const pins = spread(items.flatMap(pinsFor));
    const hot = new Set(items.flatMap((d) => d.countries || []));
    // Frame the pins (and a focus country) with some breathing room, at about 2:1.
    const pts = pins.map((p) => p.xy);
    let [x0, y0, x1, y1] = pts.length ? [Math.min(...pts.map((p) => p[0])), Math.min(...pts.map((p) => p[1])), Math.max(...pts.map((p) => p[0])), Math.max(...pts.map((p) => p[1]))] : [0, 0, W.width, W.height];
    const pad = focus ? 60 : 70;
    x0 -= pad; x1 += pad; y0 -= pad; y1 += pad;
    let w = Math.max(x1 - x0, focus ? 260 : 520), h = Math.max(y1 - y0, w / 2);
    w = Math.max(w, h * 2);
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const vb = [Math.max(0, Math.min(W.width - w, cx - w / 2)), Math.max(0, Math.min(W.height - h, cy - h / 2)), Math.min(w, W.width), Math.min(h, W.height)];
    const k = vb[2] / 1000;
    const countries = W.countries.map((c) => `<path d="${c.d}" class="${hot.has(c.name) ? 'is-hot' : ''}"><title>${esc(c.name)}</title></path>`).join('');
    const marks = pins.map((p) => `<a href="${depHref(p.d)}" class="pin pin--${p.d.kind} pin--${p.d.status}" transform="translate(${p.xy[0].toFixed(1)} ${p.xy[1].toFixed(1)}) scale(${(k * 1.5).toFixed(3)})" aria-label="${esc(p.d.title)}, ${esc(p.label)}" data-tip="${esc(p.d.title)}" data-sub="${esc(p.label)} · ${esc(dates(p.d))}">${pinMark(p.d)}</a>`).join('');
    return `<div class="lib-map"><svg viewBox="${vb.map((v) => v.toFixed(1)).join(' ')}" role="img" aria-label="Map of RISA deployments, trainings and workshops">
        <g class="lib-countries">${countries}</g><g class="lib-pins">${marks}</g></svg><div class="lib-tip" hidden></div></div>`;
  }
  function wireTips(el) {
    const tip = el.querySelector('.lib-tip');
    el.querySelectorAll('.pin').forEach((p) => {
      const show = () => {
        const a = p.getBoundingClientRect(), b = el.getBoundingClientRect();
        tip.innerHTML = `<b>${p.dataset.tip}</b><span>${p.dataset.sub}</span>`;
        tip.style.left = `${a.left + a.width / 2 - b.left}px`;
        tip.style.top = `${a.top - b.top}px`;
        tip.hidden = false;
      };
      p.addEventListener('mouseenter', show); p.addEventListener('focus', show);
      p.addEventListener('mouseleave', () => (tip.hidden = true)); p.addEventListener('blur', () => (tip.hidden = true));
    });
  }
  const mapLegend = () => `<div class="lib-legend" aria-hidden="true">
      <span><svg viewBox="-9 -9 18 18"><circle r="6.5" class="pin-core"/></svg>Response</span>
      <span><svg viewBox="-9 -9 18 18"><rect x="-5.5" y="-5.5" width="11" height="11" rx="1.5" transform="rotate(45)" class="pin-core"/></svg>Training, workshop or event</span>
      <span class="lib-legend-st"><i class="is-planned"></i>Planned</span>
      <span class="lib-legend-st"><i class="is-active"></i>Happening now</span>
      <span class="lib-legend-st"><i class="is-hot"></i>Country involved</span>
    </div>`;

  // ---- shared bits -----------------------------------------------------------
  const hero = (eyebrow, title, lead, extra = '') => `
    <section class="lib-hero${heroCls}"><div class="container">
      <p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="lib-lead">${lead}</p>${extra}
    </div></section>`;
  const depCard = (d) => `<article class="card lib-dcard">
      <p class="lib-meta"><span class="tag tag--soft">${KIND[d.kind]}</span>${statusTag(d.status)}</p>
      <h3><a href="${depHref(d)}">${esc(d.title)}</a></h3>
      <p class="lib-where">${icon('i-pin')}${esc(d.place)} · ${dates(d)}${d.tbc ? ' <span class="tbc">TBC</span>' : ''}</p>
      <p>${esc(d.summary)}</p>
      <a class="link-arrow" href="${depHref(d)}">Read more ${icon('i-arrow')}</a>
    </article>`;
  const seg = (name, label, opts) => `<div class="lib-seg" role="group" aria-label="${label}">${opts.map(([v, l], i) => `<button type="button" data-${name}="${v}" aria-pressed="${i === 0}">${l}</button>`).join('')}</div>`;
  function wireSeg(el, onChange) {
    el.querySelectorAll('.lib-seg').forEach((g) => g.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      g.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      onChange();
    }));
  }
  const pressed = (el, name) => el.querySelector(`[data-${name}][aria-pressed="true"]`)?.dataset[name] || 'all';

  // ---- deployments page --------------------------------------------------------
  function deployments() {
    const all = C.deployments;
    const responses = all.filter((d) => d.kind === 'response');
    const countries = new Set(responses.filter((d) => d.status !== 'planned').flatMap((d) => d.countries));
    const next = ordered().find((d) => d.status === 'planned' && d.locations);
    const stats = `<div class="lib-stats">
        <div><b>${responses.length}</b><span>responses supported</span></div>
        <div><b>${countries.size}</b><span>countries with a response</span></div>
        <div><b>${all.filter((d) => d.status === 'planned').length}</b><span>trainings, workshops and events planned</span></div>
        ${next ? `<div><b>Next</b><span>${esc(next.title)}, ${dates(next)}</span></div>` : ''}
      </div>`;
    return hero('Deployments', 'Where RISA has been used', 'Every response, simulation, training and workshop, from the first field test in Mozambique to the handover to national teams. Pick a pin or a card for the full story.', stats)
      + `<section class="lib-section"><div class="container">
        <div class="lib-filters">
          ${seg('kind', 'Type', [['all', 'Everything'], ['response', 'Responses'], ['other', 'Training and events']])}
          ${seg('status', 'Status', [['all', 'Any status'], ['completed', 'Completed'], ['upcoming', 'Now and planned']])}
        </div>
        <div class="lib-mapwrap" id="lib-map"></div>
        ${mapLegend()}
        <p class="lib-count" aria-live="polite"></p>
        <div class="lib-grid" id="lib-list"></div>
        <p class="lib-fine">Locations of national teams’ deployments are shown only with the national authority’s agreement. Dates marked TBC are still to be confirmed.</p>
      </div></section>`;
  }
  function wireDeployments(el) {
    const draw = () => {
      const kind = pressed(el, 'kind'), status = pressed(el, 'status');
      const items = ordered().filter((d) => (kind === 'all' || (kind === 'response' ? d.kind === 'response' : d.kind !== 'response'))
        && (status === 'all' || (status === 'completed' ? d.status === 'completed' : d.status !== 'completed')));
      el.querySelector('#lib-map').innerHTML = worldMap(C.deployments.filter((d) => items.includes(d)));
      wireTips(el.querySelector('.lib-map'));
      el.querySelector('#lib-list').innerHTML = items.map(depCard).join('') || '<p>Nothing matches these filters yet.</p>';
      el.querySelector('.lib-count').textContent = `${items.length} of ${C.deployments.length} shown`;
    };
    wireSeg(el, draw);
    draw();
  }

  // ---- deployment profile ------------------------------------------------------
  function profile(d) {
    if (!d) {
      return hero('Deployments', 'Deployment not found', 'This link may be out of date.', `<p><a class="btn btn--primary" href="deployments.html">All deployments ${icon('i-arrow')}</a></p>`);
    }
    const facts = [
      ['Status', statusTag(d.status)],
      ['Dates', dates(d) + (d.tbc ? ' <span class="tbc">TBC</span>' : '')],
      ['Where', esc(d.place)],
      ['Type', KIND[d.kind] + (d.hazard ? ` · ${esc(d.hazard)}` : '')],
      d.scenario && ['Scenario', SCENARIO[d.scenario]],
      d.mode && ['Support', MODE[d.mode]],
      d.partners?.length && ['With', list(partnerNames(d.partners))],
    ].filter(Boolean);
    const products = d.products ? `<section class="lib-products">
        <div class="lib-products-copy"><h2>What the team produced</h2><ul role="list">${d.products.map((p) => `<li>${icon('i-check')}${esc(p)}</li>`).join('')}</ul>
          <p class="lib-fine">Illustrated with the fictional sample site. Real products are published with the national authority’s agreement.</p>
          <a class="link-arrow" href="product.html">See the three-page product ${icon('i-arrow')}</a></div>
        <div class="lib-products-vis">
          <figure><div data-graphic="site" data-layers="roads,blocks,hazards,routes,services"></div><figcaption>Common Operational Picture</figcaption></figure>
          <figure><div data-graphic="site" data-mode="ortho" data-view="zoom" data-layers="imagery,blocks,hazards,services"></div><figcaption>Drone orthomosaic, hotspot</figcaption></figure>
        </div></section>` : '';
    const res = (d.resources || []).map((id) => RES[id]).filter(Boolean);
    const others = ordered().filter((x) => x.id !== d.id).slice(0, 3);
    const located = pinsFor(d).length;
    return `<section class="lib-hero lib-hero--profile${heroCls}"><div class="container">
        <nav class="lib-crumbs" aria-label="Breadcrumb"><a href="deployments.html">Deployments</a><span>/</span><span>${esc(d.title)}</span></nav>
        <p class="eyebrow">${KIND[d.kind]}${d.hazard ? ` · ${esc(d.hazard)}` : ''}</p>
        <h1>${esc(d.title)}</h1><p class="lib-lead">${esc(d.summary)}</p>
      </div></section>
      <section class="lib-section"><div class="container lib-profile">
        <div class="lib-top${located ? '' : ' lib-top--nomap'}">
          <div class="lib-facts">${facts.map(([k, v]) => `<div><small>${k}</small><p>${v}</p></div>`).join('')}</div>
          ${located ? `<div class="lib-mapwrap lib-mapwrap--small">${worldMap([d], { focus: true })}</div>` : ''}
        </div>
        <div class="lib-story">
          ${d.body.map(([h, p]) => `<h2>${esc(h)}</h2><p>${esc(p)}</p>`).join('')}
          ${d.lessons ? `<h2>Lessons for the method</h2><ul class="lib-lessons" role="list">${d.lessons.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>` : ''}
          ${d.note ? `<p class="lib-note">${icon('i-alert')}<span>${esc(d.note)}</span></p>` : ''}
        </div>
        ${products}
        ${res.length ? `<div class="lib-used"><h2>From the toolbox</h2><div class="lib-grid lib-grid--res">${res.map(resCard).join('')}</div></div>` : ''}
        <div class="lib-others"><h2>Other deployments</h2><div class="lib-grid">${others.map(depCard).join('')}</div>
          <p><a class="btn btn--secondary" href="deployments.html">All deployments on the map</a></p></div>
      </div></section>`;
  }

  // ---- who it's for (home page block) ----------------------------------------------
  function audiences() {
    const card = (a) => `<article class="who-card${a.lead ? ' who-card--lead' : ''}">
        <span class="icon-badge">${icon(a.icon)}</span>
        <div class="who-head"><h3>${esc(a.who)}</h3><p class="who-ex">${esc(a.examples)}</p></div>
        <p class="who-q">“${esc(a.question)}”</p>
        <ul role="list">${a.gets.map((g) => `<li>${icon('i-check')}${esc(g)}</li>`).join('')}</ul>
        <a class="link-arrow" href="${a.link[0]}">${esc(a.link[1])} ${icon('i-arrow')}</a>
      </article>`;
    return `<div class="container">
        <div class="who-intro"><p class="eyebrow">Who it’s for</p><h2>For the people deciding what happens in the first days, and the national teams who will run it next.</h2></div>
        <div class="who-grid">${C.audiences.map(card).join('')}</div>
        <p class="who-also"><b>Also useful for donors and advocates:</b> the optional third page shows a hotspot with before and after imagery and recommended actions.</p>
      </div>`;
  }

  // ---- about ------------------------------------------------------------------
  function about() {
    const G = C.governance;
    const L = Object.fromEntries(G.map((l) => [l.id, l]));
    // Nested rings, from the founding members outwards to national and local partners.
    // The advisory board sits above (it advises the core); funders sit underneath.
    const ring = (layer, r, cls, labelY) => `<a href="#${layer.id}" class="gov-ring gov-ring--${cls}" aria-label="${esc(layer.name)}">
        <circle cx="230" cy="296" r="${r}"/><text x="230" y="${labelY}" text-anchor="middle">${esc(layer.name)}</text></a>`;
    const band = (layer, y, cls, label) => `<a href="#${layer.id}" class="gov-band gov-band--${cls}"><rect x="20" y="${y}" width="420" height="44" rx="6"/><text x="230" y="${y + 27}" text-anchor="middle">${label}</text></a>`;
    const diagram = `<figure class="gov-fig"><svg viewBox="0 0 460 600" role="img" aria-label="Layers of RISA governance: founding members at the centre, then collaborators, humanitarian partners and national and local partners, with the advisory board above and funders underneath">
        ${band(L.advisory, 0, 'advisory', `${esc(L.advisory.name)} · advises the founding members`)}
        ${ring(L.national, 222, 'national', 98)}${ring(L.partners, 178, 'partners', 142)}${ring(L.collaborators, 136, 'collab', 184)}${ring(L.founding, 94, 'core', 238)}
        <g class="gov-core-names">${L.founding.members.map((m, i) => `<text x="230" y="${280 + i * 21}" text-anchor="middle">${esc(m.name)}</text>`).join('')}</g>
        ${band(L.funders, 548, 'funders', `${esc(L.funders.name)} ${esc(L.funders.members.map((m) => m.name).join(' · '))}`)}
      </svg></figure>`;
    const layerCard = (l, i) => `<article class="gov-layer gov-layer--${l.id}" id="${l.id}">
        <header><span class="gov-num">${String(i + 1).padStart(2, '0')}</span><div><h3>${esc(l.name)}</h3><p class="gov-short">${esc(l.short)}</p></div></header>
        <p>${esc(l.text)}</p>
        <ul class="gov-members" role="list">${l.members.map((m) => `<li><b>${esc(m.name)}</b>${m.full ? `<small>${esc(m.full)}</small>` : ''}<span>${esc(m.role)}${m.tbc ? ' <em class="tbc">Role TBC</em>' : ''}</span></li>`).join('')}</ul>
      </article>`;
    return hero('About', 'An open method, owned together', 'RISA was developed by three organisations who jointly own it, advised by an independent board, with collaborators, humanitarian partners, national and local partners, and funders around them. Nothing is patented: the method is meant to be handed over to national authorities and adapted by others.')
      + `<section class="lib-section"><div class="container">
        <div class="gov-intro">
          <div><h2>What RISA is</h2><p>A rapid assessment method that turns drone imagery and direct field observation into operational maps of displacement sites, within days. It answers three questions: can we reach people, which services still work, and where do we act first.</p></div>
          <ul class="gov-values" role="list">
            <li><b>Open</b>Nothing is patented. Anyone can use and adapt the method and the toolbox.</li>
            <li><b>Standard</b>One versioned SOP and toolbox, updated after every deployment.</li>
            <li><b>Nationally owned</b>Built to be handed over, so national teams run the next assessment.</li>
          </ul>
        </div>
      </div></section>
      <section class="lib-section lib-section--tint"><div class="container">
        <h2>Layers of governance</h2>
        <p class="lib-sub">From the organisations that own the method to those who fund it. Select a layer to see who is in it.</p>
        <div class="gov-grid">${diagram}<div class="gov-layers">${G.map(layerCard).join('')}</div></div>
      </div></section>
      <section class="lib-section"><div class="container gov-two">
        <div><h2>How decisions are made</h2>
          <p>The founding members agree changes to the method, the SOP and the toolbox. Every deployment feeds lessons into the next version, and collaborators and partners are consulted on the parts that touch their work.</p>
          <p class="lib-note">${icon('i-alert')}<span>A draft governance is being agreed at the Lyon workshop (29–30 October 2026). This page will follow it.</span></p></div>
        <div><h2>When a national authority runs RISA</h2>
          <p>The product is theirs. Their logo goes first, and RISA is credited as the method used. The consortium moves from leading deployments, to co-leading with remote support, to acting as a backstop for large or complex events.</p>
          <p><a class="btn btn--primary" href="index.html#adopt">Adopt RISA ${icon('i-arrow')}</a> <a class="btn btn--secondary" href="deployments.html">See the deployments</a></p></div>
      </div></section>
      <section class="lib-section"><div class="container"><p class="lib-fine">Organisations are named as text. Logos, names and descriptions need each organisation’s approval before anything is published. Roles marked TBC are not yet described in the consortium documents.</p></div></section>`;
  }

  // ---- toolbox ----------------------------------------------------------------
  function action(r) {
    if (r.build) return `<button class="btn btn--primary btn--sm" type="button" data-build="${r.build}">${icon('i-download')} Download ${r.format}</button>`;
    if (r.status === 'available' && r.preview) return `<a class="btn btn--primary btn--sm" href="${r.preview}">${icon('i-eye')} Open</a>`;
    // Drafts aren't public yet; the consortium shares them directly for now.
    const ask = `<span class="lib-ask">${r.status === 'planned' ? 'Planned' : 'Draft, not yet shared'}</span>`;
    return ask + (r.preview ? ` <a class="link-arrow" href="${r.preview}">Preview ${icon('i-arrow')}</a>` : '');
  }
  function resCard(r) {
    return `<article class="lib-res" id="${r.id}" data-cat="${r.category}">
        <header><span class="lib-code">${esc(r.code)}</span><span class="lib-rstatus lib-rstatus--${r.status}">${RSTATUS[r.status]}</span></header>
        <h3>${esc(r.title)}</h3>
        <p>${esc(r.summary)}</p>
        <dl><div><dt>Format</dt><dd>${esc(r.format)}</dd></div><div><dt>Version</dt><dd>${esc(r.version)}</dd></div><div><dt>Owner</dt><dd>${esc(r.owner)}</dd></div>${r.updated ? `<div><dt>Updated</dt><dd>${fmt(parseDate(r.updated))}</dd></div>` : ''}</dl>
        ${r.details ? `<details><summary>What’s in it</summary><ul>${r.details.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></details>` : ''}
        <div class="lib-actions">${action(r)}</div>
      </article>`;
  }
  function toolbox() {
    const sop = RES.sop;
    const cats = Object.entries(C.categories);
    const used = (id) => C.deployments.filter((d) => (d.resources || []).includes(id));
    return hero('Toolbox', 'Everything a trained team needs to deploy', 'The procedure, forms, map standards and training material behind every RISA product. Versioned and updated after each deployment, and open to use and adapt: nothing in RISA is patented.')
      + `<section class="lib-section"><div class="container">
        <article class="lib-feature">
          <div><p class="eyebrow">Start here</p><h2>${esc(sop.title)} <span class="lib-code">${sop.version}</span></h2><p>${esc(sop.summary)} Every annex below hangs off it.</p>
            <ul class="lib-steps" role="list">${['Mission preparation', 'Field data collection', 'Data processing', 'GIS integration', 'Dissemination', 'Updating'].map((s, i) => `<li><b>${i + 1}</b>${s}</li>`).join('')}</ul></div>
          <div class="lib-feature-side"><span class="lib-rstatus lib-rstatus--${sop.status}">${RSTATUS[sop.status]}</span><p>${esc(sop.owner)}</p><p>${sop.format} · updated ${fmt(parseDate(sop.updated))}</p>${action(sop)}
            <p class="lib-fine">Used in ${used('sop').length} deployments, workshops and trainings.</p></div>
        </article>
        <div class="lib-filters">${seg('cat', 'Category', [['all', 'Everything']].concat(cats))}
          ${seg('avail', 'Availability', [['all', 'Any status'], ['available', 'Ready to use'], ['draft', 'Drafts and in progress']])}</div>
        <div class="lib-grid lib-grid--res" id="lib-res">${C.resources.filter((r) => r.id !== 'sop').map(resCard).join('')}</div>
        <p class="lib-fine">Drafts are shared directly by the consortium while the toolbox is consolidated (Lyon workshop, October 2026); downloads will appear here once versions are agreed. Annex owners: A Kobo, B and C MapAction, D HI/Atlas Logistique.</p>
      </div></section>`;
  }
  function wireToolbox(el) {
    const draw = () => {
      const cat = pressed(el, 'cat'), avail = pressed(el, 'avail');
      el.querySelectorAll('#lib-res .lib-res').forEach((card) => {
        const r = RES[card.id];
        const ok = (cat === 'all' || r.category === cat) && (avail === 'all' || (avail === 'available' ? r.status === 'available' : r.status !== 'available'));
        card.hidden = !ok;
      });
    };
    wireSeg(el, draw);
    if (location.hash && RES[location.hash.slice(1)]) document.getElementById(location.hash.slice(1))?.classList.add('is-target');
  }

  // Downloads built from the live design system, so they always match the maps.
  function download(name, text, type) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type }));
    a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  const rootStyle = getComputedStyle(document.documentElement);
  const tok = (n) => rootStyle.getPropertyValue(n).trim();
  const resolveVars = (svg) => svg.replace(/var\((--[a-z-]+)\)/g, (_, n) => tok(n) || '#000');
  function buildSymbols() {
    const types = Object.keys(S.TYPES), sts = ['ok', 'partial', 'no', 'unknown'];
    let y = 40, rows = '';
    types.forEach((t) => {
      rows += `<text x="10" y="${y + 5}" font-size="13">${S.TYPES[t][1]}</text>`;
      sts.forEach((st, i) => { rows += S.symbol(t, 200 + i * 70, y, st, 1, `${t}-${st}`); });
      y += 40;
    });
    ['ok', 'partial', 'no'].forEach((st) => { rows += `<g fill="none">${S.routeLine(`M200 ${y}H410`, st, 7)}</g><text x="10" y="${y + 5}" font-size="13">Route: ${S.STATUS[st][0]}</text>`; y += 36; });
    const head = sts.map((st, i) => `<text x="${200 + i * 70}" y="16" font-size="11" text-anchor="middle">${S.STATUS[st][0].split(' / ').pop()}</text>`).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 470 ${y}" width="470" height="${y}" font-family="Inter, Arial, sans-serif"><rect width="100%" height="100%" fill="#fff"/>${head}${rows}<style>.sm-casing{stroke:#fff}</style></svg>`;
    download('risa-map-symbols.svg', resolveVars(svg), 'image/svg+xml');
  }
  function buildTokens() {
    const names = ['--st-ok', '--st-partial', '--st-no', '--st-unknown', '--st-ink', '--hz-flood', '--hz-debris'];
    const out = { name: 'RISA status and hazard colours', note: 'Reserved: never use these as brand colours. Always pair with line style or symbol shape.', colours: Object.fromEntries(names.map((n) => [n.slice(2), tok(n)])),
      lineStyles: { ok: 'solid', partial: 'dashed', no: 'dotted' }, symbols: { ok: 'filled', partial: 'half-filled', no: 'crossed out', unknown: 'grey outline' } };
    download('risa-status-colours.json', JSON.stringify(out, null, 2), 'application/json');
  }

  // ---- init ---------------------------------------------------------------------
  function init() {
    document.querySelectorAll('[data-block="audiences"]').forEach((b) => { b.innerHTML = audiences(); });
    const el = document.getElementById('lib');
    if (!el) return;
    if (view === 'toolbox') { el.innerHTML = toolbox(); wireToolbox(el); }
    if (view === 'about') el.innerHTML = about();
    if (view === 'deployments') { el.innerHTML = deployments(); wireDeployments(el); }
    if (view === 'deployment') {
      const d = DEP[new URLSearchParams(location.search).get('d')];
      el.innerHTML = profile(d);
      if (d) document.title = `${d.title} · ${document.title}`;
      el.querySelectorAll('.lib-map').forEach(wireTips);
    }
    S.hydrate(el);
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-build]'); if (!b) return;
      ({ symbols: buildSymbols, tokens: buildTokens })[b.dataset.build]();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
