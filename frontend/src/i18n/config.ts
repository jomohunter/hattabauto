export const locales = ['en', 'fr', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export function getLocaleDirection(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

export function getLocaleName(locale: Locale): string {
  const names: Record<Locale, string> = {
    en: 'English',
    fr: 'Français',
    ar: 'العربية'
  };
  return names[locale];
} 