import { useTheme } from '../hooks/useTheme'
import { useLanguage } from '../hooks/useLanguage'
import { useCurrency } from '../hooks/useCurrency'
import './SettingsModal.css'

function SettingsModal({ isOpen, onClose }) {
  const { currentTheme, setTheme, allThemes } = useTheme()
  const { currentLanguage, setLanguage, t, languages } = useLanguage()
  const { currentCurrency, setCurrency, currencies } = useCurrency()

  if (!isOpen) return null

  const handleThemeSelect = (themeKey) => {
    setTheme(themeKey)
  }

  const handleLanguageSelect = (langKey) => {
    setLanguage(langKey)
  }

  const handleCurrencySelect = (currencyKey) => {
    setCurrency(currencyKey)
  }

  return (
    <>
      <div className="settings-overlay" onClick={onClose}></div>
      <div className="settings-modal">
        <div className="settings-header">
          <h2 className="settings-title">⚙️ {t.settings || 'Settings'}</h2>
          <button className="settings-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="settings-content">
          {/* Language Section */}
          <div className="settings-section">
            <h3 className="settings-section-title">🌐 {t.language || 'Language'}</h3>
            <div className="settings-options">
              {Object.entries(languages).map(([key, lang]) => (
                <button
                  key={key}
                  className={`settings-option ${currentLanguage === key ? 'active' : ''}`}
                  onClick={() => handleLanguageSelect(key)}
                >
                  <span className="settings-option-name">{lang.name}</span>
                  {currentLanguage === key && <span className="settings-check">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Section */}
          <div className="settings-section">
            <h3 className="settings-section-title">🎨 {t.theme || 'Theme'}</h3>
            <div className="settings-options">
              {Object.entries(allThemes).map(([key, theme]) => (
                <button
                  key={key}
                  className={`settings-option ${currentTheme === key ? 'active' : ''}`}
                  onClick={() => handleThemeSelect(key)}
                >
                  <span 
                    className="settings-theme-preview" 
                    style={{ background: theme.gradient }}
                  ></span>
                  <span className="settings-option-name">{theme.name}</span>
                  {currentTheme === key && <span className="settings-check">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Currency Section */}
          <div className="settings-section">
            <h3 className="settings-section-title">💱 {t.currency || 'Currency'}</h3>
            <div className="settings-options">
              {Object.entries(currencies).map(([key, currency]) => (
                <button
                  key={key}
                  className={`settings-option ${currentCurrency === key ? 'active' : ''}`}
                  onClick={() => handleCurrencySelect(key)}
                >
                  <span className="settings-currency-symbol">{currency.symbol}</span>
                  <span className="settings-option-name">{currency.name}</span>
                  {currentCurrency === key && <span className="settings-check">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SettingsModal

