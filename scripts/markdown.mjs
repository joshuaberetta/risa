// Turns content files into data at build time, so the browser never parses
// Markdown or YAML. Used by the Vite plugin (vite.config.ts) and by
// scripts/validate-content.mjs. The syntax is in content/README.md.
//
// A Markdown body becomes a list of blocks:
//   { type: 'html', html }                       plain Markdown, rendered
//   { type: 'callout', tone, title, blocks }     :::failure / :::tip / :::kobo-mcp / :::note
//   { type: 'tabs', tabs: [{ label, badge, blocks }] }   :::tabs with ::tab lines
//   { type: 'prompt', text, tool }               ```prompt tool=deploy_form
//   { type: 'component', name }                  {{download-card}} on its own line
// Inline, {tbc} or {tbc: text} becomes a TBC marker.
// In front matter, every field named `body` is Markdown and becomes blocks too.
import { Marked } from 'marked';
import YAML from 'yaml';

export const CALLOUT_TONES = ['failure', 'tip', 'kobo-mcp', 'note'];
export const COMPONENTS = ['download-card', 'codebook', 'status-scale', 'guide-pages'];

const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

export function splitFrontMatter(raw) {
  const match = FRONT_MATTER.exec(raw);
  if (!match) return { data: {}, body: raw };
  return { data: YAML.parse(match[1]) ?? {}, body: match[2] };
}

export const slugify = (s) =>
  String(s)
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const plain = (html) => html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');

/**
 * Renders Markdown to blocks. `toc` collects every h2 (id and text) for the
 * page's contents list; ids are unique within one call of parseBody.
 */
function makeMarked(toc, used) {
  const marked = new Marked({ gfm: true });
  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        let id = slugify(plain(text)) || 'section';
        for (let n = 2; used.has(id); n++) id = `${slugify(plain(text))}-${n}`;
        used.add(id);
        if (depth === 2) toc.push({ id, text: plain(text) });
        return `<h${depth} id="${id}">${text}</h${depth}>\n`;
      },
    },
  });
  return marked;
}

// {tbc} or {tbc: dates to be confirmed} marks something waiting on the team.
const markTbc = (html) =>
  html.replace(/\{tbc(?::\s*([^}]*))?\}/g, (_, text) => `<span class="tbc">${text?.trim() || 'TBC'}</span>`);
const wrapTables = (html) => html.replace(/<table>/g, '<div class="md-table"><table>').replace(/<\/table>/g, '</table></div>');

/** Parses a Markdown body into blocks, with the h2 contents list. */
export function parseBody(src, { file = '' } = {}) {
  const toc = [];
  const used = new Set();
  const marked = makeMarked(toc, used);
  const errors = [];
  const lines = String(src ?? '').replace(/\r\n/g, '\n').split('\n');
  let i = 0;

  function parseUntil(stop) {
    const blocks = [];
    let buf = [];
    const flush = () => {
      const md = buf.join('\n').trim();
      // Tables scroll sideways on narrow screens instead of breaking the column.
      if (md) blocks.push({ type: 'html', html: markTbc(wrapTables(marked.parse(md).trim())) });
      buf = [];
    };
    while (i < lines.length) {
      const line = lines[i];
      if (stop(line)) break;
      let m;
      if ((m = /^```prompt(?:\s+tool=(\S+))?\s*$/.exec(line))) {
        flush();
        const text = [];
        for (i++; i < lines.length && !/^```\s*$/.test(lines[i]); i++) text.push(lines[i]);
        if (i >= lines.length) errors.push(`${file}: a \`\`\`prompt block is not closed`);
        i++;
        blocks.push({ type: 'prompt', text: text.join('\n').trim(), ...(m[1] ? { tool: m[1] } : {}) });
      } else if (/^```/.test(line)) {
        // An ordinary code block: keep it whole, even if it contains ::: lines.
        buf.push(line);
        for (i++; i < lines.length && !/^```\s*$/.test(lines[i]); i++) buf.push(lines[i]);
        if (i < lines.length) buf.push(lines[i]);
        i++;
      } else if (/^:::tabs\s*$/.test(line)) {
        flush();
        i++;
        const tabs = [];
        while (i < lines.length && !/^:::\s*$/.test(lines[i])) {
          const t = /^::tab\s+(.+?)(?:\s*\|\s*(.+))?\s*$/.exec(lines[i]);
          if (!t) {
            if (lines[i].trim()) errors.push(`${file}: expected "::tab Label" inside :::tabs, got "${lines[i]}"`);
            i++;
            continue;
          }
          i++;
          const blocks = parseUntil((l) => /^::tab\s/.test(l) || /^:::\s*$/.test(l));
          tabs.push({ label: t[1], ...(t[2] ? { badge: t[2] } : {}), blocks });
        }
        if (i >= lines.length) errors.push(`${file}: :::tabs is not closed`);
        if (tabs.length < 2) errors.push(`${file}: :::tabs needs at least two ::tab sections`);
        i++;
        blocks.push({ type: 'tabs', tabs });
      } else if ((m = /^:::([a-z-]+)(?:\s+(.+))?\s*$/.exec(line))) {
        flush();
        if (!CALLOUT_TONES.includes(m[1])) errors.push(`${file}: unknown block ":::${m[1]}" (use ${CALLOUT_TONES.join(', ')} or tabs)`);
        i++;
        const inner = parseUntil((l) => /^:::\s*$/.test(l));
        if (i >= lines.length) errors.push(`${file}: :::${m[1]} is not closed`);
        i++;
        blocks.push({ type: 'callout', tone: m[1], ...(m[2] ? { title: m[2] } : {}), blocks: inner });
      } else if ((m = /^\{\{([a-z-]+)\}\}\s*$/.exec(line))) {
        flush();
        if (!COMPONENTS.includes(m[1])) errors.push(`${file}: unknown component {{${m[1]}}} (use ${COMPONENTS.join(', ')})`);
        blocks.push({ type: 'component', name: m[1] });
        i++;
      } else {
        buf.push(line);
        i++;
      }
    }
    flush();
    return blocks;
  }

  const blocks = parseUntil(() => false);
  return { blocks, toc, errors };
}

/** Every `body` field in front matter, at any depth, becomes blocks. */
function renderBodies(value, file, errors) {
  if (Array.isArray(value)) return value.map((v) => renderBodies(v, file, errors));
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => {
        if (k === 'body' && typeof v === 'string') {
          const out = parseBody(v, { file });
          errors.push(...out.errors);
          return [k, out.blocks];
        }
        return [k, renderBodies(v, file, errors)];
      }),
    );
  }
  return value;
}

/** A content file as data: front matter (with bodies rendered), plus the file's own body. */
export function parseContentFile(raw, file = '') {
  const errors = [];
  const { data, body } = splitFrontMatter(raw);
  const out = renderBodies(JSON.parse(JSON.stringify(data)), file, errors);
  const parsed = parseBody(body, { file });
  errors.push(...parsed.errors);
  return { data: out, blocks: parsed.blocks, toc: parsed.toc, errors };
}

// ---------------------------------------------------------------------------
// The codebook (public/files/codebook.md, from risa-dashboard), as tables for
// the template page's searchable codebook.
// ---------------------------------------------------------------------------

const cells = (row) =>
  row
    .replace(/^\s*\|/, '')
    .replace(/\|\s*$/, '')
    .split(/(?<!\\)\|/)
    .map((c) => c.trim());

const inline = new Marked({ gfm: true });

/** The codebook's sections that matter to a reader, each as { title, columns, rows (inline HTML) }. */
export function parseCodebook(raw) {
  const KEEP = /^(Status|Sectors and feature types|Questions|Code lists|Settings)$/;
  const tables = [];
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const version = /\(version (\d+)\)/.exec(lines[0] ?? '')?.[1] ?? '';
  let h2 = '';
  let h3 = '';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('## ')) [h2, h3] = [line.slice(3).trim(), ''];
    else if (line.startsWith('### ')) h3 = line.slice(4).trim();
    else if (KEEP.test(h2) && line.startsWith('|') && /^\|[\s:|-]+\|$/.test(lines[i + 1] ?? '')) {
      const columns = cells(line);
      const rows = [];
      for (i += 2; i < lines.length && lines[i].startsWith('|'); i++) {
        rows.push(cells(lines[i]).map((c) => inline.parseInline(c.replace(/\\\|/g, '|'))));
      }
      const list = h3.replace(/`/g, '');
      tables.push({ id: slugify(list ? `list ${list}` : h2), title: list ? `List: ${list}` : h2, group: h2, columns, rows });
    }
  }
  return { version, tables };
}
