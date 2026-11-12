import { Link } from 'react-router';
import { formatDates } from '../../lib/format';
import type { Deployment } from '../../lib/types';
import { WORLD, worldMapLayout } from '../../lib/world';
import classes from './WorldMap.module.css';

const isResponse = (d: Deployment) => d.kind === 'response' || d.kind === 'exercise';

/** Deployments on the world map: circles for responses and exercises, diamonds for the rest. */
export function WorldMap({ items, focus = false }: { items: Deployment[]; focus?: boolean }) {
  const { pins, hot, viewBox, scale } = worldMapLayout(items, focus);
  return (
    <figure className={classes.wrap}>
      <svg viewBox={viewBox.map((v) => v.toFixed(1)).join(' ')} role="img" aria-label={focus ? `Map: ${items[0]?.place}` : 'Map of RISA deployments, exercises, trainings and workshops'}>
        <g className={classes.countries}>
          {WORLD.countries.map((c) => (
            <path key={c.name} d={c.d} data-hot={hot.has(c.name) || undefined} />
          ))}
        </g>
        <g>
          {pins.map((p) => (
            <g key={`${p.d.id}-${p.label}`} transform={`translate(${p.xy[0].toFixed(1)} ${p.xy[1].toFixed(1)}) scale(${(scale * 1.5).toFixed(3)})`}>
            <Link
              to={`/deployments/${p.d.id}`}
              className={classes.pin}
              data-status={p.d.status}
              data-response={isResponse(p.d) || undefined}
              aria-label={`${p.d.title}, ${p.label}, ${formatDates(p.d.start, p.d.end)}`}
            >
              <title>{`${p.d.title} · ${p.label} · ${formatDates(p.d.start, p.d.end)}`}</title>
              {isResponse(p.d) ? (
                <circle r={6.5} className={classes.core} />
              ) : (
                <rect x={-5.5} y={-5.5} width={11} height={11} transform="rotate(45)" className={classes.core} />
              )}
              <circle r={15} fill="transparent" />
            </Link>
            </g>
          ))}
        </g>
      </svg>
      {!focus && (
        <figcaption className={classes.legend}>
          <span>
            <svg viewBox="-9 -9 18 18" aria-hidden>
              <circle r={6.5} className={classes.core} />
            </svg>
            Response or exercise
          </span>
          <span>
            <svg viewBox="-9 -9 18 18" aria-hidden>
              <rect x={-5.5} y={-5.5} width={11} height={11} transform="rotate(45)" className={classes.core} data-kind="other" />
            </svg>
            Training, workshop, pilot or event
          </span>
          <span>
            <i className={classes.planned} aria-hidden />
            Planned
          </span>
          <span>
            <i className={classes.hot} aria-hidden />
            Country involved
          </span>
        </figcaption>
      )}
    </figure>
  );
}
