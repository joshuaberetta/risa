// Runs the function against a mock KoboToolbox server, with no network or
// account: node contact-form/test.mjs
import assert from 'node:assert/strict';
import http from 'node:http';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const fn = require('./packages/contact/submit/index.js');

const UID = 'aTestFormUid0000000000';
const received = [];
// Kobo's anonymous OpenRosa endpoint: no credentials, ever.
const mock = http.createServer((req, res) => {
  assert.equal(req.headers.authorization, undefined, 'the function must not send credentials');
  if (req.url === '/bob/submission' && req.method === 'POST') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      received.push(body);
      res.statusCode = 201;
      res.end('<OpenRosaResponse><message>Successful submission.</message></OpenRosaResponse>');
    });
    return;
  }
  res.statusCode = 404;
  res.end();
});
await new Promise((r) => mock.listen(0, r));

Object.assign(process.env, {
  KOBO_SUBMISSION_URL: `http://localhost:${mock.address().port}/bob/submission`,
  KOBO_ASSET_UID: UID,
  ALLOWED_ORIGINS: 'https://risa.kobolabs.dev,http://localhost:5173',
});

const call = (body, origin = 'https://risa.kobolabs.dev', method = 'post') =>
  fn.main({ __ow_method: method, __ow_headers: origin ? { origin } : {}, __ow_body: JSON.stringify(body) });

// A good submission: stored, with only the form's fields, escaped.
let r = await call({ kind: 'feedback', page: '/feedback', name: ' Ana <b> ', useful: 'very_useful', message: 'Map & QR worked', extra: 'x', website: '' });
assert.equal(r.statusCode, 200, JSON.stringify(r.body));
assert.equal(r.headers['Access-Control-Allow-Origin'], 'https://risa.kobolabs.dev');
assert.equal(received.length, 1);
const xml = received[0];
assert.match(xml, new RegExp(`<${UID} id="${UID}"><kind>feedback</kind><page>/feedback</page>`));
assert.match(xml, /<name>Ana &lt;b&gt;<\/name>/);
assert.match(xml, /<message>Map &amp; QR worked<\/message>/);
assert.match(xml, /<meta><instanceID>uuid:[0-9a-f-]{36}<\/instanceID><\/meta>/);
assert.doesNotMatch(xml, /extra|website/);

// Refused: another site, an unknown kind, a choice that isn't in the form, an empty form, GET.
assert.equal((await call({ kind: 'adopt', message: 'hi' }, 'https://evil.example')).statusCode, 403);
assert.equal((await call({ kind: 'adopt', message: 'hi' }, '')).statusCode, 403);
assert.equal((await call({ kind: 'spam', message: 'hi' })).statusCode, 400);
assert.equal((await call({ kind: 'feedback', useful: 'amazing' })).statusCode, 400);
assert.equal((await call({ kind: 'adopt', page: '/adopt' })).statusCode, 400);
assert.equal((await call({}, 'https://risa.kobolabs.dev', 'get')).statusCode, 405);

// A bot that fills the honeypot is thanked, and nothing is stored.
r = await call({ kind: 'adopt', message: 'buy now', website: 'http://spam' });
assert.equal(r.statusCode, 200);
assert.equal(received.length, 1);

// Preflight from the site gets CORS headers; from elsewhere it gets none.
assert.equal((await call({}, 'http://localhost:5173', 'options')).headers['Access-Control-Allow-Origin'], 'http://localhost:5173');
assert.equal((await call({}, 'https://evil.example', 'options')).headers['Access-Control-Allow-Origin'], undefined);

// Long values are capped.
await call({ kind: 'adopt', message: 'x'.repeat(9000) });
assert.match(received[1], /<message>x{5000}<\/message>/);

mock.close();
console.log('contact-form: all checks passed.');
