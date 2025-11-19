function BalanceComparisonChart({ loanAmount, scheduleWithoutExtra, amortizationSchedule }) {
  return (
    <div className="line-chart">
      <svg viewBox="0 0 800 400" className="line-chart-svg">
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={`grid-${i}`}
            x1="60"
            y1={80 + i * 60}
            x2="780"
            y2={80 + i * 60}
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        ))}
        
        {/* Y-axis labels */}
        {(() => {
          const maxBalance = parseFloat(loanAmount) || 100000
          return [0, 1, 2, 3, 4].map(i => {
            const value = maxBalance - (i * maxBalance / 4)
            return (
              <text
                key={`ylabel-${i}`}
                x="50"
                y={80 + i * 60 + 5}
                textAnchor="end"
                fontSize="12"
                fill="#718096"
              >
                {Math.round(value / 1000)}k€
              </text>
            )
          })
        })()}
        
        {/* X-axis labels (years) */}
        {(() => {
          const totalMonths = scheduleWithoutExtra.length
          const years = Math.ceil(totalMonths / 12)
          const step = years <= 10 ? 1 : Math.ceil(years / 10)
          return Array.from({ length: Math.min(11, Math.ceil(years / step) + 1) }, (_, i) => {
            const year = i * step
            const x = 60 + (year * 12 / totalMonths) * 720
            return x <= 780 ? (
              <text
                key={`xlabel-${i}`}
                x={x}
                y="330"
                textAnchor="middle"
                fontSize="12"
                fill="#718096"
              >
                {year}y
              </text>
            ) : null
          })
        })()}
        
        {/* Line without extra amortization */}
        {(() => {
          const maxBalance = parseFloat(loanAmount) || 100000
          const points = scheduleWithoutExtra
            .filter((_, i) => i % Math.max(1, Math.floor(scheduleWithoutExtra.length / 100)) === 0)
            .map((row) => {
              const x = 60 + (row.month / scheduleWithoutExtra.length) * 720
              const y = 320 - (row.balance / maxBalance) * 240
              return `${x},${y}`
            })
            .join(' ')
          return (
            <polyline
              points={points}
              fill="none"
              stroke="#fc8181"
              strokeWidth="2"
              opacity="0.8"
            />
          )
        })()}
        
        {/* Line with extra amortization */}
        {(() => {
          const maxBalance = parseFloat(loanAmount) || 100000
          const dataPoints = amortizationSchedule.filter(row => !row.isYearlySummary)
          const points = dataPoints
            .filter((_, i) => i % Math.max(1, Math.floor(dataPoints.length / 100)) === 0)
            .map((row) => {
              const monthNumber = (row.year - 1) * 12 + row.month
              const x = 60 + (monthNumber / scheduleWithoutExtra.length) * 720
              const y = 320 - (row.balance / maxBalance) * 240
              return `${x},${y}`
            })
            .join(' ')
          return (
            <polyline
              points={points}
              fill="none"
              stroke="#667eea"
              strokeWidth="3"
            />
          )
        })()}
        
        {/* Legend */}
        <line x1="600" y1="30" x2="640" y2="30" stroke="#fc8181" strokeWidth="2" opacity="0.8" />
        <text x="645" y="35" fontSize="14" fill="#4a5568">Without Extra Payments</text>
        
        <line x1="600" y1="55" x2="640" y2="55" stroke="#667eea" strokeWidth="3" />
        <text x="645" y="60" fontSize="14" fill="#4a5568">With Extra Payments</text>
      </svg>
    </div>
  )
}

export default BalanceComparisonChart

