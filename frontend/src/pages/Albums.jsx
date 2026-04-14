import { useState, useEffect } from 'react'
import axios from 'axios'
import { API } from '../context/AuthContext'
import AlbumCard from '../components/AlbumCard'

function Albums() {
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await axios.get(`${API}/music/albums`, { withCredentials: true })
        setAlbums(res.data.albums)
      } catch (err) {
        setError('Failed to load albums')
      } finally {
        setLoading(false)
      }
    }
    fetchAlbums()
  }, [])

  const handleDelete = async (albumId) => {
    if (!window.confirm('Kya aap is album ko delete karna chahte ho?')) return
    try {
      await axios.delete(`${API}/music/album/${albumId}`, { withCredentials: true })
      setAlbums(prev => prev.filter(a => a._id !== albumId))
    } catch (err) {
      alert('Delete failed')
    }
  }

  if (loading) return <div className="loading">Loading albums...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="page">
      <h2>All Albums</h2>
      {albums.length === 0 ? (
        <p>No albums yet.</p>
      ) : (
        <div className="albums-grid">
          {albums.map(album => (
            <AlbumCard key={album._id} album={album} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Albums