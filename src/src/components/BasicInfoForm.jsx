import { useLanguage } from '../hooks/useLanguage'

function BasicInfoForm({ loanAmount, setLoanAmount, months, setMonths, euribor, setEuribor, spread, setSpread }) {
  const { t } = useLanguage()
  
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
          type="number"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
          placeholder="250000"
          min="0"
          step="1000"
        />
      </div>

      <div className="input-group">
        <label htmlFor="months">
          <span className="label-text">{t.loanTerm}</span>
          <span className="label-unit">{t.months}</span>
        </label>
        <input
          id="months"
          type="number"
          value={months}
          onChange={(e) => setMonths(e.target.value)}
          placeholder="360"
          min="1"
          step="1"
        />
      </div>

      <div className="input-row">
        <div className="input-group">
          <label htmlFor="euribor">
            <span className="label-text">{t.euriborRate}</span>
            <span className="label-unit">%</span>
          </label>
          <input
            id="euribor"
            type="number"
            value={euribor}
            onChange={(e) => setEuribor(e.target.value)}
            placeholder="3.5"
            min="0"
            step="0.01"
          />
          <span className="input-hint">{t.euriborHint}</span>
        </div>

        <div className="input-group">
          <label htmlFor="spread">
            <span className="label-text">{t.spread}</span>
            <span className="label-unit">%</span>
          </label>
          <input
            id="spread"
            type="number"
            value={spread}
            onChange={(e) => setSpread(e.target.value)}
            placeholder="1.0"
            min="0"
            step="0.01"
          />
        </div>
      </div>
    </div>
  )
}

export default BasicInfoForm

