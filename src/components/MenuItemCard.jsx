import { useCart } from '../context/CartContext'

export default function MenuItemCard({ item, restaurantId, restaurantName }) {
  const { cart, addItem, updateQty } = useCart()

  const cartItem = cart.items.find(i => i.menuItem.id === item.id)
  const quantity = cartItem ? cartItem.quantity : 0

  return (
    <div className={`menu-item-card ${!item.available ? 'unavailable' : ''}`}>
      <div className="menu-item-info">
        <h4>{item.name}</h4>
        <p>{item.description}</p>
        <span className="menu-item-price">${item.price.toFixed(2)}</span>
      </div>
      <div className="menu-item-actions">
        {quantity === 0 ? (
          <button
            className="add-btn"
            onClick={() => addItem(item, restaurantId, restaurantName)}
            disabled={!item.available}
          >
            + Add
          </button>
        ) : (
          <div className="qty-controls">
            <button
              className="qty-btn"
              onClick={() => updateQty(item.id, quantity - 1)}
            >
              -
            </button>
            <span className="qty-display">{quantity}</span>
            <button
              className="qty-btn"
              onClick={() => updateQty(item.id, quantity + 1)}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
