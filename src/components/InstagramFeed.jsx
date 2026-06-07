import React from 'react';

const INSTAGRAM_USERNAME = 'nikoles_soles';

function getFeedEmbedUrl() {
  const raw = import.meta.env.VITE_INSTAGRAM_FEED_EMBED_URL;
  return typeof raw === 'string' ? raw.trim() : '';
}

export default function InstagramFeed() {
  const embedUrl = getFeedEmbedUrl();

  if (embedUrl) {
    return (
      <div className="instagram-widget-wrapper">
        <iframe
          src={embedUrl}
          title={`@${INSTAGRAM_USERNAME} on Instagram`}
          className="instagram-widget-iframe"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="instagram-widget-wrapper">
      <p className="instagram-setup-note pam-ig-setup-note">
        Add a free embed URL from{' '}
        <a
          href="https://lightwidget.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LightWidget
        </a>{' '}
        or similar, then set{' '}
        <code>VITE_INSTAGRAM_FEED_EMBED_URL</code> in your host env.
      </p>
      <div className="instagram-grid">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <a
            key={item}
            href={`https://www.instagram.com/${INSTAGRAM_USERNAME}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-item"
          >
            <div className="instagram-image-placeholder">
              <span className="instagram-icon">📷</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
