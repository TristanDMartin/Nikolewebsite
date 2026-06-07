import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function PortfolioNavTheme() {
  const { pathname } = useLocation();

  useEffect(() => {
    const isPortfolioIndex = pathname === '/portfolio';
    const isCaseStudy = pathname.startsWith('/portfolio/');
    if (!isPortfolioIndex && !isCaseStudy) {
      document.body.classList.remove('portfolio-nav-light');
      return undefined;
    }
    const hero = document.querySelector(
      '.portfolio-hero, .portfolio-case-hero',
    );
    if (!hero) {
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        document.body.classList.toggle(
          'portfolio-nav-light',
          entry.isIntersecting,
        );
      },
      { threshold: 0, rootMargin: '-72px 0px 0px 0px' },
    );
    observer.observe(hero);
    return () => {
      observer.disconnect();
      document.body.classList.remove('portfolio-nav-light');
    };
  }, [pathname]);

  return null;
}
