import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { revertAllSplits } from '../lib/split-text';
import { copy, type Locale } from './copy';

const STORAGE_KEY = 'nor-locale';

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readStoredLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'pt') return stored;
  } catch {
  }
  return 'pt';
}

function applyDocumentLocale(locale: Locale) {
  document.documentElement.lang = locale === 'pt' ? 'pt-BR' : 'en';
  document.title = copy[locale].title;
  const meta = document.querySelector('meta[name="description"]');
  meta?.setAttribute('content', copy[locale].metaDescription);
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readStoredLocale);

  useEffect(() => {
    applyDocumentLocale(locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    revertAllSplits();
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
    }
  }, []);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used inside LocaleProvider');
  }
  return context;
}

export function useCopy() {
  const { locale } = useLocale();
  return copy[locale];
}
