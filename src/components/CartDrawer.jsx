import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function CartDrawer({ open, onClose }) {
  const { cart, total, updateQty, removeItem } = useCart()
  const navigate = useNavigate()

  const handleCheckout = () => {
    onClose()
    navigate('/cart')
  }

  return (
    <div className={`cart-overlay ${open ? 'open' : ''}`} onClick={onClose}>
      <div className="cart-drawer" onClick={e => e.stopPropagation()}>
        <div className="cart-drawer-header">
          <h2>Your Cart</h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="cart-drawer-body">
          {cart.items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
              <p>Your cart is empty</p>
            </div>
          ) : (
            <>
              {cart.restaurantName && (
                <div className="cart-restaurant-name">
                  From: <strong>{cart.restaurantName}</strong>
                  {cart.branchName && ` - ${cart.branchName}`}
                </div>
              )}
              {cart.items.map(item => (
                <div key={item.menuItem.id} className="cart-item">
                  <div className="cart-item-info">
                    <h4>{item.menuItem.name}</h4>
                    <p>${(item.menuItem.price * item.quantity).toFixed(2)}</p>
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
            </>
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
