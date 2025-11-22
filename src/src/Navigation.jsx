import { Link, useLocation } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useTheme } from './hooks/useTheme'
import { useLanguage } from './hooks/useLanguage'
import './Navigation.css'

function Navigation() {
  const location = useLocation()
  const { currentTheme, setTheme, allThemes } = useTheme()
  const { currentLanguage, setLanguage, t, languages } = useLanguage()
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const themeMenuRef = useRef(null)
  const languageMenuRef = useRef(null)

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
        setIsThemeMenuOpen(false)
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setIsLanguageMenuOpen(false)
      }
    }

    if (isThemeMenuOpen || isLanguageMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isThemeMenuOpen, isLanguageMenuOpen])

  const handleThemeSelect = (themeKey) => {
    setTheme(themeKey)
    setIsThemeMenuOpen(false)
  }

  const handleLanguageSelect = (langKey) => {
    setLanguage(langKey)
    setIsLanguageMenuOpen(false)
  }

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <span className="nav-icon">🏠</span>
          <span className="nav-title">{t.navTitle}</span>
        </div>
        <ul className="nav-menu">
          <li>
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
            >
              {t.monthlyPaymentCalc}
            </Link>
          </li>
          <li>
            <Link 
              to="/amortization" 
              className={location.pathname === '/amortization' ? 'nav-link active' : 'nav-link'}
            >
              {t.amortizationCalcTitle}
            </Link>
          </li>
        </ul>
        <div className="nav-actions">
          {/* Language Selector */}
          <div className="language-selector" ref={languageMenuRef}>
            <button 
              className="language-button"
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              title="Change language"
            >
              <span className="language-button-icon">🌐</span>
            </button>
            {isLanguageMenuOpen && (
              <div className="language-menu">
                {Object.entries(languages).map(([key, lang]) => (
                  <button
                    key={key}
                    className={`language-option ${currentLanguage === key ? 'active' : ''}`}
                    onClick={() => handleLanguageSelect(key)}
                  >
                    <span className="language-name">{lang.name}</span>
                    {currentLanguage === key && <span className="language-check">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Selector */}
          <div className="theme-selector" ref={themeMenuRef}>
            <button 
              className="theme-button"
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              title="Change theme"
            >
              🎨
            </button>
            {isThemeMenuOpen && (
              <div className="theme-menu">
                {Object.entries(allThemes).map(([key, theme]) => (
                  <button
                    key={key}
                    className={`theme-option ${currentTheme === key ? 'active' : ''}`}
                    onClick={() => handleThemeSelect(key)}
                  >
                    <span 
                      className="theme-color-preview" 
                      style={{ background: theme.gradient }}
                    ></span>
                    <span className="theme-name">{theme.name}</span>
                    {currentTheme === key && <span className="theme-check">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation

