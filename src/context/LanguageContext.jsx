import { createContext, useContext, useState, useEffect } from 'react';
import translations from '../translations';
import { getStoredValue, setStoredValue } from '../utils/storage';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => getStoredValue('language') || 'en');

  useEffect(() => {
    setStoredValue('language', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => setLang(prev => prev === 'en' ? 'uz' : 'en');

  const t = (path) => {
    const keys = path.split('.');
    let value = translations[lang];
    for (const key of keys) {
      if (value[key] === undefined) return path;
      value = value[key];
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
