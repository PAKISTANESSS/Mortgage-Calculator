/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'

const currencies = {
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    locale: 'de-DE'
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    locale: 'en-US'
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    locale: 'en-GB'
  }
}

const CurrencyContext = createContext()

export function CurrencyProvider({ children }) {
  const [currentCurrency, setCurrentCurrency] = useState(() => {
    const saved = localStorage.getItem('currency')
    return saved || 'EUR'
  })

  useEffect(() => {
    localStorage.setItem('currency', currentCurrency)
  }, [currentCurrency])

  const value = {
    currentCurrency,
    setCurrency: setCurrentCurrency,
    currency: currencies[currentCurrency],
    currencies
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}

