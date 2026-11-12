import type { ReactNode } from 'react';
import { site } from '../../lib/content';
import { routeLine, siteSummary, symbol, TYPES, type ServiceType } from '../../lib/sitemap';
import type { Status } from '../../lib/status';
import { Logo } from './Logo';
import { Qr } from './Qr';
import { SiteMap } from './SiteMap';
import { StatusPill } from './Status';
import classes from './Product.module.css';

/*
 * The RISA product on the fictional sample site: page 1 the map, page 2 the
 * key findings, page 3 the hotspot. Ported from public/designs/assets/product.js
 * and updated to SOP v3 §2.5: the printed map carries a QR code to the online
 * view (the source of truth) and one to the feedback form, and counts of
 * features. Every page is A-series landscape and scales with its width.
 * All the numbers come from the sample site's data (src/lib/sitemap.ts).
 */

const D = siteSummary();
const fmt = (n: number) => n.toLocaleString('en-GB');
const SITE = 'Sample site 07';
const PLACE = 'Riverside district · Fictional data';
const DATE = '28/10/2026 14:00';
const VERSION = 'Initial assessment · Day 4 · v1.0';
const SOURCES =
  'Imagery: drone orthomosaic, 27/10/2026. Field data: KoboCollect direct observation, 46 points, 27–28/10/2026. Base: OpenStreetMap contributors.';
const DISCLAIMER = 'The boundaries and names shown on this map do not imply official endorsement or acceptance.';
// The feedback QR code carries the site, product and version, as the dashboard's FEEDBACK_URL does.
const FEEDBACK = 'https://risa.kobolabs.dev/feedback?site=sample-07&product=initial&version=1.0';

const svc = (type: ServiceType) => D.byType[type] ?? { ok: 0, partial: 0, no: 0, unknown: 0 };
const total = (c: Record<Status, number>) => c.ok + c.partial + c.no + c.unknown;
const water = svc('water');
const latrine = svc('latrine');
const named = D.routes.filter(([, label]) => label);
const routesOpen = named.filter(([, , , st]) => st === 'ok').length;

const Svg = ({ viewBox, html, className }: { viewBox: string; html: string; className?: string }) => (
  <svg viewBox={viewBox} aria-hidden className={className} dangerouslySetInnerHTML={{ __html: html }} />
);

function Doc({ n, title, children, foot }: { n: 1 | 2 | 3; title: string; children: ReactNode; foot?: string }) {
  return (
    <div className={classes.doc}>
      <div className={`${classes.page} risa-sitemap`} data-page={n}>
        <header className={classes.band}>
          {/* The national authority leads; RISA is credited as the method. */}
          <span className={classes.nema}>
            <i aria-hidden />
            <b>
              National Disaster
              <br />
              Management Authority
            </b>
          </span>
          <div>
            <p className={classes.bandTitle}>{title}</p>
            <p className={classes.bandSite}>
              {SITE} · {PLACE}
            </p>
          </div>
          <div className={classes.bandMeta}>
            <b>{VERSION}</b>
            <span>{DATE}</span>
            <span>Page {n} of 3</span>
          </div>
        </header>
        {children}
        <footer className={classes.foot}>
          <p className={classes.src}>
            {SOURCES} {foot}
          </p>
          <div className={classes.credit}>
            <small>Produced with the</small>
            <span className={classes.logo}>
              <Logo />
            </span>
          </div>
          <div className={classes.credit}>
            <small>Technical support</small>
            <b>{site.partners.map((p) => p.name).join(' · ')}</b>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className={classes.legend}>
      <h3>Access routes</h3>
      {(['ok', 'partial', 'no'] as Status[]).map((st) => (
        <p key={st}>
          <Svg viewBox="0 0 60 14" html={routeLine('M2 7H58', st, 5)} />
          {{ ok: 'Passable', partial: 'Restricted', no: 'Blocked', unknown: '' }[st]}
        </p>
      ))}
      <h3>Services</h3>
      <div className={classes.legendSym}>
        {(Object.entries(TYPES) as [ServiceType, [string, string]][]).map(([k, [, name]]) => (
          <p key={k}>
            <Svg viewBox="-13 -13 26 26" html={symbol(k, 0, 0, 'ok')} />
            {name}
          </p>
        ))}
      </div>
      <p className={classes.legendSt}>
        {(['ok', 'partial', 'no', 'unknown'] as Status[]).map((st) => (
          <span key={st}>
            <Svg viewBox="-13 -13 26 26" html={symbol('water', 0, 0, st)} />
            {{ ok: 'Working', partial: 'Partly', no: 'Not working', unknown: "Can't see" }[st]}
          </span>
        ))}
      </p>
      <h3>Hazards and site</h3>
      <p>
        <i className={classes.flood} />
        Flooded area · <i className={classes.debris} />
        Debris
      </p>
      <p>
        <Svg viewBox="-16 -16 32 28" html='<g class="sm-choke"><path d="M0 -15 L14 10 L-14 10 Z"/><text y="7" text-anchor="middle">!</text></g>' />
        Choke point · <i className={classes.tent} />
        Shelter
      </p>
    </div>
  );
}

/** Page 1: the whole site, with counts, the key message and the two QR codes. */
export function ProductMap() {
  const counts: [string, string, boolean?][] = [
    [fmt(D.pop.shelters), 'shelters, counted on imagery'],
    [`${water.ok} of ${total(water)}`, 'water points working'],
    [`${latrine.ok} of ${total(latrine)}`, 'latrine blocks working'],
    [`${routesOpen} of ${named.length}`, 'access routes passable'],
    [fmt(D.pop.people), 'people (estimate)', true],
  ];
  return (
    <Doc n={1} title="Common Operational Picture" foot={DISCLAIMER}>
      <div className={classes.p1}>
        <div className={classes.map}>
          <SiteMap fit="meet" />
        </div>
        <aside className={classes.side}>
          <div className={classes.keyMsg}>
            <h3>Key message</h3>
            <p>Blocks B1 and B2 are flooded. Use R1 (light vehicles) or R3. R2 and R4 are blocked.</p>
          </div>
          <div className={classes.glance}>
            {counts.map(([b, s, tbc]) => (
              <div key={s}>
                <b>{b}</b>
                <span>
                  {s}
                  {tbc && <em className={classes.tbc}> Estimate</em>}
                </span>
              </div>
            ))}
          </div>
          <Legend />
          <div className={classes.qrs}>
            <figure>
              <Qr value={site.dashboardUrl} label="QR code: the online view" />
              <figcaption>
                <b>Online view</b> The latest data. This print may be out of date.
              </figcaption>
            </figure>
            <figure>
              <Qr value={FEEDBACK} label="QR code: give feedback on this map" />
              <figcaption>
                <b>Feedback</b> Was this map useful? Tell us.
              </figcaption>
            </figure>
          </div>
        </aside>
      </div>
    </Doc>
  );
}

const GAPS: [Status, string, string, string][] = [
  ['no', 'Flooding in blocks B1 and B2', 'About 300 people in standing water. Relocate to the higher ground east of B4.', 'Site management · CCCM'],
  ['no', 'Water: 2 of 5 points not working', 'WP-03 and WP-05 are dry or flooded. Truck water to B1–B3 until repaired.', 'WASH cluster'],
  ['partial', 'Sanitation in the south of the site', 'LT-03 and LT-05 are flooded and overflowing. Close them and add temporary latrines in A1.', 'WASH cluster'],
  ['partial', 'West gate access', 'Debris on the last 80 m of R1. Clearing it reopens the site to trucks.', 'Logistics cluster'],
];

/** Page 2: the three questions, one column each. */
export function ProductFindings() {
  const per = D.pop.perBlock ?? {};
  const max = Math.max(...Object.values(per), 1);
  return (
    <Doc n={2} title="Key findings">
      <div className={classes.p2}>
        <section className={classes.q}>
          <h3 className={classes.qTitle}>
            <span>1</span>Can we reach people?
          </h3>
          <p className={classes.verdict}>
            <StatusPill status="partial" kind="access" /> {routesOpen} of {named.length} access routes passable
          </p>
          <ul className={classes.routes}>
            {D.routes.map(([id, label, , st, note]) => (
              <li key={id}>
                <StatusPill status={st} kind="access" />
                <b>{label || 'R1'}</b>
                <span>{note}</span>
              </li>
            ))}
          </ul>
          <div className={classes.callout}>
            <b>Use R3 from the east</b> for trucks until the west gate is cleared.
          </div>
          <h4 className={classes.h4}>Logistics conditions</h4>
          <ul className={classes.logs}>
            <li>
              <StatusPill status="ok" />
              <b>Storage</b>
              <span>WH-01 at the logistics hub, about 400 m² of dry space</span>
            </li>
            <li>
              <StatusPill status="ok" kind="access" />
              <b>Landing zone</b>
              <span>East of the site, firm ground, no obstructions</span>
            </li>
            <li>
              <StatusPill status="partial" kind="access" />
              <b>West gate</b>
              <span>Choke point: single lane, queues at distribution times</span>
            </li>
            <li>
              <StatusPill status="unknown" />
              <b>Fuel</b>
              <span>No supply seen on site</span>
            </li>
          </ul>
        </section>
        <section className={classes.q}>
          <h3 className={classes.qTitle}>
            <span>2</span>Which services still work?
          </h3>
          <table className={classes.svc}>
            <thead>
              <tr>
                <th scope="col">Service</th>
                <th scope="col">Total</th>
                <th scope="col">Working</th>
                <th scope="col">Partly</th>
                <th scope="col">Not</th>
              </tr>
            </thead>
            <tbody>
              {(Object.entries(TYPES) as [ServiceType, [string, string]][])
                .filter(([k]) => D.byType[k])
                .map(([k, [, name]]) => {
                  const c = svc(k);
                  return (
                    <tr key={k}>
                      <th scope="row">{name}</th>
                      <td>{total(c)}</td>
                      <td data-status="ok">{c.ok || '–'}</td>
                      <td data-status="partial">{c.partial || '–'}</td>
                      <td data-status="no">{c.no || '–'}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <h4 className={classes.h4}>
            Shelters by block <small>counted on imagery</small>
          </h4>
          <div className={classes.blocks}>
            {Object.entries(per).map(([b, n]) => (
              <div key={b} data-hot={b === 'B1' || b === 'B2' || undefined}>
                <span>{b}</span>
                <i style={{ '--v': `${(n / max) * 100}%` } as React.CSSProperties} />
                <b>{n}</b>
              </div>
            ))}
          </div>
          <p className={classes.pop}>
            <b>{fmt(D.pop.people)}</b> people · <b>{fmt(D.pop.households)}</b> households <em className={classes.tbc}>Estimate</em>
          </p>
        </section>
        <section className={`${classes.q} ${classes.gapsCol}`}>
          <h3 className={classes.qTitle}>
            <span>3</span>Where do we act first?
          </h3>
          <ol className={classes.gaps}>
            {GAPS.map(([st, h, p, who], i) => (
              <li key={h}>
                <b className={classes.rank}>{i + 1}</b>
                <div>
                  <h4>{h}</h4>
                  <p>{p}</p>
                  <small>
                    <StatusPill status={st}>{i < 2 ? 'Urgent' : 'High'}</StatusPill> {who}
                  </small>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </Doc>
  );
}

/** Page 3 (optional): before and after imagery of the worst area, and what to do. */
export function ProductHotspot() {
  return (
    <Doc n={3} title="Hotspot: blocks B1 and B2">
      <div className={classes.p3}>
        <div className={classes.pair}>
          <figure>
            <SiteMap mode="sat" time="before" view="zoom" layers={['imagery', 'blocks', 'furniture']} />
            <figcaption>
              <b>Before</b> Satellite, 12/10/2026
            </figcaption>
          </figure>
          <figure>
            <SiteMap mode="ortho" view="zoom" layers={['imagery', 'blocks', 'hazards', 'services', 'labels', 'furniture']} />
            <figcaption>
              <b>After</b> Drone, 27/10/2026
            </figcaption>
          </figure>
        </div>
        <div className={classes.story}>
          <div>
            <h3>What changed</h3>
            <p>
              Since 12 October, the river has risen into the south of the site. Around 60 shelters in B1 and B2 are in standing water, and two latrine
              blocks and one water point are flooded. People are moving north into A1 and A2, which are already crowded.
            </p>
          </div>
          <div>
            <h3>Recommended actions</h3>
            <ol className={classes.actions}>
              <li>
                <b>Relocate</b> households from the south of B1 and B2 to the higher ground east of B4.<small>Site management · within 48 h</small>
              </li>
              <li>
                <b>Close</b> LT-03 and LT-05 and add temporary latrines in A1.<small>WASH · within 72 h</small>
              </li>
              <li>
                <b>Truck water</b> to B1–B3 until WP-03 and WP-05 are repaired.<small>WASH · from today</small>
              </li>
              <li>
                <b>Re-fly</b> the south of the site after the next rain to update the flood extent.<small>RISA team · +1 week</small>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </Doc>
  );
}

export const PRODUCT_PAGES = {
  map: { title: 'Page 1: the map', caption: 'Common Operational Picture · A3 landscape (also A4 and A0)', Component: ProductMap },
  findings: { title: 'Page 2: key findings', caption: 'Key findings · A3 or A4 landscape', Component: ProductFindings },
  hotspot: { title: 'Page 3: hotspot (optional)', caption: 'Hotspot · A3 or A4 landscape', Component: ProductHotspot },
} as const;
