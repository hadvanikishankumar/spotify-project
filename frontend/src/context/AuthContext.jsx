import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

// 1. Create an empty context object
const AuthContext = createContext()

// 2. Export API base URL so all files can import it
export const API = import.meta.env.VITE_API_URL + '/api'

// 3. AuthProvider wraps the whole app — any child can read auth state
export function AuthProvider({ children }) {
  
  // user = null means "not logged in"
  // user = { id, username, email, role } means "logged in"
  const [user, setUser] = useState(null)
  
  // loading = true while we check localStorage on first load
  const [loading, setLoading] = useState(true)

  // On app start: check if user was already logged in (page refresh)
  useEffect(() => {
    const storedUser = localStorage.getItem('user')  // Read from browser storage
    if (storedUser) {
      setUser(JSON.parse(storedUser))   // Parse JSON string back to object
    }
    setLoading(false)   // Done checking, set loading false
  }, [])  // [] = run only once when component mounts

  // login() - called from Login page
  const login = async (credentials) => {
    const res = await axios.post(`${API}/auth/login`, credentials, {
      withCredentials: true   // CRITICAL: tells axios to send/receive cookies
    })
    setUser(res.data.user)                                  // Update state
    localStorage.setItem('user', JSON.stringify(res.data.user))  // Persist to storage
    return res.data
  }

  // register() - called from Register page
  const register = async (data) => {
    const res = await axios.post(`${API}/auth/register`, data, {
      withCredentials: true
    })
    setUser(res.data.user)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    return res.data
  }

  // logout() - called from Navbar
  const logout = async () => {
    await axios.post(`${API}/auth/logout`, {}, { withCredentials: true })
    setUser(null)                        // Clear state
    localStorage.removeItem('user')      // Clear storage
  }

  // Provide user, login, register, logout, loading to ALL children
  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook — any component calls useAuth() to get auth data
export function useAuth() {
  return useContext(AuthContext)
}