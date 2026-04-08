import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { seedRestaurants } from '../data/seedData'

const REST_KEY = 'encaveman_restaurants'
const ORDERS_KEY = 'encaveman_orders'

const GRADIENTS = [
  'linear-gradient(135deg, #800020, #5c0017)',
  'linear-gradient(135deg, #722f37, #4a0012)',
  'linear-gradient(135deg, #6b1530, #3b0010)',
  'linear-gradient(135deg, #91283b, #5c0017)',
  'linear-gradient(135deg, #4a0012, #2d000b)',
  'linear-gradient(135deg, #800020, #3b0010)',
]

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 6)
}

export default function AdminDashboard() {
  const { isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const [tab, setTab] = useState('restaurants')
  const [customRestaurants, setCustomRestaurants] = useState([])
  const [orders, setOrders] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [managing, setManaging] = useState(null)

  const [form, setForm] = useState({
    name: '', cuisine: '', description: '', rating: '4.5',
  })
  const [branchForm, setBranchForm] = useState({
    name: '', address: '', avgPrepTime: '10',
  })
  const [menuForm, setMenuForm] = useState({
    name: '', description: '', price: '', category: '',
  })

  useEffect(() => {
    if (!isAdmin) navigate('/admin')
  }, [isAdmin, navigate])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(REST_KEY) || '[]')
    setCustomRestaurants(saved)
  }, [])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
    setOrders(saved)
    const interval = setInterval(() => {
      const latest = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
      setOrders(latest)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const allRestaurants = [...seedRestaurants, ...customRestaurants]

  const saveCustom = (list) => {
    setCustomRestaurants(list)
    localStorage.setItem(REST_KEY, JSON.stringify(list))
  }

  const handleCreateRestaurant = (e) => {
    e.preventDefault()
    const newR = {
      id: generateId(),
      name: form.name,
      cuisine: form.cuisine,
      description: form.description,
      rating: parseFloat(form.rating) || 4.5,
      gradient: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
      branches: [],
      menu: [],
    }
    saveCustom([...customRestaurants, newR])
    setForm({ name: '', cuisine: '', description: '', rating: '4.5' })
    setShowForm(false)
  }

  const handleDeleteRestaurant = (id) => {
    if (!window.confirm('Delete this restaurant?')) return
    saveCustom(customRestaurants.filter(r => r.id !== id))
    if (managing === id) setManaging(null)
  }

  const handleAddBranch = (e) => {
    e.preventDefault()
    const r = customRestaurants.find(r => r.id === managing)
    if (!r) return
    const branch = {
      id: generateId(),
      name: branchForm.name,
      address: branchForm.address,
      queueCount: 0,
      avgPrepTime: parseInt(branchForm.avgPrepTime) || 10,
    }
    const updated = customRestaurants.map(rest =>
      rest.id === managing
        ? { ...rest, branches: [...rest.branches, branch] }
        : rest
    )
    saveCustom(updated)
    setBranchForm({ name: '', address: '', avgPrepTime: '10' })
  }

  const handleRemoveBranch = (branchId) => {
    const updated = customRestaurants.map(rest =>
      rest.id === managing
        ? { ...rest, branches: rest.branches.filter(b => b.id !== branchId) }
        : rest
    )
    saveCustom(updated)
  }

  const handleAddMenuItem = (e) => {
    e.preventDefault()
    const item = {
      id: generateId(),
      name: menuForm.name,
      description: menuForm.description,
      price: parseFloat(menuForm.price) || 0,
      category: menuForm.category,
      available: true,
    }
    const updated = customRestaurants.map(rest =>
      rest.id === managing
        ? { ...rest, menu: [...rest.menu, item] }
        : rest
    )
    saveCustom(updated)
    setMenuForm({ name: '', description: '', price: '', category: '' })
  }

  const handleRemoveMenuItem = (itemId) => {
    const updated = customRestaurants.map(rest =>
      rest.id === managing
        ? { ...rest, menu: rest.menu.filter(m => m.id !== itemId) }
        : rest
    )
    saveCustom(updated)
  }

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updated = orders.map(o =>
      o.id === orderId ? { ...o, status: newStatus } : o
    )
    setOrders(updated)
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated))
  }

  const statusFlow = ['pending', 'confirmed', 'preparing', 'ready', 'delivered']

  const managedRestaurant = managing
    ? customRestaurants.find(r => r.id === managing)
    : null

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <button className="logout-btn" onClick={() => { logout(); navigate('/admin'); }}>
            Logout
          </button>
        </div>

        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-label">Total Restaurants</div>
            <div className="stat-value">{allRestaurants.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Custom Restaurants</div>
            <div className="stat-value">{customRestaurants.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Orders</div>
            <div className="stat-value">{orders.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active Orders</div>
            <div className="stat-value">
              {orders.filter(o => o.status !== 'delivered').length}
            </div>
          </div>
        </div>

        <div className="admin-tabs">
          <button
            className={`admin-tab ${tab === 'restaurants' ? 'active' : ''}`}
            onClick={() => setTab('restaurants')}
          >
            Restaurants
          </button>
          <button
            className={`admin-tab ${tab === 'orders' ? 'active' : ''}`}
            onClick={() => setTab('orders')}
          >
            Orders
          </button>
        </div>

        {tab === 'restaurants' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2>Manage Restaurants</h2>
              <button className="add-btn-primary" onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Cancel' : '+ Add Restaurant'}
              </button>
            </div>

            {showForm && (
              <form className="admin-form" onSubmit={handleCreateRestaurant}>
                <h3>New Restaurant</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      required value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Restaurant name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Cuisine</label>
                    <input
                      required value={form.cuisine}
                      onChange={e => setForm({ ...form, cuisine: e.target.value })}
                      placeholder="e.g. Italian, Chinese"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input
                    required value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Short description"
                  />
                </div>
                <div className="form-group" style={{ maxWidth: 200 }}>
                  <label>Rating (1-5)</label>
                  <input
                    type="number" min="1" max="5" step="0.1"
                    value={form.rating}
                    onChange={e => setForm({ ...form, rating: e.target.value })}
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-save">Create Restaurant</button>
                </div>
              </form>
            )}

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Cuisine</th>
                  <th>Branches</th>
                  <th>Menu Items</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allRestaurants.map(r => {
                  const isCustom = customRestaurants.some(c => c.id === r.id)
                  return (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 600 }}>{r.name}</td>
                      <td>{r.cuisine}</td>
                      <td>{r.branches.length}</td>
                      <td>{r.menu.length}</td>
                      <td>
                        {isCustom ? (
                          <>
                            <button
                              className="action-btn"
                              onClick={() => setManaging(managing === r.id ? null : r.id)}
                            >
                              {managing === r.id ? 'Close' : 'Manage'}
                            </button>
                            <button
                              className="action-btn danger"
                              onClick={() => handleDeleteRestaurant(r.id)}
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            Preset
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {managedRestaurant && (
              <>
                <div className="manage-sub-section">
                  <h4>Branches for {managedRestaurant.name}</h4>
                  <form className="inline-form" onSubmit={handleAddBranch}>
                    <div className="form-group">
                      <label>Branch Name</label>
                      <input
                        required value={branchForm.name}
                        onChange={e => setBranchForm({ ...branchForm, name: e.target.value })}
                        placeholder="e.g. Downtown"
                      />
                    </div>
                    <div className="form-group">
                      <label>Address</label>
                      <input
                        required value={branchForm.address}
                        onChange={e => setBranchForm({ ...branchForm, address: e.target.value })}
                        placeholder="123 Main St"
                      />
                    </div>
                    <div className="form-group" style={{ maxWidth: 120 }}>
                      <label>Prep Time (min)</label>
                      <input
                        type="number" min="1"
                        value={branchForm.avgPrepTime}
                        onChange={e => setBranchForm({ ...branchForm, avgPrepTime: e.target.value })}
                      />
                    </div>
                    <button type="submit" className="btn-save" style={{ marginBottom: 0 }}>Add</button>
                  </form>
                  <div className="chip-list">
                    {managedRestaurant.branches.map(b => (
                      <span key={b.id} className="chip">
                        {b.name} - {b.address}
                        <button className="chip-remove" onClick={() => handleRemoveBranch(b.id)}>x</button>
                      </span>
                    ))}
                    {managedRestaurant.branches.length === 0 && (
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        No branches yet
                      </span>
                    )}
                  </div>
                </div>

                <div className="manage-sub-section">
                  <h4>Menu for {managedRestaurant.name}</h4>
                  <form className="inline-form" onSubmit={handleAddMenuItem}>
                    <div className="form-group">
                      <label>Item Name</label>
                      <input
                        required value={menuForm.name}
                        onChange={e => setMenuForm({ ...menuForm, name: e.target.value })}
                        placeholder="Item name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <input
                        required value={menuForm.description}
                        onChange={e => setMenuForm({ ...menuForm, description: e.target.value })}
                        placeholder="Short description"
                      />
                    </div>
                    <div className="form-group" style={{ maxWidth: 100 }}>
                      <label>Price ($)</label>
                      <input
                        type="number" step="0.01" min="0" required
                        value={menuForm.price}
                        onChange={e => setMenuForm({ ...menuForm, price: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ maxWidth: 140 }}>
                      <label>Category</label>
                      <input
                        required value={menuForm.category}
                        onChange={e => setMenuForm({ ...menuForm, category: e.target.value })}
                        placeholder="e.g. Mains"
                      />
                    </div>
                    <button type="submit" className="btn-save" style={{ marginBottom: 0 }}>Add</button>
                  </form>
                  <div className="chip-list">
                    {managedRestaurant.menu.map(m => (
                      <span key={m.id} className="chip">
                        {m.name} - ${m.price.toFixed(2)} ({m.category})
                        <button className="chip-remove" onClick={() => handleRemoveMenuItem(m.id)}>x</button>
                      </span>
                    ))}
                    {managedRestaurant.menu.length === 0 && (
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        No menu items yet
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'orders' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2>All Orders</h2>
            </div>

            {orders.length === 0 ? (
              <p style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                No orders yet. Orders placed by customers will appear here.
              </p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Restaurant</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => {
                    const currentIdx = statusFlow.indexOf(order.status)
                    const nextStatus = currentIdx < statusFlow.length - 1
                      ? statusFlow[currentIdx + 1]
                      : null
                    return (
                      <tr key={order.id}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>
                          {order.id.toUpperCase()}
                        </td>
                        <td>{order.customerName}</td>
                        <td>{order.restaurantName}</td>
                        <td style={{ fontWeight: 600 }}>${order.total.toFixed(2)}</td>
                        <td>
                          <span className={`status-badge ${order.status}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          {nextStatus ? (
                            <button
                              className="action-btn"
                              onClick={() => handleUpdateOrderStatus(order.id, nextStatus)}
                            >
                              Mark {nextStatus}
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              Completed
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
