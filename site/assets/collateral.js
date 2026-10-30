/*
 * Collateral mock-ups: RISA in Brief, training slides, event pieces, field kit
 * and small pieces. Renders into <main id="cl">. Every piece is a .cl-doc with
 * a real aspect ratio; its .cl-page font-size is set in container units, so
 * the whole layout (logo included) scales with the width it is shown at.
 */
(function () {
  const body = document.body;
  const root = body.dataset.root || '../../';
  const theme = window.RISAThemes.find((t) => t.id === body.dataset.themeId);
  const icon = (id) => `<svg aria-hidden="true"><use href="${root}assets/icons.svg#${id}"/></svg>`;
  const S = window.RISASite;

  // How each theme dresses the same content.
  //   art: main motif · tex: quiet background texture · cover: cover layout
  const FLAVOUR = {
    briefing: { hl: 'Know what’s on the ground, <em>in the first days.</em>', art: 'site', tex: 'grid', cover: 'split', divider: 'inverse' },
    groundtruth: { hl: 'Ground truth, <em>in the first days.</em>', art: 'site', tex: 'grid', cover: 'split', divider: 'inverse' },
    overhead: { hl: 'See the site <em>from above.</em>', art: 'ortho', tex: 'grid', cover: 'full', dark: true, divider: 'inverse' },
    streams: { hl: 'Three inputs. <em>One picture.</em>', art: 'site', tex: 'none', cover: 'split', divider: 'inverse' },
    sharedground: { hl: 'Your teams. Your sites. <em>One shared method.</em>', art: 'contours', tex: 'contours', cover: 'full', divider: 'inverse' },
    handbook: { hl: 'Know what’s on the ground in the first days.', art: 'site', tex: 'none', cover: 'split', divider: 'inverse' },
    report: { hl: 'Knowing what’s on the ground, <em>in the first days.</em>', art: 'site', tex: 'none', cover: 'split', divider: 'inverse' },
    noticeboard: { hl: 'Rapid assessment of displacement sites.', art: 'site', tex: 'none', cover: 'split', divider: 'inverse' },
    first72: { hl: 'The first 72 hours <em>decide the response.</em>', art: 'site', tex: 'none', cover: 'type', divider: 'inverse' },
  };
  const F = FLAVOUR[theme.id] || FLAVOUR.briefing;

  // ---- shared content ------------------------------------------------------
  const URL = 'risa-method.org';
  const EMAIL = 'contact@risa-method.org';
  const WHO = 'HI/Atlas Logistique · MapAction · Kobo';
  const NAME = 'Rapid Infrastructure and Service Assessment';
  const LEAD = 'An open method that turns drone imagery and direct field observation into operational maps of displacement sites, within days.';
  const QUOTE = '“The orthomosaic showed the handwashing stations, latrines and child-friendly spaces that satellite imagery couldn’t.”';
  const QUESTIONS = [
    ['i-road', 'Can we reach people?', 'Access routes, by status.'],
    ['i-drop', 'Which services still work?', 'Water, sanitation, health, protection.'],
    ['i-pin', 'Where do we act first?', 'Priority gaps, ranked, with who acts.'],
  ];
  const INPUTS = [
    ['i-drone', 'Aerial imagery', 'Drone orthomosaic at 120 m, about 4 cm per pixel, or recent satellite imagery.', 'HI/Atlas Logistique'],
    ['i-form', 'Field observation', 'A standard KoboCollect survey, by direct observation. Works offline.', 'Kobo'],
    ['i-layers', 'GIS integration', 'One map, common symbology, a georeferenced inventory.', 'MapAction'],
  ];
  const STEPS = [
    ['Prepare', 'Scope, permits, GEO zone unlock'], ['Collect', 'Flights and surveys in parallel'], ['Process', 'Orthomosaic and data cleaning'],
    ['Integrate', 'Layers, symbology, layout'], ['Share', 'UNDAC, NEMA, clusters'], ['Update', 'Follow-up after a week'],
  ];
  const STATS = [['3–5', 'days from site set-up to the first product'], ['3', 'pages, read in under a minute'], ['4.3 cm', 'per pixel, flown at 120 m'], ['0', 'patents: open to adopt and adapt']];

  // ---- building blocks -----------------------------------------------------
  function art(seed = 4, o = {}) {
    if (F.art === 'site' || F.art === 'ortho' || o.mode) {
      const mode = o.mode || (F.art === 'ortho' ? 'ortho' : 'map');
      // Covers are decoration, so they never show status symbols or route status.
      const layers = o.layers || (o.cover
        ? (mode === 'map' ? 'roads,blocks,hazards' : 'imagery,roads,blocks')
        : (mode === 'map' ? 'roads,blocks,hazards,routes,services' : 'imagery,roads,blocks,hazards,routes,services'));
      return `<div class="cl-art cl-art--fill cl-art--site" data-graphic="site" data-mode="${mode}"${o.view ? ` data-view="${o.view}"` : ''} data-layers="${layers}"></div>`;
    }
    return `<div class="cl-art cl-art--fill" data-graphic="contours" data-seed="${seed}" data-levels="${o.levels || 16}"></div>`;
  }
  function tex(seed = 17) {
    if (F.tex === 'contours') return `<div class="cl-tex" data-graphic="contours" data-seed="${seed}" data-levels="14" aria-hidden="true"></div>`;
    if (F.tex === 'grid') return '<div class="cl-tex cl-tex--grid" aria-hidden="true"></div>';
    return '';
  }
  const logo = (layout = 'horizontal', cls = 'cl-logo') => `<span class="${cls}" data-risa-logo="${layout}"></span>`;
  const qr = () => '<span class="cl-qr" aria-label="QR code placeholder"><i></i><i></i><i></i></span>';
  const pill = (st, label) => `<span class="st-pill st-pill--${st}">${label}</span>`;

  /** A mock document. kind sets aspect ratio and scale (see collateral.css). */
  const doc = (kind, inner, cls = '') => `<div class="cl-doc cl-doc--${kind}"><div class="cl-page ${cls}">${inner}</div></div>`;
  const fig = (content, caption, cls = '') => `<figure class="cl-fig ${cls}">${content}<figcaption>${caption}</figcaption></figure>`;

  /** The theme's cover composition. orient: 'land' | 'port'. */
  function cover({ orient = 'land', lead = true, meta = '', seed = 4, eyebrow = NAME, hl = F.hl, o = {} } = {}) {
    return `<div class="cl-cover cl-cover--${F.cover} cl-cover--${orient}${F.dark ? ' inverse' : ''}">
      <div class="cl-cover-vis">${art(seed, Object.assign({ cover: true }, o))}</div>
      <div class="cl-cover-copy">
        ${logo()}
        <div class="cl-cover-main">
          <p class="eyebrow">${eyebrow}</p>
          <h1 class="cl-display">${hl}</h1>
          ${lead ? `<p class="cl-lead">${LEAD}</p>` : ''}
        </div>
        ${meta ? `<p class="cl-meta">${meta}</p>` : ''}
      </div>
    </div>`;
  }

  const dividerCls = () => (F.divider === 'accent' ? 'cl-accent' : 'inverse');
  const keyRow = () => `<div class="cl-key" aria-hidden="true">
      <span><i class="k-line k-ok"></i>Open</span><span><i class="k-line k-partial"></i>Restricted</span><span><i class="k-line k-no"></i>Closed</span></div>`;

  // ---- 01 RISA in Brief ----------------------------------------------------
  function brief() {
    const front = doc('a4', `<div class="cl-brief">
        <header class="cl-brief-top">${logo()}<span class="tag">RISA in Brief · v2 draft</span></header>
        <div class="cl-brief-hero"><p class="eyebrow">${NAME}</p><h1 class="cl-display">${F.hl}</h1><p class="cl-lead">${LEAD}</p></div>
        <div class="cl-brief-map">${art(4, { mode: 'map' })}${keyRow()}</div>
        <div class="cl-brief-qs">${QUESTIONS.map(([i, h, p], n) => `<div><span class="cl-ico">${icon(i)}</span><b>${n + 1}. ${h}</b><p>${p}</p></div>`).join('')}</div>
        <p class="cl-p cl-brief-note">RISA records what physically exists on the ground. It complements, rather than replaces, MIRA and rapid needs assessments.</p>
      </div>`);
    const back = doc('a4', `<div class="cl-brief cl-brief--back">
        <p class="eyebrow">How it works</p>
        <h2 class="cl-h2">Three inputs, one common operational picture.</h2>
        <div class="cl-services cl-services--rows">${INPUTS.map(([i, h, p, who]) => `<div><span class="cl-ico">${icon(i)}</span><b>${h}</b><p>${p} <em>${who}</em></p></div>`).join('')}</div>
        <ol class="cl-steps" role="list">${STEPS.map(([h, p], n) => `<li><span>${n + 1}</span><b>${h}</b><p>${p}</p></li>`).join('')}</ol>
        <div class="cl-readmap"><h3 class="cl-h3">Reading a RISA map</h3>
          ${['ok', 'partial', 'no'].map((st) => `<p><svg viewBox="0 0 60 14" aria-hidden="true">${S.routeLine('M2 7H58', st, 5)}</svg><svg viewBox="-13 -13 26 26" aria-hidden="true">${S.symbol('water', 0, 0, st)}</svg><span>${S.STATUS[st][0]}</span><small>${S.STATUS[st][1]}</small></p>`).join('')}
        </div>
        <div class="cl-brief-cols">
          <div><h3 class="cl-h3">When</h3><p class="cl-p"><b>Day 3–5</b> initial assessment after a site is set up. <b>+1 week</b> follow-up. Then updates as the site changes.</p></div>
          <div><h3 class="cl-h3">Used in</h3><p class="cl-p">Mozambique (SADC SIMEX) and the Venezuela earthquake response.</p></div>
        </div>
        <div class="cl-cta ${dividerCls()}"><b>Adopt RISA in your country</b><span>The toolbox and training are free. ${EMAIL}</span></div>
        <footer class="cl-brief-foot">${qr()}<div><b>Developed by</b><span>${WHO}</span><span>${URL}</span></div></footer>
      </div>`);
    return `
    <section class="sg-section" id="brief">
      <div class="container">
        <div class="sg-head"><span>01</span><h2>RISA in Brief</h2><p>The two-page advocacy note (A4, printed both sides) for partners, donors and national authorities. Front: what RISA is and the three questions. Back: how it works and how to adopt it.</p></div>
        <div class="cl-row cl-row--brief">
          ${fig(front, 'Front · A4')}
          ${fig(back, 'Back · A4')}
        </div>
      </div>
    </section>`;
  }

  // ---- 02 Slides -----------------------------------------------------------
  const sfoot = (n) => `<footer class="cl-sfoot">${logo()}<span>Training of Trainers · Module 1</span><b>${String(n).padStart(2, '0')}</b></footer>`;
  const SLIDES = [
    ['Title', () => doc('slide', cover({ eyebrow: 'Training of Trainers · Module 1', meta: 'Facilitator name · Durban · November 2026' }))],
    ['Agenda', () => doc('slide', `${tex(33)}<div class="cl-s cl-s--agenda">
        <div><p class="eyebrow">Agenda</p><h2 class="cl-h1">Today</h2></div>
        <ol class="cl-agenda" role="list">${['Why RISA', 'The three inputs', 'Six steps', 'Reading the product', 'SIMEX briefing', 'Handover'].map((t, i) => `<li><b>0${i + 1}</b><span>${t}</span></li>`).join('')}</ol>
      </div>${sfoot(2)}`)],
    ['Section divider', () => doc('slide', `${tex(12)}<div class="cl-s cl-s--divider"><b class="cl-num">01</b><div><h2 class="cl-h0">Why RISA</h2><p class="cl-lead">The first days decide the response. They’re also when we know least.</p></div></div>${sfoot(3)}`, dividerCls())],
    ['Three questions', () => doc('slide', `<div class="cl-s">
        <p class="eyebrow">What RISA answers</p><h2 class="cl-h1">Three questions, in the first days</h2>
        <div class="cl-cards cl-cards--3">${QUESTIONS.map(([i, h, p], n) => `<div class="cl-card"><span class="cl-ico">${icon(i)}</span><b>${n + 1}. ${h}</b><p>${p}</p></div>`).join('')}</div>
      </div>${sfoot(4)}`)],
    ['Content + map', () => doc('slide', `<div class="cl-s cl-s--two">
        <div><p class="eyebrow">The gap</p><h2 class="cl-h1">The tools exist. They arrive separately.</h2>
          <ul class="cl-bullets" role="list"><li>Access routes and site layouts are unknown or out of date.</li><li>Drone, satellite and field data come from different teams, at different times.</li><li>Surge teams leave, and the capacity leaves with them.</li></ul></div>
        <div class="cl-artbox">${art(12, { mode: 'map' })}</div>
      </div>${sfoot(5)}`)],
    ['Three inputs', () => doc('slide', `<div class="cl-s">
        <p class="eyebrow">The method</p><h2 class="cl-h1">Three inputs, one common operational picture</h2>
        <div class="cl-services cl-services--grid cl-services--3">${INPUTS.map(([i, h, p, who]) => `<div><span class="cl-ico">${icon(i)}</span><div><b>${h}</b><p>${p}</p><small>${who}</small></div></div>`).join('')}</div>
      </div>${sfoot(6)}`)],
    ['Timeline', () => doc('slide', `<div class="cl-s">
        <p class="eyebrow">Standard operating procedure</p><h2 class="cl-h1">Six steps, from preparation to updates</h2>
        <ol class="cl-timeline cl-timeline--6" role="list">${STEPS.map(([h, p], n) => `<li><i></i><span>Step ${n + 1}</span><b>${h}</b><p>${p}</p></li>`).join('')}</ol>
      </div>${sfoot(7)}`)],
    ['Big numbers', () => doc('slide', `${tex(40)}<div class="cl-s">
        <p class="eyebrow">At a glance</p><h2 class="cl-h1">Fast, light and open</h2>
        <div class="cl-bignums">${STATS.map(([b, s]) => `<div><b>${b}</b><span>${s}</span></div>`).join('')}</div>
        <p class="cl-src">From the RISA SOP v2 and Annex D. <span class="tbc">To be confirmed</span></p>
      </div>${sfoot(8)}`)],
    ['Full-bleed map', () => doc('slide', `<div class="cl-mapslide">${art(4, { mode: 'map', layers: 'roads,blocks,hazards,routes,services,labels' })}</div>
        <div class="cl-photo-cap"><p class="eyebrow">Exercise · 60 seconds</p><h2 class="cl-h2">Which routes can a truck use today?</h2>${keyRow()}</div>`)],
    ['SIMEX briefing', () => doc('slide', `<div class="cl-s cl-s--two">
        <div><p class="eyebrow">SIMEX · Scenario</p><h2 class="cl-h1">Floods, Riverside district. Day 0.</h2>
          <ul class="cl-bullets" role="list"><li>A new site has formed on the river terrace. About 1,900 people. <span class="tbc">Scenario</span></li><li>Your team has one ADAK kit, two enumerators and a laptop.</li><li>Produce page 1 by 16:00 tomorrow.</li></ul></div>
        <div class="cl-artbox">${art(9, { mode: 'ortho' })}</div>
      </div>${sfoot(10)}`)],
    ['Quote', () => doc('slide', `${tex(17)}<div class="cl-s cl-s--quote"><span class="cl-quote-mark" data-risa-logo="mark"></span><div><p class="cl-quote">${QUOTE}</p><p class="cl-lead">From the Venezuela earthquake response. <span class="tbc">Paraphrased, to confirm</span></p></div></div>${sfoot(11)}`, 'inverse')],
    ['Thank you', () => doc('slide', `<div class="cl-s cl-s--end">
        <div><h2 class="cl-h0">Thank you</h2><p class="cl-lead">Next: the SIMEX briefing pack.</p>
          <ul class="cl-endlist" role="list"><li>${icon('i-mail')} ${EMAIL}</li><li>${icon('i-link')} ${URL}</li><li>${icon('i-people')} ${WHO}</li></ul></div>
        <div class="cl-end-art">${art(5)}<span class="cl-end-logo">${logo('stacked', 'cl-logo cl-logo--stacked')}</span></div>
      </div>`)],
  ];

  function slides() {
    const main = SLIDES.map(([name, make], i) => `<div class="cl-slide" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${SLIDES.length}: ${name}">${make()}</div>`).join('');
    const thumbs = SLIDES.map(([name, make], i) => `<button class="cl-thumb" type="button" data-go="${i}" aria-label="Go to slide ${i + 1}: ${name}"><span aria-hidden="true">${make()}</span><small>${String(i + 1).padStart(2, '0')} ${name}</small></button>`).join('');
    return `
    <section class="sg-section sg-alt" id="slides">
      <div class="container">
        <div class="sg-head"><span>02</span><h2>Training slides</h2><p>A 16:9 template for Training of Trainers courses and SIMEX briefings, with ${SLIDES.length} layouts. Use the arrows, your keyboard or the thumbnails to flip through.</p></div>
        <div class="cl-carousel" tabindex="0" aria-roledescription="carousel" aria-label="Slide templates">
          <div class="cl-viewport"><div class="cl-track">${main}</div></div>
          <div class="cl-controls">
            <button class="cl-nav" type="button" data-step="-1" aria-label="Previous slide">←</button>
            <p class="cl-counter" aria-live="polite"></p>
            <button class="cl-nav" type="button" data-step="1" aria-label="Next slide">→</button>
            <button class="cl-all" type="button" aria-pressed="false">Show all</button>
          </div>
          <div class="cl-thumbs">${thumbs}</div>
        </div>
      </div>
    </section>`;
  }

  function wireCarousel(el) {
    const track = el.querySelector('.cl-track');
    const slidesEls = [...track.children];
    const thumbs = [...el.querySelectorAll('.cl-thumb')];
    const counter = el.querySelector('.cl-counter');
    const strip = el.querySelector('.cl-thumbs');
    let i = 0;
    const go = (n, user) => {
      i = (n + slidesEls.length) % slidesEls.length;
      track.style.transform = `translateX(${-100 * i}%)`;
      slidesEls.forEach((s, k) => { s.inert = k !== i; });
      thumbs.forEach((t, k) => t.setAttribute('aria-current', String(k === i)));
      counter.innerHTML = `<b>${String(i + 1).padStart(2, '0')}</b> / ${slidesEls.length} · ${SLIDES[i][0]}`;
      if (user) {
        const t = thumbs[i];
        strip.scrollTo({ left: t.offsetLeft - (strip.clientWidth - t.offsetWidth) / 2, behavior: 'smooth' });
      }
    };
    const all = el.querySelector('.cl-all');
    const setGrid = (on) => {
      el.classList.toggle('is-grid', on);
      all.setAttribute('aria-pressed', String(on));
      all.textContent = on ? 'Show as carousel' : 'Show all';
      slidesEls.forEach((s, k) => { s.inert = !on && k !== i; });
    };
    all.addEventListener('click', () => setGrid(!el.classList.contains('is-grid')));
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-step],[data-go]');
      if (!b) return;
      go(b.dataset.go !== undefined ? +b.dataset.go : i + +b.dataset.step, true);
    });
    el.addEventListener('keydown', (e) => {
      if (el.classList.contains('is-grid')) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); go(i + (e.key === 'ArrowRight' ? 1 : -1), true); }
    });
    let x0 = null;
    const vp = el.querySelector('.cl-viewport');
    vp.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
    vp.addEventListener('pointerup', (e) => {
      if (x0 !== null && Math.abs(e.clientX - x0) > 40) go(i + (e.clientX < x0 ? 1 : -1), true);
      x0 = null;
    });
    go(0);
    if (new URLSearchParams(location.search).get('slides') === 'all') setGrid(true);
  }

  // ---- 03 Events -----------------------------------------------------------
  const base = '<span class="cl-zone cl-zone--base" aria-hidden="true"><em>Stand base</em></span>';
  const rollups = [
    ['Statement', () => doc('rollup', cover({ orient: 'port', lead: false, meta: URL, seed: 8 }) + base)],
    ['The method', () => doc('rollup', `${tex(26)}<div class="cl-rollup">
        ${logo()}
        <div><p class="eyebrow">How it works</p><h2 class="cl-h1">Three inputs, one picture.</h2></div>
        <div class="cl-services cl-services--rows">${INPUTS.map(([i, h]) => `<div><span class="cl-ico">${icon(i)}</span><b>${h}</b></div>`).join('')}</div>
        <p class="cl-meta">${URL}</p>
      </div>${base}`)],
    ['Adopt RISA', () => doc('rollup', `${tex(17)}<div class="cl-rollup">
        ${logo()}
        <div><p class="eyebrow">For national authorities</p><h2 class="cl-h1">Run the next assessment yourselves.</h2></div>
        <ul class="cl-urls" role="list"><li><b>Toolbox</b><span>Forms, standards, layouts</span></li><li><b>Training</b><span>ToT and SIMEX</span></li><li><b>Support</b><span>Until you don’t need it</span></li></ul>
        <div class="cl-contact">${qr()}<div><b>Talk to us</b><span>${URL}</span></div></div>
      </div>${base}`, 'inverse')],
  ];
  const backdrop = () => doc('backdrop', cover({ lead: false, meta: `${URL} · ${EMAIL}`, seed: 3 }) + '<span class="cl-zone cl-zone--table" aria-hidden="true"><em>Hidden by the table (0.75 m)</em></span>');
  const table = () => doc('table', `<div class="cl-table${F.dark ? ' inverse' : ''}">${tex(29)}${logo()}<div class="cl-table-copy"><p>${F.hl.replace(/<[^>]+>/g, '')}</p><b>${URL}</b></div></div>`);

  function events() {
    const person = `<svg class="cl-person" viewBox="0 0 40 170" aria-hidden="true"><circle cx="20" cy="11" r="10"/><path d="M8 26h24c4 0 6 3 6 7v50c0 3-2 4-4 4h-2v78c0 3-2 5-5 5h-2l-5-70-5 70h-2c-3 0-5-2-5-5V87H6c-2 0-4-1-4-4V33c0-4 2-7 6-7z"/></svg>`;
    return `
    <section class="sg-section" id="events">
      <div class="container">
        <div class="sg-head"><span>03</span><h2>Workshops and events</h2><p>For the Durban workshop (November 2026) and HNPW 2027: three roll-up banners, a backdrop wall and a table front, then all of them together on a typical 5 m stand. Keep text above waist height and readable from 3 m away.</p></div>
        <div class="cl-row cl-row--rollups">${rollups.map(([n, make], i) => fig(make(), `Roll-up ${String.fromCharCode(65 + i)}: ${n} · 850 × 2000 mm`)).join('')}</div>
        <div class="cl-row cl-row--wall cl-gap">
          ${fig(backdrop(), 'Backdrop wall · 3000 × 2250 mm')}
          ${fig(table(), 'Table front · 1800 × 700 mm')}
        </div>
        ${fig(`<div class="cl-scene" aria-hidden="true">
            <div class="cl-s-backdrop">${backdrop()}</div>
            <div class="cl-s-roll cl-s-roll--l">${rollups[0][1]()}</div>
            <div class="cl-s-roll cl-s-roll--r">${rollups[1][1]()}</div>
            <div class="cl-s-table">${table()}<i></i></div>
            ${person}
            <span class="cl-floor"></span>
            <span class="cl-dim"><i></i>5.2 m</span>
          </div>`, 'Front elevation to scale, with a 1.7 m person. Confirm sizes with the printer and add 3 mm bleed.', 'cl-gap')}
      </div>
    </section>`;
  }

  // ---- 04 Field kit --------------------------------------------------------
  function kit() {
    const contents = ['DJI Mini 4 Pro, 3 batteries, spare propellers', 'Starlink Mini', 'Laptop and external drive', 'Tablet with KoboCollect', 'Radios × 2', 'Laser rangefinder', 'Hi-vis × 2', 'Power bank and solar panel', 'Field marking kit'];
    const caseLabel = doc('case', `<div class="cl-case">
        <header class="cl-case-top"><div><b>ADAK</b><span>Atlas Damage Assessment Kit</span></div><span class="cl-case-no">Kit<b>03</b>of 6</span></header>
        <div class="cl-case-body">
          <ul class="cl-case-list" role="list">${contents.map((c) => `<li><i></i>${c}</li>`).join('')}</ul>
          <div class="cl-case-side">
            <div class="cl-case-warn">${icon('i-alert')}<p><b>Before you travel</b>Unlock the DJI GEO zone. It needs a connection and is separate from the flight permit.</p></div>
            <div class="cl-contact">${qr()}<div><b>Annex D checklist</b><span>Pre-flight, in-flight, processing</span></div></div>
          </div>
        </div>
        <footer class="cl-case-foot">${logo()}<span>Property of HI/Atlas Logistique · If found, call +00 000 000 000</span></footer>
      </div>`);
    const idCard = doc('idcard', `<div class="cl-id">
        <header>${logo()}<span class="cl-id-nema"><i></i>National authority</span></header>
        <div class="cl-id-body"><span class="cl-id-photo" aria-hidden="true"></span>
          <div><small>RISA field team</small><b>Firstname Lastname</b><span>Enumerator · Team 2</span><code>ID RISA-07-014 · valid to 31/12/2026</code></div></div>
        <footer class="${dividerCls()}">Direct observation survey · Show this card on request</footer>
      </div>`);
    const tabard = doc('tabard', `<div class="cl-tabard"><span class="cl-tabard-band"></span><div class="cl-tabard-copy">${logo('stacked', 'cl-logo cl-logo--stacked')}<b>Assessment team</b></div><span class="cl-tabard-band"></span></div>`);
    const phone = doc('phone', `<div class="cl-phone">
        <header class="cl-phone-top">${logo('mark', 'cl-phone-mark')}<div><b>RISA site observation</b><span>v2 · Sample site 07</span></div></header>
        <div class="cl-phone-body">
          <p class="cl-phone-step">Group 4 of 9 · Water points</p>
          <label><b>Facility ID</b><span class="cl-phone-input">WP-03</span></label>
          <label><b>Is it working?</b><small>Observe. Don’t ask.</small></label>
          <div class="cl-phone-opts">${pill('ok', 'Working')}${pill('partial', 'Partly')}<span class="st-pill st-pill--no is-on">Not working</span>${pill('unknown', 'Can’t see')}</div>
          <label><b>Why?</b><span class="cl-phone-input">Pump damaged</span></label>
          <label><b>Location</b><span class="cl-phone-gps">${icon('i-pin')} −19.8312, 34.8761 · ±4 m</span></label>
        </div>
        <footer class="cl-phone-foot"><span>‹ Back</span><b>Next ›</b></footer>
      </div>`);
    return `
    <section class="sg-section sg-alt" id="kit">
      <div class="container">
        <div class="sg-head"><span>04</span><h2>Field kit</h2><p>Where the identity meets the field: the label on each ADAK case, the enumerator ID card, the back of a hi-vis tabard and the KoboCollect form header. These have to work in the sun, in the rain and on a photocopier.</p></div>
        <div class="cl-row cl-row--kit">
          ${fig(caseLabel, 'ADAK case lid label · 300 × 180 mm, weatherproof vinyl')}
          ${fig(idCard, 'Enumerator ID card · 85.6 × 54 mm')}
        </div>
        <div class="cl-row cl-row--kit2 cl-gap">
          ${fig(tabard, 'Hi-vis tabard, back · one-colour print on fluorescent yellow (EN ISO 20471), the same in every theme')}
          ${fig(phone, 'KoboCollect form · status choices use the reserved colours')}
        </div>
      </div>
    </section>`;
  }

  // ---- 05 More -------------------------------------------------------------
  function more() {
    const badge = doc('badge', `<span class="cl-slot" aria-hidden="true"></span>
      <div class="cl-badge">${logo()}<div><b>Firstname Lastname</b><span>MapAction · GIS Officer</span></div></div>
      <div class="cl-badge-band ${dividerCls()}">${tex(44)}<b>RISA workshop</b><span>Durban · Nov 2026</span></div>`);
    const post1 = doc('social', cover({ orient: 'port', lead: false, eyebrow: 'Durban · November 2026', hl: 'RISA comes to <em>SADC member states.</em>', seed: 7 }));
    const post2 = doc('social', `<div class="cl-post cl-post--map">
      <div class="cl-post-map">${art(4, { mode: 'ortho', view: 'zoom', layers: 'imagery,blocks,hazards,services' })}</div>
      <div class="cl-post-copy">${logo()}<h2 class="cl-h2">Drone imagery shows what satellites can’t.</h2><p class="cl-p">Latrines, water points and child-friendly spaces, mapped in days.</p></div></div>`);
    const cert = doc('sheet', `${tex(50)}<div class="cl-cert">
      <header>${logo()}<span class="cl-id-nema"><i></i>National authority</span></header>
      <div><p class="eyebrow">Certificate of completion</p><h2 class="cl-h0">Firstname Lastname</h2>
        <p class="cl-lead">has completed the RISA Training of Trainers course, including the SIMEX, and is qualified to train RISA field teams.</p>
        <p class="cl-cert-mods">${['Why RISA', 'Three inputs', 'Six steps', 'Reading the product', 'SIMEX', 'Handover'].map((m) => `<span>${m}</span>`).join('')}</p></div>
      <footer><div><b>Durban, November 2026</b><span>Course RISA-ToT-02</span></div><div class="cl-sign"><i></i><span>Lead facilitator</span></div><div class="cl-sign"><i></i><span>National authority</span></div></footer>
    </div>`);
    const sig = `<div class="cl-sig">
      <div class="cl-mail-head"><span>To: nema-focal-point@example.org</span><span>Subject: RISA toolbox after Durban</span></div>
      <p>Thanks for joining the session. I’ve attached RISA in Brief and the draft SOP.</p>
      <div class="cl-sig-block"><div><b>Firstname Lastname</b><span>Humanitarian Response Specialist, Kobo</span><span>name@kobotoolbox.org · +00 000 000 000</span></div>
        <div class="cl-sig-logo"><small>Working on</small>${logo()}</div></div>
    </div>`;
    return `
    <section class="sg-section" id="more">
      <div class="container">
        <div class="sg-head"><span>05</span><h2>Extras</h2><p>Small pieces: a workshop badge, social posts, a ToT certificate the national authority co-signs, and an email signature line partners can add under their own.</p></div>
        <div class="cl-row cl-row--more">
          ${fig(badge, 'Name badge · A6')}
          ${fig(post1, 'Event post · 1080 × 1080')}
          ${fig(post2, 'Imagery post · 1080 × 1080')}
        </div>
        ${fig(cert, 'ToT certificate · A4 landscape', 'cl-gap cl-cert-fig')}
        ${fig(sig, 'Email signature under a partner’s own signature', 'cl-gap cl-sig-fig')}
      </div>
    </section>`;
  }

  const intro = () => `
    <header class="sg-intro">
      <div class="container">
        <p class="sg-kicker">Theme ${theme.letter} · Collateral</p>
        <h1>${theme.name} in print, training and the field</h1>
        <p class="sg-lede">The same identity on the advocacy brief, a training deck, a workshop stand and the kit a field team carries.</p>
        <div class="sg-intro-grid">
          <div><h2>About these mock-ups</h2><p>Layouts are drafts to compare direction, not print-ready files. All names, figures, the web address and email are placeholders. Change the logo in the review bar and every piece updates.</p></div>
          <div><h2>Also for ${theme.name}</h2><p><a class="link-arrow" href="index.html">Home page ${icon('i-arrow')}</a></p><p style="margin-top:.6rem"><a class="link-arrow" href="product.html">The product ${icon('i-arrow')}</a></p><p style="margin-top:.6rem"><a class="link-arrow" href="style-guide.html">Style guide ${icon('i-arrow')}</a></p></div>
        </div>
      </div>
    </header>`;

  function init() {
    const cl = document.getElementById('cl');
    cl.innerHTML = intro() + brief() + slides() + events() + kit() + more();
    window.RISAGraphics.hydrate(cl);
    S.hydrate(cl);
    cl.querySelectorAll('.cl-carousel').forEach(wireCarousel);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
