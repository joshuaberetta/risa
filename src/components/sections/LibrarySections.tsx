import { useState } from 'react';
import { deployments, getResource, resources, resourceStatus } from '../../lib/content';
import type { DeploymentsSection as DeploymentsData, Resource, ResourceListSection as ResourceListData, ToolboxSection as ToolboxData } from '../../lib/types';
import { Blocks } from '../Blocks';
import { WorldMap } from '../brand/WorldMap';
import { DeploymentCard, KIND } from '../library/DeploymentCard';
import { CATEGORIES, ResourceCard } from '../library/ResourceCard';
import classes from '../library/Library.module.css';
import { LinkGroup } from '../SmartLink';
import { Section } from './Section';

type Filter<T extends string> = { value: T | 'all'; set: (v: T | 'all') => void };

function FilterRow<T extends string>({ label, options, filter }: { label: string; options: [T, string][]; filter: Filter<T> }) {
  return (
    <div className={classes.filterRow} role="group" aria-label={label}>
      <span>{label}:</span>
      {[['all', 'All'] as [T | 'all', string], ...options].map(([v, name]) => (
        <button key={v} type="button" aria-pressed={filter.value === v} onClick={() => filter.set(v)}>
          {name}
        </button>
      ))}
    </div>
  );
}

/**
 * The whole toolbox: the feature card (the SOP), then every resource,
 * filterable by category and by whether it can be downloaded yet. Without
 * JavaScript, the filters hide and everything shows.
 */
export function ToolboxSection({ section }: { section: ToolboxData }) {
  const [category, setCategory] = useState<Resource['category'] | 'all'>('all');
  const [ready, setReady] = useState<'available' | 'coming' | 'all'>('all');
  const feature = section.feature ? getResource(section.feature) : undefined;
  const items = resources.filter(
    (r) =>
      r !== feature &&
      (category === 'all' || r.category === category) &&
      (ready === 'all' || (ready === 'available') === (resourceStatus(r) === 'available')),
  );
  const cats = (Object.keys(CATEGORIES) as Resource['category'][]).filter((c) => resources.some((r) => r.category === c));
  return (
    <Section section={section}>
      {feature && (
        <div className={classes.feature}>
          <ResourceCard r={feature} />
        </div>
      )}
      <Blocks body={section.body} />
      <div className={classes.filters}>
        <FilterRow label="Show" options={cats.map((c) => [c, CATEGORIES[c]])} filter={{ value: category, set: setCategory }} />
        <FilterRow
          label="Status"
          options={[
            ['available', 'Ready to download'],
            ['coming', 'Drafts and planned'],
          ]}
          filter={{ value: ready, set: setReady }}
        />
      </div>
      <p className={classes.count} aria-live="polite">
        {items.length} {items.length === 1 ? 'item' : 'items'}
      </p>
      <div className={classes.listEnd}>
        {items.map((r) => (
          <ResourceCard key={r.id} r={r} />
        ))}
      </div>
      <p className={classes.fine}>
        Drafts are shared directly by the partners while the toolbox is consolidated. Downloads appear here once a version is agreed. Annex owners: A
        Kobo; B and C MapAction (named owner to be confirmed); D Atlas Logistique; E to be confirmed; F Kobo.
      </p>
    </Section>
  );
}

/** A few named resources, for teasers. */
export function ResourceListSection({ section }: { section: ResourceListData }) {
  const items = section.items.map(getResource).filter((r): r is Resource => Boolean(r));
  return (
    <Section section={section}>
      <Blocks body={section.body} />
      <div className={classes.listEnd}>
        {items.map((r) => (
          <ResourceCard key={r.id} r={r} />
        ))}
      </div>
      <LinkGroup links={section.links} />
    </Section>
  );
}

/** Deployments on the map, then the list, most recent first; filterable by kind on the full list. */
export function DeploymentsSection({ section }: { section: DeploymentsData }) {
  const [kind, setKind] = useState<string>('all');
  const full = !section.limit;
  const all = section.limit ? deployments.slice(0, section.limit) : deployments;
  const items = all.filter((d) => kind === 'all' || d.kind === kind);
  const kinds = (Object.keys(KIND) as (keyof typeof KIND)[]).filter((k) => deployments.some((d) => d.kind === k));
  return (
    <Section section={section}>
      <Blocks body={section.body} />
      {section.map && <WorldMap items={items} />}
      {full && (
        <div className={classes.filters}>
          <FilterRow label="Show" options={kinds.map((k) => [k, KIND[k]])} filter={{ value: kind, set: setKind }} />
        </div>
      )}
      <div className={classes.listEnd}>
        {items.map((d) => (
          <DeploymentCard key={d.id} d={d} />
        ))}
      </div>
      <LinkGroup links={section.links} />
    </Section>
  );
}
