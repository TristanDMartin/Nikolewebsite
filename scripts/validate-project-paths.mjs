import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PROJECTS_FILE = join(ROOT, 'src/data/projects.js');
const PUBLIC_DIR = join(ROOT, 'public');

function extractMediaPaths(content) {
  const matches = content.matchAll(/['"](\/(?:images|assets)\/[^'"]+)['"]/g);
  const paths = new Set();
  for (const match of matches) {
    const raw = match[1].split('?')[0];
    paths.add(decodeURIComponent(raw));
  }
  return [...paths].sort();
}

const content = readFileSync(PROJECTS_FILE, 'utf8');
const paths = extractMediaPaths(content);
const missing = paths.filter((mediaPath) => {
  return !existsSync(join(PUBLIC_DIR, mediaPath));
});

console.log(`Validated ${paths.length} media paths from projects.js.\n`);

if (missing.length > 0) {
  console.error(`Missing files (${missing.length}):`);
  for (const mediaPath of missing) {
    console.error(`  ${mediaPath}`);
  }
  process.exit(1);
}

console.log('All project media paths resolve on disk.');
process.exit(0);
