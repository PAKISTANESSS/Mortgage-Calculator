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

