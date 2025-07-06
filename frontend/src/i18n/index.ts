import { locales, defaultLocale, type Locale } from './config';

// Import all translation files
import enMessages from './locales/en.json';
import frMessages from './locales/fr.json';
import arMessages from './locales/ar.json';

const messages = {
  en: enMessages,
  fr: frMessages,
  ar: arMessages,
};

let currentLocale: Locale = defaultLocale;

// Translation function with interpolation support
export function t(key: string, params?: Record<string, any>): string {
  const keys = key.split('.');
  let value: any = messages[currentLocale];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  if (typeof value !== 'string') {
    return key;
  }
  
  // Handle interpolation
  if (params) {
    return value.replace(/\{(\w+)\}/g, (match, paramName) => {
      return params[paramName] !== undefined ? String(params[paramName]) : match;
    });
  }
  
  return value;
}

// Set current locale
export function setLocale(locale: Locale) {
  currentLocale = locale;
}

// Get current locale
export function getCurrentLocale(): Locale {
  return currentLocale;
}

export { locales, defaultLocale, type Locale };

// Function to get messages for a specific locale
export function getMessages(locale: Locale) {
  return messages[locale];
}

// Function to get all available locales
export function getAvailableLocales() {
  return locales;
}

// Hook for using translations (for compatibility)
export function useTranslations() {
  return { t };
} 