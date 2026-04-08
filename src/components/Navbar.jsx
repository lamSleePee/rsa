import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import CartDrawer from './CartDrawer'

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { itemCount } = useCart()
  const { isAdmin } = useAuth()
  const location = useLocation()

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="navbar-brand">
            Food<span>Q</span>
          </Link>
          <div className="navbar-links">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link
              to={isAdmin ? '/admin/dashboard' : '/admin'}
              className={`nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
            >
              Admin
            </Link>
            <button className="cart-btn" onClick={() => setDrawerOpen(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              Cart
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </button>
          </div>
        </div>
      </nav>
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
