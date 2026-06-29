/** Client brand logos — files in public/images/brands/. */
export const clientBrandAssets = [
  {
    slug: 'clinique',
    displayName: 'Clinique',
    filename: 'clinique.svg',
  },
  {
    slug: 'colgate',
    displayName: 'Colgate',
    filename: 'colgate.svg',
  },
  {
    slug: 'yankee-candle',
    displayName: 'Yankee Candle',
    filename: 'yankee-candle.png',
  },
  {
    slug: 'sharpie',
    displayName: 'Sharpie',
    filename: 'sharpie.png',
  },
  {
    slug: 'graco',
    displayName: 'Graco',
    filename: 'graco.png',
  },
  {
    slug: 'bumble-and-bumble',
    displayName: 'Bumble and bumble',
    filename: 'bumble-and-bumble.svg',
  },
  {
    slug: 'prismacolor',
    displayName: 'Prismacolor',
    filename: 'prismacolor.svg',
  },
  {
    slug: 'paper-mate',
    displayName: 'Paper Mate',
    filename: 'paper-mate.svg',
  },
  {
    slug: 'baby-jogger',
    displayName: 'Baby Jogger',
    filename: 'baby-jogger.png',
  },
  {
    slug: 'softsoap',
    displayName: 'Softsoap',
    filename: 'softsoap.png',
  },
];

const brandLogoBase = `${
  import.meta.env?.BASE_URL ?? '/'
}images/brands/`;

export const clientBrands = clientBrandAssets.map((asset) => ({
  slug: asset.slug,
  name: asset.displayName,
  logoSrc: `${brandLogoBase}${asset.filename}`,
}));
