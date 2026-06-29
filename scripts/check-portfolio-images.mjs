import { readdir, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = new URL('..', import.meta.url).pathname;
const IMAGES_DIR = join(ROOT, 'public/images');
const SKIP_DIRS = new Set(['brands']);
const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);
const MIN_WIDTH = 2000;
const IDEAL_WIDTH = 2400;

async function listImageFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) {
        files.push(...(await listImageFiles(fullPath)));
      }
      continue;
    }
    if (IMAGE_EXT.has(extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

function getImageSize(filePath) {
  const width = Number(
    execSync(`sips -g pixelWidth "${filePath}"`, { encoding: 'utf8' })
      .split('\n')
      .find((line) => line.includes('pixelWidth'))
      ?.split(':')[1]
      ?.trim(),
  );
  const height = Number(
    execSync(`sips -g pixelHeight "${filePath}"`, { encoding: 'utf8' })
      .split('\n')
      .find((line) => line.includes('pixelHeight'))
      ?.split(':')[1]
      ?.trim(),
  );
  return { width, height };
}

const files = await listImageFiles(IMAGES_DIR);
const lowRes = [];
const ok = [];

for (const filePath of files.sort()) {
  const { width, height } = getImageSize(filePath);
  const relative = filePath.replace(IMAGES_DIR, 'public/images');
  const info = { relative, width, height };
  if (!width || width < MIN_WIDTH) {
    lowRes.push(info);
  } else {
    ok.push(info);
  }
}

console.log(`Checked ${files.length} portfolio images.\n`);
console.log(
  `Target: at least ${MIN_WIDTH}px wide (${IDEAL_WIDTH}px+ for Retina full-width galleries).\n`,
);

if (lowRes.length > 0) {
  console.log(`Low resolution (${lowRes.length}) — may look soft on large/Retina screens:`);
  for (const item of lowRes) {
    console.log(`  ${item.relative}: ${item.width}x${item.height}`);
  }
  console.log(
    '\nFix: replace files in public/images/ with originals (drag into Finder, or copy from Desktop).',
  );
  console.log(
    'Avoid chat image uploads — they are compressed to ~1024px wide.\n',
  );
}

if (ok.length > 0) {
  console.log(`Sharp enough (${ok.length}):`);
  for (const item of ok) {
    console.log(`  ${item.relative}: ${item.width}x${item.height}`);
  }
}

process.exit(lowRes.length > 0 ? 1 : 0);
