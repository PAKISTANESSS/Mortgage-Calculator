import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useLanguage } from './hooks/useLanguage'
import SettingsModal from './components/SettingsModal'
import './Navigation.css'

function Navigation() {
  const location = useLocation()
  const { t } = useLanguage()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <>
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
            {/* Settings Button */}
            <button 
              className="settings-button"
              onClick={() => setIsSettingsOpen(true)}
              title={t.settings || 'Settings'}
            >
              ⚙️
            </button>
          </div>
        </div>
      </nav>

      {/* Settings Modal - Rendered at root level for proper positioning */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  )
}

export default Navigation

