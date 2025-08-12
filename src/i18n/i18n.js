import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translation files
import zh from './locales/zh.json'
import en from './locales/en.json'
import ja from './locales/ja.json'

const resources = {
  zh: { translation: zh },
  en: { translation: en },
  ja: { translation: ja }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh',
    debug: false,

    interpolation: {
      escapeValue: false // React already does escaping
    },

    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'gameLanguage',
      caches: ['localStorage']
    }
  })

export default i18n