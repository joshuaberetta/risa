import { TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import codebook from 'virtual:codebook';
import { asset } from '../../lib/url';
import { downloads } from '../../lib/content';
import classes from './Codebook.module.css';

const strip = (html: string) => html.replace(/<[^>]+>/g, '').toLowerCase();

/**
 * The template's codebook (public/files/codebook.md, synced from
 * risa-dashboard), as searchable tables. Parsed at build time by
 * scripts/markdown.mjs, so it's always the same version as the download.
 */
export function Codebook() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const tables = useMemo(
    () =>
      codebook.tables
        .map((t) => ({ ...t, shown: q ? t.rows.filter((r) => r.some((c) => strip(c).includes(q)) || t.title.toLowerCase().includes(q)) : t.rows }))
        .filter((t) => t.shown.length),
    [q],
  );
  const lists = tables.filter((t) => t.group === 'Code lists');
  const main = tables.filter((t) => t.group !== 'Code lists');
  const count = tables.reduce((n, t) => n + t.shown.length, 0);
  return (
    <section id="codebook" className={classes.codebook} aria-labelledby="codebook-title">
      <h2 id="codebook-title">The codebook</h2>
      <p>
        Every question, choice list and setting in template version <code>{codebook.version}</code>. Search by field name, label or code. The same
        file is a <a href={asset(downloads.files.codebook.path)}>download</a>.
      </p>
      <TextInput
        className={classes.search}
        label="Search the codebook"
        placeholder="e.g. status, water, obs/count"
        leftSection={<IconSearch size={18} aria-hidden />}
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
      />
      <p className={classes.count} aria-live="polite">
        {q ? `${count} matching ${count === 1 ? 'row' : 'rows'}` : `${count} rows`}
      </p>
      {main.map((t) => (
        <CodebookTable key={t.id} table={t} />
      ))}
      {lists.length > 0 && (
        <>
          <h3>Code lists</h3>
          {lists.map((t) => (
            <CodebookTable key={t.id} table={t} small />
          ))}
        </>
      )}
    </section>
  );
}

function CodebookTable({ table, small }: { table: (typeof codebook.tables)[number] & { shown: string[][] }; small?: boolean }) {
  // Drop columns that are empty in every row shown (most questions have no notes).
  const keep = table.columns.map((_, i) => table.shown.some((r) => r[i]));
  return (
    <div className={classes.block}>
      {small ? <h4 id={table.id}>{table.title.replace('List: ', '')}</h4> : <h3 id={table.id}>{table.title}</h3>}
      <div className={classes.scroll}>
        <table>
          <thead>
            <tr>
              {table.columns.map((c, i) => keep[i] && <th key={c} scope="col">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {table.shown.map((row, r) => (
              <tr key={r}>
                {row.map((cell, i) => keep[i] && <td key={i} dangerouslySetInnerHTML={{ __html: cell }} />)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
