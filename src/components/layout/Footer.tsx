import { Container } from '@mantine/core';
import { site } from '../../lib/content';
import { Logo } from '../brand/Logo';
import { SmartLink } from '../SmartLink';
import classes from './Footer.module.css';

export function Footer() {
  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <span className={classes.logo}>
          <Logo />
        </span>
        <p>{site.footer.owners}</p>
        <ul className={classes.links}>
          {site.footer.links.map((link) => (
            <li key={link.href}>
              <SmartLink href={link.href}>{link.label}</SmartLink>
            </li>
          ))}
        </ul>
        {site.footer.note && <p className={classes.fine}>{site.footer.note}</p>}
        <p className={classes.fine}>
          © {import.meta.env.VITE_BUILD_YEAR} Kobo, MapAction and Atlas Logistique.
        </p>
      </Container>
    </footer>
  );
}
