import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import PaymentCalculator from './PaymentCalculator.jsx'
import AmortizationCalculator from './AmortizationCalculator.jsx'
import Navigation from './Navigation.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<PaymentCalculator />} />
        <Route path="/amortization" element={<AmortizationCalculator />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
