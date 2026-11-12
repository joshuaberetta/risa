import { Text, type TextProps } from '@mantine/core';
import type { ReactNode } from 'react';
import classes from './Typography.module.css';

/** The grey line above a heading: "RISA handbook · SOP v3, working draft". Sentence case, as in Handbook. */
export function Kicker({ children, ...rest }: { children: ReactNode } & TextProps) {
  return (
    <Text component="p" className={classes.kicker} {...rest}>
      {children}
    </Text>
  );
}

/** Data labels: codes, field names, coordinates, versions. */
export function Mono({ children }: { children: ReactNode }) {
  return <code className={classes.mono}>{children}</code>;
}

/**
 * Marks copy that's waiting on the team: visible to reviewers, easy to find
 * later. The class is global (global.css) because {tbc} in Markdown makes the
 * same span at build time.
 */
export function Tbc({ children }: { children?: ReactNode }) {
  return <span className="tbc">{children ?? 'TBC'}</span>;
}
