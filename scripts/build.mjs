import { cp, mkdir, readdir, rm, stat } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');
const files = ['index.html', 'styles.css', 'app.js', 'content.js', 'piero-loop.wav'];
const assetTypes = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.otf', '.txt', '.vtt']);

// Validate the fixed output path and required sources before replacing a build.
if (output !== root + sep + 'dist') throw new Error('Unexpected build output directory');
for (const file of files) {
  if (!(await stat(resolve(root, file))).isFile()) throw new Error(`Missing site file: ${file}`);
}
if (!(await stat(resolve(root, 'assets'))).isDirectory()) throw new Error('Missing assets directory');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const file of files) await cp(resolve(root, file), resolve(output, file));

async function copyAssets(source, target) {
  await mkdir(target, { recursive: true });
  for (const entry of await readdir(source, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const from = resolve(source, entry.name);
    const to = resolve(target, entry.name);
    if (entry.isDirectory()) await copyAssets(from, to);
    else if (entry.isFile() && (assetTypes.has(extname(entry.name).toLowerCase()) || entry.name === 'fonts.css')) {
      await cp(from, to);
    }
  }
}
await copyAssets(resolve(root, 'assets'), resolve(output, 'assets'));
console.log('Built dist/ with the website, public assets, and piero-loop.wav.');
