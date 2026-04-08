import { getRestaurant, deleteRestaurant, verifyAdmin } from '../../_lib/store.js'

export default function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    const restaurant = getRestaurant(id)
    if (!restaurant) return res.status(404).json({ error: 'Not found' })
    return res.status(200).json(restaurant)
  }

  if (req.method === 'DELETE') {
    if (!verifyAdmin(req)) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const deleted = deleteRestaurant(id)
    if (!deleted) return res.status(404).json({ error: 'Not found' })
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
