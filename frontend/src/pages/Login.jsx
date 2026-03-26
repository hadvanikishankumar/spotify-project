import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  // Controlled inputs — React manages input values via state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')      // Error message to show user
  const [loading, setLoading] = useState(false) // Disable button while submitting

  const { login } = useAuth()
  const navigate = useNavigate()

  // One handler for ALL inputs — uses input's name attribute as key
  const handleChange = (e) => {
    setFormData({
      ...formData,                    // Keep existing values
      [e.target.name]: e.target.value // Update only changed field
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()    // IMPORTANT: prevents page reload on form submit
    setError('')
    setLoading(true)

    try {
      await login(formData)   // Calls backend POST /api/auth/login
      navigate('/')           // On success, go to home
    } catch (err) {
      // err.response.data.message = backend error message
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)   // Always re-enable button
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>

        {/* Only render error paragraph if there IS an error */}
        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"           // Must match formData key
              value={formData.email} // Controlled input
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          {/* disabled while loading so user can't double-submit */}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  )
}

export default Login