// Run `node build/optimize-images.mjs [inventory.json]` after changing media.
// Conversion happens before deployment; visitors only receive static files.
import { readFile, writeFile, readdir, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const publicDir = path.join(root, 'public');
async function imagesIn(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.filter(e => e.name !== 'optimized').map(e => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? imagesIn(p) : /\.(png|jpe?g|webp)$/i.test(p) ? [p] : [];
  }));
  return files.flat();
}
const sources = process.argv[2]
  ? JSON.parse(await readFile(process.argv[2], 'utf8')).items.map(i => i.src)
  : (await imagesIn(publicDir)).map(p => '/' + path.relative(publicDir, p));
await mkdir(path.join(publicDir, 'optimized'), { recursive: true });
const manifest = {};
let originalBytes = 0, largestBytes = 0;
for (const src of [...new Set(sources)].sort()) {
  if (!/\.(png|jpe?g|webp)$/i.test(src) || src.startsWith('/optimized/')) continue;
  const input = path.resolve(publicDir, '.' + src);
  if (!input.startsWith(publicDir + path.sep)) throw new Error('Image outside public: ' + src);
  const data = await readFile(input);
  const meta = await sharp(data).metadata();
  const { width: sourceWidth, height: sourceHeight } = meta.autoOrient ?? meta;
  if (!sourceWidth || !sourceHeight || (meta.pages ?? 1) > 1) continue;
  if (sourceWidth <= 256 && data.length <= 100 * 1024) continue;
  const options = src.includes('/screens/') ? { quality: 92, nearLossless: true, effort: 4 } : { quality: 82, effort: 4 };
  const hash = createHash('sha256').update(data).update(JSON.stringify(options) + '-v1' + (meta.orientation > 1 ? '-oriented' : '')).digest('hex').slice(0, 16);
  const widths = [...new Set([128, 640, 1280, Math.min(sourceWidth, 1920)])].filter(w => w <= sourceWidth).sort((a,b) => a-b);
  const variants = [];
  for (const width of widths) {
    const url = `/optimized/${hash}-${width}.webp`;
    const output = path.join(publicDir, url);
    let bytes = await stat(output).then(s => s.size).catch(() => 0);
    if (!bytes) {
      const result = await sharp(data).rotate().resize({ width, withoutEnlargement: true }).webp(options).toBuffer();
      bytes = result.length;
      if (bytes < data.length) await writeFile(output, result);
    }
    if (bytes < data.length) variants.push({ src: url, width, bytes });
  }
  // Never replace a sharp original with only a tiny thumbnail when recompression loses.
  if (variants.at(-1)?.width !== widths.at(-1)) variants.push({ src, width: sourceWidth, bytes: data.length });
  if (variants.length === 1 && variants[0].src === src) continue;
  const largest = variants.at(-1);
  manifest[src] = { src: largest.src, width: sourceWidth, height: sourceHeight,
    srcSet: variants.map(v => `${v.src} ${v.width}w`).join(', ') };
  originalBytes += data.length;
  largestBytes += largest.bytes;
}
await writeFile(path.join(root, 'app/image-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ images: Object.keys(manifest).length, originalBytes, largestBytes,
  reductionPercent: Math.round((1-largestBytes/originalBytes)*1000)/10 }));
