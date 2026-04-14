import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'user' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(formData)
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
        <div className="auth-logo">🎵</div>
        <h2>Create account</h2>
        <p className="auth-subtitle">Join Rhythmix today</p>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" name="username" value={formData.username}
              onChange={handleChange} placeholder="Choose a username" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email}
              onChange={handleChange} placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password}
              onChange={handleChange} placeholder="Create a password" required />
          </div>
          <div className="form-group">
            <label>I want to</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="user">Listen to music</option>
              <option value="artist">Upload & share music (Artist)</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p>Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  )
}

export default Register
