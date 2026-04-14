import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API } from '../context/AuthContext'

function Playlists() {
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`${API}/playlists`, { withCredentials: true })
      .then(res => setPlaylists(res.data.playlists))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    try {
      const res = await axios.post(`${API}/playlists`, { name: newName.trim() }, { withCredentials: true })
      setPlaylists(prev => [res.data.playlist, ...prev])
      setNewName('')
    } catch (err) { alert('Failed to create playlist') }
    finally { setCreating(false) }
  }

  const handleDelete = async (playlistId) => {
    if (!window.confirm('Playlist delete karna chahte ho?')) return
    try {
      await axios.delete(`${API}/playlists/${playlistId}`, { withCredentials: true })
      setPlaylists(prev => prev.filter(p => p._id !== playlistId))
    } catch (err) { alert('Delete failed') }
  }

  if (loading) return <div className="loading" />

  return (
    <div className="page">
      <h2>Your Playlists</h2>

      <form className="create-playlist-form" onSubmit={handleCreate} style={{ marginTop: '1.5rem' }}>
        <input type="text" placeholder="Give your playlist a name..."
          value={newName} onChange={(e) => setNewName(e.target.value)}
          className="playlist-name-input" />
        <button type="submit" className="btn-inline" disabled={creating}>
          {creating ? 'Creating...' : '+ Create'}
        </button>
      </form>

      {playlists.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📋</span>
          <h3>No playlists yet</h3>
          <p>Create one above to get started</p>
        </div>
      ) : (
        <div className="playlists-grid">
          {playlists.map(playlist => (
            <div key={playlist._id} className="playlist-card" onClick={() => navigate(`/playlists/${playlist._id}`)}>
              <div className="playlist-icon">📋</div>
              <div className="playlist-info">
                <h4>{playlist.name}</h4>
                <p>{playlist.songs?.length || 0} songs</p>
              </div>
              <button className="delete-btn"
                onClick={(e) => { e.stopPropagation(); handleDelete(playlist._id) }}>🗑️</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Playlists
