import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { isAdmin, login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAdmin) navigate('/admin/dashboard')
  }, [isAdmin, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const result = login(username, password)
    if (result.success) {
      navigate('/admin/dashboard')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="login-card">
        <h1>Admin Login</h1>
        <p className="subtitle">Sign in to manage restaurants and orders</p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">Sign In</button>
        </form>

        <div className="login-hint">
          Demo credentials: <code>admin</code> / <code>root</code>
        </div>
      </div>
    </div>
  )
}
