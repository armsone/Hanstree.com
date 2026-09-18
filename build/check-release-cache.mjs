// Isolated cache-boundary check; no network, provider credentials or database calls.
// Run: node build/check-release-cache.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { transformSync } from 'esbuild';
const source = readFileSync(new URL('../worker/index.ts', import.meta.url), 'utf8').replace(/^import .*;$/gm, '');
const code = transformSync(source, { loader: 'ts', format: 'cjs' }).code;
const entries = new Map();
let calls = 0, policy = 'public, max-age=60, s-maxage=300', cookie = false, status = 200;
const module = { exports: {} };
runInNewContext(code, { module, exports: module.exports, Request, Response, Headers, URL,
  caches: { default: {
    match: async key => entries.get(key.url)?.clone(),
    put: async (key, response) => { entries.set(key.url, response.clone()); },
  } },
  handleWhattoEatAPI: async () => null,
  handler: { fetch: async () => {
    calls++;
    return Response.json({ calls }, { status, headers: { 'Cache-Control': policy, ...(cookie ? { 'Set-Cookie': 'private=1' } : {}) } });
  } },
});
async function request(path, headers = {}, method = 'GET') {
  const pending = [];
  const response = await module.exports.default.fetch(new Request('https://example.test' + path, { headers, method }), {}, { waitUntil: p => pending.push(p) });
  await Promise.all(pending);
  return response;
}
for (const path of ['/api/android-releases', '/api/testflight-builds']) {
  entries.clear(); calls = 0;
  assert.equal((await request(path)).headers.get('X-Hanstree-Cache'), 'MISS');
  const hit = await request(path + '?ignored=1');
  assert.equal(hit.headers.get('X-Hanstree-Cache'), 'HIT');
  assert.equal(hit.headers.get('Cache-Control'), policy);
  assert.equal(calls, 1);
  for (const headers of [{ Authorization: 'check' }, { RSC: '1' }]) {
    assert.equal((await request(path, headers)).headers.get('X-Hanstree-Cache'), null);
  }
  assert.equal((await request(path, {}, 'POST')).headers.get('X-Hanstree-Cache'), null);
  assert.equal(calls, 4);
}
for (const path of ['/admin', '/api/site-stats', '/api/support-contact', '/api/release-download?app=CCMB', '/apps/nasfinder']) {
  assert.equal((await request(path)).headers.get('X-Hanstree-Cache'), null);
}
for (const mode of ['private', 'no-store', 'cookie', 'error']) {
  entries.clear(); policy = mode === 'private' || mode === 'no-store' ? mode : 'public, max-age=60';
  cookie = mode === 'cookie'; status = mode === 'error' ? 500 : 200;
  await request('/api/android-releases');
  assert.equal(entries.size, 0, mode);
}
console.log('Public release cache: hit, bypass and private/error exclusion checks passed.');
