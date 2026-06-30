import React, { useEffect } from 'react';

export default function SchemaMarkup({ schema }) {
  useEffect(() => {
    if (!schema) return;
    const scriptId = 'schema-org-json-ld';
    let scriptEl = document.getElementById(scriptId);
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(schema);
    return () => {
      const el = document.getElementById(scriptId);
      if (el) {
        el.remove();
      }
    };
  }, [schema]);
  return null;
}
