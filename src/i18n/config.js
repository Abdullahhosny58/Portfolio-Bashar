import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import ar from './locales/ar.json'

const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('bashar-lang') : null
const lang = saved ? saved : 'en'

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ar: { translation: ar } },
  lng: lang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
