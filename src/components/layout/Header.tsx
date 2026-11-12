import { Button, Container } from '@mantine/core';
import { IconMenu2 } from '@tabler/icons-react';
import { useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { site } from '../../lib/content';
import { Logo } from '../brand/Logo';
import classes from './Header.module.css';

function Nav({ className }: { className: string }) {
  return (
    <ul className={className}>
      {site.nav.map((item) => (
        <li key={item.href}>
          <NavLink to={item.href}>{item.label}</NavLink>
        </li>
      ))}
    </ul>
  );
}

/**
 * Handbook's header: the logo, the main links and the Adopt RISA button. On
 * small screens the links fold into a "Menu" <details>, which works without
 * JavaScript; it closes on navigation.
 */
export function Header() {
  const menu = useRef<HTMLDetailsElement>(null);
  const { pathname } = useLocation();
  useEffect(() => {
    if (menu.current) menu.current.open = false;
  }, [pathname]);
  return (
    <header className={classes.header}>
      <Container className={classes.bar}>
        <Link to="/" className={classes.brand} aria-label={`${site.shortName}, ${site.name}: home`}>
          <Logo />
        </Link>
        <nav aria-label="Main" className={classes.desktop}>
          <Nav className={classes.links} />
          <Button component={Link} to={site.cta.href}>
            {site.cta.label}
          </Button>
        </nav>
        <details ref={menu} className={classes.mobile}>
          <summary>
            <IconMenu2 size={20} stroke={2} aria-hidden />
            Menu
          </summary>
          <nav aria-label="Main" className={classes.panel}>
            <Nav className={classes.mobileLinks} />
            <Button component={Link} to={site.cta.href} fullWidth>
              {site.cta.label}
            </Button>
          </nav>
        </details>
      </Container>
    </header>
  );
}
