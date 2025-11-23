import { useLanguage } from '../hooks/useLanguage'
import { useCurrency } from '../hooks/useCurrency'

function ComparisonPieCharts({ 
  loanAmount,
  scheduleWithoutExtra,
  amortizationSchedule,
  euribor,
  spread,
  lifeInsurance,
  houseInsurance
}) {
  const { t, locale } = useLanguage()
  const { currency } = useCurrency()

  return (
    <div className="comparison-pies">
      <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2d3748', marginBottom: '1.5rem', marginTop: '2rem' }}>
        {t.totalPaymentBreakdown}
      </h3>
      <div className="pies-container">
        {/* Without Extra Amortization */}
        {(() => {
          const principal = parseFloat(loanAmount) || 0
          const life = parseFloat(lifeInsurance) || 0
          const house = parseFloat(houseInsurance) || 0
          const monthlyInsurance = life + house
          const totalInterest = scheduleWithoutExtra.reduce((sum, row) => {
            const balance = row.month === 1 ? principal : scheduleWithoutExtra[row.month - 2].balance
            const monthlyRate = (parseFloat(euribor) + parseFloat(spread)) / 12 / 100
            return sum + (balance * monthlyRate)
          }, 0)
          const totalInsurance = monthlyInsurance * scheduleWithoutExtra.length
          const total = principal + totalInterest + totalInsurance
          const principalPercent = (principal / total * 100).toFixed(1)
          const interestPercent = (totalInterest / total * 100).toFixed(1)
          const insurancePercent = (totalInsurance / total * 100).toFixed(1)
          
          const principalDegrees = (principal / total) * 360
          const interestDegrees = principalDegrees + (totalInterest / total) * 360
          
          return (
            <div className="pie-comparison-item">
              <h4>{t.withoutExtraPayments}</h4>
              <div className="pie-chart-mini">
                <div 
                  className="pie-chart-mini-inner"
                  style={{
                    background: totalInsurance > 0 ? `conic-gradient(
                      #667eea 0deg ${principalDegrees}deg,
                      #fc8181 ${principalDegrees}deg ${interestDegrees}deg,
                      #f6ad55 ${interestDegrees}deg 360deg
                    )` : `conic-gradient(
                      #667eea 0deg ${principalDegrees}deg,
                      #fc8181 ${principalDegrees}deg 360deg
                    )`
                  }}
                >
                  <div className="pie-chart-center-mini">
                    <div className="pie-chart-total-mini">{t.totalPaid}</div>
                    <div className="pie-chart-amount-mini">{currency.symbol}{total.toLocaleString(locale, { maximumFractionDigits: 0 })}</div>
                  </div>
                </div>
              </div>
              <div className="pie-legend-mini">
                <div className="legend-item-mini">
                  <span className="legend-color-mini" style={{ background: '#667eea' }}></span>
                  <span className="legend-text-mini">{t.principal}: {currency.symbol}{principal.toLocaleString(locale, { maximumFractionDigits: 0 })} ({principalPercent}%)</span>
                </div>
                <div className="legend-item-mini">
                  <span className="legend-color-mini" style={{ background: '#fc8181' }}></span>
                  <span className="legend-text-mini">{t.interest}: {currency.symbol}{totalInterest.toLocaleString(locale, { maximumFractionDigits: 0 })} ({interestPercent}%)</span>
                </div>
                {totalInsurance > 0 && (
                  <div className="legend-item-mini">
                    <span className="legend-color-mini" style={{ background: '#f6ad55' }}></span>
                    <span className="legend-text-mini">{t.insurance}: {currency.symbol}{totalInsurance.toLocaleString(locale, { maximumFractionDigits: 0 })} ({insurancePercent}%)</span>
                  </div>
                )}
              </div>
            </div>
          )
        })()}

        {/* With Extra Amortization */}
        {(() => {
          const dataPoints = amortizationSchedule.filter(row => !row.isYearlySummary)
          const loanPrincipal = parseFloat(loanAmount) || 0
          const totalInterest = dataPoints.reduce((sum, row) => sum + row.interest, 0)
          const totalInsurance = dataPoints.reduce((sum, row) => sum + row.insurance, 0)
          const totalExtra = dataPoints.reduce((sum, row) => sum + row.extraAmortization, 0)
          const totalPrincipalPaid = dataPoints.reduce((sum, row) => sum + row.principal, 0)
          const totalPayments = dataPoints.reduce((sum, row) => sum + row.totalPayment, 0)
          const regularPrincipal = totalPrincipalPaid
          const total = totalPayments
          const regularPrincipalPercent = (regularPrincipal / total * 100).toFixed(1)
          const extraPercent = (totalExtra / total * 100).toFixed(1)
          const interestPercent = (totalInterest / total * 100).toFixed(1)
          const insurancePercent = totalInsurance > 0 ? (totalInsurance / total * 100).toFixed(1) : 0
          
          const regularPrincipalDegrees = (regularPrincipal / total) * 360
          const extraDegrees = regularPrincipalDegrees + (totalExtra / total) * 360
          const interestDegrees = extraDegrees + (totalInterest / total) * 360
          
          return (
            <div className="pie-comparison-item">
              <h4>{t.withExtraPayments}</h4>
              <div className="pie-chart-mini">
                <div 
                  className="pie-chart-mini-inner"
                  style={{
                    background: totalInsurance > 0 && totalExtra > 0 ? `conic-gradient(
                      #667eea 0deg ${regularPrincipalDegrees}deg,
                      #48bb78 ${regularPrincipalDegrees}deg ${extraDegrees}deg,
                      #fc8181 ${extraDegrees}deg ${interestDegrees}deg,
                      #f6ad55 ${interestDegrees}deg 360deg
                    )` : totalExtra > 0 ? `conic-gradient(
                      #667eea 0deg ${regularPrincipalDegrees}deg,
                      #48bb78 ${regularPrincipalDegrees}deg ${extraDegrees}deg,
                      #fc8181 ${extraDegrees}deg 360deg
                    )` : totalInsurance > 0 ? `conic-gradient(
                      #667eea 0deg ${regularPrincipalDegrees}deg,
                      #fc8181 ${regularPrincipalDegrees}deg ${interestDegrees}deg,
                      #f6ad55 ${interestDegrees}deg 360deg
                    )` : `conic-gradient(
                      #667eea 0deg ${regularPrincipalDegrees}deg,
                      #fc8181 ${regularPrincipalDegrees}deg 360deg
                    )`
                  }}
                >
                  <div className="pie-chart-center-mini">
                    <div className="pie-chart-total-mini">{t.totalPaid}</div>
                    <div className="pie-chart-amount-mini">{currency.symbol}{total.toLocaleString(locale, { maximumFractionDigits: 0 })}</div>
                  </div>
                </div>
              </div>
              <div className="pie-legend-mini">
                <div className="legend-item-mini">
                  <span className="legend-color-mini" style={{ background: '#667eea' }}></span>
                  <span className="legend-text-mini">{t.principal}: {currency.symbol}{regularPrincipal.toLocaleString(locale, { maximumFractionDigits: 0 })} ({regularPrincipalPercent}%)</span>
                </div>
                {totalExtra > 0 && (
                  <div className="legend-item-mini">
                    <span className="legend-color-mini" style={{ background: '#48bb78' }}></span>
                    <span className="legend-text-mini">{t.extraPayments}: {currency.symbol}{totalExtra.toLocaleString(locale, { maximumFractionDigits: 0 })} ({extraPercent}%)</span>
                  </div>
                )}
                <div className="legend-item-mini">
                  <span className="legend-color-mini" style={{ background: '#fc8181' }}></span>
                  <span className="legend-text-mini">{t.interest}: {currency.symbol}{totalInterest.toLocaleString(locale, { maximumFractionDigits: 0 })} ({interestPercent}%)</span>
                </div>
                {totalInsurance > 0 && (
                  <div className="legend-item-mini">
                    <span className="legend-color-mini" style={{ background: '#f6ad55' }}></span>
                    <span className="legend-text-mini">{t.insurance}: {currency.symbol}{totalInsurance.toLocaleString(locale, { maximumFractionDigits: 0 })} ({insurancePercent}%)</span>
                  </div>
                )}
                {totalExtra > 0 && (
                  <div className="legend-item-mini" style={{ fontSize: '0.75rem', color: '#718096', fontStyle: 'italic', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0' }}>
                    {t.savesInterest} {currency.symbol}{(scheduleWithoutExtra.reduce((sum, row) => {
                      const balance = row.month === 1 ? loanPrincipal : scheduleWithoutExtra[row.month - 2].balance
                      const monthlyRate = (parseFloat(euribor) + parseFloat(spread)) / 12 / 100
                      return sum + (balance * monthlyRate)
                    }, 0) - totalInterest).toLocaleString(locale, { maximumFractionDigits: 0 })} {t.inInterest}
                  </div>
                )}
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}

export default ComparisonPieCharts

