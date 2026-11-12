// The RISA website's Adopt RISA and Feedback forms, as a DigitalOcean Function.
//
// The site POSTs a form's fields here; this sends them to a KoboToolbox form
// as one submission (OpenRosa, as kobo-mcp's create_submissions does). Kobo
// stores every message, and its REST services (webhooks) can send email
// notifications or anything else. The Kobo form is built from the site's own
// form fields by contact-form/build_xlsform.py.
//
// Only fields that exist in the *deployed* Kobo form are kept, select answers
// must be one of its choice codes, and values are trimmed and capped, so the
// site can't put anything into Kobo the form doesn't define.
//
// Environment (contact-form/.env, see README):
//   KOBO_SERVER      https://kf.kobotoolbox.org (or https://eu.kobotoolbox.org)
//   KOBO_TOKEN       API token of a dedicated account with only "Add submissions"
//                    on the one form: never a person's token
//   KOBO_ASSET_UID   the form's uid (aXXXXXXXXXXXXXXXXXXXXX)
//   ALLOWED_ORIGINS  comma-separated origins: https://risa.kobolabs.dev,http://localhost:5173

const crypto = require('node:crypto');

const MAX_FIELD = 5000;
const MAX_FIELDS = 40;
// Filled in by the function or the site, never by the visitor.
const SYSTEM = new Set(['kind', 'page']);
// A field real visitors never see: anything in it is a bot.
const HONEYPOT = 'website';

const CACHE_MS = 5 * 60 * 1000;
let cache = null;

const env = (k) => (process.env[k] || '').trim();
const server = () => env('KOBO_SERVER').replace(/\/+$/, '');

function respond(statusCode, body, origin) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...(origin ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } : {}),
    },
    body,
  };
}

async function kobo(path, init = {}) {
  const res = await fetch(`${server()}${path}`, {
    ...init,
    headers: { Authorization: `Token ${env('KOBO_TOKEN')}`, Accept: 'application/json', ...(init.headers || {}) },
  });
  return res;
}

/** The deployed form: its questions, choice codes and the values the XML must carry. Cached. */
async function deployedForm() {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.form;
  const uid = env('KOBO_ASSET_UID');
  const res = await kobo(`/api/v2/assets/${uid}/?format=json`);
  if (!res.ok) throw new Error(`Kobo returned ${res.status} for the form`);
  const asset = await res.json();
  if (!asset.has_deployment || asset.deployment__active === false) throw new Error('The Kobo form is not deployed');
  const versionUid = asset.deployed_version_id;
  // The asset's own content may be a newer, undeployed draft: read the deployed version.
  const vres = await kobo(`/api/v2/assets/${uid}/versions/${versionUid}/?format=json`);
  if (!vres.ok) throw new Error(`Kobo returned ${vres.status} for the deployed version`);
  const content = (await vres.json()).content || {};
  const questions = new Map();
  for (const row of content.survey || []) {
    const name = row.name || row.$autoname;
    if (!name || /^(begin|end)_/.test(row.type) || ['start', 'end', 'today', 'deviceid', 'calculate', 'note'].includes(row.type)) continue;
    const select = /^select_one\s+(\S+)/.exec(row.type) || (row.select_from_list_name && row.type === 'select_one' ? [0, row.select_from_list_name] : null);
    questions.set(name, { list: select ? select[1] : null });
  }
  const choices = new Map();
  for (const c of content.choices || []) {
    const name = c.name || c.$autovalue;
    if (!choices.has(c.list_name)) choices.set(c.list_name, new Set());
    choices.get(c.list_name).add(name);
  }
  const results = (asset.deployed_versions && asset.deployed_versions.results) || [];
  const latest = results.find((v) => v.uid === versionUid) || {};
  const deployed = String(latest.date_deployed || '').slice(0, 19).replace('T', ' ');
  const form = {
    uid,
    questions,
    choices,
    formhubUuid: asset.deployment__uuid,
    versionUid,
    // Collect's version label: "<deployed count> (<date deployed>)". Optional for Kobo.
    version: deployed ? `${(asset.deployed_versions && asset.deployed_versions.count) || results.length} (${deployed})` : null,
  };
  cache = { at: Date.now(), form };
  return form;
}

const escapeXml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);

/** The submission XML, shaped like a Collect/Enketo instance (kobo-mcp's build_xml). The form is flat. */
function buildXml(form, answers, instanceId) {
  const fields = Object.entries(answers)
    .map(([k, v]) => `<${k}>${escapeXml(v)}</${k}>`)
    .join('');
  const version = form.version ? ` version="${escapeXml(form.version)}"` : '';
  return (
    `<?xml version="1.0" encoding="utf-8"?>` +
    `<${form.uid} id="${form.uid}"${version}>` +
    `<formhub><uuid>${escapeXml(form.formhubUuid)}</uuid></formhub>` +
    fields +
    `<__version__>${escapeXml(form.versionUid)}</__version__>` +
    `<meta><instanceID>${instanceId}</instanceID></meta>` +
    `</${form.uid}>`
  );
}

/** The visitor's answers, kept only where the deployed form has the question. */
function clean(form, input) {
  const answers = {};
  const dropped = [];
  for (const [key, raw] of Object.entries(input).slice(0, MAX_FIELDS)) {
    if (key === HONEYPOT) continue;
    const q = form.questions.get(key);
    const value = typeof raw === 'string' ? raw.trim().slice(0, MAX_FIELD) : '';
    if (!q) {
      dropped.push(key);
      continue;
    }
    if (!value) continue;
    if (q.list && !(form.choices.get(q.list) || new Set()).has(value)) return { error: `"${key}" isn't one of the choices` };
    answers[key] = value;
  }
  return { answers, dropped };
}

async function main(args) {
  const headers = args.__ow_headers || {};
  const origin = headers.origin || '';
  const allowed = env('ALLOWED_ORIGINS').split(',').map((s) => s.trim()).filter(Boolean);
  const okOrigin = allowed.includes(origin) ? origin : '';
  const method = (args.__ow_method || 'post').toLowerCase();

  if (method === 'options') {
    return {
      statusCode: 204,
      headers: okOrigin
        ? { 'Access-Control-Allow-Origin': okOrigin, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type', Vary: 'Origin' }
        : {},
    };
  }
  if (method !== 'post') return respond(405, { ok: false, error: 'POST only' }, okOrigin);
  // Browsers send Origin on cross-site POSTs. This stops other sites' pages using
  // the function; it isn't authentication (anything can send any header).
  if (!okOrigin) return respond(403, { ok: false, error: 'Not allowed from this site' });

  // The site sends JSON as text/plain, so the browser needn't ask first (no preflight);
  // that arrives as __ow_body. A JSON content type arrives merged into args.
  let input = args;
  if (typeof args.__ow_body === 'string') {
    try {
      const text = args.__ow_body.trim().startsWith('{') ? args.__ow_body : Buffer.from(args.__ow_body, 'base64').toString('utf8');
      input = JSON.parse(text);
    } catch {
      return respond(400, { ok: false, error: 'Expected JSON' }, okOrigin);
    }
  }
  input = Object.fromEntries(Object.entries(input).filter(([k]) => !k.startsWith('__ow_')));

  // A bot filled in the hidden field: say thanks, store nothing.
  if (typeof input[HONEYPOT] === 'string' && input[HONEYPOT].trim()) return respond(200, { ok: true }, okOrigin);
  if (!['adopt', 'feedback'].includes(input.kind)) return respond(400, { ok: false, error: 'Unknown form' }, okOrigin);

  let form;
  try {
    form = await deployedForm();
  } catch (e) {
    console.error('form', e.message);
    return respond(502, { ok: false, error: "Couldn't reach the form store" }, okOrigin);
  }
  const { answers, dropped, error } = clean(form, input);
  if (error) return respond(400, { ok: false, error }, okOrigin);
  if (dropped.length) console.warn('fields not in the Kobo form, dropped:', dropped.join(', '));
  if (Object.keys(answers).filter((k) => !SYSTEM.has(k)).length === 0) return respond(400, { ok: false, error: 'The form is empty' }, okOrigin);

  const instance = crypto.randomUUID();
  const xml = buildXml(form, answers, `uuid:${instance}`);
  const body = new FormData();
  body.append('xml_submission_file', new Blob([xml], { type: 'text/xml' }), `${instance}.xml`);
  let res;
  try {
    res = await kobo('/submission', { method: 'POST', body, headers: { 'X-OpenRosa-Version': '1.0' } });
  } catch (e) {
    console.error('submit', e.message);
    return respond(502, { ok: false, error: "Couldn't reach the form store" }, okOrigin);
  }
  // 201 created; 202 a duplicate instanceID (a retry that was already stored).
  if (res.status === 201 || res.status === 202) return respond(200, { ok: true }, okOrigin);
  console.error('submit', res.status, (await res.text()).slice(0, 300));
  // A changed form: read it again next time.
  cache = null;
  return respond(502, { ok: false, error: "The message wasn't stored" }, okOrigin);
}

module.exports = { main, buildXml, clean, _reset: () => (cache = null) };
