import { site } from '../../lib/content';
import { logoMark, nameLines } from '../../lib/logo';
import classes from './Logo.module.css';

const MARK = logoMark();

/** The 10b mark alone. Decorative: give the surrounding link its label. */
export function LogoMark({ className }: { className?: string }) {
  return <span className={`${classes.mark} ${className ?? ''}`} dangerouslySetInnerHTML={{ __html: MARK }} />;
}

/**
 * Logo 10b with the wordmark: RISA in Public Sans, and the full name from
 * site.yml in two lines beside it (`horizontal`) or under it (`stacked`).
 * Size it with font-size; colours come from --logo-*.
 */
export function Logo({ layout = 'horizontal' }: { layout?: 'horizontal' | 'stacked' | 'mark' }) {
  if (layout === 'mark') return <LogoMark />;
  const [line1, line2] = nameLines(site.name);
  return (
    <span className={classes.lockup} data-layout={layout}>
      <LogoMark />
      <span className={classes.wordmark}>
        <b>{site.shortName}</b>
        <small>
          {line1} <br />
          {line2}
        </small>
      </span>
    </span>
  );
}
