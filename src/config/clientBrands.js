/** Client brand logos (Wikimedia Commons). Run scripts/sync-brand-logos.mjs to refresh files. */
export const clientBrandAssets = [
  {
    slug: 'clinique',
    displayName: 'Clinique',
    filename: 'clinique.svg',
    sourceUrl:
      'https://upload.wikimedia.org/wikipedia/commons/4/45/Clinique_logo.svg',
  },
  {
    slug: 'colgate',
    displayName: 'Colgate',
    filename: 'colgate.svg',
    sourceUrl:
      'https://upload.wikimedia.org/wikipedia/commons/e/e5/Colgate-Palmolive_logo.svg',
  },
  {
    slug: 'yankee-candle',
    displayName: 'Yankee Candle',
    filename: 'yankee-candle.png',
    sourceUrl:
      'https://upload.wikimedia.org/wikipedia/commons/c/c6/Yankee_candle_logo.png',
  },
  {
    slug: 'sharpie',
    displayName: 'Sharpie',
    filename: 'sharpie.svg',
    sourceUrl:
      'https://upload.wikimedia.org/wikipedia/commons/7/7e/Sharpie_markers_logo.svg',
  },
  {
    slug: 'graco',
    displayName: 'Graco',
    filename: 'graco.svg',
    sourceUrl:
      'https://upload.wikimedia.org/wikipedia/commons/d/de/Graco_logo.svg',
  },
  {
    slug: 'bumble-and-bumble',
    displayName: 'Bumble and bumble',
    filename: 'bumble-and-bumble.svg',
    sourceUrl:
      'https://upload.wikimedia.org/wikipedia/commons/6/6e/Bumble_and_bumble_Logo.svg',
  },
  {
    slug: 'prismacolor',
    displayName: 'Prismacolor',
    filename: 'prismacolor.svg',
    sourceUrl:
      'https://upload.wikimedia.org/wikipedia/commons/f/f6/Prismacolor_logo.svg',
  },
  {
    slug: 'paper-mate',
    displayName: 'Paper Mate',
    filename: 'paper-mate.svg',
    sourceUrl:
      'https://upload.wikimedia.org/wikipedia/commons/d/d7/Paper_mate_textlogo.svg',
  },
  {
    slug: 'baby-jogger',
    displayName: 'Baby Jogger',
    filename: 'baby-jogger.svg',
    sourceUrl: null,
  },
  {
    slug: 'softsoap',
    displayName: 'Softsoap',
    filename: 'softsoap.svg',
    sourceUrl:
      'https://upload.wikimedia.org/wikipedia/commons/8/83/Softsoap_logo_2022.svg',
  },
];

const brandLogoBase = `${import.meta.env.BASE_URL}images/brands/`;

export const clientBrands = clientBrandAssets.map((asset) => ({
  name: asset.displayName,
  logoSrc: `${brandLogoBase}${asset.filename}`,
}));
