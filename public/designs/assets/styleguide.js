/*
 * Generic style guide. Renders into <main id="sg"> using the current theme's
 * tokens.css + theme.css, so every theme gets the same structure while the
 * colours, type and components are its own. The status colours and map
 * symbology sections are shared: they are the same in every theme.
 */
(function () {
  const body = document.body;
  const root = body.dataset.root || '../../';
  const theme = window.RISAThemes.find((t) => t.id === body.dataset.themeId);
  const icon = (id) => `<svg aria-hidden="true"><use href="${root}assets/icons.svg#${id}"/></svg>`;
  const S = window.RISASite;

  // ---- colour helpers ------------------------------------------------------
  const probe = document.createElement('i');
  function resolve(token, scope) {
    probe.style.color = `var(${token})`;
    (scope || document.getElementById('sg')).appendChild(probe);
    const rgb = getComputedStyle(probe).color.match(/[\d.]+/g).slice(0, 3).map(Number);
    probe.remove();
    return rgb;
  }
  const hex = (rgb) => '#' + rgb.map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase();
  const lum = (rgb) => {
    const [r, g, b] = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const grade = (c) => (c >= 7 ? 'AAA' : c >= 4.5 ? 'AA' : c >= 3 ? 'AA Large' : 'Fail');

  function badge(fg, bg, label) {
    const c = contrast(fg, bg);
    return `<span class="sg-contrast is-${grade(c).replace(' ', '-').toLowerCase()}" title="${label}: ${c.toFixed(2)}:1">
      <b style="color:${hex(fg)};background:${hex(bg)}">Aa</b>${label} ${c.toFixed(1)} · ${grade(c)}</span>`;
  }

  // ---- sections ------------------------------------------------------------
  const intro = () => `
    <header class="sg-intro">
      <div class="container">
        <p class="sg-kicker">Theme ${theme.letter} · Style guide</p>
        <h1>${theme.name}</h1>
        <p class="sg-lede">${theme.tagline}</p>
        <div class="sg-intro-grid">
          <div><h2>Colour and type logic</h2><p>${theme.blend}</p></div>
          <div><h2>Best for</h2><p>${theme.bestFor}</p>
            <p style="margin-top:1.2rem"><a class="link-arrow" href="index.html">View the ${theme.name} home page ${icon('i-arrow')}</a></p>
            <p style="margin-top:.6rem"><a class="link-arrow" href="product.html">The three-page product ${icon('i-arrow')}</a></p>
            <p style="margin-top:.6rem"><a class="link-arrow" href="collateral.html">Brief, slides, events and field kit ${icon('i-arrow')}</a></p></div>
        </div>
      </div>
    </header>`;

  const owners = '<span class="sg-cobrand-members"><small>Developed by</small><b>HI/Atlas Logistique</b><b>MapAction</b><b>Kobo</b></span>';
  const logo = () => `
    <section class="sg-section" id="logo">
      <div class="container">
        <div class="sg-head"><span>01</span><h2>Logo</h2><p class="sg-logo-meta"></p></div>
        <div class="sg-logo-grid">
          <figure class="sg-tile sg-tile--wide"><div class="sg-stage"><span data-risa-logo="horizontal" style="font-size:30px"></span></div><figcaption>Primary: horizontal lockup with the full name</figcaption></figure>
          <figure class="sg-tile"><div class="sg-stage"><span data-risa-logo="stacked" style="font-size:22px"></span></div><figcaption>Stacked</figcaption></figure>
          <figure class="sg-tile"><div class="sg-stage inverse"><span data-risa-logo="horizontal" style="font-size:20px"></span></div><figcaption>Reversed on dark</figcaption></figure>
          <figure class="sg-tile"><div class="sg-stage sg-mono"><span data-risa-logo="horizontal" style="font-size:20px"></span></div><figcaption>One colour: photocopies, stamps and map margins</figcaption></figure>
          <figure class="sg-tile"><div class="sg-stage sg-grey"><span data-risa-logo="horizontal" style="font-size:20px"></span></div><figcaption>Full colour printed in greyscale</figcaption></figure>
          <figure class="sg-tile"><div class="sg-stage sg-sizes">
              <span class="sg-mark" data-risa-logo="mark" style="width:64px;height:64px"></span>
              <span class="sg-mark" data-risa-logo="mark" style="width:40px;height:40px"></span>
              <span class="sg-mark" data-risa-logo="mark" style="width:24px;height:24px"></span>
              <span class="sg-mark" data-risa-logo="mark" style="width:16px;height:16px"></span>
            </div><figcaption>Mark only: 64 / 40 / 24 / 16 px (16 px minimum)</figcaption></figure>
          <figure class="sg-tile"><div class="sg-stage sg-on-imagery"><div class="sg-imagery" data-graphic="site" data-mode="ortho" data-layers="imagery,blocks"></div><span class="sg-chip-logo" data-risa-logo="horizontal" style="font-size:16px"></span></div><figcaption>On imagery: always on a solid panel</figcaption></figure>
          <figure class="sg-tile"><div class="sg-stage sg-appicons">
              <span class="sg-app inverse"><span data-risa-logo="mark"></span></span>
              <span class="sg-app sg-app--light"><span data-risa-logo="mark"></span></span>
              <span class="sg-app sg-app--round inverse"><span data-risa-logo="mark"></span></span>
            </div><figcaption>App icon, favicon and social avatar</figcaption></figure>
          <figure class="sg-tile sg-tile--full"><div class="sg-stage sg-cobrand">
              <span data-risa-logo="horizontal" style="font-size:22px"></span>${owners}
            </div><figcaption>Endorsement: on the website, toolbox and training material, the three owners are named to the right, divided by a rule and given equal weight</figcaption></figure>
          <figure class="sg-tile sg-tile--full"><div class="sg-stage sg-nema">
              <span class="sg-nema-logo" aria-label="Placeholder for a national authority logo"><i></i><b>National Disaster<br>Management Authority</b></span>
              <span class="sg-nema-with"><small>Produced with the</small><span data-risa-logo="horizontal" style="font-size:15px"></span></span>
              <span class="sg-nema-partners"><small>Technical support</small><b>HI/Atlas Logistique · MapAction · Kobo</b></span>
            </div><figcaption>Handover: on products made by a national team, the authority’s logo leads and RISA appears as the method used. Partners are credited only if they supported the deployment.</figcaption></figure>
        </div>
        <ul class="sg-rules">
          <li><b>Do</b> use the full-colour logo on the page background or the primary dark colour.</li>
          <li><b>Do</b> use the one-colour version on photocopies, stamps and in map margins.</li>
          <li><b>Don’t</b> recolour the mark with status colours (red, amber, green). They are reserved for the map.</li>
          <li><b>Don’t</b> make RISA bigger than a national authority’s logo when they’re shown together.</li>
        </ul>
      </div>
    </section>`;

  function colour() {
    const cards = theme.swatches.map(([token, name, role]) => `
      <div class="sg-swatch" data-token="${token}">
        <div class="sg-chip" style="background:var(${token})"></div>
        <div class="sg-swatch-body"><b>${name}</b><code class="sg-hex"></code><code>${token}</code><p>${role}</p><div class="sg-badges"></div></div>
      </div>`).join('');
    const logoChips = ['a', 'b', 'c', 'd'].map((k) => `<span class="sg-logo-chip" data-token="--logo-${k}"><i style="background:var(--logo-${k})"></i><code></code></span>`).join('');
    return `
    <section class="sg-section sg-alt" id="colour">
      <div class="container">
        <div class="sg-head"><span>02</span><h2>Colour</h2><p>Brand colours live in the frame: headers, titles, the website. Contrast is checked live (WCAG 2.1) against the page background and white. Body text needs AA (4.5:1); large text and UI elements need 3:1.</p></div>
        <div class="sg-swatches">${cards}</div>
        <div class="sg-logo-colours"><h3>Logo colours</h3><div>${logoChips}</div><p>Most concepts use only the first two. The others are for the few marks that need supporting tones.</p></div>
        <div class="sg-ratio"><h3>Suggested proportion</h3><div class="sg-ratio-bar">
          <i style="flex:60;background:var(--c-bg)"></i><i style="flex:18;background:var(--c-surface)"></i><i style="flex:14;background:var(--c-primary)"></i><i style="flex:6;background:var(--c-accent)"></i><i style="flex:2;background:var(--c-accent-2)"></i></div>
          <p>Mostly white and stone, navy for structure, and the accent for the few things that should be clicked.</p></div>
      </div>
    </section>`;
  }

  // Shared across themes: the reserved status set.
  function status() {
    const rows = [
      ['--st-ok', 'Open / working', 'Access route open to all vehicles. Service fully working.', 'Solid line · filled symbol'],
      ['--st-partial', 'Restricted / partly working', 'Light vehicles only, debris, congestion. Service partly working or overloaded.', 'Dashed line · half-filled symbol'],
      ['--st-no', 'Closed / not working', 'Route cut, flooded or unsafe. Service not working or destroyed.', 'Dotted line · crossed-out symbol'],
      ['--st-unknown', 'Not assessed', 'Not yet visited or not visible in imagery.', 'Grey outline'],
    ];
    return `
    <section class="sg-section" id="status">
      <div class="container">
        <div class="sg-head"><span>03</span><h2>Status colours</h2><p><b>The same in every theme, and never used for branding.</b> A coordinator should be able to read status on any RISA product, made by anyone, without the legend. Status is always shown twice, by colour and by line style or symbol, so it still works in greyscale and for people with colour-vision differences.</p></div>
        <div class="sg-status">
          ${rows.map(([t, name, use, code], i) => `<div class="sg-status-row">
            <i class="sg-status-chip" style="background:var(${t})"></i>
            <div><b>${name}</b><code class="sg-hex" data-token="${t}"></code><code>${t}</code><p>${use}</p></div>
            <svg viewBox="0 0 120 30" class="sg-status-line" aria-hidden="true">${S.routeLine('M4 15H116', ['ok', 'partial', 'no', 'unknown'][i], 7)}</svg>
            <svg viewBox="-16 -16 32 32" class="sg-status-sym" aria-hidden="true">${S.symbol('water', 0, 0, ['ok', 'partial', 'no', 'unknown'][i], 1.15)}</svg>
            <span class="sg-status-code">${code}</span>
          </div>`).join('')}
        </div>
        <div class="sg-status-tests">
          <figure class="sg-tile"><div class="sg-stage sg-map-stage"><div data-graphic="site" data-layers="roads,blocks,routes,services"></div></div><figcaption>As printed</figcaption></figure>
          <figure class="sg-tile"><div class="sg-stage sg-map-stage sg-grey"><div data-graphic="site" data-layers="roads,blocks,routes,services"></div></div><figcaption>Greyscale photocopy: line style and symbol shape still carry the status</figcaption></figure>
          <figure class="sg-tile"><div class="sg-stage sg-map-stage sg-deutan"><div data-graphic="site" data-layers="roads,blocks,routes,services"></div></div><figcaption>Simulated deuteranopia (red-green colour blindness)</figcaption></figure>
        </div>
        <svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="sg-deutan" color-interpolation-filters="linearRGB"><feColorMatrix type="matrix" values="0.367 0.861 -0.228 0 0  0.280 0.673 0.047 0 0  -0.012 0.043 0.969 0 0  0 0 0 1 0"/></filter></svg>
      </div>
    </section>`;
  }

  const type = () => {
    const f = theme.fonts;
    return `
    <section class="sg-section sg-alt" id="type">
      <div class="container">
        <div class="sg-head"><span>04</span><h2>Typography</h2><p>Headings: <b>${f.head}</b>. Body: <b>${f.body}</b>.${f.mono ? ` Map labels, coordinates and data: <b>${f.mono}</b>.` : ''} All free on Google Fonts, and installable offline for QGIS layouts.</p></div>
        <div class="sg-type">
          <div class="sg-type-row"><code>Display · 56–72</code><p class="sg-t-display">Know what’s on the ground</p></div>
          <div class="sg-type-row"><code>H2 · 40</code><h2 class="sg-t-h2">Three inputs, one picture</h2></div>
          <div class="sg-type-row"><code>H3 · 24</code><h3 class="sg-t-h3">Water points: 2 of 5 working</h3></div>
          <div class="sg-type-row"><code>Eyebrow</code><p class="eyebrow">Initial assessment · Day 4</p></div>
          <div class="sg-type-row"><code>Lead · 20</code><p class="sg-t-lead">RISA turns drone imagery and direct field observation into one operational map of a displacement site.</p></div>
          <div class="sg-type-row"><code>Body · 17</code><p class="sg-t-body">Route R2 is washed out 2 km north of the site, so the north gate can’t be used. All deliveries should use R1 from the logistics hub, light vehicles only until the debris at the west gate is cleared.</p></div>
          <div class="sg-type-row"><code>Map label · mono</code><p class="sg-t-mono">WP-03 · water point · not working · 14:20 28/10/2026 · grid F4</p></div>
          <div class="sg-type-row"><code>Small · 14</code><p class="sg-t-small">Source: drone orthomosaic, 120 m AGL, 4.3 cm/px, 27/10/2026. Field observation, KoboCollect, n = 46 points.</p></div>
        </div>
      </div>
    </section>`;
  };

  const components = () => `
    <section class="sg-section" id="components">
      <div class="container">
        <div class="sg-head"><span>05</span><h2>Components</h2><p>The same building blocks power every theme. Only the tokens and a few details change.</p></div>
        <div class="sg-comp-grid">
          <div class="sg-comp"><h3>Buttons</h3><div class="sg-row">
            <a class="btn btn--primary" href="#components">Get the toolbox ${icon('i-arrow')}</a>
            <a class="btn btn--secondary" href="#components">See the product</a>
            <a class="btn btn--ghost" href="#components">Learn more</a></div>
            <div class="sg-row inverse sg-dark-strip">
            <a class="btn btn--primary" href="#components">On dark ${icon('i-arrow')}</a>
            <a class="btn btn--secondary" href="#components">Secondary</a></div></div>
          <div class="sg-comp"><h3>Tags, status and links</h3><div class="sg-row">
            <span class="tag">Draft v2</span><span class="tag tag--soft">In progress</span><span class="tag">Annex D</span></div>
            <div class="sg-row"><span class="st-pill st-pill--ok">Open</span><span class="st-pill st-pill--partial">Restricted</span><span class="st-pill st-pill--no">Closed</span><span class="st-pill st-pill--unknown">Not assessed</span></div>
            <div class="sg-row"><a class="link-arrow" href="#components">Read the SOP ${icon('i-arrow')}</a></div></div>
          <div class="sg-comp"><h3>Form</h3>
            <label class="sg-label">Organisation<input class="input" placeholder="National authority or partner"></label>
            <label class="sg-label">What do you need?<textarea class="input" rows="2" placeholder="Scoping, training, a deployment"></textarea></label></div>
          <div class="sg-comp"><h3>Key finding</h3>
            <article class="card sg-finding"><span class="st-pill st-pill--no">Priority 1</span><h3>Blocks B1 and B2 are flooded</h3><p>About 300 people. Two latrine blocks and one water point are not working. Relocate to the higher ground east of B4.</p></article></div>
          <div class="sg-comp sg-comp--wide"><h3>Icons</h3><div class="sg-icons">
            ${['i-drone', 'i-satellite', 'i-form', 'i-layers', 'i-map', 'i-road', 'i-drop', 'i-health', 'i-people', 'i-pin', 'i-clock', 'i-alert', 'i-check', 'i-handover', 'i-download', 'i-print', 'i-eye', 'i-shield'].map((i) => `<span>${icon(i)}<code>${i.slice(2)}</code></span>`).join('')}
            </div><p class="sg-note">1.7 px outline icons on a 24 px grid, in the text colour, for the website and documents. Map symbols are separate (see Map symbology).</p></div>
        </div>
      </div>
    </section>`;

  // Shared across themes: map symbology.
  function symbology() {
    const T = S.TYPES;
    const types = Object.keys(T);
    return `
    <section class="sg-section sg-alt" id="symbology">
      <div class="container">
        <div class="sg-head"><span>06</span><h2>Map symbology</h2><p>One symbol set for every product. Each service is a letter in a circle, so it can be written by hand on a printout. The final set will follow the OCHA humanitarian icons and the GIS standards in Annex B. <span class="tbc">Draft</span></p></div>
        <div class="sg-symbols">
          <table class="sg-sym-table">
            <thead><tr><th scope="col">Service</th><th scope="col">Working</th><th scope="col">Partly</th><th scope="col">Not working</th><th scope="col">Not assessed</th></tr></thead>
            <tbody>${types.map((t) => `<tr><th scope="row"><b>${T[t][1]}</b><code>${T[t][0]}</code></th>${['ok', 'partial', 'no', 'unknown'].map((st) => `<td><svg viewBox="-15 -15 30 30" aria-label="${T[t][1]}, ${S.STATUS[st][0]}">${S.symbol(t, 0, 0, st)}</svg></td>`).join('')}</tr>`).join('')}</tbody>
          </table>
          <div class="sg-sym-other">
            <h3>Routes</h3>
            ${['ok', 'partial', 'no'].map((st) => `<p><svg viewBox="0 0 90 20" aria-hidden="true">${S.routeLine('M3 10H87', st, 6)}</svg><span>${S.STATUS[st][0].split(' / ')[0]}</span></p>`).join('')}
            <h3>Hazards</h3>
            <p><i class="sg-hz sg-hz--flood"></i><span>Flooded area</span></p>
            <p><i class="sg-hz sg-hz--debris"></i><span>Debris</span></p>
            <p><svg viewBox="-16 -16 32 22" aria-hidden="true"><g class="sm-choke"><path d="M0 -15 L14 10 L-14 10 Z"/><text y="7" text-anchor="middle">!</text></g></svg><span>Choke point</span></p>
            <h3>Site</h3>
            <p><svg viewBox="-10 -10 20 20" aria-hidden="true"><g class="sm-gate"><rect x="-6" y="-6" width="12" height="12" transform="rotate(45)"/></g></svg><span>Gate</span></p>
            <p><svg viewBox="-19 -19 38 38" aria-hidden="true"><g class="sm-lz"><circle r="16"/><text y="6" text-anchor="middle">H</text></g></svg><span>Landing zone</span></p>
            <p><i class="sg-tent"></i><span>Shelter</span></p>
          </div>
        </div>
      </div>
    </section>`;
  }

  const graphics = () => `
    <section class="sg-section" id="graphics">
      <div class="container">
        <div class="sg-head"><span>07</span><h2>Graphics</h2><p>Real maps and imagery are the identity: no stock photography. These are generated from one fictional sample site, so every mock-up shows the same place. Use real imagery from deployments only with the national authority’s agreement.</p></div>
        <div class="sg-graphics">
          <figure class="sg-tile"><div class="sg-stage sg-map-stage"><div data-graphic="site"></div></div><figcaption>The operational map</figcaption></figure>
          <figure class="sg-tile"><div class="sg-stage sg-map-stage"><div data-graphic="site" data-mode="ortho"></div></div><figcaption>The same site on drone imagery</figcaption></figure>
          <figure class="sg-tile"><div class="sg-stage sg-map-stage"><div data-graphic="site" data-mode="ortho" data-view="zoom" data-layers="imagery,blocks,roads,furniture"></div></div><figcaption>Imagery close-up, without overlays</figcaption></figure>
          <figure class="sg-tile"><div class="sg-stage inverse sg-contours"><div data-graphic="contours" data-seed="3" data-levels="9"></div></div><figcaption>Contour texture for quiet backgrounds</figcaption></figure>
        </div>
      </div>
    </section>`;

  const voice = () => `
    <section class="sg-section sg-alt" id="voice">
      <div class="container">
        <div class="sg-head"><span>08</span><h2>Voice</h2><p>How RISA sounds, whichever theme is chosen.</p></div>
        <div class="sg-voice">
          <div><h3>Operational first</h3><p>Lead with the decision: “Use R1. R2 is washed out.” Then the evidence. A coordinator should be able to brief from any page.</p></div>
          <div><h3>Observed, not estimated</h3><p>Say what was seen, where and when. “WP-03 not working, observed 14:20.” Mark anything not checked on the ground.</p></div>
          <div><h3>Plain words</h3><p>Write acronyms out on first use (UNDAC, NEMA, SIMEX). Say “map of the site”, not “geospatial intelligence product”.</p></div>
          <div><h3>Theirs to run</h3><p>Write for the national team that will run the next deployment. Name the authority first and the method second.</p></div>
        </div>
      </div>
    </section>`;

  // ---- render --------------------------------------------------------------
  function fillColours() {
    const sg = document.getElementById('sg');
    const bg = resolve('--c-bg'), white = [255, 255, 255];
    sg.querySelectorAll('.sg-swatch').forEach((el) => {
      const rgb = resolve(el.dataset.token);
      el.querySelector('.sg-hex').textContent = hex(rgb);
      const sameAsBg = hex(rgb) === hex(bg);
      el.querySelector('.sg-badges').innerHTML = (sameAsBg ? badge(resolve('--c-ink'), rgb, 'Ink on it') : badge(rgb, bg, 'On bg')) + badge(rgb, white, 'On white');
    });
    sg.querySelectorAll('.sg-logo-chip').forEach((el) => { el.querySelector('code').textContent = hex(resolve(el.dataset.token)); });
    sg.querySelectorAll('.sg-status .sg-hex').forEach((el) => { el.textContent = hex(resolve(el.dataset.token)); });
  }

  function logoMeta(id) {
    const l = window.RISALogos.byId[id];
    const el = document.querySelector('.sg-logo-meta');
    if (l && el) el.innerHTML = `<b>Logo ${l.num} · ${l.name}.</b> ${l.rationale} <a href="${root}logos/index.html">Compare all logos</a>`;
  }

  function init() {
    const sg = document.getElementById('sg');
    sg.innerHTML = intro() + logo() + colour() + status() + type() + components() + symbology() + graphics() + voice();
    fillColours();
    window.RISAGraphics.hydrate(sg);
    S.hydrate(sg);
    logoMeta(theme.defaultLogo);
  }
  document.addEventListener('risa:logo', (e) => logoMeta(e.detail));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
