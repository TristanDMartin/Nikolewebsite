#!/usr/bin/env node
/**
 * Re-encode large portfolio videos for web delivery (requires ffmpeg).
 *
 * Usage: npm run optimize:videos
 */
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

const TARGETS = [
  'images/prismacolor-instagram-videos/2_Koi_PN_11-17.mp4',
  'images/prismacolor-instagram-videos/3_Manhattan Version 3 8-8.mp4',
  'images/colgate-magik/thumbnail-campaigntry.mp4',
  'images/hum/thumbnail_15_REV2_CLDC6532000H.mp4',
  'images/nikoles-soles/102123_NS_Niu video.MOV',
];

function hasFfmpeg() {
  return spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' }).status === 0;
}

async function fileSize(filePath) {
  try {
    const stat = await fs.stat(filePath);
    return stat.size;
  } catch {
    return 0;
  }
}

async function optimizeVideo(relativePath) {
  const inputPath = path.join(publicDir, relativePath);
  const before = await fileSize(inputPath);
  if (!before) {
    console.warn(`skip (missing): ${relativePath}`);
    return;
  }
  const parsed = path.parse(inputPath);
  const outputPath = path.join(parsed.dir, `${parsed.name}-web.mp4`);
  if ((await fileSize(outputPath)) > 0) {
    console.log(`skip (exists): ${relativePath} → ${path.basename(outputPath)}`);
    return;
  }
  const backupPath = `${inputPath}.orig`;
  if (!(await fileSize(backupPath))) {
    await fs.copyFile(inputPath, backupPath);
  }
  execSync(
    [
      'ffmpeg',
      '-y',
      '-i',
      JSON.stringify(inputPath),
      '-vf',
      'scale=1080:-2',
      '-c:v',
      'libx264',
      '-preset',
      'slow',
      '-crf',
      '28',
      '-movflags',
      '+faststart',
      '-an',
      JSON.stringify(outputPath),
    ].join(' '),
    { stdio: 'inherit' },
  );
  const after = await fileSize(outputPath);
  console.log(
    `✓ ${relativePath} ${(before / 1e6).toFixed(1)}MB → ${path.basename(outputPath)} ${(after / 1e6).toFixed(1)}MB`,
  );
}

async function main() {
  if (!hasFfmpeg()) {
    console.error(
      'ffmpeg not found. Install with: brew install ffmpeg\nThen re-run: npm run optimize:videos',
    );
    process.exit(1);
  }
  for (const target of TARGETS) {
    await optimizeVideo(target);
  }
  console.log(
    'Update src/data/projects.js to point cardVideo/galleryVideos at *-web.mp4 files.',
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
