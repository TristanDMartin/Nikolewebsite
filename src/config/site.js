export const SITE_URL = (
  typeof import.meta.env.VITE_SITE_URL === 'string'
    ? import.meta.env.VITE_SITE_URL.replace(/\/$/, '')
    : 'https://www.nikoleglenn.com'
);

export const SITE_NAME = 'Nikole Glenn';

export const DEFAULT_DESCRIPTION =
  'Nikole Glenn: NYC Creative Director specializing in packaging design, brand identity, and creative campaigns for Colgate, Clinique, Bumble and Bumble, Yankee Candle, Sharpie, Graco.';

export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/colgate-collab-explore/thumbnail.png`;

export const LANDING_WORK_PANEL_INDEX = 1;

export const SEO_KEYWORDS = [
  'Creative Director NYC',
  'Packaging Design',
  'Brand Identity',
  'Design Strategist',
  'Campaign Strategy',
  'Visual Merchandising',
  'Art Direction',
  'New York Creative Director',
  'Colgate',
  'Clinique',
  'Bumble and Bumble',
  'Yankee Candle',
  'Sharpie',
];

export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/nikoles_soles/',
};

export const CONTACT_INFO = {
  location: 'New York, NY',
  country: 'United States',
  profession: 'Creative Director & Design Strategist',
};
