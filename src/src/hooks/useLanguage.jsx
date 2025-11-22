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

  const value = {
    currentLanguage,
    setLanguage: setCurrentLanguage,
    t,
    languages
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

/**
 * Hook to use language context
 * @returns {Object} Language context with currentLanguage, setLanguage, t (translations), and languages
 */
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Export languages for use in other components
export { languages }
