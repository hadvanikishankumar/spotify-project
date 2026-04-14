import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  if (!user) return null

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">🎵 Rhythmix</Link>
      </div>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/albums">Albums</Link>
        <Link to="/liked">❤️ Liked</Link>
        <Link to="/playlists">📋 Playlists</Link>

        {user.role === 'artist' && (
          <>
            <Link to="/upload">Upload</Link>
            <Link to="/create-album">Create Album</Link>
          </>
        )}
      </div>

      {/* Search bar */}
      <form className="navbar-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search songs, albums..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-btn">🔍</button>
      </form>

      <div className="navbar-user">
        <Link to="/profile" className="profile-link">👤 {user.username}</Link>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>
    </nav>
  )
}

export default Navbar