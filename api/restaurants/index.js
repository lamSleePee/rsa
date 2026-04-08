import { getRestaurants, createRestaurant, verifyAdmin } from '../_lib/store.js'

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(getRestaurants())
  }

  if (req.method === 'POST') {
    if (!verifyAdmin(req)) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const { name, cuisine, description, rating, gradient } = req.body || {}
    if (!name || !cuisine) {
      return res.status(400).json({ error: 'Name and cuisine are required' })
    }
    const restaurant = createRestaurant({ name, cuisine, description, rating, gradient })
    return res.status(201).json(restaurant)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
