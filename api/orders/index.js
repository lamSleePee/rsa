import { getOrders, createOrder } from '../_lib/store.js'

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(getOrders())
  }

  if (req.method === 'POST') {
    const { restaurantId, restaurantName, branchId, branchName, items, total, estimatedMinutes, customerName, customerPhone } = req.body || {}
    if (!restaurantId || !items || !customerName) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    const order = createOrder({
      restaurantId, restaurantName, branchId, branchName,
      items, total, estimatedMinutes, customerName, customerPhone,
    })
    return res.status(201).json(order)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
