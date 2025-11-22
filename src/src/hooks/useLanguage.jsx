/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { locales, languages } from '../../locales'

/**
 * Language Context for global language state
 */
const LanguageContext = createContext()

/**
 * Language Provider component
 * Wraps the application to provide language context
 */
export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useLocalStorage('appLanguage', 'en')

  // Get translations for current language, fallback to English
  const t = locales[currentLanguage] || locales.en
  const currentLocale = languages[currentLanguage]?.locale || 'en-GB'

  const value = {
    currentLanguage,
    setLanguage: setCurrentLanguage,
    t,
    languages,
    locale: currentLocale
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

/**
 * Hook to use language context
 * @returns {Object} Language context with currentLanguage, setLanguage, t (translations), languages, and locale
 */
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
