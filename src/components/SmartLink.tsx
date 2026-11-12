import { Button } from '@mantine/core';
import { IconArrowRight, IconArrowUpRight } from '@tabler/icons-react';
import { Link } from 'react-router';
import type { LinkItem } from '../lib/types';
import { asset, isExternal, isRouterLink } from '../lib/url';
import classes from './SmartLink.module.css';

/**
 * Props that make any Mantine component behave as the right kind of link.
 * `component` is typed loosely because Mantine's polymorphic props can't
 * accept a union of "router Link" and "plain <a>".
 */
interface LinkLikeProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: any;
  to?: string;
  href?: string;
  target?: string;
  rel?: string;
}

/** Links that leave the site (not mail links). These open in a new tab and get a ↗. */
export const isOffsite = (href: string) => /^(https?:)?\/\//.test(href);

export function linkProps(href: string): LinkLikeProps {
  if (isRouterLink(href)) return { component: Link, to: href };
  const external = isExternal(href) && isOffsite(href);
  return {
    component: 'a',
    href: asset(href),
    ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
  };
}

/** A plain <a> or router link, for text. */
export function SmartLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const { component: C, ...rest } = linkProps(href);
  return (
    <C className={className} {...rest}>
      {children}
      {isOffsite(href) && <IconArrowUpRight size={15} stroke={2} className={classes.offsite} aria-label="(opens another site)" />}
    </C>
  );
}

/** Handbook has one primary button style, an outlined secondary, and plain links. */
export function LinkButton({ link }: { link: LinkItem }) {
  if (!link.variant || link.variant === 'link') {
    return (
      <SmartLink href={link.href} className={classes.link}>
        {link.label}
      </SmartLink>
    );
  }
  const offsite = isOffsite(link.href);
  return (
    <Button
      variant={link.variant === 'primary' ? 'filled' : 'outline'}
      color={link.variant === 'primary' ? 'blue' : 'var(--risa-ink)'}
      className={link.variant === 'secondary' ? classes.secondary : undefined}
      rightSection={
        offsite ? (
          <IconArrowUpRight size={17} stroke={2} aria-label="(opens another site)" />
        ) : link.variant === 'primary' ? (
          <IconArrowRight size={17} stroke={2} aria-hidden />
        ) : undefined
      }
      {...linkProps(link.href)}
    >
      {link.label}
    </Button>
  );
}

export function LinkGroup({ links }: { links?: LinkItem[] }) {
  if (!links?.length) return null;
  return (
    <p className={classes.group}>
      {links.map((link) => (
        <LinkButton key={link.href + link.label} link={link} />
      ))}
    </p>
  );
}
