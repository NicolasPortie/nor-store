const LANDING_IDS = new Set(['top', 'film', 'drop', 'about', 'look', 'fit', 'shop', 'system', 'campaign']);

export function getLandingHash() {
  const id = window.location.hash.slice(1);
  return LANDING_IDS.has(id) ? `#${id}` : '';
}

export function normalizeLandingHash() {
  if (typeof history.replaceState !== 'function') return getLandingHash();
  if (window.location.hash && !getLandingHash()) {
    history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  }
  return getLandingHash();
}

export function shouldPlayIntro() {
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches && !getLandingHash();
}
