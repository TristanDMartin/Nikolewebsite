import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://www.nikoleglenn.com';

const projects = [
  'clinique-uv-solutions',
  'clinique-chubby-franchise',
  'bumble-and-bumble-holiday-2024',
  'bumble-and-bumble-holiday-2023',
  'bumble-and-bumble-holiday-2022',
  'hum-by-colgate',
  'colgate-collab-explore',
  'colgate-magik',
  'colgate-optic-white-overnight-pen',
  'softsoap-room',
  'nikoles-soles',
  'yankee-candle-2018-holiday-gift-sets',
  'yankee-candle-holiday-deep-dive',
  'yankee-candle-2018-target-limited-edition',
  'packaging-innovation-in-tokyo',
  'sharpie-2017-limited-edition-packs',
  'prismacolor-instagram-videos',
  'paper-mate-flair-coloring-kit',
  'baby-jogger-rebrand-exploration',
  'baby-jogger-city-tour-display',
  'sharpie-rebrand',
];

const currentDate = new Date().toISOString().split('T')[0];

const staticPages = [
  { loc: '/', priority: '1.0', changefreq: 'weekly', lastmod: currentDate },
  {
    loc: '/portfolio',
    priority: '0.9',
    changefreq: 'weekly',
    lastmod: currentDate,
  },
  {
    loc: '/inquire',
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: currentDate,
  },
  {
    loc: '/about',
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: currentDate,
  },
  {
    loc: '/resume',
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: currentDate,
  },
];

function generateSitemap() {
  const urls = [...staticPages];
  projects.forEach((slug) => {
    urls.push({
      loc: `/portfolio/${slug}`,
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: currentDate,
    });
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map(
    (url) => `  <url>
    <loc>${SITE_URL}${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;
  const publicDir = path.join(__dirname, '..', 'public');
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf8');
  console.log('✓ Generated sitemap.xml');
}

generateSitemap();
