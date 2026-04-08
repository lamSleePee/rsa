const ADMIN_USER = 'admin'
const ADMIN_PASS = 'root'
const ADMIN_TOKEN = 'encaveman-demo-admin-token'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { username, password } = req.body || {}

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return res.status(200).json({ success: true, token: ADMIN_TOKEN })
  }

  return res.status(401).json({ success: false, error: 'Invalid credentials' })
}
