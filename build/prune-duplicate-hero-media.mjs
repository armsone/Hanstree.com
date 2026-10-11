// Preserve source media; deploy optimized variants and redirect duplicate original URLs.
import { readFile, unlink, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const output = path.join(root, 'dist/client');
const manifest = JSON.parse(await readFile(path.join(root, 'app/image-manifest.json'), 'utf8'));
const sourceRedirects = await readFile(path.join(root, 'public/_redirects'), 'utf8').catch(e => { if (e.code === 'ENOENT') return ''; throw e; });
const redirects = []; let omittedBytes = 0;
for (const [url, entry] of Object.entries(manifest)) {
  if (!url.startsWith('/') || url.includes('..') || !entry.src.startsWith('/optimized/') || entry.src.includes('..') || entry.srcSet.includes(url)) continue;
  const file = path.join(output, url);
  await stat(path.join(output, entry.src));
  try { omittedBytes += (await stat(file)).size; await unlink(file); }
  catch (e) { if (e.code !== 'ENOENT') throw e; }
  redirects.push(`${url} ${entry.src} 302`);
}
await writeFile(path.join(output, '_redirects'), sourceRedirects.trimEnd() + '\n' + redirects.join('\n') + '\n');
console.log(JSON.stringify({ duplicateOriginalRedirects: redirects.length, omittedBytes, sourceMediaPreserved: true }));
