export const LANDING_RETURN_KEY = 'nikole-landing-return';

export function isPageReload() {
  if (typeof window === 'undefined') {
    return false;
  }
  const [entry] = performance.getEntriesByType('navigation');
  if (entry?.type) {
    return entry.type === 'reload';
  }
  return performance.navigation?.type === 1;
}

export function saveLandingReturn({ panelIndex, scrollX }) {
  if (!Number.isFinite(panelIndex) || panelIndex < 0) {
    return;
  }
  try {
    sessionStorage.setItem(
      LANDING_RETURN_KEY,
      JSON.stringify({
        panelIndex,
        scrollX: Number.isFinite(scrollX) ? scrollX : 0,
      }),
    );
  } catch {
    /* ignore storage errors */
  }
}

export function peekLandingReturn() {
  try {
    const raw = sessionStorage.getItem(LANDING_RETURN_KEY);
    if (raw === null) {
      return null;
    }
    const parsed = JSON.parse(raw);
    const panelIndex = Number.parseInt(parsed?.panelIndex, 10);
    const scrollX = Number.parseFloat(parsed?.scrollX);
    if (!Number.isFinite(panelIndex) || panelIndex < 0) {
      return null;
    }
    return {
      panelIndex,
      scrollX: Number.isFinite(scrollX) ? scrollX : 0,
    };
  } catch {
    return null;
  }
}

export function consumeLandingReturn() {
  const value = peekLandingReturn();
  try {
    sessionStorage.removeItem(LANDING_RETURN_KEY);
  } catch {
    /* ignore storage errors */
  }
  return value;
}

export function buildPortfolioLinkState(returnTo, extra = {}) {
  return {
    returnTo,
    ...extra,
  };
}

export function getReturnToFromLocation(location) {
  const returnTo = location.state?.returnTo;
  if (typeof returnTo === 'string' && returnTo.length > 0) {
    return returnTo;
  }
  return null;
}

export function getLandingReturnFromLocation(location) {
  const panelIndex = location.state?.landingPanel;
  const scrollX = location.state?.landingScrollX;
  return {
    panelIndex:
      typeof panelIndex === 'number' && Number.isFinite(panelIndex)
        ? panelIndex
        : null,
    scrollX:
      typeof scrollX === 'number' && Number.isFinite(scrollX) ? scrollX : null,
  };
}

export function canGoBackInHistory() {
  if (typeof window === 'undefined') {
    return false;
  }
  const idx = window.history.state?.idx;
  return typeof idx === 'number' && idx > 0;
}
