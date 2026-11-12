// Checks everything in /content before a build: `npm run lint:content`.
// The format is in content/README.md; the types in src/lib/types.ts. A change
// to the content's shape updates both, this file, the section component and
// SectionRenderer.tsx together.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { credentialsIn } from './credentials.mjs';
import { parseContentFile } from './markdown.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const rel = (file) => path.relative(root, file);
const fail = (file, msg) => errors.push(`${rel(file)}: ${msg}`);

const walk = (dir) =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]))
    : [];
const mdIn = (dir) => walk(path.join(root, 'content', dir)).filter((f) => f.endsWith('.md'));
const slugOf = (file) => path.basename(file, '.md');

// No credentials, ever (scripts/credentials.mjs).
for (const file of [...walk(path.join(root, 'content')), ...walk(path.join(root, 'public', 'files'))]) {
  if (/\.(xlsx|png|jpe?g|pdf)$/i.test(file)) continue;
  for (const re of credentialsIn(fs.readFileSync(file, 'utf8'))) fail(file, `matches the credential pattern ${re}`);
}

// ---------------------------------------------------------------------------
// Shapes
// ---------------------------------------------------------------------------

const isStr = (v) => typeof v === 'string' && v.trim() !== '';
const isBody = (v) => Array.isArray(v); // rendered by parseContentFile
const isStrList = (v) => Array.isArray(v) && v.every(isStr);
const LINK_VARIANTS = ['primary', 'secondary', 'link'];
const isLink = (v) => v && isStr(v.label) && isStr(v.href) && (v.variant === undefined || LINK_VARIANTS.includes(v.variant));
const isLinks = (v) => Array.isArray(v) && v.every(isLink);
const CALLOUT_TONES = ['failure', 'tip', 'kobo-mcp', 'note'];

/** Checks `obj` against `shape` ({ key: [required, test, description] }); unknown keys are errors. */
function check(file, where, obj, shape) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return fail(file, `${where}: expected fields, got ${JSON.stringify(obj)}`);
  for (const [key, value] of Object.entries(obj)) {
    if (!(key in shape)) fail(file, `${where}: unknown field "${key}"${value === null ? ' (a ": " or "," inside unquoted text?)' : ''}`);
  }
  for (const [key, [required, test, what]] of Object.entries(shape)) {
    const v = obj[key];
    if (v === undefined || v === null) {
      if (required) fail(file, `${where}: missing ${key}`);
    } else if (test && !test(v)) fail(file, `${where}: ${key} should be ${what}`);
  }
}
const opt = (test, what) => [false, test, what];
const req = (test, what) => [true, test, what];
const items = (shape) => (v) => Array.isArray(v) && v.length > 0 && v.every((x) => x && typeof x === 'object');

const BASE = {
  type: req(isStr, 'a section type'),
  id: opt((v) => /^[a-z0-9-]+$/.test(v), 'lower-case letters, digits and hyphens'),
  title: opt(isStr, 'text'),
  short: opt(isStr, 'text'),
  intro: opt(isStr, 'text'),
  hidden: opt((v) => typeof v === 'boolean', 'true or false'),
  tbc: opt((v) => typeof v === 'boolean', 'true or false'),
};

// Item shapes are checked one by one below.
const SECTIONS = {
  hero: { kicker: opt(isStr, 'text'), siteName: opt((v) => typeof v === 'boolean', 'true or false'), lead: opt(isStr, 'text'), questions: opt(isStrList, 'a list of text'), links: opt(isLinks, 'a list of links') },
  prose: { body: req(isBody, 'Markdown') },
  audiences: { items: req(items(), 'a list') },
  rows: { items: req(items(), 'a list'), body: opt(isBody, 'Markdown') },
  steps: { items: req(items(), 'a list'), body: opt(isBody, 'Markdown') },
  table: { columns: req(isStrList, 'a list of text'), rows: req((v) => Array.isArray(v) && v.every(isStrList), 'a list of rows of text'), caption: opt(isStr, 'text'), body: opt(isBody, 'Markdown') },
  timeline: { items: req(items(), 'a list'), body: opt(isBody, 'Markdown') },
  'status-scale': { body: opt(isBody, 'Markdown') },
  product: { pages: req((v) => Array.isArray(v) && v.length && v.every((p) => ['map', 'findings', 'hotspot'].includes(p)), 'a list of map, findings, hotspot'), body: opt(isBody, 'Markdown'), links: opt(isLinks, 'a list of links') },
  cards: { items: req(items(), 'a list'), body: opt(isBody, 'Markdown') },
  cta: { body: opt(isBody, 'Markdown'), links: req(isLinks, 'a list of links') },
  owners: {},
  stats: { items: req(items(), 'a list') },
  toolbox: { feature: opt(isStr, 'a resource id'), body: opt(isBody, 'Markdown') },
  'resource-list': { items: req(isStrList, 'a list of resource ids'), body: opt(isBody, 'Markdown'), links: opt(isLinks, 'a list of links') },
  deployments: { map: opt((v) => typeof v === 'boolean', 'true or false'), limit: opt(Number.isInteger, 'a whole number'), body: opt(isBody, 'Markdown'), links: opt(isLinks, 'a list of links') },
  governance: { layers: req(items(), 'a list'), body: opt(isBody, 'Markdown') },
  partners: { body: opt(isBody, 'Markdown') },
  form: { kind: req((v) => ['adopt', 'feedback'].includes(v), 'adopt or feedback'), subject: req(isStr, 'text'), fields: req(items(), 'a list'), submit: req(isStr, 'text'), body: opt(isBody, 'Markdown') },
  'guide-pages': { body: opt(isBody, 'Markdown') },
  callout: { tone: req((v) => CALLOUT_TONES.includes(v), CALLOUT_TONES.join(', ')), body: req(isBody, 'Markdown') },
};

const ITEMS = {
  audiences: { who: req(isStr), examples: req(isStr), question: req(isStr), gets: req(isStrList, 'a list of text'), link: opt(isLink, 'a link'), lead: opt((v) => typeof v === 'boolean') },
  rows: { term: req(isStr), detail: opt(isStr), body: req(isBody, 'Markdown'), tbc: opt((v) => typeof v === 'boolean') },
  steps: { title: req(isStr), body: opt(isBody, 'Markdown'), failure: opt(isStr) },
  timeline: { when: req(isStr), title: req(isStr), body: opt(isBody, 'Markdown') },
  cards: { title: req(isStr), kicker: opt(isStr), body: opt(isBody, 'Markdown'), link: opt(isLink, 'a link'), tbc: opt((v) => typeof v === 'boolean') },
  stats: { value: req(isStr), label: req(isStr), tbc: opt((v) => typeof v === 'boolean') },
  layers: { id: req(isStr), name: req(isStr), short: opt(isStr), text: opt(isStr), hidden: opt((v) => typeof v === 'boolean'), tbc: opt((v) => typeof v === 'boolean'), members: req(items(), 'a list') },
  members: { name: req(isStr), full: opt(isStr), role: opt(isStr), tbc: opt((v) => typeof v === 'boolean') },
  fields: {
    name: req((v) => /^[a-z][a-z0-9_]*$/.test(v), 'lower_case'),
    label: req(isStr),
    type: req((v) => ['text', 'email', 'textarea', 'select'].includes(v), 'text, email, textarea or select'),
    options: opt(isStrList, 'a list of text'),
    required: opt((v) => typeof v === 'boolean'),
    hint: opt(isStr),
    param: opt((v) => /^[a-z_]+$/.test(v), 'a query-string name'),
  },
};

// ---------------------------------------------------------------------------
// Load everything
// ---------------------------------------------------------------------------

function load(file) {
  const raw = fs.readFileSync(file, 'utf8');
  if (!raw.startsWith('---')) fail(file, 'no front matter (the file must start with ---)');
  try {
    const out = parseContentFile(raw, rel(file));
    out.errors.forEach((e) => errors.push(e));
    return out;
  } catch (e) {
    fail(file, `can't be read: ${e.message.split('\n')[0]}`);
    return { data: {}, blocks: [], toc: [] };
  }
}

const sitePath = path.join(root, 'content/settings/site.yml');
const site = YAML.parse(fs.readFileSync(sitePath, 'utf8')) ?? {};
check(sitePath, 'site.yml', site, {
  name: req(isStr),
  nameStatus: req((v) => ['pending', 'agreed'].includes(v), 'pending or agreed'),
  shortName: req(isStr),
  description: req(isStr),
  contact: req((v) => /^[^@\s]+@[^@\s]+$/.test(v), 'an email address'),
  contactTbc: opt((v) => typeof v === 'boolean'),
  dashboardUrl: req((v) => /^https:\/\//.test(v), 'an https URL'),
  partners: req(items(), 'a list'),
  endorsers: req(Array.isArray, 'a list'),
  nav: req(isLinks, 'a list of links'),
  cta: req(isLink, 'a link'),
  footer: req((v) => v && isStr(v.owners) && isLinks(v.links ?? []), 'owners and links'),
});
const partnerShape = { id: req(isStr), name: req(isStr), role: opt(isStr), note: opt(isStr), tbc: opt((v) => typeof v === 'boolean') };
[...(site.partners ?? []), ...(site.endorsers ?? [])].forEach((p, i) => check(sitePath, `partner ${p?.id ?? i}`, p, partnerShape));
const partnerIds = new Set([...(site.partners ?? []), ...(site.endorsers ?? [])].map((p) => p.id));

const downloadsPath = path.join(root, 'content/settings/downloads.yml');
const files = new Set();
if (!fs.existsSync(downloadsPath)) fail(downloadsPath, 'missing: run npm run sync:downloads');
else {
  const downloads = YAML.parse(fs.readFileSync(downloadsPath, 'utf8'));
  for (const key of ['template', 'codebook', 'legacyCodes']) {
    const f = downloads.files?.[key];
    if (!f) fail(downloadsPath, `missing files.${key}: run npm run sync:downloads`);
    else if (!fs.existsSync(path.join(root, 'public', f.path))) fail(downloadsPath, `${key}: ${f.path} is not in public/files/`);
  }
}
for (const f of walk(path.join(root, 'public/files'))) files.add(`/${path.relative(path.join(root, 'public'), f)}`);

const pages = mdIn('pages').map((f) => ({ file: f, slug: slugOf(f), ...load(f) }));
const deployments = mdIn('deployments').map((f) => ({ file: f, id: slugOf(f), ...load(f) }));
const resources = mdIn('resources').map((f) => ({ file: f, id: slugOf(f), ...load(f) }));
const guide = mdIn('guide').map((f) => ({ file: f, slug: slugOf(f), ...load(f) }));
const resourceIds = new Set(resources.map((r) => r.id));

// Every URL the site has, for checking links.
const routes = new Set([
  ...pages.map((p) => (p.slug === 'home' ? '/' : `/${p.slug}`)),
  ...deployments.map((d) => `/deployments/${d.id}`),
  ...guide.map((g) => (g.slug === 'index' ? '/guide' : `/guide/${g.slug}`)),
]);
const links = []; // [file, href]

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

for (const p of pages) {
  const { data, file } = p;
  check(file, 'front matter', data, { title: req(isStr), description: opt(isStr), toc: opt((v) => typeof v === 'boolean'), sections: req(Array.isArray, 'a list') });
  const ids = new Set();
  (data.sections ?? []).forEach((s, i) => {
    const where = `section ${i + 1} (${s?.type ?? '?'})`;
    const shape = SECTIONS[s?.type];
    if (!shape) return fail(file, `${where}: unknown type "${s?.type}" (use ${Object.keys(SECTIONS).join(', ')})`);
    check(file, where, s, { ...BASE, ...shape });
    if (s.id) {
      if (ids.has(s.id)) fail(file, `${where}: id "${s.id}" is used twice on this page`);
      ids.add(s.id);
    }
    if (data.toc && s.title && !s.id && !['hero', 'owners', 'cta'].includes(s.type)) fail(file, `${where}: needs an id, so it appears in the contents list`);
    const listKey = s.type === 'governance' ? 'layers' : s.type === 'form' ? 'fields' : 'items';
    const itemShape = ITEMS[s.type === 'governance' ? 'layers' : s.type === 'form' ? 'fields' : s.type];
    if (itemShape && Array.isArray(s[listKey])) {
      s[listKey].forEach((item, j) => {
        check(file, `${where}, item ${j + 1}`, item, itemShape);
        if (s.type === 'governance') (item.members ?? []).forEach((m, k) => check(file, `${where}, layer ${item.id}, member ${k + 1}`, m, ITEMS.members));
        if (s.type === 'form' && item.type === 'select' && !item.options?.length) fail(file, `${where}, field ${item.name}: a select needs options`);
        if (item.link) links.push([file, item.link.href]);
      });
    }
    if (s.type === 'resource-list') s.items.forEach((id) => resourceIds.has(id) || fail(file, `${where}: no resource "${id}"`));
    if (s.type === 'toolbox' && s.feature && !resourceIds.has(s.feature)) fail(file, `${where}: no resource "${s.feature}"`);
    (s.links ?? []).forEach((l) => links.push([file, l.href]));
  });
  if (data.sections?.[0] && data.sections[0].type !== 'hero') fail(file, 'the first section should be a hero');
}
if (!pages.some((p) => p.slug === 'home')) errors.push('content/pages: home.md is missing');

// ---------------------------------------------------------------------------
// Deployments
// ---------------------------------------------------------------------------

const DATE = /^\d{4}(-(\d{2}(-\d{2})?|Q[1-4]))?$/;
const isDate = (v) => v instanceof Date || DATE.test(String(v).replace(/T00:00:00\.000Z$/, ''));
const world = JSON.parse(fs.readFileSync(path.join(root, 'src/lib/world.json'), 'utf8'));
const countries = new Set(world.countries.map((c) => c.name));

for (const d of deployments) {
  const { data, file } = d;
  check(file, 'front matter', data, {
    title: req(isStr),
    kind: req((v) => ['response', 'exercise', 'training', 'workshop', 'event', 'pilot'].includes(v), 'response, exercise, training, workshop, event or pilot'),
    status: req((v) => ['done', 'active', 'planned'].includes(v), 'done, active or planned'),
    mode: opt((v) => ['deployed', 'remote', 'both'].includes(v), 'deployed, remote or both'),
    scenario: opt((v) => ['full', 'hybrid', 'rapid'].includes(v), 'full, hybrid or rapid'),
    place: req(isStr),
    countries: req(Array.isArray, 'a list'),
    iso3: req((v) => Array.isArray(v) && v.every((c) => /^[A-Z]{3}$/.test(c)), 'a list of ISO3 codes'),
    locations: opt((v) => Array.isArray(v) && v.every((l) => isStr(l.name) && typeof l.lat === 'number' && typeof l.lon === 'number'), 'a list of { name, lat, lon }'),
    hazard: opt(isStr),
    start: req(isDate, 'yyyy-mm-dd, yyyy-mm, yyyy or yyyy-Qn'),
    end: opt(isDate, 'yyyy-mm-dd, yyyy-mm, yyyy or yyyy-Qn'),
    partners: req(isStrList, 'a list of partner ids'),
    summary: req(isStr),
    facts: opt((v) => Array.isArray(v) && v.every((f) => isStr(f.label) && isStr(f.value)), 'a list of { label, value }'),
    products: opt(isStrList, 'a list of text'),
    lessons: opt(isStrList, 'a list of text'),
    resources: opt(isStrList, 'a list of resource ids'),
    note: opt(isStr),
    tbc: opt((v) => typeof v === 'boolean'),
  });
  (data.partners ?? []).forEach((p) => partnerIds.has(p) || fail(file, `no partner "${p}" in site.yml`));
  (data.resources ?? []).forEach((r) => resourceIds.has(r) || fail(file, `no resource "${r}"`));
  (data.countries ?? []).forEach((c) => countries.has(c) || fail(file, `"${c}" isn't a country name on the world map (src/lib/world.json)`));
  // A deployment with neither (a training not yet placed) is listed but not on the map.
}

// ---------------------------------------------------------------------------
// Resources
// ---------------------------------------------------------------------------

const orders = new Map();
for (const r of resources) {
  const { data, file } = r;
  check(file, 'front matter', data, {
    order: req(Number.isInteger, 'a whole number'),
    category: req((v) => ['sop', 'forms', 'gis', 'training', 'comms'].includes(v), 'sop, forms, gis, training or comms'),
    code: req(isStr),
    title: req(isStr),
    version: opt((v) => isStr(String(v)), 'text'),
    status: req((v) => ['available', 'draft', 'in-progress', 'planned'].includes(v), 'available, draft, in-progress or planned'),
    follows: opt((v) => resourceIds.has(v), 'another resource id'),
    owner: req(isStr),
    format: opt(isStr),
    languages: opt(isStrList, 'a list of text'),
    updated: opt(isDate, 'a date'),
    summary: req(isStr),
    details: opt(isStrList, 'a list of text'),
    files: opt((v) => Array.isArray(v) && v.every((f) => isStr(f.label) && isStr(f.path)), 'a list of { label, path }'),
    link: opt(isLink, 'a link'),
    note: opt(isStr),
    tbc: opt((v) => typeof v === 'boolean'),
  });
  (data.files ?? []).forEach((f) => files.has(f.path) || fail(file, `${f.path} is not in public/files/`));
  if (data.link) links.push([file, data.link.href]);
  if (orders.has(data.order)) fail(file, `order ${data.order} is also used by ${orders.get(data.order)}`);
  orders.set(data.order, r.id);
}

// ---------------------------------------------------------------------------
// The guide
// ---------------------------------------------------------------------------

const guideOrders = new Map();
for (const g of guide) {
  const { data, file } = g;
  check(file, 'front matter', data, {
    title: req(isStr),
    order: req(Number.isInteger, 'a whole number'),
    annexRef: opt(isStr),
    summary: req(isStr),
    lastChecked: req(isDate, 'a date'),
  });
  if (guideOrders.has(data.order)) fail(file, `order ${data.order} is also used by ${guideOrders.get(data.order)}.md`);
  guideOrders.set(data.order, g.slug);
  if (!g.blocks.length) fail(file, 'the page has no body');
}
if (guide.length && !guide.some((g) => g.slug === 'index')) errors.push('content/guide: index.md (the /guide overview) is missing');

// ---------------------------------------------------------------------------
// Links inside the site: every /path must be a page, a file or the review site
// ---------------------------------------------------------------------------

function collectHtml(value, file) {
  if (Array.isArray(value)) value.forEach((v) => collectHtml(v, file));
  else if (value && typeof value === 'object') {
    if (value.type === 'html' && typeof value.html === 'string') {
      for (const m of value.html.matchAll(/href="([^"]+)"/g)) links.push([file, m[1].replace(/&amp;/g, '&')]);
    }
    Object.values(value).forEach((v) => collectHtml(v, file));
  }
}
for (const c of [...pages, ...deployments, ...resources, ...guide]) {
  collectHtml(c.data, c.file);
  collectHtml(c.blocks, c.file);
}
for (const [file, href] of links) {
  if (!href.startsWith('/') || href.startsWith('//')) continue;
  const [pathPart] = href.split(/[?#]/);
  const p = pathPart.replace(/\/+$/, '') || '/';
  if (p.startsWith('/designs') || files.has(p) || routes.has(p)) continue;
  fail(file, `links to ${href}, which isn't a page or a file on this site`);
}

if (errors.length) {
  console.error(`Content check failed (${errors.length}):\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log(`Content OK: ${pages.length} pages, ${deployments.length} deployments, ${resources.length} resources, ${guide.length} guide pages.`);
