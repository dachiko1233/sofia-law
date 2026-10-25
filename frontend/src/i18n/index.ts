import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import gr from './locales/gr.json';
import ru from './locales/ru.json';

export const SUPPORTED_LANGUAGES = ['en', 'gr', 'ru'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'EN',
  gr: 'GR',
  ru: 'RU',
};

const STORAGE_KEY = 'pk-lang';

function initialLanguage(): Language {
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && (SUPPORTED_LANGUAGES as readonly string[]).includes(stored)) {
      return stored as Language;
    }
  }
  return 'en';
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    gr: { translation: gr },
    ru: { translation: ru },
  },
  lng: initialLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  returnNull: false,
});

// Persist the choice and keep <html lang> in sync for accessibility/SEO.
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, lng);
    document.documentElement.lang = lng === 'gr' ? 'el' : lng;
  }
});

if (typeof document !== 'undefined') {
  const lng = i18n.language as Language;
  document.documentElement.lang = lng === 'gr' ? 'el' : lng;
}

export default i18n;
