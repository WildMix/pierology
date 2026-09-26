import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('assets/fonts', { recursive: true });
const css = await (await fetch('https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&family=Libre+Caslon+Display&display=swap')).text();
const faces = new Map();
for (const match of css.matchAll(/@font-face\s*\{([^}]+)\}/g)) {
  const body = match[1];
  const family = body.match(/font-family:\s*'([^']+)'/)[1];
  const weight = body.match(/font-weight:\s*(\d+)/)[1];
  const url = body.match(/url\(([^)]+)\)/)[1];
  const name = `${family.toLowerCase().replaceAll(' ', '-')}-${weight}.woff2`;
  faces.set(name, { family, weight, url });
}
let localCSS = '';
for (const [name, { family, weight, url }] of faces) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Font download failed: ${response.status}`);
  await writeFile(`assets/fonts/${name}`, Buffer.from(await response.arrayBuffer()));
  localCSS += `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};font-display:swap;src:url('./${name}')}\n`;
}
await writeFile('assets/fonts/fonts.css', localCSS);
for (const family of ['jost', 'librecaslondisplay']) {
  const response = await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${family}/OFL.txt`);
  if (!response.ok) throw new Error(`Font license download failed: ${response.status}`);
  await writeFile(`assets/fonts/${family}-OFL.txt`, await response.text());
}
console.log(`Saved ${faces.size} local font files.`);
