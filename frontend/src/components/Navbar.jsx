import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()   // Get user and logout from context
  const navigate = useNavigate()        // For programmatic navigation

  const handleLogout = async () => {
    await logout()          // Clear user state + cookie
    navigate('/login')      // Send to login page
  }

  // If user is not logged in, don't show navbar at all
  if (!user) return null

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">🎵 Rhythmix</Link>
      </div>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/albums">Albums</Link>

        {/* These links ONLY show if the user is an artist */}
        {user.role === 'artist' && (
          <>
            <Link to="/upload">Upload Music</Link>
            <Link to="/create-album">Create Album</Link>
          </>
        )}
      </div>

      <div className="navbar-user">
        {/* Show username and role badge */}
        <span>👤 {user.username} <em>({user.role})</em></span>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>
    </nav>
  )
}

export default Navbar