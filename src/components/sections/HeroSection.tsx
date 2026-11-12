import { Container } from '@mantine/core';
import { site } from '../../lib/content';
import type { HeroSection as Hero } from '../../lib/types';
import { LinkGroup } from '../SmartLink';
import { Kicker, Tbc } from '../Typography';
import classes from './HeroSection.module.css';

/** Handbook's opening: a kicker, the title, a lead and (on the home page) the three questions. */
export function HeroSection({ section }: { section: Hero }) {
  return (
    <section className={classes.hero} id={section.id}>
      <Container>
        {section.kicker && <Kicker>{section.kicker}</Kicker>}
        <h1 className={classes.title}>
          {section.siteName ? site.name : section.title}
          {section.tbc && <Tbc />}
        </h1>
        {section.siteName && site.nameStatus === 'pending' && <p className={classes.note}>Name pending sign-off by the working group</p>}
        {section.lead && <p className={classes.lead}>{section.lead}</p>}
        {section.questions && (
          <ol className={classes.questions}>
            {section.questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ol>
        )}
        <LinkGroup links={section.links} />
      </Container>
    </section>
  );
}
