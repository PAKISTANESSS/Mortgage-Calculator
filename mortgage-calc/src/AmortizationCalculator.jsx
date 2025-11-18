import { useState, useEffect } from 'react'
import './Calculator.css'

function AmortizationCalculator() {
  // Load from localStorage or use empty string
  const [loanAmount, setLoanAmount] = useState(() => localStorage.getItem('loanAmount') || '')
  const [months, setMonths] = useState(() => localStorage.getItem('months') || '')
  const [euribor, setEuribor] = useState(() => localStorage.getItem('euribor') || '')
  const [spread, setSpread] = useState(() => localStorage.getItem('spread') || '')
  const [lifeInsurance, setLifeInsurance] = useState(() => localStorage.getItem('lifeInsurance') || '')
  const [houseInsurance, setHouseInsurance] = useState(() => localStorage.getItem('houseInsurance') || '')
  const [amortizationSchedule, setAmortizationSchedule] = useState([])
  const [isScheduleExpanded, setIsScheduleExpanded] = useState(true)
  const [isInsuranceExpanded, setIsInsuranceExpanded] = useState(false)
  const [amortizationRules, setAmortizationRules] = useState(() => {
    const saved = localStorage.getItem('amortizationRules')
    return saved ? JSON.parse(saved) : [{ type: 'recurring', frequency: '1', period: 'year', amount: '1000', month: '', year: '' }]
  })

  // Save to localStorage whenever values change
  useEffect(() => {
    localStorage.setItem('loanAmount', loanAmount)
    localStorage.setItem('months', months)
    localStorage.setItem('euribor', euribor)
    localStorage.setItem('spread', spread)
    localStorage.setItem('lifeInsurance', lifeInsurance)
    localStorage.setItem('houseInsurance', houseInsurance)
  }, [loanAmount, months, euribor, spread, lifeInsurance, houseInsurance])

  // Save amortization rules to localStorage
  useEffect(() => {
    localStorage.setItem('amortizationRules', JSON.stringify(amortizationRules))
  }, [amortizationRules])

  const addAmortizationRule = () => {
    setAmortizationRules([...amortizationRules, { type: 'recurring', frequency: '', period: 'month', amount: '', month: '', year: '' }])
  }

  const removeAmortizationRule = (index) => {
    setAmortizationRules(amortizationRules.filter((_, i) => i !== index))
  }

  const updateAmortizationRule = (index, field, value) => {
    const newRules = [...amortizationRules]
    newRules[index][field] = value
    setAmortizationRules(newRules)
  }

  const calculateAmortization = () => {
    const principal = parseFloat(loanAmount)
    const numberOfMonths = parseInt(months)
    const euriborRate = parseFloat(euribor)
    const spreadRate = parseFloat(spread)
    const life = parseFloat(lifeInsurance) || 0
    const house = parseFloat(houseInsurance) || 0

    // Validate inputs
    if (!principal || !numberOfMonths || isNaN(euriborRate) || isNaN(spreadRate)) {
      alert('Please fill in all fields with valid numbers')
      return
    }

    // Calculate monthly interest rate
    const annualRate = euriborRate + spreadRate
    const monthlyRate = annualRate / 12 / 100

    // Calculate monthly payment
    let payment
    if (monthlyRate === 0) {
      payment = principal / numberOfMonths
    } else {
      const x = Math.pow(1 + monthlyRate, numberOfMonths)
      payment = (principal * monthlyRate * x) / (x - 1)
    }

    // Total insurance per month
    const totalInsurance = life + house

    // Generate amortization schedule with yearly summaries
    const schedule = []
    let remainingBalance = principal
    let yearlyPrincipal = 0
    let yearlyInterest = 0
    let yearlyInsurance = 0
    let yearlyExtraAmortization = 0
    let yearlyTotal = 0

    for (let i = 1; i <= numberOfMonths; i++) {
      const interestPayment = remainingBalance * monthlyRate
      const principalPayment = payment - interestPayment
      
      // Apply amortization rules
      let extraAmortization = 0
      amortizationRules.forEach(rule => {
        const amt = parseFloat(rule.amount)
        if (amt) {
          if (rule.type === 'onetime') {
            // One-time payment on specific month and year
            const ruleMonth = parseInt(rule.month)
            const ruleYear = parseInt(rule.year)
            if (ruleMonth && ruleYear) {
              const targetMonth = (ruleYear - 1) * 12 + ruleMonth
              if (i === targetMonth) {
                extraAmortization += amt
              }
            }
          } else {
            // Recurring payment
            const freq = parseInt(rule.frequency)
            if (freq) {
              const periodInMonths = rule.period === 'year' ? freq * 12 : freq
              if (i % periodInMonths === 0) {
                extraAmortization += amt
              }
            }
          }
        }
      })
      
      remainingBalance -= principalPayment
      remainingBalance -= extraAmortization
      remainingBalance = Math.max(0, remainingBalance)

      const monthInYear = ((i - 1) % 12) + 1
      const yearNumber = Math.floor((i - 1) / 12) + 1

      schedule.push({
        month: monthInYear,
        year: yearNumber,
        principal: principalPayment,
        interest: interestPayment,
        insurance: totalInsurance,
        extraAmortization: extraAmortization,
        totalPayment: payment + totalInsurance + extraAmortization,
        balance: remainingBalance,
        isYearlySummary: false
      })

      yearlyPrincipal += principalPayment
      yearlyInterest += interestPayment
      yearlyInsurance += totalInsurance
      yearlyExtraAmortization += extraAmortization
      yearlyTotal += payment + totalInsurance + extraAmortization
      
      // Stop if balance reaches 0
      if (remainingBalance === 0) {
        break
      }

      if (i % 12 === 0) {
        schedule.push({
          month: 'Total',
          year: i / 12,
          principal: yearlyPrincipal,
          interest: yearlyInterest,
          insurance: yearlyInsurance,
          extraAmortization: yearlyExtraAmortization,
          totalPayment: yearlyTotal,
          balance: Math.max(0, remainingBalance),
          isYearlySummary: true
        })
        yearlyPrincipal = 0
        yearlyInterest = 0
        yearlyInsurance = 0
        yearlyExtraAmortization = 0
        yearlyTotal = 0
      }
    }

    // Add final year summary if there are remaining months (not a full year)
    if (numberOfMonths % 12 !== 0 && yearlyTotal > 0) {
      const finalYear = Math.floor(numberOfMonths / 12) + 1
      schedule.push({
        month: 'Total',
        year: finalYear,
        principal: yearlyPrincipal,
        interest: yearlyInterest,
        insurance: yearlyInsurance,
        extraAmortization: yearlyExtraAmortization,
        totalPayment: yearlyTotal,
        balance: Math.max(0, remainingBalance),
        isYearlySummary: true
      })
    }

    setAmortizationSchedule(schedule)
  }

  const resetCalculator = () => {
    setLoanAmount('')
    setMonths('')
    setEuribor('')
    setSpread('')
    setLifeInsurance('')
    setHouseInsurance('')
    setAmortizationSchedule([])
  }

  const totalInterest = amortizationSchedule.length > 0
    ? amortizationSchedule
        .filter(row => !row.isYearlySummary)
        .reduce((sum, row) => sum + row.interest, 0)
    : 0

  const monthlyPayment = amortizationSchedule.length > 0 && !amortizationSchedule[0].isYearlySummary
    ? amortizationSchedule[0].totalPayment
    : 0

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>📊 Amortization Calculator</h1>
          <p className="subtitle">View detailed loan amortization schedule</p>
        </header>

        <div className="calculator-card">
          {/* Amortization Rules Section */}
          <div className="section">
            <h2 className="section-title">📝 Amortization Rules</h2>
            
            <div>
              <p style={{ fontSize: '0.9rem', color: '#718096', marginBottom: '1rem' }}>
                Add recurring (e.g., every year) or one-time (e.g., month 10 of year 4) extra payments to reduce your loan faster.
              </p>
              
              {amortizationRules.map((rule, index) => (
                <div key={index} className="rule-row">
                  <div className="rule-inputs">
                    <div className="rule-input-group">
                      <select
                        value={rule.type || 'recurring'}
                        onChange={(e) => updateAmortizationRule(index, 'type', e.target.value)}
                      >
                        <option value="recurring">Recurring</option>
                        <option value="onetime">One-time</option>
                      </select>
                    </div>
                    
                    {rule.type === 'onetime' ? (
                      <>
                        <div className="rule-input-group">
                          <label>Month</label>
                          <input
                            type="number"
                            value={rule.month}
                            onChange={(e) => {
                              const value = e.target.value
                              if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 12)) {
                                updateAmortizationRule(index, 'month', value)
                              }
                            }}
                            placeholder="10"
                            min="1"
                            max="12"
                          />
                        </div>
                        
                        <div className="rule-input-group">
                          <label>Year</label>
                          <input
                            type="number"
                            value={rule.year}
                            onChange={(e) => updateAmortizationRule(index, 'year', e.target.value)}
                            placeholder="4"
                            min="1"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="rule-input-group">
                          <label>Every</label>
                          <input
                            type="number"
                            value={rule.frequency}
                            onChange={(e) => updateAmortizationRule(index, 'frequency', e.target.value)}
                            placeholder="2"
                            min="1"
                          />
                        </div>
                        
                        <div className="rule-input-group">
                          <select
                            value={rule.period}
                            onChange={(e) => updateAmortizationRule(index, 'period', e.target.value)}
                          >
                            <option value="month">Month(s)</option>
                            <option value="year">Year(s)</option>
                          </select>
                        </div>
                      </>
                    )}
                    
                    <div className="rule-input-group">
                      <label>Pay Extra</label>
                      <input
                        type="number"
                        value={rule.amount}
                        onChange={(e) => updateAmortizationRule(index, 'amount', e.target.value)}
                        placeholder="500"
                        min="0"
                        step="100"
                      />
                      <span style={{ marginLeft: '0.5rem', color: '#4a5568', fontWeight: '600', fontSize: '1rem' }}>€</span>
                    </div>
                    
                    <div className="rule-input-group">
                      <button
                        className="remove-rule-btn"
                        onClick={() => removeAmortizationRule(index)}
                        title="Remove rule"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              <button className="add-rule-btn" onClick={addAmortizationRule}>
                + Add Rule
              </button>
            </div>
          </div>

          {/* Basic Section */}
          <div className="section">
            <h2 className="section-title">📋 Basic Information</h2>
            
            <div className="input-group">
              <label htmlFor="loanAmount">
                <span className="label-text">Loan Amount</span>
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
                <span className="label-text">Loan Term</span>
                <span className="label-unit">months</span>
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
                  <span className="label-text">Euribor Rate</span>
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
                <span className="input-hint">💡 Euribor rates change frequently.</span>
              </div>

              <div className="input-group">
                <label htmlFor="spread">
                  <span className="label-text">Spread</span>
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

          {/* Insurance Section */}
          <div className="section">
            <h2 
              className="section-title collapsible" 
              onClick={() => setIsInsuranceExpanded(!isInsuranceExpanded)}
            >
              🛡️ Insurance (Optional)
              <span className="collapse-icon">{isInsuranceExpanded ? '▼' : '▶'}</span>
            </h2>
            
            {isInsuranceExpanded && (
              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="lifeInsurance">
                    <span className="label-text">Life Insurance</span>
                    <span className="label-unit">€/month</span>
                  </label>
                  <input
                    id="lifeInsurance"
                    type="number"
                    value={lifeInsurance}
                    onChange={(e) => setLifeInsurance(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="houseInsurance">
                    <span className="label-text">House Insurance</span>
                    <span className="label-unit">€/month</span>
                  </label>
                  <input
                    id="houseInsurance"
                    type="number"
                    value={houseInsurance}
                    onChange={(e) => setHouseInsurance(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="button-group">
            <button className="calculate-btn" onClick={calculateAmortization}>
              Calculate Amortization
            </button>
            <button className="reset-btn" onClick={resetCalculator}>
              Reset
            </button>
          </div>

          {amortizationSchedule.length > 0 && (
            <div className="result-card">
              <div className="result-label">Monthly Payment</div>
              <div className="result-amount">
                €{monthlyPayment.toLocaleString('pt-PT', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </div>
              <div className="result-details">
                <div className="detail-item">
                  <span>Total Interest Rate:</span>
                  <span>{(parseFloat(euribor || 0) + parseFloat(spread || 0)).toFixed(2)}%</span>
                </div>
                {(parseFloat(lifeInsurance) > 0 || parseFloat(houseInsurance) > 0) && (
                  <div className="detail-item">
                    <span>Monthly Insurance:</span>
                    <span>€{((parseFloat(lifeInsurance) || 0) + (parseFloat(houseInsurance) || 0)).toLocaleString('pt-PT', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}</span>
                  </div>
                )}
                <div className="detail-item">
                  <span>Total Amount Paid:</span>
                  <span>€{(monthlyPayment * parseInt(months || 0)).toLocaleString('pt-PT', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}</span>
                </div>
                <div className="detail-item">
                  <span>Total Interest:</span>
                  <span>€{totalInterest.toLocaleString('pt-PT', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}</span>
                </div>
              </div>
            </div>
          )}

          {amortizationSchedule.length > 0 && (
            <div className="section amortization-section">
              <h2 
                className="section-title collapsible" 
                onClick={() => setIsScheduleExpanded(!isScheduleExpanded)}
              >
                📋 Amortization Schedule
                <span className="collapse-icon">{isScheduleExpanded ? '▼' : '▶'}</span>
              </h2>

              {isScheduleExpanded && (
                <div className="amortization-table-wrapper">
                  <table className="amortization-table">
                    <thead>
                      <tr>
                        <th>Year</th>
                        <th>Month</th>
                        <th>Principal</th>
                        <th>Interest</th>
                        {(parseFloat(lifeInsurance) > 0 || parseFloat(houseInsurance) > 0) && (
                          <th>Insurance</th>
                        )}
                        {amortizationRules.length > 0 && (
                          <th>Extra Amort.</th>
                        )}
                        <th>Total Payment</th>
                        <th>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {amortizationSchedule.map((row, index) => (
                        <tr key={`${row.month}-${index}`} className={row.isYearlySummary ? 'yearly-summary' : ''}>
                          <td>{row.year}</td>
                          <td>{row.month}</td>
                          <td>€{row.principal.toLocaleString('pt-PT', { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })}</td>
                          <td>€{row.interest.toLocaleString('pt-PT', { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })}</td>
                          {(parseFloat(lifeInsurance) > 0 || parseFloat(houseInsurance) > 0) && (
                            <td>€{row.insurance.toLocaleString('pt-PT', { 
                              minimumFractionDigits: 2, 
                              maximumFractionDigits: 2 
                            })}</td>
                          )}
                          {amortizationRules.length > 0 && (
                            <td style={{ color: row.extraAmortization > 0 ? '#38a169' : '#4a5568', fontWeight: row.extraAmortization > 0 ? '600' : 'normal' }}>
                              €{row.extraAmortization.toLocaleString('pt-PT', { 
                                minimumFractionDigits: 2, 
                                maximumFractionDigits: 2 
                              })}
                            </td>
                          )}
                          <td>€{row.totalPayment.toLocaleString('pt-PT', { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })}</td>
                          <td>€{row.balance.toLocaleString('pt-PT', { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AmortizationCalculator

