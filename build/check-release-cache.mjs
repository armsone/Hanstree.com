// Isolated cache-boundary check; no network, provider credentials or database calls.
// Run: node build/check-release-cache.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { transformSync } from 'esbuild';
const source = readFileSync(new URL('../worker/index.ts', import.meta.url), 'utf8').replace(/^import .*;$/gm, '');
const code = transformSync(source, { loader: 'ts', format: 'cjs' }).code;
function fixture(policy = 'public, max-age=60, s-maxage=300', cookie = false, status = 200) {
  let calls = 0, now = 1000;
  const module = { exports: {} };
  runInNewContext(code, { module, exports: module.exports, Request, Response, Headers, URL,
    Date: class extends Date { static now() { return now; } },
    handleWhattoEatAPI: async () => null,
    handler: { fetch: async () => {
      calls++;
      return Response.json({ calls }, { status, headers: { 'Cache-Control': policy, ...(cookie ? { 'Set-Cookie': 'private=1' } : {}) } });
    } },
  });
  return {
    calls: () => calls,
    expire: () => { now += 301000; },
    request: (path, headers = {}, method = 'GET') => module.exports.default.fetch(
      new Request('https://example.test' + path, { headers, method }), {}, { waitUntil() {} }),
  };
}
for (const path of ['/api/android-releases', '/api/testflight-builds']) {
  const f = fixture();
  assert.equal((await f.request(path)).headers.get('X-Hanstree-Cache'), 'MISS');
  const hit = await f.request(path + '?ignored=1');
  assert.equal(hit.headers.get('X-Hanstree-Cache'), 'HIT');
  assert.equal(hit.headers.get('Cache-Control'), 'public, max-age=60, s-maxage=300');
  assert.equal(f.calls(), 1);
  for (const headers of [{ Authorization: 'check' }, { RSC: '1' }]) {
    assert.equal((await f.request(path, headers)).headers.get('X-Hanstree-Cache'), null);
  }
  assert.equal((await f.request(path, {}, 'POST')).headers.get('X-Hanstree-Cache'), null);
  assert.equal(f.calls(), 4);
  f.expire();
  assert.equal((await f.request(path)).headers.get('X-Hanstree-Cache'), 'MISS');
  assert.equal(f.calls(), 5);
}
for (const path of ['/admin', '/api/site-stats', '/api/support-contact', '/api/release-download?app=CCMB', '/apps/nasfinder']) {
  assert.equal((await fixture().request(path)).headers.get('X-Hanstree-Cache'), null);
}
for (const [policy, cookie, status] of [['private', false, 200], ['public, no-store', false, 200], ['public, max-age=60', true, 200], ['public, max-age=60', false, 500], ['public, max-age=0', false, 200]]) {
  const f = fixture(policy, cookie, status);
  await f.request('/api/android-releases');
  await f.request('/api/android-releases');
  assert.equal(f.calls(), 2);
}
console.log('Public release cache: hit, expiry, bypass and private/error exclusion checks passed.');
