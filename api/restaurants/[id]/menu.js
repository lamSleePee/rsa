import { getRestaurant, addMenuItem, removeMenuItem, verifyAdmin } from '../../_lib/store.js'

export default function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    const restaurant = getRestaurant(id)
    if (!restaurant) return res.status(404).json({ error: 'Not found' })
    return res.status(200).json(restaurant.menu)
  }

  if (req.method === 'POST') {
    if (!verifyAdmin(req)) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const { name, description, price, category } = req.body || {}
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' })
    }
    const item = addMenuItem(id, { name, description, price, category })
    if (!item) return res.status(404).json({ error: 'Restaurant not found' })
    return res.status(201).json(item)
  }

  if (req.method === 'DELETE') {
    if (!verifyAdmin(req)) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const { itemId } = req.body || {}
    removeMenuItem(id, itemId)
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
