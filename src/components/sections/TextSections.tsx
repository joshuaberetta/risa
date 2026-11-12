import { Container } from '@mantine/core';
import { site } from '../../lib/content';
import type {
  AudiencesSection as Audiences,
  CalloutSection as CalloutData,
  CardsSection as Cards,
  CtaSection as Cta,
  GovernanceSection as Governance,
  GuidePagesSection as GuidePages,
  PartnersSection as Partners,
  ProductSection as Product,
  ProseSection as Prose,
  RowsSection as Rows,
  StatsSection as Stats,
  StatusScaleSection as StatusScale,
  StepsSection as Steps,
  TableSection as Table,
  TimelineSection as Timeline,
} from '../../lib/types';
import { Blocks, Callout } from '../Blocks';
import { PRODUCT_PAGES } from '../brand/Product';
import { StatusLegend } from '../brand/Status';
import { GuidePageList } from '../guide/GuidePageList';
import { LinkButton, LinkGroup } from '../SmartLink';
import { Mono, Tbc } from '../Typography';
import { list } from '../library/DeploymentCard';
import { Section } from './Section';
import classes from './TextSections.module.css';

export function ProseSection({ section }: { section: Prose }) {
  return (
    <Section section={section}>
      <Blocks body={section.body} />
    </Section>
  );
}

/** Who RISA is for: one row per audience, national authorities first. */
export function AudiencesSection({ section }: { section: Audiences }) {
  return (
    <Section section={section}>
      <div className={classes.who}>
        {section.items.map((a) => (
          <div key={a.who} className={classes.whoRow} data-lead={a.lead || undefined}>
            <div>
              <h3>{a.who}</h3>
              <p className={classes.whoEx}>{a.examples}</p>
            </div>
            <div>
              <p className={classes.whoQ}>“{a.question}”</p>
              {a.link && <LinkButton link={a.link} />}
            </div>
            <ul>
              {a.gets.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

/** Term and description rows: the three inputs, the roles. */
export function RowsSection({ section }: { section: Rows }) {
  return (
    <Section section={section}>
      <dl className={classes.rows}>
        {section.items.map((r) => (
          <div key={r.term}>
            <dt>
              {r.term}
              {r.detail && (
                <span className={classes.detail}>
                  <Mono>{r.detail}</Mono>
                </span>
              )}
              {r.tbc && <Tbc />}
            </dt>
            <dd>
              <Blocks body={r.body} />
            </dd>
          </div>
        ))}
      </dl>
      <Blocks body={section.body} />
    </Section>
  );
}

/** Numbered steps, each with how it most often fails. */
export function StepsSection({ section }: { section: Steps }) {
  return (
    <Section section={section}>
      <ol className={classes.steps}>
        {section.items.map((s) => (
          <li key={s.title}>
            <h3>{s.title}</h3>
            <Blocks body={s.body} />
            {s.failure && (
              <p className={classes.failure}>
                <b>Common failure:</b> {s.failure}
              </p>
            )}
          </li>
        ))}
      </ol>
      <Blocks body={section.body} />
    </Section>
  );
}

export function TableSection({ section }: { section: Table }) {
  return (
    <Section section={section}>
      <div className={classes.tableWrap}>
        <table className={classes.table}>
          {section.caption && <caption>{section.caption}</caption>}
          <thead>
            <tr>
              {section.columns.map((c) => (
                <th key={c} scope="col">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) =>
                  j === 0 ? (
                    <th key={j} scope="row">
                      {cell}
                    </th>
                  ) : (
                    <td key={j}>{cell}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Blocks body={section.body} />
    </Section>
  );
}

export function TimelineSection({ section }: { section: Timeline }) {
  return (
    <Section section={section}>
      <ol className={classes.timeline}>
        {section.items.map((t) => (
          <li key={t.when + t.title}>
            <span className={classes.when}>{t.when}</span>
            <div>
              <h3>{t.title}</h3>
              <Blocks body={t.body} />
            </div>
          </li>
        ))}
      </ol>
      <Blocks body={section.body} />
    </Section>
  );
}

export function StatusScaleSection({ section }: { section: StatusScale }) {
  return (
    <Section section={section}>
      <StatusLegend />
      <Blocks body={section.body} />
    </Section>
  );
}

/** The sample product's pages, at full column width. */
export function ProductSection({ section }: { section: Product }) {
  return (
    <Section section={section}>
      <Blocks body={section.body} />
      {section.pages.map((p) => {
        const { title, caption, Component } = PRODUCT_PAGES[p];
        return (
          <figure key={p} className={classes.productPage} id={`page-${p}`}>
            {/* A section showing one page is already titled by the section. */}
            {section.pages.length > 1 && <h3>{title}</h3>}
            <Component />
            <figcaption>{caption}. Fictional data.</figcaption>
          </figure>
        );
      })}
      <LinkGroup links={section.links} />
    </Section>
  );
}

export function CardsSection({ section }: { section: Cards }) {
  return (
    <Section section={section}>
      <div className={classes.cards}>
        {section.items.map((c) => (
          <article key={c.title} className={classes.card}>
            {c.kicker && <p className={classes.cardKicker}>{c.kicker}</p>}
            <h3>
              {c.title}
              {c.tbc && <Tbc />}
            </h3>
            <Blocks body={c.body} />
            {c.link && <LinkButton link={c.link} />}
          </article>
        ))}
      </div>
      <Blocks body={section.body} />
    </Section>
  );
}

export function StatsSection({ section }: { section: Stats }) {
  return (
    <Section section={section}>
      <dl className={classes.stats}>
        {section.items.map((s) => (
          <div key={s.label}>
            <dt>
              {s.label}
              {s.tbc && <Tbc />}
            </dt>
            <dd>{s.value}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

/** A dark band to close a page: Adopt RISA. */
export function CtaSection({ section, inColumn }: { section: Cta; inColumn?: boolean }) {
  const inner = (
    <>
      {section.title && <h2>{section.title}</h2>}
      {section.intro && <p className={classes.ctaIntro}>{section.intro}</p>}
      <Blocks body={section.body} />
      <LinkGroup links={section.links} />
    </>
  );
  return (
    <section id={section.id} className={`risa-dark ${classes.cta}`} data-in-column={inColumn || undefined}>
      {inColumn ? inner : <Container>{inner}</Container>}
    </section>
  );
}

/** The owners line: who runs RISA, and who endorses it (as text until cleared). */
export function OwnersSection() {
  const endorsers = site.endorsers.map((e) => `${e.name}${e.note ? ` (${e.note})` : ''}`).join(', ');
  return (
    <section className={classes.owners}>
      <Container>
        <p>
          A joint initiative of {list(site.partners.map((p) => p.name))}.{endorsers && ` Endorsed by ${endorsers}.`}
        </p>
      </Container>
    </section>
  );
}

/** The partners and what each brings, then the endorsers. */
export function PartnersSection({ section }: { section: Partners }) {
  return (
    <Section section={section}>
      <dl className={classes.rows}>
        {[...site.partners, ...site.endorsers].map((p) => (
          <div key={p.id}>
            <dt>
              {p.name}
              {p.tbc && <Tbc />}
            </dt>
            <dd>
              {p.role ?? 'Endorsement'}
              {p.note && <span className={classes.partnerNote}> ({p.note})</span>}
            </dd>
          </div>
        ))}
      </dl>
      <Blocks body={section.body} />
    </Section>
  );
}

/** Governance layers. Unconfirmed layers are hidden or marked TBC in the content. */
export function GovernanceSection({ section }: { section: Governance }) {
  return (
    <Section section={section}>
      <Blocks body={section.body} />
      <ol className={classes.layers}>
        {section.layers
          .filter((l) => !l.hidden)
          .map((l, i) => (
            <li key={l.id} id={`layer-${l.id}`}>
              <p className={classes.layerNum}>Layer {i + 1}</p>
              <h3>
                {l.name}
                {l.tbc && <Tbc />}
              </h3>
              {l.short && <p className={classes.layerShort}>{l.short}</p>}
              {l.text && <p>{l.text}</p>}
              <ul className={classes.members}>
                {l.members.map((m) => (
                  <li key={m.name}>
                    <b>{m.name}</b>
                    {m.tbc && <Tbc />}
                    {m.full && <span className={classes.full}>{m.full}</span>}
                    {m.role && <span>{m.role}</span>}
                  </li>
                ))}
              </ul>
            </li>
          ))}
      </ol>
    </Section>
  );
}

export function GuidePagesSection({ section }: { section: GuidePages }) {
  return (
    <Section section={section}>
      <Blocks body={section.body} />
      <GuidePageList />
    </Section>
  );
}

export function CalloutSection({ section }: { section: CalloutData }) {
  return (
    <Callout tone={section.tone} title={section.title}>
      <Blocks body={section.body} />
    </Callout>
  );
}
