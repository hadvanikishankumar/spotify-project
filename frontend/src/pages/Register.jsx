import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'    // Default role — user can change to "artist"
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(formData)   // Calls backend POST /api/auth/register
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Register</h2>
        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" name="username" value={formData.username}
              onChange={handleChange} placeholder="Enter username" required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email}
              onChange={handleChange} placeholder="Enter email" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password}
              onChange={handleChange} placeholder="Enter password" required />
          </div>

          {/* Dropdown to choose role — matches backend enum ["user", "artist"] */}
          <div className="form-group">
            <label>Register as</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="user">User (Listener)</option>
              <option value="artist">Artist (Can upload music)</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  )
}

export default Register