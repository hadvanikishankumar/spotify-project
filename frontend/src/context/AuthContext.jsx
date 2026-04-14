import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const API = import.meta.env.VITE_API_URL + '/api'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // ─── GLOBAL 401 INTERCEPTOR ───────────────────────────────────────────────
  // Jab bhi koi API call 401 return kare (cookie expire/invalid),
  // automatically logout karo aur login page pe bhejo
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response, // Success — as it is return karo
      (error) => {
        if (error.response?.status === 401) {
          // Cookie expire ho gayi — clear sab kuch
          setUser(null)
          localStorage.removeItem('user')
          // Login page pe redirect karo (agar already login page pe nahi hain)
          if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
            window.location.href = '/login'
          }
        }
        return Promise.reject(error)
      }
    )

    // Cleanup: component unmount hone pe interceptor remove karo
    return () => {
      axios.interceptors.response.eject(interceptor)
    }
  }, [])

  const login = async (credentials) => {
    const res = await axios.post(`${API}/auth/login`, credentials, {
      withCredentials: true
    })
    setUser(res.data.user)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    return res.data
  }

  const register = async (data) => {
    const res = await axios.post(`${API}/auth/register`, data, {
      withCredentials: true
    })
    setUser(res.data.user)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    return res.data
  }

  const logout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true })
    } catch (err) {
      // Logout fail hone pe bhi local clear karo
    }
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
