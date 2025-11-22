import { useState } from 'react'
import './Calculator.css'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useLanguage } from './hooks/useLanguage'
import { calculateMonthlyPayment } from './utils/calculations'
import BasicInfoForm from './components/BasicInfoForm'
import InsuranceForm from './components/InsuranceForm'

function PaymentCalculator() {
  const { t } = useLanguage()
  // Form state with localStorage persistence
  const [loanAmount, setLoanAmount] = useLocalStorage('loanAmount', '')
  const [months, setMonths] = useLocalStorage('months', '')
  const [euribor, setEuribor] = useLocalStorage('euribor', '')
  const [spread, setSpread] = useLocalStorage('spread', '')
  const [lifeInsurance, setLifeInsurance] = useLocalStorage('lifeInsurance', '')
  const [houseInsurance, setHouseInsurance] = useLocalStorage('houseInsurance', '')

  // UI state
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
      alert(t.validationError)
      return
    }

    // Calculate monthly interest rate and payment
    const annualRate = euriborRate + spreadRate
    const monthlyRate = annualRate / 12 / 100
    const payment = calculateMonthlyPayment(principal, monthlyRate, numberOfMonths)

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

      yearlyPrincipal += principalPayment
      yearlyInterest += interestPayment
      yearlyInsurance += totalInsurance
      yearlyTotal += payment + totalInsurance

      // Add yearly summary row
      if (i % 12 === 0) {
        schedule.push({
          month: 'Total',
          year: i / 12,
          absoluteMonth: i,
          payment: payment,
          principal: yearlyPrincipal,
          interest: yearlyInterest,
          insurance: yearlyInsurance,
          totalPayment: yearlyTotal,
          balance: Math.max(0, remainingBalance),
          isYearlySummary: true
        })
        yearlyPrincipal = 0
        yearlyInterest = 0
        yearlyInsurance = 0
        yearlyTotal = 0
      }
    }

    // Add final year summary if not a full year
    if (numberOfMonths % 12 !== 0 && yearlyTotal > 0) {
      const finalYear = Math.floor(numberOfMonths / 12) + 1
      schedule.push({
        month: 'Total',
        year: finalYear,
        absoluteMonth: numberOfMonths,
        payment: payment,
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

  const totalInterest = amortizationSchedule.length > 0
    ? amortizationSchedule
        .filter(row => !row.isYearlySummary)
        .reduce((sum, row) => sum + row.interest, 0)
    : 0

  const grandTotal = amortizationSchedule.length > 0
    ? parseFloat(loanAmount) + totalInterest + (amortizationSchedule.filter(row => !row.isYearlySummary).reduce((sum, row) => sum + row.insurance, 0))
    : 0

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>🏠 {t.navTitle}</h1>
          <p className="subtitle">{t.monthlyPaymentCalc}</p>
        </header>

        <div className="calculator-card">
          <BasicInfoForm
            loanAmount={loanAmount}
            setLoanAmount={setLoanAmount}
            months={months}
            setMonths={setMonths}
            euribor={euribor}
            setEuribor={setEuribor}
            spread={spread}
            setSpread={setSpread}
          />

          <InsuranceForm
            lifeInsurance={lifeInsurance}
            setLifeInsurance={setLifeInsurance}
            houseInsurance={houseInsurance}
            setHouseInsurance={setHouseInsurance}
            isExpanded={isInsuranceExpanded}
            setIsExpanded={setIsInsuranceExpanded}
          />

          <div className="button-group">
            <button className="calculate-btn" onClick={calculateMortgage}>
              {t.calculate}
            </button>
            <button className="reset-btn" onClick={resetCalculator}>
              {t.reset}
            </button>
          </div>

          {monthlyPayment && (
            <div className="result-card">
              <div className="result-label">{t.monthlyPayment}</div>
              <div className="result-amount">
                €{monthlyPayment.toLocaleString('pt-PT', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </div>
              <div className="result-details">
                <div className="detail-item">
                  <span>{t.loanAmount}:</span>
                  <span>€{parseFloat(loanAmount).toLocaleString('pt-PT', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}</span>
                </div>
                <div className="detail-item">
                  <span>{t.loanTerm}:</span>
                  <span>{months} {t.months} ({(parseInt(months) / 12).toFixed(1)} {t.years})</span>
                </div>
                <div className="detail-item">
                  <span>{t.totalInterestRate}:</span>
                  <span>{(parseFloat(euribor || 0) + parseFloat(spread || 0)).toFixed(2)}%</span>
                </div>
                <div className="detail-item">
                  <span>{t.totalAmountPaid}:</span>
                  <span>€{(monthlyPayment * parseInt(months)).toLocaleString('pt-PT', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}</span>
                </div>
                <div className="detail-item">
                  <span>{t.totalInterest}:</span>
                  <span>€{totalInterest.toLocaleString('pt-PT', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}</span>
                </div>
              </div>
            </div>
          )}

          {amortizationSchedule.length > 0 && grandTotal > 0 && (
            <div className="section">
              <h2 
                className="section-title collapsible" 
                onClick={() => setIsBreakdownExpanded(!isBreakdownExpanded)}
              >
                💰 {t.paymentBreakdown}
                <span className="collapse-icon">{isBreakdownExpanded ? '▼' : '▶'}</span>
              </h2>
              
              {isBreakdownExpanded && (() => {
                const principal = parseFloat(loanAmount) || 0
                const life = parseFloat(lifeInsurance) || 0
                const house = parseFloat(houseInsurance) || 0
                const totalInsurance = (life + house) * amortizationSchedule.filter(row => !row.isYearlySummary).length
                
                const principalPercent = (principal / grandTotal * 100).toFixed(1)
                const interestPercent = (totalInterest / grandTotal * 100).toFixed(1)
                const insurancePercent = totalInsurance > 0 ? (totalInsurance / grandTotal * 100).toFixed(1) : 0
                
                const principalDegrees = (principal / grandTotal) * 360
                const interestDegrees = principalDegrees + (totalInterest / grandTotal) * 360
                
                return (
                  <div className="chart-container">
                    <div className="pie-chart-wrapper">
                      <div 
                        className="pie-chart"
                        style={{
                          background: totalInsurance > 0 
                            ? `conic-gradient(
                                from 0deg,
                                #667eea 0deg ${principalDegrees}deg,
                                #f093fb ${principalDegrees}deg ${interestDegrees}deg,
                                #4facfe ${interestDegrees}deg 360deg
                              )`
                            : `conic-gradient(
                                from 0deg,
                                #667eea 0deg ${principalDegrees}deg,
                                #f093fb ${principalDegrees}deg 360deg
                              )`
                        }}
                      >
                        <div className="pie-chart-center">
                          <div className="pie-chart-total">{t.total}</div>
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
                          <div className="legend-color" style={{ background: '#667eea' }}></div>
                          <div className="legend-details">
                            <div className="legend-label">{t.principal}</div>
                            <div className="legend-value">€{principal.toLocaleString('pt-PT', { 
                              minimumFractionDigits: 0, 
                              maximumFractionDigits: 0 
                            })}</div>
                            <div className="legend-percent">({principalPercent}%)</div>
                          </div>
                        </div>
                        
                        <div className="legend-item">
                          <div className="legend-color" style={{ background: '#f093fb' }}></div>
                          <div className="legend-details">
                            <div className="legend-label">{t.interest}</div>
                            <div className="legend-value">€{totalInterest.toLocaleString('pt-PT', { 
                              minimumFractionDigits: 0, 
                              maximumFractionDigits: 0 
                            })}</div>
                            <div className="legend-percent">({interestPercent}%)</div>
                          </div>
                        </div>
                        
                        {totalInsurance > 0 && (
                          <div className="legend-item">
                            <div className="legend-color" style={{ background: '#4facfe' }}></div>
                            <div className="legend-details">
                              <div className="legend-label">{t.insurance}</div>
                              <div className="legend-value">€{totalInsurance.toLocaleString('pt-PT', { 
                                minimumFractionDigits: 0, 
                                maximumFractionDigits: 0 
                              })}</div>
                              <div className="legend-percent">({insurancePercent}%)</div>
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

          {amortizationSchedule.length > 0 && (
            <div className="section">
              <h2 
                className="section-title collapsible" 
                onClick={() => setIsScheduleExpanded(!isScheduleExpanded)}
              >
                📋 {t.paymentSchedule}
                <span className="collapse-icon">{isScheduleExpanded ? '▼' : '▶'}</span>
              </h2>

              {isScheduleExpanded && (
                <div className="amortization-table-wrapper">
                  <table className="amortization-table">
                    <thead>
                      <tr>
                        <th>{t.yearColumn}</th>
                        <th>{t.monthColumn}</th>
                        <th>{t.principalColumn}</th>
                        <th>{t.interestColumn}</th>
                        {(parseFloat(lifeInsurance) > 0 || parseFloat(houseInsurance) > 0) && (
                          <th>{t.insuranceColumn}</th>
                        )}
                        <th>{t.totalPaymentColumn}</th>
                        <th>{t.balanceColumn}</th>
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
