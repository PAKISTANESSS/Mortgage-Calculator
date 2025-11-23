import { useState, useRef, useEffect } from 'react'
import './Calculator.css'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useLanguage } from './hooks/useLanguage'
import { useCurrency } from './hooks/useCurrency'
import { 
  calculateAmortizationSchedule, 
  calculateScheduleWithoutExtra,
  calculateMonthlyRate,
  calculateAnnualRate,
  calculateTotalInterest,
  calculateTotalAmountPaid,
  calculateAveragePayments
} from './utils/calculations'
import { exportReportToPDF } from './utils/pdfExport'
import { getDataFromURL } from './utils/urlSharing'
import BasicInfoForm from './components/BasicInfoForm'
import InsuranceForm from './components/InsuranceForm'
import AmortizationRules from './components/AmortizationRules'
import BalanceComparisonChart from './components/BalanceComparisonChart'
import ComparisonPieCharts from './components/ComparisonPieCharts'
import ShareButton from './components/ShareButton'

function AmortizationCalculator() {
  const { t, locale } = useLanguage()
  const { currency } = useCurrency()
  // Form state with localStorage persistence
  const [loanAmount, setLoanAmount] = useLocalStorage('loanAmount', '')
  const [months, setMonths] = useLocalStorage('months', '')
  const [euribor, setEuribor] = useLocalStorage('euribor', '')
  const [spread, setSpread] = useLocalStorage('spread', '')
  const [lifeInsurance, setLifeInsurance] = useLocalStorage('lifeInsurance', '')
  const [houseInsurance, setHouseInsurance] = useLocalStorage('houseInsurance', '')
  const [amortizationRules, setAmortizationRules] = useLocalStorage('amortizationRules', [
    { type: 'recurring', frequency: '1', period: 'year', amount: '1000', month: '', year: '' }
  ])
  const [recalculatePayment, setRecalculatePayment] = useLocalStorage('recalculatePayment', false)

  // UI state
  const [amortizationSchedule, setAmortizationSchedule] = useState([])
  const [scheduleWithoutExtra, setScheduleWithoutExtra] = useState([])
  const [isScheduleExpanded, setIsScheduleExpanded] = useState(true)
  const [isInsuranceExpanded, setIsInsuranceExpanded] = useState(false)
  const [isChartExpanded, setIsChartExpanded] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  
  // Field-level validation errors
  const [fieldErrors, setFieldErrors] = useState({
    loanAmount: '',
    months: '',
    euribor: '',
    spread: ''
  })

  const exportRef = useRef()
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
      if (urlData.amortizationRules !== undefined) setAmortizationRules(urlData.amortizationRules)
      if (urlData.recalculatePayment !== undefined) setRecalculatePayment(urlData.recalculatePayment)
      
      // Auto-calculate by triggering button click after data is loaded
      if (calculateButtonRef.current) {
        setTimeout(() => {
          calculateButtonRef.current.click()
        }, 100)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Disable scrolling when exporting
  useEffect(() => {
    if (isExporting) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isExporting])

  const calculateAmortization = () => {
    const principal = parseFloat(loanAmount)
    const numberOfMonths = parseInt(months)
    const euriborRate = parseFloat(euribor)
    const spreadRate = parseFloat(spread)
    const life = parseFloat(lifeInsurance) || 0
    const house = parseFloat(houseInsurance) || 0

    // Validate inputs field by field
    const errors = {
      loanAmount: !principal ? t.validationError : '',
      months: !numberOfMonths ? t.validationError : '',
      euribor: isNaN(euriborRate) ? t.validationError : '',
      spread: isNaN(spreadRate) ? t.validationError : ''
    }

    setFieldErrors(errors)

    // If any errors exist, stop
    if (Object.values(errors).some(error => error !== '')) {
      return
    }

    // Calculate amortization schedule
    const schedule = calculateAmortizationSchedule({
      principal,
      numberOfMonths,
      euriborRate,
      spreadRate,
      lifeInsurance: life,
      houseInsurance: house,
      amortizationRules,
      recalculatePayment
    })

    // Calculate schedule without extra payments for comparison
    const annualRate = calculateAnnualRate(euriborRate, spreadRate)
    const monthlyRate = calculateMonthlyRate(annualRate)
    const scheduleNoExtra = calculateScheduleWithoutExtra({
      principal,
      numberOfMonths,
      monthlyRate
    })

    setAmortizationSchedule(schedule)
    setScheduleWithoutExtra(scheduleNoExtra)
  }

  const resetCalculator = () => {
    setLoanAmount('')
    setMonths('')
    setEuribor('')
    setSpread('')
    setLifeInsurance('')
    setHouseInsurance('')
    setAmortizationSchedule([])
    setScheduleWithoutExtra([])
    setAmortizationRules([{ type: 'recurring', frequency: '1', period: 'year', amount: '1000', month: '', year: '' }])
    setRecalculatePayment(false)
    setFieldErrors({ loanAmount: '', months: '', euribor: '', spread: '' })
  }

  const handleExportToPDF = () => {
    exportReportToPDF({
      exportRef,
      isChartExpanded,
      isScheduleExpanded,
      isInsuranceExpanded,
      setIsChartExpanded,
      setIsScheduleExpanded,
      setIsInsuranceExpanded,
      setIsExporting,
      t
    })
  }

  // Calculate totals using utility functions
  const totalInterest = calculateTotalInterest(amortizationSchedule)

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>{t.amortizationCalcTitle}</h1>
          <p className="subtitle">{t.amortizationCalcSubtitle}</p>
        </header>

        <div className="calculator-card" ref={exportRef}>
          <AmortizationRules
            amortizationRules={amortizationRules}
            setAmortizationRules={setAmortizationRules}
            recalculatePayment={recalculatePayment}
            setRecalculatePayment={setRecalculatePayment}
          />

          <BasicInfoForm
            loanAmount={loanAmount}
            setLoanAmount={setLoanAmount}
            months={months}
            setMonths={setMonths}
            euribor={euribor}
            setEuribor={setEuribor}
            spread={spread}
            setSpread={setSpread}
            errors={fieldErrors}
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
            <button ref={calculateButtonRef} className="calculate-btn" onClick={calculateAmortization}>
              {t.amortizationCalc}
            </button>
            <button className="reset-btn" onClick={resetCalculator}>
              {t.reset}
            </button>
          </div>

          {amortizationSchedule.length > 0 && (
            <div className="result-card">
              <div className="result-label">{t.avgMonthlyPayments}</div>
              {(() => {
                // Calculate average payments using utility function
                const avgPayments = calculateAveragePayments(amortizationSchedule)
                const { firstYear, thirtyPercent, sixtyPercent } = avgPayments
                
                return (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', marginBottom: '0.5rem' }}>{t.year} {firstYear.year}</div>
                        <div className="result-amount" style={{ fontSize: '1.5rem' }}>
                          {currency.symbol}{firstYear.avgBase.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          {firstYear.avgTotal !== firstYear.avgBase && (
                            <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', marginLeft: '0.5rem' }}>
                              → ({currency.symbol}{firstYear.avgTotal.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', marginBottom: '0.5rem' }}>{t.year} {thirtyPercent.year}</div>
                        <div className="result-amount" style={{ fontSize: '1.5rem' }}>
                          {currency.symbol}{thirtyPercent.avgBase.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          {thirtyPercent.avgTotal !== thirtyPercent.avgBase && (
                            <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', marginLeft: '0.5rem' }}>
                              → ({currency.symbol}{thirtyPercent.avgTotal.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', marginBottom: '0.5rem' }}>{t.year} {sixtyPercent.year}</div>
                        <div className="result-amount" style={{ fontSize: '1.5rem' }}>
                          {currency.symbol}{sixtyPercent.avgBase.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          {sixtyPercent.avgTotal !== sixtyPercent.avgBase && (
                            <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', marginLeft: '0.5rem' }}>
                              → ({currency.symbol}{sixtyPercent.avgTotal.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )
              })()}
              <div className="result-details">
                <div className="detail-item">
                  <span>{t.totalInterestRate}:</span>
                  <span>{(parseFloat(euribor || 0) + parseFloat(spread || 0)).toFixed(2)}%</span>
                </div>
                <div className="detail-item">
                  <span>{t.totalAmountPaid}:</span>
                  <span>{currency.symbol}{calculateTotalAmountPaid(amortizationSchedule).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="detail-item">
                  <span>{t.totalInterest}:</span>
                  <span>{currency.symbol}{totalInterest.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          )}

          {amortizationSchedule.length > 0 && (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', margin: '3rem 0 2.5rem 0' }}>
              <button className="export-btn-inline" onClick={handleExportToPDF} title={t.exportPDF}>
                📄 {t.exportPDF}
              </button>
              <ShareButton 
                path="/amortization" 
                data={{
                  loanAmount,
                  months,
                  euribor,
                  spread,
                  lifeInsurance,
                  houseInsurance,
                  amortizationRules,
                  recalculatePayment
                }}
              />
            </div>
          )}

          {amortizationSchedule.length > 0 && scheduleWithoutExtra.length > 0 && (
            <div className="section amortization-section" data-section="balance-comparison">
              <h2 
                className="section-title collapsible" 
                onClick={() => setIsChartExpanded(!isChartExpanded)}
              >
                📈 {t.balanceComparison}
                <span className="collapse-icon">{isChartExpanded ? '▼' : '▶'}</span>
              </h2>

              {isChartExpanded && (
                <div className="chart-comparison">
                  <p style={{ fontSize: '0.9rem', color: '#718096', marginBottom: '1.5rem' }}>
                    {t.balanceDesc}
                  </p>
                  
                  <BalanceComparisonChart
                    loanAmount={loanAmount}
                    scheduleWithoutExtra={scheduleWithoutExtra}
                    amortizationSchedule={amortizationSchedule}
                  />

                  <ComparisonPieCharts
                    loanAmount={loanAmount}
                    scheduleWithoutExtra={scheduleWithoutExtra}
                    amortizationSchedule={amortizationSchedule}
                    euribor={euribor}
                    spread={spread}
                    lifeInsurance={lifeInsurance}
                    houseInsurance={houseInsurance}
                  />
                </div>
              )}
            </div>
          )}

          {amortizationSchedule.length > 0 && (
            <div className="section amortization-section" data-section="amortization-schedule">
              <h2 
                className="section-title collapsible" 
                onClick={() => setIsScheduleExpanded(!isScheduleExpanded)}
              >
                📋 {t.amortizationSchedule}
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
                        <th>{t.monthlyPaymentColumn}</th>
                        {amortizationRules.length > 0 && (
                          <th>{t.extraAmortColumn}</th>
                        )}
                        <th>{t.paymentPlusAmortColumn}</th>
                        <th>{t.balanceColumn}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {amortizationSchedule.map((row, index) => (
                        <tr key={`${row.month}-${index}`} className={row.isYearlySummary ? 'yearly-summary' : ''}>
                          <td>{row.year}</td>
                          <td>{row.month}</td>
                          <td>{currency.symbol}{row.principal.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td>{currency.symbol}{row.interest.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          {(parseFloat(lifeInsurance) > 0 || parseFloat(houseInsurance) > 0) && (
                            <td>{currency.symbol}{row.insurance.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          )}
                          <td>{currency.symbol}{row.basePayment.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          {amortizationRules.length > 0 && (
                            <td style={{ color: row.extraAmortization > 0 ? '#38a169' : '#4a5568', fontWeight: row.extraAmortization > 0 ? '600' : 'normal' }}>
                              {currency.symbol}{row.extraAmortization.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                          )}
                          <td>{currency.symbol}{row.totalPayment.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td>{currency.symbol}{row.balance.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="table-total">
                        <td colSpan="2" style={{ fontWeight: '700', textAlign: 'left' }}>{t.total}</td>
                        <td style={{ fontWeight: '700' }}>
                          {currency.symbol}{amortizationSchedule
                            .filter(row => !row.isYearlySummary)
                            .reduce((sum, row) => sum + row.principal, 0)
                            .toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td style={{ fontWeight: '700' }}>
                          {currency.symbol}{amortizationSchedule
                            .filter(row => !row.isYearlySummary)
                            .reduce((sum, row) => sum + row.interest, 0)
                            .toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        {(parseFloat(lifeInsurance) > 0 || parseFloat(houseInsurance) > 0) && (
                          <td style={{ fontWeight: '700' }}>
                            {currency.symbol}{amortizationSchedule
                              .filter(row => !row.isYearlySummary)
                              .reduce((sum, row) => sum + row.insurance, 0)
                              .toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        )}
                        <td style={{ fontWeight: '700' }}>
                          {currency.symbol}{amortizationSchedule
                            .filter(row => !row.isYearlySummary)
                            .reduce((sum, row) => sum + row.basePayment, 0)
                            .toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        {amortizationRules.length > 0 && (
                          <td style={{ fontWeight: '700', color: '#38a169' }}>
                            {currency.symbol}{amortizationSchedule
                              .filter(row => !row.isYearlySummary)
                              .reduce((sum, row) => sum + row.extraAmortization, 0)
                              .toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        )}
                        <td style={{ fontWeight: '700' }}>
                          {currency.symbol}{amortizationSchedule
                            .filter(row => !row.isYearlySummary)
                            .reduce((sum, row) => sum + row.totalPayment, 0)
                            .toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td style={{ fontWeight: '700' }}>—</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {isExporting && (
        <div className="export-loading-overlay">
          <div className="export-loading-content">
            <div className="export-spinner"></div>
            <p>{t.exporting}</p>
            <p className="export-loading-subtitle">{t.exportSubtitle}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AmortizationCalculator
