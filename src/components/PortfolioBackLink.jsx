import React, { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  canGoBackInHistory,
  getLandingReturnFromLocation,
  getReturnToFromLocation,
} from '../utils/portfolioNavigation';

export default function PortfolioBackLink({
  fallback = '/portfolio',
  className = 'portfolio-back-link',
  label = 'Back',
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = useCallback(() => {
    const returnTo = getReturnToFromLocation(location);
    const landingReturn = getLandingReturnFromLocation(location);
    if (returnTo) {
      navigate(returnTo, {
        state: {
          landingPanel: landingReturn.panelIndex,
          landingScrollX: landingReturn.scrollX,
        },
      });
      return;
    }
    if (canGoBackInHistory()) {
      navigate(-1);
      return;
    }
    navigate(fallback);
  }, [fallback, location, navigate]);

  return (
    <button type="button" className={className} onClick={handleBack}>
      ← {label}
    </button>
  );
}
