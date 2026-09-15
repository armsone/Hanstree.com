import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('AIplaygrand public preview is explicit and download stays pinned and allow-listed', async () => {
  const data = await readFile(new URL('../app/data.ts', import.meta.url), 'utf8');
  const releases = await readFile(new URL('../app/releases.ts', import.meta.url), 'utf8');
  const route = await readFile(new URL('../app/api/release-download/route.ts', import.meta.url), 'utf8');
  assert.match(data, /slug: "aiplaygrand"/);
  assert.match(data, /Windows 실기기·실제 로그인 이동 미검증/);
  assert.match(releases, /pinnedPreviewTag: "v0\.3\.0"/);
  assert.match(releases, /https:\/\/github.com\/armsone\/AIplaygrand-Win\/releases\/download\/v0.3.0\/AIplaygrand-Win-0.3.0-x64.zip/);
  assert.match(route, /release.draft \|\| \(release.prerelease && !allowPreview\)/);
  assert.match(route, /const key = DOWNLOAD_KEYS.find/);
  for (const file of ['icon.svg', 'flow.svg']) assert.match(await readFile(new URL(`../public/apps/aiplaygrand/${file}`, import.meta.url), 'utf8'), /<svg/);
});
