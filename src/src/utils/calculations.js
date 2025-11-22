// ============================================================
// CORE CALCULATION FUNCTIONS
// ============================================================

/**
 * Calculate monthly payment using amortization formula
 * @param {number} principal - Loan amount
 * @param {number} monthlyRate - Monthly interest rate (as decimal)
 * @param {number} numberOfMonths - Total number of months
 * @returns {number} Monthly payment amount
 */
export function calculateMonthlyPayment(principal, monthlyRate, numberOfMonths) {
  if (monthlyRate === 0) {
    return principal / numberOfMonths
  }
  const x = Math.pow(1 + monthlyRate, numberOfMonths)
  return (principal * monthlyRate * x) / (x - 1)
}

/**
 * Calculate annual interest rate from Euribor and spread
 * @param {number} euriborRate - Euribor rate
 * @param {number} spreadRate - Spread rate
 * @returns {number} Total annual rate
 */
export function calculateAnnualRate(euriborRate, spreadRate) {
  return euriborRate + spreadRate
}

/**
 * Calculate monthly interest rate from annual rate
 * @param {number} annualRate - Annual interest rate
 * @returns {number} Monthly interest rate (as decimal)
 */
export function calculateMonthlyRate(annualRate) {
  return annualRate / 12 / 100
}

/**
 * Calculate amortization schedule with extra payments
 * @param {Object} params - Calculation parameters
 * @returns {Array} Amortization schedule with monthly and yearly summaries
 */
export function calculateAmortizationSchedule({
  principal,
  numberOfMonths,
  euriborRate,
  spreadRate,
  lifeInsurance = 0,
  houseInsurance = 0,
  amortizationRules = [],
  recalculatePayment = false
}) {
  // Calculate monthly interest rate and payment
  const annualRate = euriborRate + spreadRate
  const monthlyRate = annualRate / 12 / 100
  let payment = calculateMonthlyPayment(principal, monthlyRate, numberOfMonths)

  // Total insurance per month
  const totalInsurance = lifeInsurance + houseInsurance

  // Generate amortization schedule with yearly summaries
  const schedule = []
  let remainingBalance = principal
  let yearlyPrincipal = 0
  let yearlyInterest = 0
  let yearlyInsurance = 0
  let yearlyBasePayment = 0
  let yearlyExtraAmortization = 0
  let yearlyTotal = 0

  for (let i = 1; i <= numberOfMonths; i++) {
    // Recalculate payment if mode is enabled and there are extra payments
    let currentPayment = payment
    if (recalculatePayment && i > 1 && remainingBalance > 0) {
      const remainingMonths = numberOfMonths - i + 1
      currentPayment = calculateMonthlyPayment(remainingBalance, monthlyRate, remainingMonths)
    }
    
    const interestPayment = remainingBalance * monthlyRate
    const principalPayment = currentPayment - interestPayment
    
    // Apply amortization rules
    let extraAmortization = calculateExtraAmortization(i, amortizationRules)
    
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
      basePayment: currentPayment + totalInsurance,
      extraAmortization: extraAmortization,
      totalPayment: currentPayment + totalInsurance + extraAmortization,
      balance: remainingBalance,
      isYearlySummary: false
    })

    yearlyPrincipal += principalPayment
    yearlyInterest += interestPayment
    yearlyInsurance += totalInsurance
    yearlyBasePayment += currentPayment + totalInsurance
    yearlyExtraAmortization += extraAmortization
    yearlyTotal += currentPayment + totalInsurance + extraAmortization
    
    // Stop if balance reaches 0
    if (remainingBalance === 0) {
      break
    }

    // Add yearly summary
    if (i % 12 === 0) {
      schedule.push({
        month: 'Total',
        year: i / 12,
        principal: yearlyPrincipal,
        interest: yearlyInterest,
        insurance: yearlyInsurance,
        basePayment: yearlyBasePayment,
        extraAmortization: yearlyExtraAmortization,
        totalPayment: yearlyTotal,
        balance: Math.max(0, remainingBalance),
        isYearlySummary: true
      })
      yearlyPrincipal = 0
      yearlyInterest = 0
      yearlyInsurance = 0
      yearlyBasePayment = 0
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
      basePayment: yearlyBasePayment,
      extraAmortization: yearlyExtraAmortization,
      totalPayment: yearlyTotal,
      balance: Math.max(0, remainingBalance),
      isYearlySummary: true
    })
  }

  return schedule
}

/**
 * Calculate schedule without extra payments for comparison
 * @param {Object} params - Calculation parameters
 * @returns {Array} Simple balance schedule
 */
export function calculateScheduleWithoutExtra({
  principal,
  numberOfMonths,
  monthlyRate
}) {
  const payment = calculateMonthlyPayment(principal, monthlyRate, numberOfMonths)
  const schedule = []
  let balance = principal

  for (let i = 1; i <= numberOfMonths; i++) {
    const interestPayment = balance * monthlyRate
    const principalPayment = payment - interestPayment
    
    balance -= principalPayment
    balance = Math.max(0, balance)

    schedule.push({
      month: i,
      balance: balance
    })

    if (balance === 0) {
      break
    }
  }

  return schedule
}

/**
 * Calculate extra amortization for a given month
 * @param {number} currentMonth - Current month number (1-based)
 * @param {Array} rules - Array of amortization rules
 * @returns {number} Total extra amortization for this month
 */
function calculateExtraAmortization(currentMonth, rules) {
  let total = 0
  
  rules.forEach(rule => {
    const amt = parseFloat(rule.amount)
    if (amt) {
      if (rule.type === 'onetime') {
        // One-time payment on specific month and year
        const ruleMonth = parseInt(rule.month)
        const ruleYear = parseInt(rule.year)
        if (ruleMonth && ruleYear) {
          const targetMonth = (ruleYear - 1) * 12 + ruleMonth
          if (currentMonth === targetMonth) {
            total += amt
          }
        }
      } else {
        // Recurring payment
        const freq = parseInt(rule.frequency)
        if (freq) {
          const periodInMonths = rule.period === 'year' ? freq * 12 : freq
          if (currentMonth % periodInMonths === 0) {
            total += amt
          }
        }
      }
    }
  })
  
  return total
}

// ============================================================
// PAYMENT CALCULATOR SCHEDULE (Simple schedule with insurance)
// ============================================================

/**
 * Generate payment schedule for PaymentCalculator (includes insurance)
 * @param {Object} params - Calculation parameters
 * @returns {Array} Payment schedule with monthly and yearly summaries
 */
export function generatePaymentSchedule({
  principal,
  numberOfMonths,
  monthlyRate,
  lifeInsurance = 0,
  houseInsurance = 0
}) {
  const payment = calculateMonthlyPayment(principal, monthlyRate, numberOfMonths)
  const totalInsurance = lifeInsurance + houseInsurance

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

  return schedule
}

// ============================================================
// SUMMARY CALCULATIONS
// ============================================================

/**
 * Calculate total interest from schedule
 * @param {Array} schedule - Amortization schedule
 * @returns {number} Total interest paid
 */
export function calculateTotalInterest(schedule) {
  if (!schedule || schedule.length === 0) return 0
  return schedule
    .filter(row => !row.isYearlySummary)
    .reduce((sum, row) => sum + row.interest, 0)
}

/**
 * Calculate total insurance from schedule
 * @param {Array} schedule - Amortization schedule
 * @returns {number} Total insurance paid
 */
export function calculateTotalInsurance(schedule) {
  if (!schedule || schedule.length === 0) return 0
  return schedule
    .filter(row => !row.isYearlySummary)
    .reduce((sum, row) => sum + row.insurance, 0)
}

/**
 * Calculate grand total (principal + interest + insurance)
 * @param {number} principal - Loan amount
 * @param {Array} schedule - Amortization schedule
 * @returns {number} Grand total amount
 */
export function calculateGrandTotal(principal, schedule) {
  if (!schedule || schedule.length === 0) return 0
  const totalInterest = calculateTotalInterest(schedule)
  const totalInsurance = calculateTotalInsurance(schedule)
  return principal + totalInterest + totalInsurance
}

/**
 * Calculate total amount paid from schedule
 * @param {Array} schedule - Amortization schedule
 * @returns {number} Total amount paid
 */
export function calculateTotalAmountPaid(schedule) {
  if (!schedule || schedule.length === 0) return 0
  return schedule
    .filter(row => !row.isYearlySummary)
    .reduce((sum, row) => sum + row.totalPayment, 0)
}

// ============================================================
// PIE CHART CALCULATIONS
// ============================================================

/**
 * Calculate pie chart data for payment breakdown
 * @param {number} principal - Loan amount
 * @param {number} totalInterest - Total interest
 * @param {number} totalInsurance - Total insurance
 * @returns {Object} Pie chart data with percentages and degrees
 */
export function calculatePieChartData(principal, totalInterest, totalInsurance = 0) {
  const grandTotal = principal + totalInterest + totalInsurance
  
  const principalPercent = ((principal / grandTotal) * 100).toFixed(1)
  const interestPercent = ((totalInterest / grandTotal) * 100).toFixed(1)
  const insurancePercent = totalInsurance > 0 
    ? ((totalInsurance / grandTotal) * 100).toFixed(1) 
    : 0
  
  const principalDegrees = (principal / grandTotal) * 360
  const interestDegrees = principalDegrees + (totalInterest / grandTotal) * 360
  
  return {
    grandTotal,
    principalPercent,
    interestPercent,
    insurancePercent,
    principalDegrees,
    interestDegrees
  }
}

// ============================================================
// AVERAGE PAYMENT CALCULATIONS
// ============================================================

/**
 * Calculate average payments for different time periods
 * @param {Array} schedule - Amortization schedule
 * @returns {Object} Average payment data for different periods
 */
export function calculateAveragePayments(schedule) {
  const dataPoints = schedule.filter(row => !row.isYearlySummary)
  const totalMonths = dataPoints.length
  
  // First year average (months 1-12)
  const firstYearEnd = Math.min(12, totalMonths)
  const firstYearPayments = dataPoints.slice(0, firstYearEnd)
  const firstYearAvgBase = firstYearPayments.reduce((sum, row) => sum + row.basePayment, 0) / firstYearEnd
  const firstYearAvgTotal = firstYearPayments.reduce((sum, row) => sum + row.totalPayment, 0) / firstYearEnd
  
  // 30% mark average (year around 30%)
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
  
  // 60% mark average (year around 60%)
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
  
  return {
    totalMonths,
    firstYear: {
      avgBase: firstYearAvgBase,
      avgTotal: firstYearAvgTotal,
      year: 1
    },
    thirtyPercent: {
      avgBase: yearAt30AvgBase,
      avgTotal: yearAt30AvgTotal,
      year: Math.ceil(totalMonths * 0.30 / 12)
    },
    sixtyPercent: {
      avgBase: yearAt60AvgBase,
      avgTotal: yearAt60AvgTotal,
      year: Math.ceil(totalMonths * 0.60 / 12)
    }
  }
}

