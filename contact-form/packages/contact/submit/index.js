// The RISA website's Adopt RISA and Feedback forms, as a DigitalOcean Function.
//
// The site POSTs a form's fields here; this sends them to a KoboToolbox form
// as one submission (OpenRosa, as Enketo and Collect do). Kobo stores every
// message, and its REST services send the email notifications. The Kobo form
// takes anonymous submissions, so this holds no Kobo credentials at all.
//
// form.json (written by contact-form/build_xlsform.py, from the site's own form
// fields) lists the form's questions and choice codes. Only those are sent,
// select answers must be one of the codes, and values are trimmed and capped.
//
// Environment (contact-form/.env, see README):
//   KOBO_SUBMISSION_URL  the form owner's OpenRosa endpoint, which takes anonymous
//                        submissions: https://kc.kobotoolbox.org/<owner>/submission
//                        (EU: https://kc-eu.kobotoolbox.org/<owner>/submission)
//   KOBO_ASSET_UID       the form's uid (aXXXXXXXXXXXXXXXXXXXXX)
//   ALLOWED_ORIGINS      comma-separated: https://risa.kobolabs.dev,http://localhost:5173

const crypto = require('node:crypto');
const FORM = require('./form.json');

const MAX_FIELD = 5000;
const MAX_FIELDS = 40;
// Filled in by the site, not typed by the visitor.
const SYSTEM = new Set(['kind', 'page']);
// A field real visitors never see: anything in it is a bot.
const HONEYPOT = 'website';

const env = (k) => (process.env[k] || '').trim();

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

const escapeXml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);

/**
 * The submission XML, shaped like an Enketo instance: root tag and id are the
 * form's uid, one element per answer (the form is flat), and an instanceID.
 * Kobo accepts it without formhub/uuid or __version__ (checked on kf, 2026-11-12).
 */
function buildXml(uid, answers, instanceId) {
  const fields = Object.entries(answers)
    .map(([k, v]) => `<${k}>${escapeXml(v)}</${k}>`)
    .join('');
  return `<?xml version="1.0" encoding="utf-8"?><${uid} id="${uid}">${fields}<meta><instanceID>${instanceId}</instanceID></meta></${uid}>`;
}

/** The visitor's answers, kept only where the form has the question. */
function clean(input, form = FORM) {
  const answers = {};
  const dropped = [];
  for (const [key, raw] of Object.entries(input).slice(0, MAX_FIELDS)) {
    if (key === HONEYPOT) continue;
    if (!Object.prototype.hasOwnProperty.call(form.questions, key)) {
      dropped.push(key);
      continue;
    }
    const value = typeof raw === 'string' ? raw.trim().slice(0, MAX_FIELD) : '';
    if (!value) continue;
    const list = form.questions[key];
    if (list && !(form.choices[list] || []).includes(value)) return { error: `"${key}" isn't one of the choices` };
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

  const { answers, dropped, error } = clean(input);
  if (error) return respond(400, { ok: false, error }, okOrigin);
  if (dropped.length) console.warn('fields not in form.json, dropped:', dropped.join(', '));
  if (Object.keys(answers).filter((k) => !SYSTEM.has(k)).length === 0) return respond(400, { ok: false, error: 'The form is empty' }, okOrigin);

  const instance = crypto.randomUUID();
  const body = new FormData();
  const xml = buildXml(env('KOBO_ASSET_UID'), answers, `uuid:${instance}`);
  body.append('xml_submission_file', new Blob([xml], { type: 'text/xml' }), `${instance}.xml`);
  let res;
  try {
    res = await fetch(env('KOBO_SUBMISSION_URL'), { method: 'POST', body, headers: { 'X-OpenRosa-Version': '1.0' } });
  } catch (e) {
    console.error('submit', e.message);
    return respond(502, { ok: false, error: "Couldn't reach the form store" }, okOrigin);
  }
  // 201 created; 202 a duplicate instanceID (a retry that was already stored).
  if (res.status === 201 || res.status === 202) return respond(200, { ok: true }, okOrigin);
  console.error('submit', res.status, (await res.text()).slice(0, 300));
  return respond(502, { ok: false, error: "The message wasn't stored" }, okOrigin);
}

module.exports = { main, buildXml, clean };
