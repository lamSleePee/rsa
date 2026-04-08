import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

const ADMIN_USER = 'admin'
const ADMIN_PASS = 'root'
const TOKEN_KEY = 'foodq_admin_token'
const ADMIN_TOKEN = 'foodq-demo-admin-token'

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem(TOKEN_KEY) === ADMIN_TOKEN
  })

  const login = (username, password) => {
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      localStorage.setItem(TOKEN_KEY, ADMIN_TOKEN)
      setIsAdmin(true)
      return { success: true }
    }
    return { success: false, error: 'Invalid username or password' }
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setIsAdmin(false)
  }

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
