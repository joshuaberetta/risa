import { Container } from '@mantine/core';
import type { ReactNode } from 'react';
import type { TocEntry } from '../../lib/types';
import classes from './HandbookLayout.module.css';

/**
 * Handbook's reading layout: a sticky contents list beside a reading column.
 * On small screens the list folds into a "Contents" <details> above the text.
 * `aside` goes under the contents list on wide screens (the guide's page list).
 */
export function HandbookLayout({ toc, title = 'Contents', aside, children }: { toc: TocEntry[]; title?: string; aside?: ReactNode; children: ReactNode }) {
  const list = (
    <ol>
      {toc.map((t) => (
        <li key={t.id}>
          <a href={`#${t.id}`}>{t.text}</a>
        </li>
      ))}
    </ol>
  );
  return (
    <Container className={classes.layout}>
      <div className={classes.side}>
        {toc.length > 0 && (
          <>
            <nav className={classes.toc} aria-label={title}>
              <h2>{title}</h2>
              {list}
            </nav>
            <details className={classes.mobileToc}>
              <summary>{title}</summary>
              {list}
            </details>
          </>
        )}
        {aside}
      </div>
      <div className={classes.content}>{children}</div>
    </Container>
  );
}
