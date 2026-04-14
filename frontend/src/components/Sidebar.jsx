import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
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

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <span className="logo-icon">🎵</span>
        <span className="logo-text">Rhythmix</span>
      </div>

      {/* Search */}
      <form className="sidebar-search" onSubmit={handleSearch}>
        <span className="search-icon-inner">🔍</span>
        <input
          type="text"
          placeholder="Search songs, albums..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="sidebar-search-input"
        />
      </form>

      {/* Main nav */}
      <nav className="sidebar-nav">
        <p className="nav-section-label">Menu</p>

        <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">🏠</span>
          <span>Home</span>
        </NavLink>

        <NavLink to="/albums" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">💿</span>
          <span>Albums</span>
        </NavLink>

        <NavLink to="/liked" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">❤️</span>
          <span>Liked Songs</span>
        </NavLink>

        <NavLink to="/playlists" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📋</span>
          <span>Playlists</span>
        </NavLink>

        {/* Artist-only section */}
        {user?.role === 'artist' && (
          <>
            <p className="nav-section-label" style={{ marginTop: '1.5rem' }}>Artist</p>

            <NavLink to="/upload" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">⬆️</span>
              <span>Upload Music</span>
            </NavLink>

            <NavLink to="/create-album" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">➕</span>
              <span>Create Album</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* Bottom: profile + logout */}
      <div className="sidebar-footer">
        <NavLink to="/profile" className={({ isActive }) => `sidebar-profile ${isActive ? 'active' : ''}`}>
          <div className="sidebar-avatar">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-username">{user?.username}</span>
            <span className={`sidebar-role ${user?.role}`}>{user?.role}</span>
          </div>
        </NavLink>

        <button onClick={handleLogout} className="sidebar-logout" title="Logout">
          ⏻
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
