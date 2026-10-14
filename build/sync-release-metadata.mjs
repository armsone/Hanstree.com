// Backfill release.json from public GitHub asset facts. Default is read-only; --publish adds missing metadata.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { RELEASE_DOWNLOADS } from '../app/releases.ts';
const args = process.argv.slice(2);
if (args.some((arg) => arg !== '--publish' && !arg.startsWith('--repo='))) throw new Error('Use [--publish] [--repo=Repository]');
const publish = args.includes('--publish');
const onlyRepo = args.find((arg) => arg.startsWith('--repo='))?.slice(7);
const work = mkdtempSync(join(tmpdir(), 'hanstree-release-info-'));
const api = (path) => JSON.parse(execFileSync('gh', ['api', path], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 }));
const report = [];
try {
 const repos = [...new Set(Object.values(RELEASE_DOWNLOADS).map((entry) => entry.repo))].filter((repo) => !onlyRepo || repo === onlyRepo);
 if (!repos.length) throw new Error('Unknown registered repository');
 for (const repo of repos) {
  try {
   const repository = api(`repos/armsone/${repo}`);
   if (repository.private) throw new Error('Only existing public releases are supported');
   const releases = api(`repos/armsone/${repo}/releases?per_page=100`);
   let latest = null;
   if (Object.values(RELEASE_DOWNLOADS).some((c) => c.repo === repo && !c.tagPattern && !c.allowPreview && !c.pinnedPreviewTag)) {
    try { latest = api(`repos/armsone/${repo}/releases/latest`); } catch { /* The list still handles preview-only or legacy repositories. */ }
   }
   const groups = new Map();
   for (const [key, config] of Object.entries(RELEASE_DOWNLOADS).filter(([, c]) => c.repo === repo)) {
    const candidates = config.pinnedPreviewTag ? releases.filter((r) => r.tag_name === config.pinnedPreviewTag)
      : !config.tagPattern && !config.allowPreview && latest ? [latest, ...releases.filter((r) => r.id !== latest.id)] : releases;
    let found = false;
    for (const release of candidates) {
     if (release.draft || (release.prerelease && !config.allowPreview && !config.pinnedPreviewTag) || (config.tagPattern && !config.tagPattern.test(release.tag_name))) continue;
     if (config.releasePage) { report.push({ key, repo, tag: release.tag_name, status: 'release-page', reason: 'Uses the published source release page; no package metadata needed' }); found = true; break; }
     const matching = release.assets.filter((a) => a.state === 'uploaded' && a.size > 0 && config.assetPattern.test(a.name) && a.browser_download_url.startsWith(`https://github.com/armsone/${repo}/releases/download/`));
     if (matching.length > 1) throw new Error(`Ambiguous assets for ${key} at ${release.tag_name}`);
     if (!matching.length) continue;
     const asset = matching[0];
     const version = release.tag_name.match(/\d+\.\d+\.\d+/)?.[0] ?? asset.name.match(/\d+\.\d+\.\d+/)?.[0];
     if (!version) throw new Error(`Missing product version for ${key}`);
     let sha256 = asset.digest?.match(/^sha256:([a-f0-9]{64})$/i)?.[1];
     if (!sha256) {
      const response = await fetch(asset.browser_download_url, { signal: AbortSignal.timeout(60000) });
      if (!response.ok) throw new Error(`Asset download failed for ${key}: ${response.status}`);
      const hash = createHash('sha256'); let size = 0;
      for await (const chunk of response.body) { hash.update(chunk); size += chunk.length; }
      if (size !== asset.size) throw new Error(`Asset size mismatch for ${key}`);
      sha256 = hash.digest('hex');
     }
     const build = release.body?.match(/^Build-Number:\s*(\d{1,20})\s*$/mi)?.[1] ?? asset.name.match(/-(\d{12})(?:\.|-)/)?.[1];
     const code = release.body?.match(/^Android-Version-Code:\s*(\d+)\s*$/mi)?.[1];
     const entry = { key, version, ...(build ? { build } : {}), ...(code && Number.isSafeInteger(Number(code)) && Number(code) > 0 ? { versionCode: Number(code) } : {}), asset: { name: asset.name, size: asset.size, sha256 } };
     const group = groups.get(release.id) ?? { release, entries: [] };
     group.entries.push(entry); groups.set(release.id, group); found = true; break;
    }
    if (!found) report.push({ key, repo, status: 'missing', reason: 'No matching published release' });
   }
   for (const { release, entries } of groups.values()) {
    const existing = release.assets.filter((a) => a.name === 'release.json');
    if (existing.length > 1) throw new Error(`Ambiguous metadata for ${release.tag_name}`);
    if (existing.length) {
     const response = await fetch(existing[0].browser_download_url, { signal: AbortSignal.timeout(15000) });
     if (!response.ok) throw new Error(`Cannot read existing metadata for ${release.tag_name}`);
     const data = await response.json();
     if (data.schemaVersion !== 1 || !Array.isArray(data.downloads)) throw new Error(`Existing metadata format conflict: ${release.tag_name}`);
     for (const entry of entries) {
      const old = data.downloads.filter((d) => d.key === entry.key);
      if (old.length !== 1 || old[0].version !== entry.version || old[0].asset?.name !== entry.asset.name || old[0].asset?.size !== entry.asset.size || old[0].asset?.sha256 !== entry.asset.sha256) throw new Error(`Existing metadata content conflict: ${entry.key}`);
     }
     report.push({ repo, tag: release.tag_name, keys: entries.map((e) => e.key), status: 'already-present' }); continue;
    }
    if (release.immutable) { report.push({ repo, tag: release.tag_name, keys: entries.map((e) => e.key), status: 'immutable', reason: 'Existing release assets cannot be changed' }); continue; }
    if (publish) {
     const dir = mkdtempSync(join(work, 'metadata-')), path = join(dir, 'release.json');
     writeFileSync(path, JSON.stringify({ schemaVersion: 1, downloads: entries }, null, 2) + '\n');
     execFileSync('gh', ['release', 'upload', release.tag_name, path, '--repo', `armsone/${repo}`], { stdio: 'pipe' });
     const after = api(`repos/armsone/${repo}/releases/${release.id}`).assets.find((a) => a.name === 'release.json' && a.state === 'uploaded');
     if (!after || after.size !== readFileSync(path).length) throw new Error(`Metadata upload not confirmed: ${release.tag_name}`);
     const response = await fetch(after.browser_download_url, { signal: AbortSignal.timeout(15000) });
     if (!response.ok || await response.text() !== readFileSync(path, 'utf8')) throw new Error(`Published metadata differs: ${release.tag_name}`);
    }
    report.push({ repo, tag: release.tag_name, keys: entries.map((e) => e.key), status: publish ? 'published' : 'ready' });
   }
  } catch (error) { report.push({ repo, status: 'error', reason: error.message }); }
 }
} finally { rmSync(work, { recursive: true, force: true }); }
console.log(JSON.stringify(report, null, 2));
if (report.some((entry) => ['error', 'missing', 'immutable'].includes(entry.status))) process.exitCode = 1;
