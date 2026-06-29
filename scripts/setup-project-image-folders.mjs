import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const IMAGES_DIR = join(ROOT, 'public/images');
const MIN_WIDTH = 2000;
const IDEAL_WIDTH = 2400;

const projects = [
  {
    slug: 'clinique-uv-solutions',
    folder: 'clinique-uv-solutions',
    title: 'Clinique UV Solutions',
    slots: 3,
  },
  {
    slug: 'clinique-chubby-franchise',
    folder: 'clinique-chubby-franchise',
    title: 'Clinique Chubby Franchise',
    slots: 3,
  },
  {
    slug: 'bumble-and-bumble-holiday-2024',
    folder: 'bumble-2024',
    title: 'Bumble and bumble Holiday 2024',
    slots: 5,
  },
  {
    slug: 'bumble-and-bumble-holiday-2023',
    folder: 'bumble-2023',
    title: 'Bumble and bumble Holiday 2023',
    slots: 4,
  },
  {
    slug: 'bumble-and-bumble-holiday-2022',
    folder: 'bumble-2022',
    title: 'Bumble and bumble Holiday 2022',
    slots: 5,
  },
  {
    slug: 'hum-by-colgate',
    folder: 'hum',
    title: 'Hum by Colgate',
    slots: 10,
  },
  {
    slug: 'colgate-collab-explore',
    folder: 'colgate-collab-explore',
    title: 'Colgate Collab Explore',
    slots: 12,
  },
  {
    slug: 'colgate-magik',
    folder: 'colgate-magik',
    title: 'Colgate Magik',
    slots: 4,
  },
  {
    slug: 'colgate-optic-white-overnight-pen',
    folder: 'colgate-optic-white-overnight-pen',
    title: 'Colgate Optic White Overnight Pen',
    slots: 5,
  },
  {
    slug: 'softsoap-room',
    folder: 'softsoap-room',
    title: 'Softsoap Room',
    slots: 5,
  },
  {
    slug: 'nikoles-soles',
    folder: 'nikoles-soles',
    title: "Nikole's Soles",
    slots: 6,
  },
  {
    slug: 'yankee-candle-2018-holiday-gift-sets',
    folder: 'yankee-candle-2018-holiday-gift-sets',
    title: 'Yankee Candle Holiday Gift Set 2018',
    slots: 11,
  },
  {
    slug: 'yankee-candle-holiday-deep-dive',
    folder: 'yankee-candle-holiday-deep-dive',
    title: 'Yankee Candle Holiday Concept',
    slots: 6,
  },
  {
    slug: 'yankee-candle-2018-target-limited-edition',
    folder: 'yankee-candle-2018-target-limited-edition',
    title: 'Yankee Candle Target Limited Edition 2018',
    slots: 6,
  },
  {
    slug: 'packaging-innovation-in-tokyo',
    folder: 'packaging-innovation-in-tokyo',
    title: 'Newell Brands Global Packaging Innovation Tokyo, 2017',
    slots: 6,
  },
  {
    slug: 'sharpie-2017-limited-edition-packs',
    folder: 'sharpie-2017-limited-edition-packs',
    title: 'Sharpie Limited Edition Packs 2017',
    slots: 6,
  },
  {
    slug: 'prismacolor-instagram-videos',
    folder: 'prismacolor-instagram-videos',
    title: 'Prismacolor National Coloring Day',
    slots: 2,
  },
  {
    slug: 'paper-mate-flair-coloring-kit',
    folder: 'paper-mate-flair-coloring-kit',
    title: 'Papermate Flair Color Kit',
    slots: 6,
  },
  {
    slug: 'baby-jogger-rebrand-exploration',
    folder: 'baby-jogger-rebrand-exploration',
    title: 'Baby Jogger Rebrand Explore',
    slots: 6,
  },
  {
    slug: 'baby-jogger-city-tour-display',
    folder: 'baby-jogger-city-tour-display',
    title: 'Baby Jogger City Tour Retail Display',
    slots: 6,
  },
  {
    slug: 'sharpie-rebrand',
    folder: 'sharpie-rebrand',
    title: 'Sharpie Global Brand Refresh',
    slots: 6,
  },
];

function buildReadme(project) {
  const slotLines = Array.from({ length: project.slots }, (_, index) => {
    const num = String(index + 1).padStart(2, '0');
    return `- \`${num}-short-description.png\``;
  }).join('\n');

  return `# ${project.title}

Drop high-resolution PNG or JPG files here for the portfolio case study.

## Resolution
- Minimum width: **${MIN_WIDTH}px** (avoids blur on Retina / full-width layouts)
- Ideal width: **${IDEAL_WIDTH}px+**
- Use original exports — not chat uploads or compressed screenshots

## Naming
Use numbered filenames so gallery order stays predictable:

${slotLines}

## Paths in site data
- Folder: \`/images/${project.folder}/\`
- Project slug: \`${project.slug}\`

After adding files, update \`src/data/projects.js\` if filenames differ from what is listed there.
Check sharpness: \`npm run check:images\`
`;
}

function buildIndexReadme() {
  const rows = projects
    .map(
      (project) =>
        `| ${project.title} | \`${project.folder}/\` | \`${project.slug}\` |`,
    )
    .join('\n');

  return `# Portfolio image folders

One folder per project under \`public/images/\`. Drop originals here at **${MIN_WIDTH}px+** wide (${IDEAL_WIDTH}px+ ideal).

| Project | Folder | Slug |
|---------|--------|------|
${rows}

## Workflow
1. Export or copy originals into the project folder (Finder drag-and-drop is fine).
2. Name files \`01-description.png\`, \`02-description.png\`, etc.
3. Wire paths in \`src/data/projects.js\` (\`image\` + \`gallery\` arrays).
4. Run \`npm run check:images\` to verify resolution.

Do not upload images through chat — they are compressed to ~1024px wide.
`;
}

for (const project of projects) {
  const dir = join(IMAGES_DIR, project.folder);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'README.md'), buildReadme(project));
  console.log(`✓ public/images/${project.folder}/`);
}

await writeFile(join(IMAGES_DIR, 'README.md'), buildIndexReadme());
console.log('✓ public/images/README.md');
console.log(`\n${projects.length} project folders ready.`);
