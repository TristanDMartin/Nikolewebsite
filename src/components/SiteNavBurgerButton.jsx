import React from 'react';

export default function SiteNavBurgerButton({
  isOpen,
  onClick,
  controlsId,
  className = '',
}) {
  return (
    <button
      type="button"
      className={[
        'site-nav-burger',
        isOpen ? 'is-open' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-expanded={isOpen}
      aria-controls={controlsId}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      onClick={onClick}
    >
      <span className="site-nav-burger__icon" aria-hidden="true">
        <span className="site-nav-burger__line" />
        <span className="site-nav-burger__line" />
        <span className="site-nav-burger__line" />
      </span>
    </button>
  );
}
