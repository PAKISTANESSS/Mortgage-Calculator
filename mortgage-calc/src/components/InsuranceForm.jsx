function InsuranceForm({ 
  lifeInsurance, 
  setLifeInsurance, 
  houseInsurance, 
  setHouseInsurance, 
  isExpanded, 
  setIsExpanded 
}) {
  return (
    <div className="section">
      <h2 
        className="section-title collapsible" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        🛡️ Insurance (Optional)
        <span className="collapse-icon">{isExpanded ? '▼' : '▶'}</span>
      </h2>
      
      {isExpanded && (
        <div className="input-row">
          <div className="input-group">
            <label htmlFor="lifeInsurance">
              <span className="label-text">Life Insurance</span>
              <span className="label-unit">€/month</span>
            </label>
            <input
              id="lifeInsurance"
              type="number"
              value={lifeInsurance}
              onChange={(e) => setLifeInsurance(e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>

          <div className="input-group">
            <label htmlFor="houseInsurance">
              <span className="label-text">House Insurance</span>
              <span className="label-unit">€/month</span>
            </label>
            <input
              id="houseInsurance"
              type="number"
              value={houseInsurance}
              onChange={(e) => setHouseInsurance(e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default InsuranceForm

