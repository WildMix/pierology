import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('assets', { recursive: true });
const photographs = [
  ['tuscany.jpg', 'photo-1518098268026-4e89f1a2cd8e', 2200],
  ['villa.jpg', 'photo-1782070308261-15cb7a4720ee', 1400],
  ['candle.jpg', 'photo-1640544351861-930d12160bbb', 1400],
  ['vito.jpg', 'photo-1756628984155-e8cce24a8e01', 1400],
];
await Promise.all(photographs.map(async ([name, photo, width]) => {
  const url = `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=${width}&q=85&fm=jpg`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${name}: ${response.status}`);
  await writeFile(`assets/${name}`, Buffer.from(await response.arrayBuffer()));
  console.log(`Saved assets/${name}`);
}));
