/**
 * Verifies client brand logo files exist in public/images/brands/.
 * Logos are maintained locally — see src/config/clientBrands.js.
 * Run: node scripts/sync-brand-logos.mjs
 */
import { access } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { clientBrandAssets } from '../src/config/clientBrands.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public/images/brands');

let missing = 0;
for (const asset of clientBrandAssets) {
  const dest = join(outDir, asset.filename);
  try {
    await access(dest);
    console.log(`OK ${asset.filename}`);
  } catch {
    console.error(`Missing ${asset.filename}`);
    missing += 1;
  }
}

if (missing > 0) {
  process.exit(1);
}

console.log('All brand logos present.');
