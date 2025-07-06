'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Locale, locales, defaultLocale, getLocaleDirection, getLocaleName } from '@/i18n/config';
import { setLocale, getCurrentLocale } from '@/i18n';

interface LanguageContextType {
  currentLocale: Locale;
  setLocale: (locale: Locale) => void;
  availableLocales: Locale[];
  getLocaleName: (locale: Locale) => string;
  direction: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLocale, setCurrentLocale] = useState<Locale>(defaultLocale);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && locales.includes(savedLocale)) {
      setCurrentLocale(savedLocale);
      setLocale(savedLocale);
    }
  }, []);

  const handleSetLocale = (locale: Locale) => {
    setCurrentLocale(locale);
    setLocale(locale);
    localStorage.setItem('locale', locale);
    
    // Update document direction for RTL languages
    document.documentElement.dir = getLocaleDirection(locale);
    document.documentElement.lang = locale;
  };

  const direction = getLocaleDirection(currentLocale);

  const value: LanguageContextType = {
    currentLocale,
    setLocale: handleSetLocale,
    availableLocales: locales,
    getLocaleName,
    direction,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 