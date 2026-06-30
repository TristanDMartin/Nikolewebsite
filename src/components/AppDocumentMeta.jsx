import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { DEFAULT_OG_IMAGE } from '../config/site';
import { getSeoForPath } from '../utils/seoRoutes';
import { generateSchemaForPage } from '../utils/schemaMarkup';
import { projects } from '../data/projects';
import DocumentMeta from './DocumentMeta';
import SchemaMarkup from './SchemaMarkup';

export default function AppDocumentMeta() {
  const { pathname } = useLocation();
  const seo = useMemo(() => getSeoForPath(pathname), [pathname]);
  const project = useMemo(() => {
    const projectMatch = pathname.match(/^\/portfolio\/([^/]+)\/?$/);
    if (projectMatch) {
      const slug = projectMatch[1];
      return projects.find((p) => p.slug === slug);
    }
    return null;
  }, [pathname]);
  const schema = useMemo(
    () => generateSchemaForPage(pathname, project),
    [pathname, project],
  );
  return (
    <>
      <DocumentMeta
        title={seo.title}
        description={seo.description}
        canonicalUrl={seo.canonicalUrl}
        ogImageUrl={seo.ogImageUrl || DEFAULT_OG_IMAGE}
        robotsContent={seo.robotsContent}
      />
      <SchemaMarkup schema={schema} />
    </>
  );
}
