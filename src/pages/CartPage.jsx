import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { seedRestaurants } from '../data/seedData'
import PaymentModal from '../components/PaymentModal'

const ORDERS_KEY = 'foodq_orders'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 6)
}

function getRestaurant(id) {
  const custom = JSON.parse(localStorage.getItem('foodq_restaurants') || '[]')
  return [...seedRestaurants, ...custom].find(r => r.id === id)
}

export default function CartPage() {
  const { cart, total, updateQty, clearCart } = useCart()
  const navigate = useNavigate()

  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [showPayment, setShowPayment] = useState(false)

  const restaurant = cart.restaurantId ? getRestaurant(cart.restaurantId) : null
  const branch = restaurant?.branches.find(b => b.id === cart.branchId)

  const estimatedMinutes = branch
    ? (branch.queueCount + 1) * branch.avgPrepTime
    : 30

  const handlePaymentSuccess = () => {
    const order = {
      id: generateId(),
      restaurantId: cart.restaurantId,
      restaurantName: cart.restaurantName,
      branchId: cart.branchId,
      branchName: cart.branchName || 'Not selected',
      items: cart.items.map(i => ({
        name: i.menuItem.name,
        price: i.menuItem.price,
        quantity: i.quantity,
      })),
      total: total,
      status: 'pending',
      estimatedMinutes,
      customerName,
      customerPhone,
      paymentStatus: 'completed',
      createdAt: new Date().toISOString(),
    }

    const existing = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
    localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...existing]))

    clearCart()
    navigate(`/order/${order.id}`)
  }

  if (cart.items.length === 0) {
    return (
      <div className="empty-state" style={{ paddingTop: 120 }}>
        <h2>Your cart is empty</h2>
        <p>Browse restaurants and add items to get started</p>
        <Link to="/" className="back-home-btn">Browse Restaurants</Link>
      </div>
    )
  }

  const canCheckout = customerName.trim() && customerPhone.trim() && cart.branchId

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Checkout</h1>

        <div className="cart-page-layout">
          <div className="cart-items-section">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>
              {cart.restaurantName}
            </h3>
            {cart.branchName && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                {cart.branchName} branch
              </p>
            )}

            {cart.items.map(item => (
              <div key={item.menuItem.id} className="cart-page-item">
                <div className="cart-item-info">
                  <h4>{item.menuItem.name}</h4>
                  <p>${item.menuItem.price.toFixed(2)} each</p>
                </div>
                <div className="qty-controls">
                  <button
                    className="qty-btn"
                    onClick={() => updateQty(item.menuItem.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="qty-display">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQty(item.menuItem.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-section">
            <h3>Order Details</h3>

            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="Enter phone number"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
              />
            </div>

            {!cart.branchId && (
              <p style={{
                color: 'var(--danger)',
                fontSize: '0.85rem',
                fontWeight: 500,
                marginBottom: 12,
                padding: '8px 12px',
                background: 'var(--danger-light)',
                borderRadius: 'var(--radius-sm)',
              }}>
                Please select a branch on the restaurant page first
              </p>
            )}

            {branch && (
              <div className="branch-eta" style={{ marginTop: 0, marginBottom: 16 }}>
                <div className="eta-label">Estimated Wait</div>
                <div className="eta-time">~{estimatedMinutes} min</div>
              </div>
            )}

            <div className="order-summary">
              {cart.items.map(item => (
                <div key={item.menuItem.id} className="order-summary-row">
                  <span>{item.menuItem.name} x{item.quantity}</span>
                  <span>${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="order-summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="pay-btn"
              disabled={!canCheckout}
              onClick={() => setShowPayment(true)}
            >
              Pay ${total.toFixed(2)}
            </button>
          </div>
        </div>
      </div>

      {showPayment && (
        <PaymentModal
          amount={total}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  )
}
