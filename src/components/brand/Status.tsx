import { STATUSES, statusLabel, type Status } from '../../lib/status';
import classes from './Status.module.css';

/** The one UI element in the status colours: a label with its symbol. */
export function StatusPill({ status, kind = 'service', children }: { status: Status; kind?: 'service' | 'access'; children?: string }) {
  return (
    <span className={classes.pill} data-status={status}>
      {children ?? statusLabel(status, kind)}
    </span>
  );
}

/**
 * The four statuses with their symbols and, for access points, their line
 * styles. `kind="both"` shows the service and access wording side by side.
 */
export function StatusLegend({ kind = 'both' }: { kind?: 'service' | 'access' | 'both' }) {
  return (
    <table className={classes.legend}>
      <thead>
        <tr>
          <th scope="col">{kind === 'access' ? 'Access points' : 'Services'}</th>
          {kind === 'both' && <th scope="col">Access points (routes, choke points)</th>}
          <th scope="col">On the map</th>
        </tr>
      </thead>
      <tbody>
        {STATUSES.map((s) => (
          <tr key={s}>
            <td>
              <StatusPill status={s} kind={kind === 'access' ? 'access' : 'service'} />
            </td>
            {kind === 'both' && <td>{statusLabel(s, 'access')}</td>}
            <td className={classes.how}>
              <span className={classes.sym} data-status={s} aria-hidden />
              {s !== 'unknown' && <span className={classes.line} data-status={s} aria-hidden />}
              {SHAPES[s]}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const SHAPES: Record<Status, string> = {
  ok: 'Filled symbol, solid line',
  partial: 'Half-filled symbol, dashed line',
  no: 'Crossed-out symbol, dotted line',
  unknown: 'Grey outline: not assessed',
};
