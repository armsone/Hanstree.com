// Run after signing/packaging, before publishing the release. No files are uploaded by this helper.
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { basename } from 'node:path';
import { createHash } from 'node:crypto';
const args = process.argv.slice(2);
const options = new Map();
for (let i = 0; i < args.length; i += 2) {
  if (!args[i].startsWith('--') || !args[i + 1] || args[i + 1].startsWith('--')) throw new Error('Expected --option value pairs');
  const values = options.get(args[i]) ?? [];
  options.set(args[i], [...values, args[i + 1]]);
}
for (const key of options.keys()) if (!['--artifact', '--version', '--build', '--version-code', '--minimum-os', '--output'].includes(key)) throw new Error(`Unknown option: ${key}`);
const version = options.get('--version')?.[0];
if (!/^\d+\.\d+\.\d+$/.test(version ?? '')) throw new Error('--version must be the packaged product version');
const artifactArgs = options.get('--artifact') ?? [];
if (!artifactArgs.length) throw new Error('Provide --artifact DownloadKey=/absolute/path for each file');
const catalog = readFileSync(new URL('../app/releases.ts', import.meta.url), 'utf8').split('] as const;')[0];
const seen = new Set();
const downloads = artifactArgs.map((entry) => {
  const separator = entry.indexOf('=');
  const key = entry.slice(0, separator), path = entry.slice(separator + 1);
  if (separator < 1 || !catalog.includes(`"${key}"`) || seen.has(key)) throw new Error(`Unknown or duplicate download key: ${key}`);
  seen.add(key);
  const name = basename(path), size = statSync(path).size;
  if (!size || !name.includes(version)) throw new Error(`File must be nonempty and include packaged version ${version}: ${name}`);
  const build = options.get('--build')?.[0];
  if (build && !/^\d{1,20}$/.test(build)) throw new Error('Invalid build number');
  const versionCode = options.get('--version-code')?.[0];
  if (versionCode && (!Number.isSafeInteger(Number(versionCode)) || Number(versionCode) <= 0)) throw new Error('Invalid Android version code');
  return { key, version, ...(build ? { build } : {}), ...(versionCode ? { versionCode: Number(versionCode) } : {}), ...(options.has('--minimum-os') ? { minimumOS: options.get('--minimum-os')[0] } : {}), asset: { name, size, sha256: createHash('sha256').update(readFileSync(path)).digest('hex') } };
});
const output = options.get('--output')?.[0] ?? 'release.json';
writeFileSync(output, JSON.stringify({ schemaVersion: 1, downloads }, null, 2) + '\n');
console.log(`Release metadata: ${downloads.length} artifact(s), ${output}`);
