import { useState, useRef } from 'react'
import './Calculator.css'
import { useLocalStorage } from './hooks/useLocalStorage'
import { calculateAmortizationSchedule, calculateScheduleWithoutExtra } from './utils/calculations'
import { exportReportToPDF } from './utils/pdfExport'
import BasicInfoForm from './components/BasicInfoForm'
import InsuranceForm from './components/InsuranceForm'
import AmortizationRules from './components/AmortizationRules'
import BalanceComparisonChart from './components/BalanceComparisonChart'
import ComparisonPieCharts from './components/ComparisonPieCharts'

function AmortizationCalculator() {
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

  const exportRef = useRef()

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
    const annualRate = euriborRate + spreadRate
    const monthlyRate = annualRate / 12 / 100
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
      setIsExporting
    })
  }

  const totalInterest = amortizationSchedule.length > 0
    ? amortizationSchedule
        .filter(row => !row.isYearlySummary)
        .reduce((sum, row) => sum + row.interest, 0)
    : 0

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>📊 Amortization Calculator</h1>
          <p className="subtitle">View detailed loan amortization schedule</p>
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
            <button className="calculate-btn" onClick={calculateAmortization}>
              Calculate Amortization
            </button>
            <button className="reset-btn" onClick={resetCalculator}>
              Reset
            </button>
          </div>

          {amortizationSchedule.length > 0 && (
            <div className="result-card">
              <div className="result-label">Average Monthly Payments (with amortization)</div>
              {(() => {
                const dataPoints = amortizationSchedule.filter(row => !row.isYearlySummary)
                const totalMonths = dataPoints.length
                
                // First year average (months 1-12)
                const firstYearEnd = Math.min(12, totalMonths)
                const firstYearPayments = dataPoints.slice(0, firstYearEnd)
                const firstYearAvgBase = firstYearPayments.reduce((sum, row) => sum + row.basePayment, 0) / firstYearEnd
                const firstYearAvgTotal = firstYearPayments.reduce((sum, row) => sum + row.totalPayment, 0) / firstYearEnd
                
                // 30% mark average
                const thirtyPercentMonth = Math.floor(totalMonths * 0.30)
                const yearAt30Start = Math.max(0, thirtyPercentMonth - 6)
                const yearAt30End = Math.min(totalMonths, thirtyPercentMonth + 6)
                const yearAt30Payments = dataPoints.slice(yearAt30Start, yearAt30End)
                const yearAt30AvgBase = yearAt30Payments.length > 0 
                  ? yearAt30Payments.reduce((sum, row) => sum + row.basePayment, 0) / yearAt30Payments.length 
                  : 0
                const yearAt30AvgTotal = yearAt30Payments.length > 0 
                  ? yearAt30Payments.reduce((sum, row) => sum + row.totalPayment, 0) / yearAt30Payments.length 
                  : 0
                
                // 60% mark average
                const sixtyPercentMonth = Math.floor(totalMonths * 0.60)
                const yearAt60Start = Math.max(0, sixtyPercentMonth - 6)
                const yearAt60End = Math.min(totalMonths, sixtyPercentMonth + 6)
                const yearAt60Payments = dataPoints.slice(yearAt60Start, yearAt60End)
                const yearAt60AvgBase = yearAt60Payments.length > 0 
                  ? yearAt60Payments.reduce((sum, row) => sum + row.basePayment, 0) / yearAt60Payments.length 
                  : 0
                const yearAt60AvgTotal = yearAt60Payments.length > 0 
                  ? yearAt60Payments.reduce((sum, row) => sum + row.totalPayment, 0) / yearAt60Payments.length 
                  : 0
                
                return (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', marginBottom: '0.5rem' }}>Year 1</div>
                        <div className="result-amount" style={{ fontSize: '1.5rem' }}>
                          €{firstYearAvgBase.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          {firstYearAvgTotal !== firstYearAvgBase && (
                            <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', marginLeft: '0.5rem' }}>
                              → (€{firstYearAvgTotal.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', marginBottom: '0.5rem' }}>Year {Math.ceil(totalMonths * 0.30 / 12)}</div>
                        <div className="result-amount" style={{ fontSize: '1.5rem' }}>
                          €{yearAt30AvgBase.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          {yearAt30AvgTotal !== yearAt30AvgBase && (
                            <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', marginLeft: '0.5rem' }}>
                              → (€{yearAt30AvgTotal.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', marginBottom: '0.5rem' }}>Year {Math.ceil(totalMonths * 0.60 / 12)}</div>
                        <div className="result-amount" style={{ fontSize: '1.5rem' }}>
                          €{yearAt60AvgBase.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          {yearAt60AvgTotal !== yearAt60AvgBase && (
                            <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', marginLeft: '0.5rem' }}>
                              → (€{yearAt60AvgTotal.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
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
                  <span>Total Interest Rate:</span>
                  <span>{(parseFloat(euribor || 0) + parseFloat(spread || 0)).toFixed(2)}%</span>
                </div>
                <div className="detail-item">
                  <span>Total Amount Paid:</span>
                  <span>€{(() => {
                    const dataPoints = amortizationSchedule.filter(row => !row.isYearlySummary)
                    const totalPaid = dataPoints.reduce((sum, row) => sum + row.totalPayment, 0)
                    return totalPaid.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  })()}</span>
                </div>
                <div className="detail-item">
                  <span>Total Interest:</span>
                  <span>€{totalInterest.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          )}

          {amortizationSchedule.length > 0 && (
            <div style={{ textAlign: 'center', margin: '3rem 0 2.5rem 0' }}>
              <button className="export-btn-inline" onClick={handleExportToPDF} title="Export to PDF">
                📄 Export to PDF
              </button>
            </div>
          )}

          {amortizationSchedule.length > 0 && scheduleWithoutExtra.length > 0 && (
            <div className="section amortization-section">
              <h2 
                className="section-title collapsible" 
                onClick={() => setIsChartExpanded(!isChartExpanded)}
              >
                📈 Balance Comparison
                <span className="collapse-icon">{isChartExpanded ? '▼' : '▶'}</span>
              </h2>

              {isChartExpanded && (
                <div className="chart-comparison">
                  <p style={{ fontSize: '0.9rem', color: '#718096', marginBottom: '1.5rem' }}>
                    Compare how extra amortization payments reduce your loan balance over time.
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
                        <th>Monthly Payment</th>
                        {amortizationRules.length > 0 && (
                          <th>Extra Amort.</th>
                        )}
                        <th>Payment + Amort.</th>
                        <th>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {amortizationSchedule.map((row, index) => (
                        <tr key={`${row.month}-${index}`} className={row.isYearlySummary ? 'yearly-summary' : ''}>
                          <td>{row.year}</td>
                          <td>{row.month}</td>
                          <td>€{row.principal.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td>€{row.interest.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          {(parseFloat(lifeInsurance) > 0 || parseFloat(houseInsurance) > 0) && (
                            <td>€{row.insurance.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          )}
                          <td>€{row.basePayment.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          {amortizationRules.length > 0 && (
                            <td style={{ color: row.extraAmortization > 0 ? '#38a169' : '#4a5568', fontWeight: row.extraAmortization > 0 ? '600' : 'normal' }}>
                              €{row.extraAmortization.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                          )}
                          <td>€{row.totalPayment.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td>€{row.balance.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="table-total">
                        <td colSpan="2" style={{ fontWeight: '700', textAlign: 'left' }}>TOTAL</td>
                        <td style={{ fontWeight: '700' }}>
                          €{amortizationSchedule
                            .filter(row => !row.isYearlySummary)
                            .reduce((sum, row) => sum + row.principal, 0)
                            .toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td style={{ fontWeight: '700' }}>
                          €{amortizationSchedule
                            .filter(row => !row.isYearlySummary)
                            .reduce((sum, row) => sum + row.interest, 0)
                            .toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        {(parseFloat(lifeInsurance) > 0 || parseFloat(houseInsurance) > 0) && (
                          <td style={{ fontWeight: '700' }}>
                            €{amortizationSchedule
                              .filter(row => !row.isYearlySummary)
                              .reduce((sum, row) => sum + row.insurance, 0)
                              .toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        )}
                        <td style={{ fontWeight: '700' }}>
                          €{amortizationSchedule
                            .filter(row => !row.isYearlySummary)
                            .reduce((sum, row) => sum + row.basePayment, 0)
                            .toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        {amortizationRules.length > 0 && (
                          <td style={{ fontWeight: '700', color: '#38a169' }}>
                            €{amortizationSchedule
                              .filter(row => !row.isYearlySummary)
                              .reduce((sum, row) => sum + row.extraAmortization, 0)
                              .toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        )}
                        <td style={{ fontWeight: '700' }}>
                          €{amortizationSchedule
                            .filter(row => !row.isYearlySummary)
                            .reduce((sum, row) => sum + row.totalPayment, 0)
                            .toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
            <p>Generating PDF...</p>
            <p className="export-loading-subtitle">This may take a moment for large reports</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AmortizationCalculator
