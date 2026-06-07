import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { DEFAULT_OG_IMAGE } from '../config/site';
import { getSeoForPath } from '../utils/seoRoutes';
import DocumentMeta from './DocumentMeta';

export default function AppDocumentMeta() {
  const { pathname } = useLocation();
  const seo = useMemo(() => getSeoForPath(pathname), [pathname]);
  return (
    <DocumentMeta
      title={seo.title}
      description={seo.description}
      canonicalUrl={seo.canonicalUrl}
      ogImageUrl={seo.ogImageUrl || DEFAULT_OG_IMAGE}
      robotsContent={seo.robotsContent}
    />
  );
}
