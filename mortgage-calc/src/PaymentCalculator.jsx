import { useState } from 'react'
import './Calculator.css'

function PaymentCalculator() {
  const [loanAmount, setLoanAmount] = useState('')
  const [months, setMonths] = useState('')
  const [euribor, setEuribor] = useState('')
  const [spread, setSpread] = useState('')
  const [lifeInsurance, setLifeInsurance] = useState('')
  const [houseInsurance, setHouseInsurance] = useState('')
  const [monthlyPayment, setMonthlyPayment] = useState(null)
  const [amortizationSchedule, setAmortizationSchedule] = useState([])
  const [isScheduleExpanded, setIsScheduleExpanded] = useState(true)
  const [isInsuranceExpanded, setIsInsuranceExpanded] = useState(false)
  const [isBreakdownExpanded, setIsBreakdownExpanded] = useState(true)

  const calculateMortgage = () => {
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

    // Calculate monthly payment using the mortgage formula
    // M = P * [r(1 + r)^n] / [(1 + r)^n - 1]
    let payment
    if (monthlyRate === 0) {
      payment = principal / numberOfMonths
    } else {
      const x = Math.pow(1 + monthlyRate, numberOfMonths)
      payment = (principal * monthlyRate * x) / (x - 1)
    }

    // Total insurance per month
    const totalInsurance = life + house

    setMonthlyPayment(payment + totalInsurance)

    // Generate amortization schedule with yearly summaries
    const schedule = []
    let remainingBalance = principal
    let yearlyPrincipal = 0
    let yearlyInterest = 0
    let yearlyInsurance = 0
    let yearlyTotal = 0

    for (let i = 1; i <= numberOfMonths; i++) {
      const interestPayment = remainingBalance * monthlyRate
      const principalPayment = payment - interestPayment
      remainingBalance -= principalPayment

      // Calculate month within the year (1-12)
      const monthInYear = ((i - 1) % 12) + 1
      const yearNumber = Math.floor((i - 1) / 12) + 1

      const monthData = {
        month: monthInYear,
        year: yearNumber,
        absoluteMonth: i,
        payment: payment,
        principal: principalPayment,
        interest: interestPayment,
        insurance: totalInsurance,
        totalPayment: payment + totalInsurance,
        balance: Math.max(0, remainingBalance),
        isYearlySummary: false
      }

      schedule.push(monthData)

      // Accumulate yearly totals
      yearlyPrincipal += principalPayment
      yearlyInterest += interestPayment
      yearlyInsurance += totalInsurance
      yearlyTotal += payment + totalInsurance

      // Add yearly summary row after every 12 months
      if (i % 12 === 0) {
        const yearNum = i / 12
        schedule.push({
          month: 'Total',
          year: yearNum,
          principal: yearlyPrincipal,
          interest: yearlyInterest,
          insurance: yearlyInsurance,
          totalPayment: yearlyTotal,
          balance: Math.max(0, remainingBalance),
          isYearlySummary: true
        })

        // Reset yearly accumulators
        yearlyPrincipal = 0
        yearlyInterest = 0
        yearlyInsurance = 0
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
    setMonthlyPayment(null)
    setAmortizationSchedule([])
  }

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>🏠 Monthly Payment Calculator</h1>
          <p className="subtitle">Calculate your monthly mortgage payment</p>
        </header>

        <div className="calculator-card">
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
            <button className="calculate-btn" onClick={calculateMortgage}>
              Calculate Payment
            </button>
            <button className="reset-btn" onClick={resetCalculator}>
              Reset
            </button>
          </div>

          {monthlyPayment !== null && (
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
                  <span>€{((monthlyPayment * parseInt(months || 0)) - parseFloat(loanAmount || 0) - ((parseFloat(lifeInsurance) || 0) + (parseFloat(houseInsurance) || 0)) * parseInt(months || 0)).toLocaleString('pt-PT', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}</span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Breakdown Chart */}
          {amortizationSchedule.length > 0 && (
            <div className="section amortization-section">
              <h2 
                className="section-title collapsible" 
                onClick={() => setIsBreakdownExpanded(!isBreakdownExpanded)}
              >
                📈 Payment Breakdown
                <span className="collapse-icon">{isBreakdownExpanded ? '▼' : '▶'}</span>
              </h2>
              
              {isBreakdownExpanded && (() => {
                // Calculate totals from schedule
                const totalPrincipal = parseFloat(loanAmount)
                const totalInterest = (monthlyPayment * parseInt(months)) - totalPrincipal - ((parseFloat(lifeInsurance) || 0) + (parseFloat(houseInsurance) || 0)) * parseInt(months)
                const totalInsurance = ((parseFloat(lifeInsurance) || 0) + (parseFloat(houseInsurance) || 0)) * parseInt(months)
                const grandTotal = totalPrincipal + totalInterest + totalInsurance
                
                // Calculate percentages
                const principalPercent = (totalPrincipal / grandTotal) * 100
                const interestPercent = (totalInterest / grandTotal) * 100
                const insurancePercent = (totalInsurance / grandTotal) * 100
                
                return (
                  <div className="chart-container">
                    <div className="pie-chart-wrapper">
                      <div 
                        className="pie-chart"
                        style={{
                          background: totalInsurance > 0 
                            ? `conic-gradient(
                                from 0deg,
                                #667eea 0deg ${principalPercent * 3.6}deg,
                                #f093fb ${principalPercent * 3.6}deg ${(principalPercent + interestPercent) * 3.6}deg,
                                #4facfe ${(principalPercent + interestPercent) * 3.6}deg 360deg
                              )`
                            : `conic-gradient(
                                from 0deg,
                                #667eea 0deg ${principalPercent * 3.6}deg,
                                #f093fb ${principalPercent * 3.6}deg 360deg
                              )`
                        }}
                      >
                        <div className="pie-chart-center">
                          <div className="pie-chart-total">Total</div>
                          <div className="pie-chart-amount">
                            €{grandTotal.toLocaleString('pt-PT', { 
                              minimumFractionDigits: 0, 
                              maximumFractionDigits: 0 
                            })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="chart-legend">
                        <div className="legend-item">
                          <span className="legend-color" style={{ backgroundColor: '#667eea' }}></span>
                          <div className="legend-details">
                            <span className="legend-label">Principal</span>
                            <span className="legend-value">
                              €{totalPrincipal.toLocaleString('pt-PT', { 
                                minimumFractionDigits: 2, 
                                maximumFractionDigits: 2 
                              })}
                            </span>
                            <span className="legend-percent">{principalPercent.toFixed(1)}%</span>
                          </div>
                        </div>
                        
                        <div className="legend-item">
                          <span className="legend-color" style={{ backgroundColor: '#f093fb' }}></span>
                          <div className="legend-details">
                            <span className="legend-label">Interest</span>
                            <span className="legend-value">
                              €{totalInterest.toLocaleString('pt-PT', { 
                                minimumFractionDigits: 2, 
                                maximumFractionDigits: 2 
                              })}
                            </span>
                            <span className="legend-percent">{interestPercent.toFixed(1)}%</span>
                          </div>
                        </div>
                        
                        {totalInsurance > 0 && (
                          <div className="legend-item">
                            <span className="legend-color" style={{ backgroundColor: '#4facfe' }}></span>
                            <div className="legend-details">
                              <span className="legend-label">Insurance</span>
                              <span className="legend-value">
                                €{totalInsurance.toLocaleString('pt-PT', { 
                                  minimumFractionDigits: 2, 
                                  maximumFractionDigits: 2 
                                })}
                              </span>
                              <span className="legend-percent">{insurancePercent.toFixed(1)}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

          {/* Payment Schedule Section */}
          {amortizationSchedule.length > 0 && (
            <div className="section amortization-section">
              <h2 
                className="section-title collapsible" 
                onClick={() => setIsScheduleExpanded(!isScheduleExpanded)}
              >
                📊 Payment Schedule
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

export default PaymentCalculator

