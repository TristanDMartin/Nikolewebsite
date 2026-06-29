#!/usr/bin/env node
/**
 * Compress portfolio images referenced in src/data/projects.js.
 * Keeps originals as *.orig backup on first run.
 *
 * Usage: npm run optimize:images
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const projectsFile = path.join(rootDir, 'src/data/projects.js');

const MAX_WIDTH = 1920;
const JPEG_QUALITY = 82;
const PNG_QUALITY = 82;

function collectImagePaths(source) {
  const paths = new Set();
  const re = /['"](\/images\/[^'"]+\.(?:jpg|jpeg|png|webp|gif|JPG|JPEG|PNG))['"]/gi;
  let match = re.exec(source);
  while (match) {
    paths.add(match[1]);
    match = re.exec(source);
  }
  return [...paths];
}

async function fileSize(filePath) {
  try {
    const stat = await fs.stat(filePath);
    return stat.size;
  } catch {
    return 0;
  }
}

async function optimizeImage(relativePath) {
  const absPath = path.join(publicDir, relativePath.replace(/^\//, ''));
  const before = await fileSize(absPath);
  if (!before) {
    console.warn(`skip (missing): ${relativePath}`);
    return { relativePath, before: 0, after: 0, skipped: true };
  }
  const ext = path.extname(absPath).toLowerCase();
  if (ext === '.gif' || ext === '.webp') {
    return { relativePath, before, after: before, skipped: true };
  }
  const backupPath = `${absPath}.orig`;
  const hasBackup = (await fileSize(backupPath)) > 0;
  if (!hasBackup) {
    await fs.copyFile(absPath, backupPath);
  }
  const image = sharp(absPath, { failOn: 'none' });
  const metadata = await image.metadata();
  const needsResize = (metadata.width ?? 0) > MAX_WIDTH;
  const isLarge = before > 500_000;
  if (!needsResize && !isLarge) {
    return { relativePath, before, after: before, skipped: true };
  }
  let pipeline = sharp(absPath, { failOn: 'none' });
  if (needsResize) {
    pipeline = pipeline.resize({
      width: MAX_WIDTH,
      withoutEnlargement: true,
    });
  }
  if (ext === '.png') {
    pipeline = pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 });
  } else {
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  }
  const buffer = await pipeline.toBuffer();
  if (buffer.length >= before) {
    return { relativePath, before, after: before, skipped: true };
  }
  await fs.writeFile(absPath, buffer);
  const after = buffer.length;
  return { relativePath, before, after, skipped: false };
}

async function main() {
  const source = await fs.readFile(projectsFile, 'utf8');
  const imagePaths = collectImagePaths(source);
  console.log(`Optimizing ${imagePaths.length} portfolio images…`);
  let saved = 0;
  for (const relativePath of imagePaths) {
    const result = await optimizeImage(relativePath);
    if (!result.skipped && result.after < result.before) {
      const delta = result.before - result.after;
      saved += delta;
      console.log(
        `✓ ${relativePath} ${(result.before / 1e6).toFixed(1)}MB → ${(result.after / 1e6).toFixed(1)}MB`,
      );
    }
  }
  console.log(`Done. Saved ${(saved / 1e6).toFixed(1)}MB total.`);
  console.log(
    'Tip: run `npm run optimize:videos` after installing ffmpeg to compress large MP4s.',
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
