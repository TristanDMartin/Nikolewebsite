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
      title: `Portfolio — ${SITE_NAME}`,
      description:
        'Selected packaging, campaigns, and brand work by Nikole Glenn — Creative Director & Design Strategist in New York.',
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
      title: `Inquire — ${SITE_NAME}`,
      description:
        'Start a project conversation with Nikole Glenn — creative direction, packaging, campaigns, and brand systems.',
    };
  }
  if (pathname === '/about') {
    return {
      ...base,
      title: `About — ${SITE_NAME}`,
      description:
        'Creative Director & Design Strategist based in New York — brand strategy, packaging, campaigns, and retail systems.',
    };
  }
  if (pathname === '/resume') {
    return {
      ...base,
      title: `Résumé — ${SITE_NAME}`,
      description:
        'Résumé and background for Nikole Glenn — Creative Director & Design Strategist.',
    };
  }
  return {
    ...base,
    title: `${SITE_NAME} — Creative Director & Design Strategist`,
    description: DEFAULT_DESCRIPTION,
  };
}
