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
        // Calls GET /api/music/albums
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
            <AlbumCard key={album._id} album={album} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Albums