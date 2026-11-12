import { Button } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { downloads, resourceStatus } from '../../lib/content';
import { formatBytes, formatDate } from '../../lib/format';
import type { Resource, ResourceStatus } from '../../lib/types';
import { asset } from '../../lib/url';
import { LinkButton } from '../SmartLink';
import { Tbc } from '../Typography';
import classes from './Library.module.css';

export const RESOURCE_STATUS: Record<ResourceStatus, string> = {
  available: 'Available',
  draft: 'Draft',
  'in-progress': 'In progress',
  planned: 'Planned',
};

export const CATEGORIES = {
  sop: 'Procedures and annexes',
  forms: 'Forms and data',
  gis: 'GIS and maps',
  training: 'Training',
  comms: 'Communication',
} as const;

const sizeOf = (path: string) => Object.values(downloads.files).find((f) => f.path === path)?.bytes;

/** One toolbox item. Only `available` items show their downloads. */
export function ResourceCard({ r, headingLevel = 3 }: { r: Resource; headingLevel?: 3 | 4 }) {
  const status = resourceStatus(r);
  const H = `h${headingLevel}` as const;
  return (
    <article className={classes.res} id={`resource-${r.id}`}>
      <header>
        <span className={classes.code}>{r.code}</span>
        <span className={classes.rstatus} data-status={status}>
          {RESOURCE_STATUS[status]}
          {r.version && ` · ${r.version}`}
        </span>
      </header>
      <H className={classes.resTitle}>
        {r.title}
        {r.tbc && <Tbc />}
      </H>
      <p>{r.summary}</p>
      <dl className={classes.resMeta}>
        <div>
          <dt>Owner</dt>
          <dd>{r.owner}</dd>
        </div>
        {r.format && (
          <div>
            <dt>Format</dt>
            <dd>{r.format}</dd>
          </div>
        )}
        {r.languages?.length ? (
          <div>
            <dt>Languages</dt>
            <dd>{r.languages.join(', ')}</dd>
          </div>
        ) : null}
        {r.updated && (
          <div>
            <dt>Updated</dt>
            <dd>{formatDate(r.updated)}</dd>
          </div>
        )}
      </dl>
      {r.details?.length ? (
        <details className={classes.more}>
          <summary>What’s in it</summary>
          <ul>
            {r.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </details>
      ) : null}
      {r.note && <p className={classes.note}>{r.note}</p>}
      {(status === 'available' && r.files?.length) || r.link ? (
        <p className={classes.actions}>
          {status === 'available' &&
            r.files?.map((f) => {
              const bytes = sizeOf(f.path);
              return (
                <Button key={f.path} component="a" href={asset(f.path)} download leftSection={<IconDownload size={18} aria-hidden />}>
                  {f.label}
                  {bytes ? ` (${formatBytes(bytes)})` : ''}
                </Button>
              );
            })}
          {r.link && <LinkButton link={r.link} />}
        </p>
      ) : null}
    </article>
  );
}
