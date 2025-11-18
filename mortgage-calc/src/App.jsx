import { useState } from 'react'
import './App.css'

function App() {
  const [loanAmount, setLoanAmount] = useState('')
  const [months, setMonths] = useState('')
  const [euribor, setEuribor] = useState('')
  const [spread, setSpread] = useState('')
  const [monthlyPayment, setMonthlyPayment] = useState(null)

  const calculateMortgage = () => {
    const principal = parseFloat(loanAmount)
    const numberOfMonths = parseInt(months)
    const euriborRate = parseFloat(euribor)
    const spreadRate = parseFloat(spread)

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

    setMonthlyPayment(payment)
  }

  const resetCalculator = () => {
    setLoanAmount('')
    setMonths('')
    setEuribor('')
    setSpread('')
    setMonthlyPayment(null)
  }

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>🏠 Mortgage Calculator</h1>
          <p className="subtitle">Calculate your monthly mortgage payment</p>
        </header>

        <div className="calculator-card">
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
                <div className="detail-item">
                  <span>Total Amount Paid:</span>
                  <span>€{(monthlyPayment * parseInt(months || 0)).toLocaleString('pt-PT', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}</span>
                </div>
                <div className="detail-item">
                  <span>Total Interest:</span>
                  <span>€{((monthlyPayment * parseInt(months || 0)) - parseFloat(loanAmount || 0)).toLocaleString('pt-PT', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer>
          <p>💡 Tip: Euribor rates change frequently. Check the current rate before calculations.</p>
        </footer>
      </div>
    </div>
  )
}

export default App
