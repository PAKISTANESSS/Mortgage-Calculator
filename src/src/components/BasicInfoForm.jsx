import { useLanguage } from '../hooks/useLanguage'

function BasicInfoForm({ loanAmount, setLoanAmount, months, setMonths, euribor, setEuribor, spread, setSpread, errors = {} }) {
  const { t } = useLanguage()
  
  // Validate numeric input
  const handleNumericInput = (value, setter, allowDecimals = false) => {
    if (value === '') {
      setter('')
      return
    }
    
    const regex = allowDecimals ? /^\d*\.?\d*$/ : /^\d*$/
    if (regex.test(value)) {
      setter(value)
    }
  }
  
  return (
    <div className="section">
      <h2 className="section-title">📋 {t.basicInfo}</h2>
      
      <div className="input-group">
        <label htmlFor="loanAmount">
          <span className="label-text">{t.loanAmount}</span>
          <span className="label-unit">€</span>
        </label>
        <input
          id="loanAmount"
          type="text"
          inputMode="numeric"
          value={loanAmount}
          onChange={(e) => handleNumericInput(e.target.value, setLoanAmount, false)}
          placeholder="250000"
          className={errors.loanAmount ? 'error' : ''}
        />
        {errors.loanAmount && <span className="field-error">{errors.loanAmount}</span>}
      </div>

      <div className="input-group">
        <label htmlFor="months">
          <span className="label-text">{t.loanTerm}</span>
          <span className="label-unit">{t.months}</span>
        </label>
        <input
          id="months"
          type="text"
          inputMode="numeric"
          value={months}
          onChange={(e) => handleNumericInput(e.target.value, setMonths, false)}
          placeholder="360"
          className={errors.months ? 'error' : ''}
        />
        {errors.months && <span className="field-error">{errors.months}</span>}
      </div>

      <div className="input-row">
        <div className="input-group">
          <label htmlFor="euribor">
            <span className="label-text">{t.euriborRate}</span>
            <span className="label-unit">%</span>
          </label>
          <input
            id="euribor"
            type="text"
            inputMode="decimal"
            value={euribor}
            onChange={(e) => handleNumericInput(e.target.value, setEuribor, true)}
            placeholder="3.5"
            className={errors.euribor ? 'error' : ''}
          />
          {errors.euribor ? (
            <span className="field-error">{errors.euribor}</span>
          ) : (
            <span className="input-hint">{t.euriborHint}</span>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="spread">
            <span className="label-text">{t.spread}</span>
            <span className="label-unit">%</span>
          </label>
          <input
            id="spread"
            type="text"
            inputMode="decimal"
            value={spread}
            onChange={(e) => handleNumericInput(e.target.value, setSpread, true)}
            placeholder="1.0"
            className={errors.spread ? 'error' : ''}
          />
          {errors.spread && <span className="field-error">{errors.spread}</span>}
        </div>
      </div>
    </div>
  )
}

export default BasicInfoForm

