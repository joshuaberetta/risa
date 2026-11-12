import { Link } from 'react-router';
import { guide, guidePath } from '../../lib/content';
import classes from './GuidePageList.module.css';

/** The guide's pages in order, with their one-line summaries. */
export function GuidePageList() {
  return (
    <ol className={classes.list}>
      {guide
        .filter((g) => g.slug)
        .map((g) => (
          <li key={g.slug}>
            <Link to={guidePath(g)}>{g.title}</Link>
            <span>{g.summary}</span>
          </li>
        ))}
    </ol>
  );
}
