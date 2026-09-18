import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { build } from 'esbuild';
import test from 'node:test';

// Run with: node --test tests/catalogue-assets.test.mjs
// Verify the product data and shared icon table, including appended features.
test('every catalogue feature, guide and shared icon resolves to an existing visual', async () => {
  const result = await build({ entryPoints: ['app/data.ts'], bundle: true, write: false, platform: 'node', format: 'esm' });
  const { apps } = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
  const route = readFileSync('app/apps/[...path]/page.tsx', 'utf8');
  const visuals = JSON.parse(route.match(/const contentVisuals[^=]*= (\{[\s\S]*?\n\});/)[1]);
  const shared = readFileSync('app/components/AdvantageVisual.tsx', 'utf8');
  const variantKeys = new Set([...shared.matchAll(/^  "([^"]+)": /gm)].map(m => m[1]));
  function asset(src, label) {
    assert.ok(src?.startsWith('/'), `Missing visual: ${label}`);
    assert.ok(existsSync(`public${src}`), `Missing file: ${label} → ${src}`);
  }
  for (const app of apps) {
    for (const feature of app.features) asset(feature.icon, `${app.slug}: ${feature.title}`);
    for (const step of app.guide) assert.ok(variantKeys.has(visuals[step.title]), `Missing guide icon: ${app.slug}: ${step.title}`);
    asset(app.heroImage ?? `/apps/${app.slug}/${app.slug}-hero-v2.png`, `${app.slug}: hero`);
    for (const screen of app.screenshots ?? []) asset(screen.src, `${app.slug}: screenshot`);
  }
  for (const match of shared.matchAll(/"(\/(?:apps|icons)\/[^"\n]+)"/g)) asset(match[1], 'shared icon');
  const variants = shared.split('export type AdvantageVariant =')[1].split('const glow')[0].matchAll(/"([a-z-]+)"/g);
  for (const [, variant] of variants) assert.ok(variantKeys.has(variant), `Empty shared icon: ${variant}`);
  assert.doesNotMatch(route, /features\/feature-\$\{/, 'Do not invent indexed image filenames');
});
