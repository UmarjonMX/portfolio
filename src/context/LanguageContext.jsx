/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import translations from '../translations';

const LanguageContext = createContext();

/**
 * Resolves `a.b.c` against the active language.
 *
 * Interpolation takes `{name}` placeholders: `t('palette.language', { to: 'UZ' })`.
 * A missing key returns the key path itself rather than `undefined`, so a
 * forgotten translation is visible in the UI instead of silently blank.
 * Non-string leaves (arrays, objects) are passed through untouched, which is
 * what `t('projects.items')` and `t('about.manifesto')` rely on.
 */
function resolve(lang, path, params) {
  const keys = path.split('.');
  let value = translations[lang];
  for (const key of keys) {
    if (value == null || value[key] === undefined) return path;
    value = value[key];
  }
  if (typeof value !== 'string' || !params) return value;
  return value.replace(/\{(\w+)\}/g, (m, k) =>
    params[k] !== undefined ? String(params[k]) : m
  );
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return 'en';
    const stored = localStorage.getItem('language');
    return stored === 'uz' || stored === 'en' ? stored : 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = useCallback(() => setLang((prev) => (prev === 'en' ? 'uz' : 'en')), []);

  // `t` is a render input for a dozen components and a dependency of several
  // effects (the Navbar re-measures its links when the label language changes).
  // A stable identity across renders that do not change the language stops
  // those effects from restarting on every unrelated parent render.
  const t = useMemo(() => (path, params) => resolve(lang, path, params), [lang]);

  const value = useMemo(() => ({ lang, toggleLanguage, t }), [lang, toggleLanguage, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}