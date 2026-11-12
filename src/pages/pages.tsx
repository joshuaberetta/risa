import { Button, Container } from '@mantine/core';
import { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router';
import { deployments, downloads, getDeployment, getGuidePage, getPage, getResource, guide, guidePath, pageSlugFromPath, partnerName } from '../lib/content';
import { formatDate, formatDates } from '../lib/format';
import type { Section } from '../lib/types';
import { legacyRedirect } from '../lib/url';
import { Blocks } from '../components/Blocks';
import { WorldMap } from '../components/brand/WorldMap';
import { HandbookLayout } from '../components/layout/HandbookLayout';
import { DeploymentCard, KIND, list, STATUS } from '../components/library/DeploymentCard';
import { ResourceCard } from '../components/library/ResourceCard';
import { HeroSection } from '../components/sections/HeroSection';
import { SectionRenderer } from '../components/sections/SectionRenderer';
import { Kicker, Tbc } from '../components/Typography';
import classes from './pages.module.css';

/** A page from content/pages/. With `toc: true`, everything after the hero goes in Handbook's reading layout. */
export function ContentPage() {
  const { pathname } = useLocation();
  const page = getPage(pageSlugFromPath(pathname));
  if (!page) return <NotFound />;
  const sections = page.sections.filter((s) => !s.hidden);
  const [first, ...rest] = sections;
  const hero = first?.type === 'hero' ? first : undefined;
  const body = hero ? rest : sections;
  // The owners strip always runs full width, under the reading layout.
  const owners = body.filter((s) => s.type === 'owners');
  const main = body.filter((s) => s.type !== 'owners');
  return (
    <>
      {hero && <HeroSection section={hero} />}
      {page.toc ? (
        <HandbookLayout toc={tocFor(main)}>
          <SectionRenderer sections={main} inColumn />
        </HandbookLayout>
      ) : (
        <Container className={classes.plain}>
          <SectionRenderer sections={main} />
        </Container>
      )}
      <SectionRenderer sections={owners} />
    </>
  );
}

const tocFor = (sections: Section[]) =>
  sections.filter((s) => s.id && s.title).map((s) => ({ id: s.id!, text: s.short ?? s.title! }));

/** /deployments/:id */
export function DeploymentPage() {
  const { id = '' } = useParams();
  const d = getDeployment(id);
  if (!d) return <NotFound />;
  const toc = [...d.headings];
  if (d.lessons?.length) toc.push({ id: 'lessons', text: 'Lessons' });
  if (d.resources?.length) toc.push({ id: 'resources', text: 'From the toolbox' });
  const others = deployments.filter((o) => o.id !== d.id).slice(0, 3);
  return (
    <>
      <section className={classes.head}>
        <Container>
          <p className={classes.crumbs}>
            <Link to="/deployments">Deployments</Link> / {KIND[d.kind]}
          </p>
          <h1>
            {d.title}
            {d.tbc && <Tbc>details TBC</Tbc>}
          </h1>
          <p className={classes.lead}>{d.summary}</p>
          <dl className={classes.facts}>
            <div>
              <dt>Status</dt>
              <dd>{STATUS[d.status]}</dd>
            </div>
            <div>
              <dt>When</dt>
              <dd>{formatDates(d.start, d.end)}</dd>
            </div>
            <div>
              <dt>Where</dt>
              <dd>{d.place}</dd>
            </div>
            {d.partners.length > 0 && (
              <div>
                <dt>With</dt>
                <dd>{list(d.partners.map(partnerName))}</dd>
              </div>
            )}
          </dl>
        </Container>
      </section>
      <HandbookLayout toc={toc} aside={d.locations?.length || d.countries.length ? <WorldMap items={[d]} focus /> : undefined}>
        {d.facts?.length ? (
          <dl className={classes.keyFacts}>
            {d.facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>
                  {f.value}
                  {f.tbc && <Tbc />}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
        <Blocks body={d.blocks} />
        {d.products?.length ? (
          <>
            <h3>Products</h3>
            <ul>
              {d.products.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </>
        ) : null}
        {d.lessons?.length ? (
          <section id="lessons" className={classes.block}>
            <h2>Lessons</h2>
            <ul className={classes.lessons}>
              {d.lessons.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </section>
        ) : null}
        {d.note && (
          <p className={classes.note}>
            <b>Still to check:</b> {d.note}
          </p>
        )}
        {d.resources?.length ? (
          <section id="resources" className={classes.block}>
            <h2>From the toolbox</h2>
            {d.resources
              .map(getResource)
              .filter((r) => r !== undefined)
              .map((r) => (
                <ResourceCard key={r.id} r={r} />
              ))}
            <p>
              <Link to="/toolbox">The whole toolbox</Link>
            </p>
          </section>
        ) : null}
        <section className={classes.block}>
          <h2>Other deployments</h2>
          {others.map((o) => (
            <DeploymentCard key={o.id} d={o} />
          ))}
        </section>
      </HandbookLayout>
    </>
  );
}

/** /guide and /guide/:slug: the data collection guide (Annex F of the SOP). */
export function GuidePage() {
  const { slug = '' } = useParams();
  const g = getGuidePage(slug);
  if (!g) return <NotFound />;
  const i = guide.indexOf(g);
  const prev = guide[i - 1];
  const next = guide[i + 1];
  const pages = (
    <nav className={classes.guideNav} aria-label="Data collection guide">
      <h2>The guide</h2>
      <ol>
        {guide.map((p) => (
          <li key={p.slug}>
            <Link to={guidePath(p)} aria-current={p === g ? 'page' : undefined}>
              {p.title}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
  return (
    <>
      <section className={classes.head}>
        <Container>
          <Kicker>
            {g.slug ? (
              <>
                <Link to="/guide">Data collection guide</Link> · {i} of {guide.length - 1}
              </>
            ) : (
              'RISA handbook · Annex F'
            )}
          </Kicker>
          <h1>{g.title}</h1>
          <p className={classes.lead}>{g.summary}</p>
        </Container>
      </section>
      <HandbookLayout toc={g.headings} title="On this page" aside={pages}>
        <Blocks body={g.blocks} />
        <nav className={classes.pager} aria-label="Previous and next">
          {prev ? (
            <Link to={guidePath(prev)} rel="prev">
              <small>Previous</small>
              {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link to={guidePath(next)} rel="next" data-next>
              <small>Next</small>
              {next.title}
            </Link>
          )}
        </nav>
        <p className={classes.source}>
          This guide is Annex F of the RISA SOP (v3, working draft). {g.annexRef && <>This page: {g.annexRef}. </>}
          Last checked against the annexes on {formatDate(g.lastChecked)}. Template version <code>{downloads.version}</code>.
        </p>
      </HandbookLayout>
    </>
  );
}

export function NotFound() {
  // On the static host, 404.html redirects old links before React loads
  // (scripts/prerender.mjs). This does the same on the dev server.
  useEffect(() => {
    const { pathname, search, hash } = window.location;
    const files = { template: downloads.files.template.path, codebook: downloads.files.codebook.path };
    const to = legacyRedirect(pathname, search, hash, files);
    if (to) window.location.replace(to);
  }, []);
  return (
    <Container className={classes.notFound}>
      <Kicker>Page not found</Kicker>
      <h1>We can’t find that page.</h1>
      <p className={classes.lead}>
        It may have moved. The design review that came before this site is at <a href="/designs/">/designs</a>.
      </p>
      <Button component={Link} to="/" mt="xl">
        Go to the home page
      </Button>
    </Container>
  );
}
