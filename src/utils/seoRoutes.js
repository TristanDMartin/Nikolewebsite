import { projects } from '../data/projects';
import { getGallerySrc } from './projectMedia';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
} from '../config/site';

function truncateDescription(text, maxLen = 158) {
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (trimmed.length <= maxLen) {
    return trimmed;
  }
  const slicePoint = trimmed.slice(0, maxLen).lastIndexOf(' ');
  const end = slicePoint > 80 ? slicePoint : maxLen;
  return `${trimmed.slice(0, end)}…`;
}

export function getProjectOgImage(project) {
  const url =
    project?.image ||
    getGallerySrc(project?.gallery?.[0]) ||
    DEFAULT_OG_IMAGE;
  if (!url || url.startsWith('http')) {
    return url || DEFAULT_OG_IMAGE;
  }
  return `${SITE_URL}${url.startsWith('/') ? url : `/${url}`}`;
}

export function getSeoForPath(pathname) {
  const canonicalUrl = `${SITE_URL}${pathname === '/' ? '' : pathname}`;
  const base = {
    canonicalUrl,
    ogImageUrl: DEFAULT_OG_IMAGE,
    robotsContent:
      'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
  };
  if (pathname === '/portfolio') {
    return {
      ...base,
      title: `Portfolio — ${SITE_NAME} | Creative Director NYC`,
      description:
        'Award-winning packaging design, brand identity, and creative campaigns for Colgate, Clinique, Bumble and Bumble, Yankee Candle, Sharpie. NYC Creative Director & Design Strategist portfolio.',
    };
  }
  const projectMatch = pathname.match(/^\/portfolio\/([^/]+)\/?$/);
  if (projectMatch) {
    const slug = projectMatch[1];
    const project = projects.find((p) => p.slug === slug);
    if (project) {
      return {
        ...base,
        title: `${project.title} — ${SITE_NAME}`,
        description: truncateDescription(project.description || DEFAULT_DESCRIPTION),
        ogImageUrl: getProjectOgImage(project),
      };
    }
    return {
      ...base,
      title: `Project — ${SITE_NAME}`,
      description: DEFAULT_DESCRIPTION,
    };
  }
  if (pathname === '/inquire') {
    return {
      ...base,
      title: `Hire Nikole Glenn | Creative Director & Design Strategist NYC`,
      description:
        'Contact Nikole Glenn for creative direction, packaging design, brand strategy, and campaign development. NYC-based Creative Director available for projects.',
    };
  }
  if (pathname === '/about') {
    return {
      ...base,
      title: `About Nikole Glenn | Creative Director & Brand Strategist NYC`,
      description:
        'Meet Nikole Glenn: Award-winning Creative Director & Design Strategist specializing in packaging design, brand identity, and omnichannel campaigns. Based in New York.',
    };
  }
  if (pathname === '/resume') {
    return {
      ...base,
      title: `Nikole Glenn Résumé | Creative Director Portfolio & Experience`,
      description:
        'Download Nikole Glenn\'s résumé. Creative Director with expertise in packaging design, brand strategy, and campaign development for global brands.',
    };
  }
  return {
    ...base,
    title: `${SITE_NAME} — Creative Director & Design Strategist NYC | Packaging & Brand Design`,
    description:
      'Nikole Glenn: NYC Creative Director specializing in packaging design, brand identity, and creative campaigns for Colgate, Clinique, Bumble and Bumble, Yankee Candle, Sharpie, Graco.',
  };
}
