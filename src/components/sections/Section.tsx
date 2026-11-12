import type { ReactNode } from 'react';
import type { Section as SectionData } from '../../lib/types';
import { Tbc } from '../Typography';
import classes from './Section.module.css';

/**
 * One section of a page: its anchor, its h2 (with a TBC marker if it's
 * waiting on the team) and its intro. In the Handbook layout it sits in the
 * reading column; otherwise it's a full-width band.
 */
export function Section({ section, children, wide, className }: { section: SectionData; children: ReactNode; wide?: boolean; className?: string }) {
  return (
    <section id={section.id} className={`${classes.section} ${className ?? ''}`} data-wide={wide || undefined}>
      {section.title && (
        <h2 className={classes.title}>
          {section.title}
          {section.tbc && <Tbc />}
        </h2>
      )}
      {section.intro && <p className={classes.intro}>{section.intro}</p>}
      {children}
    </section>
  );
}
