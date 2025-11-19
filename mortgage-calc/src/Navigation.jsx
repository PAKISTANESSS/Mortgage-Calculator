import { Link, useLocation } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useTheme } from './hooks/useTheme'
import './Navigation.css'

function Navigation() {
  const location = useLocation()
  const { currentTheme, setTheme, allThemes } = useTheme()
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsThemeMenuOpen(false)
      }
    }

    if (isThemeMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isThemeMenuOpen])

  const handleThemeSelect = (themeKey) => {
    setTheme(themeKey)
    setIsThemeMenuOpen(false)
  }

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <span className="nav-icon">🏠</span>
          <span className="nav-title">Mortgage Tools</span>
        </div>
        <ul className="nav-menu">
          <li>
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
            >
              Monthly Payment Calculator
            </Link>
          </li>
          <li>
            <Link 
              to="/amortization" 
              className={location.pathname === '/amortization' ? 'nav-link active' : 'nav-link'}
            >
              Amortization Calculator
            </Link>
          </li>
        </ul>
        <div className="theme-selector" ref={menuRef}>
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
    </nav>
  )
}

export default Navigation

