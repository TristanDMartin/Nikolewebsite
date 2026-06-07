import React, { useEffect } from 'react';
import { applyDocumentMeta } from '../utils/documentMeta';

export default function DocumentMeta({
  title,
  description,
  canonicalUrl,
  ogImageUrl,
  robotsContent,
}) {
  useEffect(() => {
    applyDocumentMeta({
      title,
      description,
      canonicalUrl,
      ogImageUrl,
      robotsContent,
    });
  }, [title, description, canonicalUrl, ogImageUrl, robotsContent]);
  return null;
}
