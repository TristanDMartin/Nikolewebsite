import React, { useState } from 'react';
import { clientBrands } from '../config/clientBrands';

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
        loading="lazy"
        decoding="async"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

export default function BrandMarquee({ className = '', label = 'Brands' }) {
  const trackItems = [...clientBrands, ...clientBrands];

  return (
    <div
      className={`brand-marquee${className ? ` ${className}` : ''}`}
      aria-label={label}
    >
      <div className="brand-marquee__track">
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
