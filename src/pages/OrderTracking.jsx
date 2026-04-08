import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import OrderTracker from '../components/OrderTracker'

const ORDERS_KEY = 'encaveman_orders'

export default function OrderTrackingPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
    const found = orders.find(o => o.id === id)
    setOrder(found || null)
  }, [id])

  useEffect(() => {
    if (!order || order.status === 'delivered') return

    const statusFlow = ['pending', 'confirmed', 'preparing', 'ready', 'delivered']
    const currentIdx = statusFlow.indexOf(order.status)

    if (currentIdx < statusFlow.length - 1) {
      const timer = setTimeout(() => {
        const nextStatus = statusFlow[currentIdx + 1]
        const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
        const updated = orders.map(o =>
          o.id === order.id ? { ...o, status: nextStatus } : o
        )
        localStorage.setItem(ORDERS_KEY, JSON.stringify(updated))
        setOrder(prev => ({ ...prev, status: nextStatus }))
      }, 8000)

      return () => clearTimeout(timer)
    }
  }, [order])

  if (!order) {
    return (
      <div className="empty-state" style={{ paddingTop: 120 }}>
        <h2>Order not found</h2>
        <p>We could not find the order you are looking for</p>
        <Link to="/" className="back-home-btn">Back to Home</Link>
      </div>
    )
  }

  return (
    <div className="order-tracking-page">
      <div className="container">
        <h1>Order #{order.id.toUpperCase()}</h1>

        <div className="tracking-layout">
          <OrderTracker
            status={order.status}
            estimatedMinutes={order.estimatedMinutes}
            createdAt={order.createdAt}
          />

          <div>
            <div className="order-details-card">
              <div className="order-meta">
                <p>Restaurant: <span>{order.restaurantName}</span></p>
                <p>Branch: <span>{order.branchName}</span></p>
                <p>Customer: <span>{order.customerName}</span></p>
                <p>Phone: <span>{order.customerPhone}</span></p>
              </div>

              <h3>Items</h3>
              {order.items.map((item, idx) => (
                <div key={idx} className="order-detail-row">
                  <span>{item.name} x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="order-detail-row total">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <Link to="/" className="back-home-btn" style={{ fontSize: '0.85rem', padding: '10px 24px' }}>
                Order More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
