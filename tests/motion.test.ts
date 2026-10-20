import { afterEach, describe, expect, it, vi } from 'vitest';
import { getLandingHash, shouldPlayIntro } from '../src/lib/motion';

function stubBrowser(hash: string, reducedMotion = false) {
  vi.stubGlobal('window', {
    location: { hash, pathname: '/', search: '' },
    matchMedia: () => ({ matches: reducedMotion }),
  });
}

describe('landing hash', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('accepts known section ids', () => {
    stubBrowser('#shop');
    expect(getLandingHash()).toBe('#shop');
  });

  it('ignores unknown or empty hashes', () => {
    stubBrowser('#unknown');
    expect(getLandingHash()).toBe('');
    stubBrowser('');
    expect(getLandingHash()).toBe('');
  });
});

describe('intro curtain', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('plays on a clean first visit', () => {
    stubBrowser('');
    expect(shouldPlayIntro()).toBe(true);
  });

  it('is skipped when deep-linking or when motion is reduced', () => {
    stubBrowser('#look');
    expect(shouldPlayIntro()).toBe(false);
    stubBrowser('', true);
    expect(shouldPlayIntro()).toBe(false);
  });
});
