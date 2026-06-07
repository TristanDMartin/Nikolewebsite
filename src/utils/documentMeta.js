function upsertMetaName(name, content) {
  let el = document.head.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertMetaProperty(property, content) {
  let el = document.head.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function applyDocumentMeta({
  title,
  description,
  canonicalUrl,
  ogImageUrl,
  robotsContent,
}) {
  document.title = title;
  upsertMetaName('description', description);
  upsertMetaProperty('og:type', 'website');
  upsertMetaProperty('og:locale', 'en_US');
  upsertMetaProperty('og:site_name', 'Nikole Glenn');
  upsertMetaProperty('og:title', title);
  upsertMetaProperty('og:description', description);
  upsertMetaProperty('og:url', canonicalUrl);
  upsertMetaProperty('og:image', ogImageUrl);
  upsertMetaName('twitter:card', 'summary_large_image');
  upsertMetaName('twitter:title', title);
  upsertMetaName('twitter:description', description);
  upsertMetaName('twitter:image', ogImageUrl);
  upsertLink('canonical', canonicalUrl);
  upsertMetaName(
    'robots',
    robotsContent ||
      'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
  );
}
