export const SITE_URL = (
  typeof import.meta.env.VITE_SITE_URL === 'string'
    ? import.meta.env.VITE_SITE_URL.replace(/\/$/, '')
    : 'https://nikoleglenn.com'
);

export const SITE_NAME = 'Nikole Glenn';

export const DEFAULT_DESCRIPTION =
  'New York–based Creative Director & Design Strategist: brand identity, packaging, campaigns, and omni-channel creative for brands including Colgate, Yankee Candle, Sharpie, Graco, and Clinique.';

export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/bumble-2023/01-holiday-website.png`;
