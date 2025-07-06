'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageSelector: React.FC = () => {
  const { currentLocale, setLocale, availableLocales, getLocaleName } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (locale: string) => {
    setLocale(locale as any);
    setIsOpen(false);
    // Refresh the page to ensure all translations update properly
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md"
      >
        <span className="w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
          {currentLocale.toUpperCase()}
        </span>
        <span>{getLocaleName(currentLocale)}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            {availableLocales.map((locale) => (
              <button
                key={locale}
                onClick={() => handleLanguageChange(locale)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 ${
                  currentLocale === locale ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
                  {locale.toUpperCase()}
                </span>
                <span>{getLocaleName(locale)}</span>
                {currentLocale === locale && (
                  <svg className="w-4 h-4 ml-auto text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector; 