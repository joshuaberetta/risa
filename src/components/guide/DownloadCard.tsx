import { Button } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { Link } from 'react-router';
import { downloads, getResource, resourceStatus } from '../../lib/content';
import { formatBytes, formatDate } from '../../lib/format';
import { asset } from '../../lib/url';
import { Mono } from '../Typography';
import classes from './DownloadCard.module.css';

const FILES = [
  { key: 'template', label: 'XLSForm template', ext: '.xlsx' },
  { key: 'codebook', label: 'Codebook', ext: '.md' },
  { key: 'legacyCodes', label: 'Mapping from earlier forms', ext: '.csv' },
] as const;

/**
 * The template package, as synced from risa-dashboard (downloads.yml). The
 * guide always offers it; until the xlsform resource is `available` (the
 * working group's sign-off), it's labelled a test version.
 */
export function DownloadCard() {
  const xlsform = getResource('xlsform');
  const live = xlsform ? resourceStatus(xlsform) === 'available' : false;
  return (
    <section className={classes.card} aria-labelledby="download-card-title">
      <h3 id="download-card-title" className={classes.title}>
        The RISA form template
      </h3>
      <p className={classes.meta}>
        Version <Mono>{downloads.version}</Mono> · updated {formatDate(downloads.synced)} · English only; to add your language, see{' '}
        <Link to="/guide/languages">Add a language</Link>.
      </p>
      {!live && (
        <p className={classes.status}>
          Test version until the working group signs off. Use it, test it, and <Link to="/feedback">tell us what breaks</Link>.
        </p>
      )}
      <ul className={classes.files}>
          {FILES.map((f) => {
            const file = downloads.files[f.key];
            return (
              <li key={f.key}>
                <Button
                  component="a"
                  href={asset(file.path)}
                  download
                  variant={f.key === 'template' ? 'filled' : 'outline'}
                  color={f.key === 'template' ? 'blue' : 'ink.9'}
                  leftSection={<IconDownload size={18} stroke={2} aria-hidden />}
                >
                  {f.label} ({f.ext})
                </Button>
                <span className={classes.size}>{formatBytes(file.bytes)}</span>
              </li>
            );
          })}
      </ul>
      <p className={classes.more}>
        The codebook is also <Link to="/guide/template#codebook">readable on this site</Link>.
      </p>
    </section>
  );
}
