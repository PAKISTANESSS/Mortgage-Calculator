import { useLanguage } from '../hooks/useLanguage'

function AmortizationRules({
  amortizationRules,
  setAmortizationRules,
  recalculatePayment,
  setRecalculatePayment
}) {
  const { t } = useLanguage()
  
  const addRule = () => {
    setAmortizationRules([...amortizationRules, { type: 'recurring', frequency: '', period: 'month', amount: '', month: '', year: '' }])
  }

  const removeRule = (index) => {
    setAmortizationRules(amortizationRules.filter((_, i) => i !== index))
  }

  const updateRule = (index, field, value) => {
    const newRules = [...amortizationRules]
    newRules[index][field] = value
    setAmortizationRules(newRules)
  }

  return (
    <div className="section">
      <h2 className="section-title">📝 {t.amortizationRules}</h2>
      
      <div>
        <p style={{ fontSize: '0.9rem', color: '#718096', marginBottom: '1rem' }}>
          {t.amortizationDesc}
        </p>
        
        <div style={{ 
          marginBottom: '1.5rem', 
          padding: '1rem', 
          background: '#f7fafc', 
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: '500',
            color: '#2d3748'
          }}>
            <input
              type="checkbox"
              checked={recalculatePayment}
              onChange={(e) => setRecalculatePayment(e.target.checked)}
              style={{ 
                marginRight: '0.75rem',
                width: '18px',
                height: '18px',
                cursor: 'pointer'
              }}
            />
            {t.recalculatePayment}
          </label>
          <p style={{ 
            fontSize: '0.85rem', 
            color: '#718096', 
            marginTop: '0.5rem',
            marginLeft: '26px',
            marginBottom: 0
          }}>
            {recalculatePayment ? t.recalculateYes : t.recalculateNo}
          </p>
        </div>
        
        {amortizationRules.map((rule, index) => (
          <div key={index} className="rule-row">
            <div className="rule-inputs">
              <div className="rule-input-group">
                <select
                  value={rule.type || 'recurring'}
                  onChange={(e) => updateRule(index, 'type', e.target.value)}
                >
                  <option value="recurring">{t.recurring}</option>
                  <option value="onetime">{t.oneTime}</option>
                </select>
              </div>
              
              {rule.type === 'onetime' ? (
                <>
                  <div className="rule-input-group">
                    <label>{t.month}</label>
                    <input
                      type="number"
                      value={rule.month}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 12)) {
                          updateRule(index, 'month', value)
                        }
                      }}
                      placeholder="10"
                      min="1"
                      max="12"
                    />
                  </div>
                  
                  <div className="rule-input-group">
                    <label>{t.year}</label>
                    <input
                      type="number"
                      value={rule.year}
                      onChange={(e) => updateRule(index, 'year', e.target.value)}
                      placeholder="4"
                      min="1"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="rule-input-group">
                    <label>{t.every}</label>
                    <input
                      type="number"
                      value={rule.frequency}
                      onChange={(e) => updateRule(index, 'frequency', e.target.value)}
                      placeholder="2"
                      min="1"
                    />
                  </div>
                  
                  <div className="rule-input-group">
                    <select
                      value={rule.period}
                      onChange={(e) => updateRule(index, 'period', e.target.value)}
                    >
                      <option value="month">{t.monthsOption}</option>
                      <option value="year">{t.yearsOption}</option>
                    </select>
                  </div>
                </>
              )}
              
              <div className="rule-input-group">
                <label>{t.payExtra}</label>
                <input
                  type="number"
                  value={rule.amount}
                  onChange={(e) => updateRule(index, 'amount', e.target.value)}
                  placeholder="500"
                  min="0"
                  step="100"
                />
                <span style={{ marginLeft: '0.5rem', color: '#4a5568', fontWeight: '600', fontSize: '1rem' }}>€</span>
              </div>
              
              <div className="rule-input-group">
                <button
                  className="remove-rule-btn"
                  onClick={() => removeRule(index)}
                  title="Remove rule"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
        
        <button className="add-rule-btn" onClick={addRule}>
          {t.addRule}
        </button>
      </div>
    </div>
  )
}

export default AmortizationRules

