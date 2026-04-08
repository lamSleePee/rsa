import { getOrder, updateOrderStatus, verifyAdmin } from '../_lib/store.js'

export default function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    const order = getOrder(id)
    if (!order) return res.status(404).json({ error: 'Not found' })
    return res.status(200).json(order)
  }

  if (req.method === 'PATCH') {
    if (!verifyAdmin(req)) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const { status } = req.body || {}
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }
    const order = updateOrderStatus(id, status)
    if (!order) return res.status(404).json({ error: 'Not found' })
    return res.status(200).json(order)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
