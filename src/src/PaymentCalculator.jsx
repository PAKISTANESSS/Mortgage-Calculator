import { useState, useEffect, useRef } from 'react'
import './Calculator.css'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useLanguage } from './hooks/useLanguage'
import { 
  calculateMonthlyPayment,
  calculateMonthlyRate,
  calculateAnnualRate,
  generatePaymentSchedule,
  calculateTotalInterest,
  calculateTotalInsurance,
  calculateGrandTotal,
  calculatePieChartData
} from './utils/calculations'
import { getDataFromURL } from './utils/urlSharing'
import BasicInfoForm from './components/BasicInfoForm'
import InsuranceForm from './components/InsuranceForm'
import ShareButton from './components/ShareButton'

function PaymentCalculator() {
  const { t, locale } = useLanguage()
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

  const calculateButtonRef = useRef(null)

  // Load data from URL on mount and auto-calculate
  useEffect(() => {
    const urlData = getDataFromURL()
    if (urlData) {
      if (urlData.loanAmount !== undefined) setLoanAmount(urlData.loanAmount)
      if (urlData.months !== undefined) setMonths(urlData.months)
      if (urlData.euribor !== undefined) setEuribor(urlData.euribor)
      if (urlData.spread !== undefined) setSpread(urlData.spread)
      if (urlData.lifeInsurance !== undefined) setLifeInsurance(urlData.lifeInsurance)
      if (urlData.houseInsurance !== undefined) setHouseInsurance(urlData.houseInsurance)
      
      // Auto-calculate by triggering button click after data is loaded
      if (calculateButtonRef.current) {
        setTimeout(() => {
          calculateButtonRef.current.click()
        }, 100)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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

    // Calculate interest rates
    const annualRate = calculateAnnualRate(euriborRate, spreadRate)
    const monthlyRate = calculateMonthlyRate(annualRate)
    
    // Calculate monthly payment
    const payment = calculateMonthlyPayment(principal, monthlyRate, numberOfMonths)
    const totalInsurance = life + house
    setMonthlyPayment(payment + totalInsurance)

    // Generate payment schedule
    const schedule = generatePaymentSchedule({
      principal,
      numberOfMonths,
      monthlyRate,
      lifeInsurance: life,
      houseInsurance: house
    })

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

  // Calculate totals using utility functions
  const totalInterest = calculateTotalInterest(amortizationSchedule)
  const totalInsuranceAmount = calculateTotalInsurance(amortizationSchedule)
  const grandTotal = amortizationSchedule.length > 0
    ? calculateGrandTotal(parseFloat(loanAmount), amortizationSchedule)
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
            <button ref={calculateButtonRef} className="calculate-btn" onClick={calculateMortgage}>
              {t.calculate}
            </button>
            <button className="reset-btn" onClick={resetCalculator}>
              {t.reset}
            </button>
            <ShareButton 
              path="/" 
              data={{
                loanAmount,
                months,
                euribor,
                spread,
                lifeInsurance,
                houseInsurance
              }}
            />
          </div>

          {monthlyPayment && (
            <div className="result-card">
              <div className="result-label">{t.monthlyPayment}</div>
              <div className="result-amount">
                €{monthlyPayment.toLocaleString(locale, { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </div>
              <div className="result-details">
                <div className="detail-item">
                  <span>{t.loanAmount}:</span>
                  <span>€{parseFloat(loanAmount).toLocaleString(locale, { 
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
                  <span>€{(monthlyPayment * parseInt(months)).toLocaleString(locale, { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}</span>
                </div>
                <div className="detail-item">
                  <span>{t.totalInterest}:</span>
                  <span>€{totalInterest.toLocaleString(locale, { 
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
                
                // Calculate pie chart data using utility function
                const pieData = calculatePieChartData(principal, totalInterest, totalInsuranceAmount)
                const { principalPercent, interestPercent, insurancePercent, principalDegrees, interestDegrees } = pieData
                
                return (
                  <div className="chart-container">
                    <div className="pie-chart-wrapper">
                      <div 
                        className="pie-chart"
                        style={{
                          background: totalInsuranceAmount > 0 
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
                            €{grandTotal.toLocaleString(locale, { 
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
                            <div className="legend-value">€{principal.toLocaleString(locale, { 
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
                            <div className="legend-value">€{totalInterest.toLocaleString(locale, { 
                              minimumFractionDigits: 0, 
                              maximumFractionDigits: 0 
                            })}</div>
                            <div className="legend-percent">({interestPercent}%)</div>
                          </div>
                        </div>
                        
                        {totalInsuranceAmount > 0 && (
                          <div className="legend-item">
                            <div className="legend-color" style={{ background: '#4facfe' }}></div>
                            <div className="legend-details">
                              <div className="legend-label">{t.insurance}</div>
                              <div className="legend-value">€{totalInsuranceAmount.toLocaleString(locale, { 
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
                          <td>€{row.principal.toLocaleString(locale, { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })}</td>
                          <td>€{row.interest.toLocaleString(locale, { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })}</td>
                          {(parseFloat(lifeInsurance) > 0 || parseFloat(houseInsurance) > 0) && (
                            <td>€{row.insurance.toLocaleString(locale, { 
                              minimumFractionDigits: 2, 
                              maximumFractionDigits: 2 
                            })}</td>
                          )}
                          <td>€{row.totalPayment.toLocaleString(locale, { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })}</td>
                          <td>€{row.balance.toLocaleString(locale, { 
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
