import { SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION } from '../config/site';
import { getProjectOgImage } from './seoRoutes';

export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: 'Nikole Glenn',
    url: SITE_URL,
    jobTitle: 'Creative Director & Design Strategist',
    description:
      'Creative Director and Design Strategist based in New York. Brand strategy, packaging, campaigns, and omni-channel creative.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'New York',
      addressRegion: 'NY',
      addressCountry: 'US',
    },
    sameAs: ['https://www.instagram.com/nikoles_soles/'],
    knowsAbout: [
      'Creative Direction',
      'Design Strategy',
      'Packaging Design',
      'Brand Identity',
      'Campaign Strategy',
      'Visual Merchandising',
      'Art Direction',
      'Product Design',
    ],
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Creative Director',
      occupationLocation: {
        '@type': 'City',
        name: 'New York',
      },
      skills: [
        'Creative Direction',
        'Design Strategy',
        'Packaging Design',
        'Brand Identity',
        'Campaign Development',
        'Team Leadership',
      ],
    },
  };
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    publisher: { '@id': `${SITE_URL}/#person` },
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/portfolio?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generatePortfolioPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Portfolio — ${SITE_NAME}`,
    description:
      'Selected packaging, campaigns, and brand work by Nikole Glenn — Creative Director & Design Strategist in New York.',
    url: `${SITE_URL}/portfolio`,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#person` },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [],
    },
  };
}

export function generateProjectSchema(project) {
  if (!project) return null;
  const projectUrl = `${SITE_URL}/portfolio/${project.slug}`;
  const imageUrl = getProjectOgImage(project);
  const keywords = project.tags
    ? project.tags.split('•').map((tag) => tag.trim())
    : [];
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': projectUrl,
    name: project.title,
    description: project.description,
    url: projectUrl,
    image: imageUrl,
    creator: { '@id': `${SITE_URL}/#person` },
    author: { '@id': `${SITE_URL}/#person` },
    keywords: keywords.join(', '),
    inLanguage: 'en-US',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    ...(project.credits && {
      creditText: project.credits,
    }),
  };
}

export function generateBreadcrumbSchema(pathname, projectTitle = null) {
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: SITE_URL,
    },
  ];
  if (pathname.startsWith('/portfolio')) {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: 'Portfolio',
      item: `${SITE_URL}/portfolio`,
    });
    if (projectTitle) {
      items.push({
        '@type': 'ListItem',
        position: 3,
        name: projectTitle,
        item: `${SITE_URL}${pathname}`,
      });
    }
  } else if (pathname === '/about') {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: 'About',
      item: `${SITE_URL}/about`,
    });
  } else if (pathname === '/inquire') {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: 'Inquire',
      item: `${SITE_URL}/inquire`,
    });
  } else if (pathname === '/resume') {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: 'Résumé',
      item: `${SITE_URL}/resume`,
    });
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    founder: { '@id': `${SITE_URL}/#person` },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'New York',
      addressRegion: 'NY',
      addressCountry: 'US',
    },
    areaServed: {
      '@type': 'Place',
      name: 'Worldwide',
    },
    serviceType: [
      'Creative Direction',
      'Design Strategy',
      'Packaging Design',
      'Brand Identity',
      'Campaign Strategy',
    ],
  };
}

export function generateSchemaForPage(pathname, project = null) {
  const schemas = [generateWebsiteSchema(), generatePersonSchema()];
  if (pathname === '/portfolio' && !project) {
    schemas.push(generatePortfolioPageSchema());
  } else if (project) {
    schemas.push(generateProjectSchema(project));
  } else if (pathname === '/') {
    schemas.push(generateOrganizationSchema());
  }
  schemas.push(generateBreadcrumbSchema(pathname, project?.title));
  return {
    '@context': 'https://schema.org',
    '@graph': schemas,
  };
}
