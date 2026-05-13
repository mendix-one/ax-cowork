import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enCommon from './locales/en/common.json'
import enAuth from './locales/en/auth.json'
import enApp from './locales/en/app.json'
import koCommon from './locales/ko/common.json'
import koAuth from './locales/ko/auth.json'
import koApp from './locales/ko/app.json'

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'ko'],
    defaultNS: 'common',
    ns: ['common', 'auth', 'app'],
    resources: {
      en: { common: enCommon, auth: enAuth, app: enApp },
      ko: { common: koCommon, auth: koAuth, app: koApp },
    },
    interpolation: { escapeValue: false },
  })

export default i18n
