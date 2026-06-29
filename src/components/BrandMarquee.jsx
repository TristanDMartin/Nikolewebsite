import React, { useEffect, useRef, useState } from 'react';
import { clientBrands } from '../config/clientBrands';

function restartMarqueeAnimation(trackEl) {
  if (!trackEl) {
    return;
  }
  trackEl.style.animation = 'none';
  void trackEl.offsetWidth;
  trackEl.style.animation = '';
}

function BrandMarqueeItem({ brand }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="brand-marquee__item">
        <span className="brand-marquee__fallback">{brand.name}</span>
      </div>
    );
  }

  return (
    <div className="brand-marquee__item">
      <img
        className="brand-marquee__logo"
        src={brand.logoSrc}
        alt={brand.name}
        width={160}
        height={48}
        loading="eager"
        decoding="async"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

export default function BrandMarquee({ className = '', label = 'Brands' }) {
  const marqueeRef = useRef(null);
  const trackRef = useRef(null);
  const trackItems = [...clientBrands, ...clientBrands];

  useEffect(() => {
    const marqueeEl = marqueeRef.current;
    const trackEl = trackRef.current;
    if (!marqueeEl || !trackEl) {
      return undefined;
    }

    let resizeFrame = 0;
    const syncMarquee = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        restartMarqueeAnimation(trackEl);
      });
    };

    const observer = new ResizeObserver(syncMarquee);
    observer.observe(marqueeEl);
    window.addEventListener('orientationchange', syncMarquee);

    return () => {
      cancelAnimationFrame(resizeFrame);
      observer.disconnect();
      window.removeEventListener('orientationchange', syncMarquee);
    };
  }, []);

  return (
    <div
      ref={marqueeRef}
      className={`brand-marquee${className ? ` ${className}` : ''}`}
      aria-label={label}
    >
      <div ref={trackRef} className="brand-marquee__track">
        {trackItems.map((brand, index) => (
          <BrandMarqueeItem
            key={`${brand.name}-${index}`}
            brand={brand}
          />
        ))}
      </div>
    </div>
  );
}
