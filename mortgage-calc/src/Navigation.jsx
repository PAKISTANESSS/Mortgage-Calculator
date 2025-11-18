import { Link, useLocation } from 'react-router-dom'
import './Navigation.css'

function Navigation() {
  const location = useLocation()

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <span className="nav-icon">🏠</span>
          <span className="nav-title">Mortgage Tools</span>
        </div>
        <ul className="nav-menu">
          <li>
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
            >
              Payment Calculator
            </Link>
          </li>
          <li>
            <Link 
              to="/amortization" 
              className={location.pathname === '/amortization' ? 'nav-link active' : 'nav-link'}
            >
              Amortization Calculator
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navigation

