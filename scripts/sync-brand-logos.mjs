/**
 * Downloads client brand logos into public/images/brands/.
 * Sources: Wikimedia Commons (see file URLs in clientBrands.js).
 * Run: node scripts/sync-brand-logos.mjs
 */
import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { clientBrandAssets } from '../src/config/clientBrands.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public/images/brands');

const WIKIMEDIA_USER_AGENT =
  'NikoleGlennPortfolio/1.0 (portfolio site; contact: nikole@nikoleglenn.com)';

async function downloadAsset(asset) {
  const response = await fetch(asset.sourceUrl, {
    headers: { 'User-Agent': WIKIMEDIA_USER_AGENT },
  });
  if (!response.ok) {
    throw new Error(`${asset.slug}: HTTP ${response.status}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  const dest = join(outDir, asset.filename);
  await writeFile(dest, buffer);
  console.log(`Saved ${asset.filename}`);
}

await mkdir(outDir, { recursive: true });
for (const asset of clientBrandAssets) {
  if (!asset.sourceUrl) {
    console.log(`Skip ${asset.filename} (local asset)`);
    continue;
  }
  await downloadAsset(asset);
  await new Promise((resolve) => setTimeout(resolve, 1200));
}
console.log('Done.');
