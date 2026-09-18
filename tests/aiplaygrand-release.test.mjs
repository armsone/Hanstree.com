import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('AIplaygrand public preview is explicit and download stays pinned and allow-listed', async () => {
  const data = await readFile(new URL('../app/data.ts', import.meta.url), 'utf8');
  const releases = await readFile(new URL('../app/releases.ts', import.meta.url), 'utf8');
  const route = await readFile(new URL('../app/api/release-download/route.ts', import.meta.url), 'utf8');
  assert.match(data, /slug: "aiplaygrand"/);
  assert.match(data, /Windows 실기기 업데이트·재시작·실패 복구·물리 USB 이동·실제 OAuth 복원과 사용량 흐름 미검증/);
  assert.match(releases, /pinnedPreviewTag: "v0\.6\.2"/);
  assert.match(releases, /https:\/\/github.com\/armsone\/AIplaygrand-Win\/releases\/download\/v0.6.2\/AIplaygrand-Win-0.6.2-x64.zip/);
  assert.match(route, /release.draft \|\| \(release.prerelease && !allowPreview\)/);
  assert.match(route, /const key = DOWNLOAD_KEYS.find/);
  for (const file of ['icon.svg', 'flow.svg']) assert.match(await readFile(new URL(`../public/apps/aiplaygrand/${file}`, import.meta.url), 'utf8'), /<svg/);
});
