export function initGoogleAnalytics(measurementId) {
  if (!measurementId || typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', measurementId);
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
}

export function trackPageView(url) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', window.GA_MEASUREMENT_ID || 'G-XXXXXXXXXX', {
      page_path: url,
    });
  }
}

export function trackEvent(eventName, eventParams = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
}

export function trackProjectView(projectSlug, projectTitle) {
  trackEvent('view_project', {
    project_slug: projectSlug,
    project_title: projectTitle,
    event_category: 'engagement',
  });
}

export function trackResumeDownload() {
  trackEvent('download_resume', {
    event_category: 'conversion',
    event_label: 'Resume PDF',
  });
}

export function trackInquireFormSubmit() {
  trackEvent('submit_inquiry', {
    event_category: 'conversion',
    event_label: 'Contact Form',
  });
}

export function trackSocialClick(platform) {
  trackEvent('social_click', {
    event_category: 'engagement',
    event_label: platform,
  });
}
