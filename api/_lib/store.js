const seedRestaurants = [
  {
    id: 'r1', name: 'The Burger Joint', cuisine: 'American',
    description: 'Handcrafted burgers with premium ingredients and secret house sauces',
    rating: 4.5, gradient: 'linear-gradient(135deg, #b91c1c, #7f1d1d)',
    branches: [
      { id: 'b1', name: 'Downtown', address: '123 Main Street', queueCount: 3, avgPrepTime: 8 },
      { id: 'b2', name: 'Midtown', address: '456 Oak Avenue', queueCount: 1, avgPrepTime: 10 },
      { id: 'b3', name: 'Brooklyn', address: '789 Park Lane', queueCount: 5, avgPrepTime: 7 },
    ],
    menu: [
      { id: 'm1', name: 'Classic Smash Burger', description: 'Double smashed patties, American cheese, pickles, special sauce', price: 9.99, category: 'Burgers', available: true },
      { id: 'm2', name: 'Bacon Deluxe', description: 'Crispy bacon, cheddar, caramelized onions, BBQ sauce', price: 12.99, category: 'Burgers', available: true },
      { id: 'm3', name: 'Crispy Fries', description: 'Golden hand-cut fries with sea salt', price: 4.99, category: 'Sides', available: true },
      { id: 'm4', name: 'Chocolate Shake', description: 'Thick and creamy chocolate milkshake', price: 6.99, category: 'Drinks', available: true },
    ],
  },
  {
    id: 'r2', name: 'Sushi Master', cuisine: 'Japanese',
    description: 'Authentic Japanese sushi and rolls crafted with the freshest fish',
    rating: 4.8, gradient: 'linear-gradient(135deg, #dc2626, #991b1b)',
    branches: [
      { id: 'b4', name: 'Upper East', address: '321 5th Avenue', queueCount: 2, avgPrepTime: 12 },
      { id: 'b5', name: 'Williamsburg', address: '654 Bedford Ave', queueCount: 4, avgPrepTime: 15 },
    ],
    menu: [
      { id: 'm10', name: 'California Roll', description: 'Crab, avocado, cucumber with sesame seeds', price: 10.99, category: 'Rolls', available: true },
      { id: 'm11', name: 'Spicy Tuna Roll', description: 'Fresh tuna, spicy mayo, crispy tempura flakes', price: 12.99, category: 'Rolls', available: true },
      { id: 'm16', name: 'Miso Soup', description: 'Traditional miso with tofu and wakame', price: 3.99, category: 'Sides', available: true },
    ],
  },
  {
    id: 'r3', name: 'Pizza Paradise', cuisine: 'Italian',
    description: 'Wood-fired Neapolitan pizzas with imported Italian ingredients',
    rating: 4.6, gradient: 'linear-gradient(135deg, #9f1239, #881337)',
    branches: [
      { id: 'b6', name: 'SoHo', address: '100 Prince Street', queueCount: 6, avgPrepTime: 15 },
      { id: 'b7', name: 'Chelsea', address: '200 W 23rd Street', queueCount: 2, avgPrepTime: 12 },
    ],
    menu: [
      { id: 'm19', name: 'Margherita', description: 'San Marzano tomatoes, fresh mozzarella, basil', price: 13.99, category: 'Pizzas', available: true },
      { id: 'm20', name: 'Pepperoni', description: 'Classic pepperoni, mozzarella, red sauce', price: 15.99, category: 'Pizzas', available: true },
      { id: 'm24', name: 'Garlic Bread', description: 'Toasted ciabatta with garlic butter and herbs', price: 5.99, category: 'Sides', available: true },
    ],
  },
]

const restaurants = [...seedRestaurants]
const orders = []

const ADMIN_TOKEN = 'foodq-demo-admin-token'

export function verifyAdmin(req) {
  const auth = req.headers.authorization
  return auth === `Bearer ${ADMIN_TOKEN}`
}

export function getRestaurants() {
  return restaurants
}

export function getRestaurant(id) {
  return restaurants.find(r => r.id === id) || null
}

export function createRestaurant(data) {
  const r = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 6),
    ...data,
    branches: data.branches || [],
    menu: data.menu || [],
  }
  restaurants.push(r)
  return r
}

export function deleteRestaurant(id) {
  const idx = restaurants.findIndex(r => r.id === id)
  if (idx === -1) return false
  restaurants.splice(idx, 1)
  return true
}

export function addMenuItem(restaurantId, item) {
  const r = restaurants.find(r => r.id === restaurantId)
  if (!r) return null
  const newItem = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 6),
    ...item,
    available: true,
  }
  r.menu.push(newItem)
  return newItem
}

export function removeMenuItem(restaurantId, itemId) {
  const r = restaurants.find(r => r.id === restaurantId)
  if (!r) return false
  r.menu = r.menu.filter(m => m.id !== itemId)
  return true
}

export function getOrders() {
  return orders
}

export function getOrder(id) {
  return orders.find(o => o.id === id) || null
}

export function createOrder(data) {
  const order = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 6),
    ...data,
    status: 'pending',
    paymentStatus: 'completed',
    createdAt: new Date().toISOString(),
  }
  orders.unshift(order)
  return order
}

export function updateOrderStatus(id, status) {
  const order = orders.find(o => o.id === id)
  if (!order) return null
  order.status = status
  return order
}
