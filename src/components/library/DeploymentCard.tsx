import { Link } from 'react-router';
import { partnerName } from '../../lib/content';
import { formatDates } from '../../lib/format';
import type { Deployment } from '../../lib/types';
import { Tbc } from '../Typography';
import classes from './Library.module.css';

export const KIND: Record<Deployment['kind'], string> = {
  response: 'Response',
  exercise: 'Exercise',
  training: 'Training',
  workshop: 'Workshop',
  event: 'Event',
  pilot: 'Pilot',
};

export const STATUS: Record<Deployment['status'], string> = { done: 'Done', active: 'Happening now', planned: 'Planned' };

export const list = (items: string[]) => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`);

export function DeploymentCard({ d }: { d: Deployment }) {
  return (
    <article className={classes.dcard}>
      <p className={classes.dmeta}>
        <span className={classes.dstatus} data-status={d.status}>
          {STATUS[d.status]}
        </span>
        {' · '}
        {KIND[d.kind]} · {formatDates(d.start, d.end)}
      </p>
      <h3>
        <Link to={`/deployments/${d.id}`}>{d.title}</Link>
        {d.tbc && <Tbc>details TBC</Tbc>}
      </h3>
      <p className={classes.where}>
        {d.place}
        {d.hazard && ` · ${d.hazard}`}
      </p>
      <p>{d.summary}</p>
      {d.partners.length > 0 && <p className={classes.with}>With {list(d.partners.map(partnerName))}</p>}
    </article>
  );
}
