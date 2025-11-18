import { useState } from 'react'
import './Calculator.css'

function AmortizationCalculator() {
  const [loanAmount, setLoanAmount] = useState('')
  const [years, setYears] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [amortizationSchedule, setAmortizationSchedule] = useState([])
  const [isScheduleExpanded, setIsScheduleExpanded] = useState(true)

  const calculateAmortization = () => {
    const principal = parseFloat(loanAmount)
    const numberOfYears = parseInt(years)
    const rate = parseFloat(interestRate)

    // Validate inputs
    if (!principal || !numberOfYears || isNaN(rate)) {
      alert('Please fill in all fields with valid numbers')
      return
    }

    const numberOfMonths = numberOfYears * 12
    const monthlyRate = rate / 12 / 100

    // Calculate monthly payment
    let payment
    if (monthlyRate === 0) {
      payment = principal / numberOfMonths
    } else {
      const x = Math.pow(1 + monthlyRate, numberOfMonths)
      payment = (principal * monthlyRate * x) / (x - 1)
    }

    // Generate amortization schedule with yearly summaries
    const schedule = []
    let remainingBalance = principal
    let yearlyPrincipal = 0
    let yearlyInterest = 0
    let yearlyTotal = 0

    for (let i = 1; i <= numberOfMonths; i++) {
      const interestPayment = remainingBalance * monthlyRate
      const principalPayment = payment - interestPayment
      remainingBalance -= principalPayment

      const monthInYear = ((i - 1) % 12) + 1
      const yearNumber = Math.floor((i - 1) / 12) + 1

      schedule.push({
        month: monthInYear,
        year: yearNumber,
        principal: principalPayment,
        interest: interestPayment,
        totalPayment: payment,
        balance: Math.max(0, remainingBalance),
        isYearlySummary: false
      })

      yearlyPrincipal += principalPayment
      yearlyInterest += interestPayment
      yearlyTotal += payment

      if (i % 12 === 0) {
        schedule.push({
          month: 'Total',
          year: i / 12,
          principal: yearlyPrincipal,
          interest: yearlyInterest,
          totalPayment: yearlyTotal,
          balance: Math.max(0, remainingBalance),
          isYearlySummary: true
        })
        yearlyPrincipal = 0
        yearlyInterest = 0
        yearlyTotal = 0
      }
    }

    setAmortizationSchedule(schedule)
  }

  const resetCalculator = () => {
    setLoanAmount('')
    setYears('')
    setInterestRate('')
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
          <div className="section">
            <h2 className="section-title">💰 Loan Details</h2>
            
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
              <label htmlFor="years">
                <span className="label-text">Loan Term</span>
                <span className="label-unit">years</span>
              </label>
              <input
                id="years"
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                placeholder="30"
                min="1"
                step="1"
              />
            </div>

            <div className="input-group">
              <label htmlFor="interestRate">
                <span className="label-text">Annual Interest Rate</span>
                <span className="label-unit">%</span>
              </label>
              <input
                id="interestRate"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="4.5"
                min="0"
                step="0.01"
              />
            </div>
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
                  <span>Total Amount Paid:</span>
                  <span>€{(monthlyPayment * parseInt(years) * 12).toLocaleString('pt-PT', { 
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

