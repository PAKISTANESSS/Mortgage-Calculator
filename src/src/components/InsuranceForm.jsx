import { useLanguage } from '../hooks/useLanguage'
import { useCurrency } from '../hooks/useCurrency'

function InsuranceForm({ 
  lifeInsurance, 
  setLifeInsurance, 
  houseInsurance, 
  setHouseInsurance, 
  isExpanded, 
  setIsExpanded 
}) {
  const { t } = useLanguage()
  const { currency } = useCurrency()
  
  // Validate numeric input
  const handleNumericInput = (value, setter) => {
    if (value === '') {
      setter('')
      return
    }
    
    const regex = /^\d*\.?\d*$/
    if (regex.test(value)) {
      setter(value)
    }
  }
  
  return (
    <div className="section">
      <h2 
        className="section-title collapsible" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        🛡️ {t.insurance}
        <span className="collapse-icon">{isExpanded ? '▼' : '▶'}</span>
      </h2>
      
      {isExpanded && (
        <div className="input-row">
          <div className="input-group">
            <label htmlFor="lifeInsurance">
              <span className="label-text">{t.lifeInsurance}</span>
              <span className="label-unit">{currency.symbol}{t.perMonth}</span>
            </label>
            <input
              id="lifeInsurance"
              type="text"
              inputMode="decimal"
              value={lifeInsurance}
              onChange={(e) => handleNumericInput(e.target.value, setLifeInsurance)}
              placeholder="0"
            />
          </div>

          <div className="input-group">
            <label htmlFor="houseInsurance">
              <span className="label-text">{t.houseInsurance}</span>
              <span className="label-unit">{currency.symbol}{t.perMonth}</span>
            </label>
            <input
              id="houseInsurance"
              type="text"
              inputMode="decimal"
              value={houseInsurance}
              onChange={(e) => handleNumericInput(e.target.value, setHouseInsurance)}
              placeholder="0"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default InsuranceForm

