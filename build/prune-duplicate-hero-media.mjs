// Keep source media; omit duplicate legacy hero originals from deployment only.
// SiteImage already renders their optimized variants, and metadata uses explicit hero/icon paths.
import { readFile, readdir, unlink } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const manifest = JSON.parse(await readFile(path.join(root, 'app/image-manifest.json'), 'utf8'));
async function sourceText(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(async e => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? sourceText(p) : /\.(tsx?|html)$/.test(e.name) ? readFile(p, 'utf8') : '';
  }))).join('\n');
}
const text = await sourceText(path.join(root, 'app')) + await sourceText(path.join(root, 'public'));
let removed = 0;
for (const [url, entry] of Object.entries(manifest)) {
  if (!/^\/apps\/([^/]+)\/\1-hero-v2\.png$/.test(url) || text.includes(url) ||
      !entry.src.startsWith('/optimized/') || entry.srcSet.includes(url)) continue;
  const file = path.join(root, 'dist/client', url);
  await unlink(file);
  removed++;
}
console.log(JSON.stringify({ omittedDuplicateHeroOriginals: removed, sourceMediaPreserved: true }));
