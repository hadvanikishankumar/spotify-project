import { useState, useEffect } from 'react'
import axios from 'axios'
import { API } from '../context/AuthContext'

function CreateAlbum() {
  const [title, setTitle] = useState('')
  const [allMusics, setAllMusics] = useState([])        // All songs from DB
  const [selectedMusics, setSelectedMusics] = useState([])  // IDs artist picks
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // Load all available songs when page opens
  useEffect(() => {
    const fetchMusics = async () => {
      try {
        const res = await axios.get(`${API}/music/`, { withCredentials: true })
        setAllMusics(res.data.musics)
      } catch (err) {
        console.error(err)
      }
    }
    fetchMusics()
  }, [])

  // Toggle a music ID in/out of selectedMusics array
  const handleMusicToggle = (musicId) => {
    setSelectedMusics(prev =>
      prev.includes(musicId)
        ? prev.filter(id => id !== musicId)   // Remove if already in array
        : [...prev, musicId]                   // Add if not in array
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Backend createAlbum expects { title, musics: [id1, id2, ...] }
      await axios.post(`${API}/music/album`, {
        title,
        musics: selectedMusics
      }, {
        withCredentials: true
      })
      setSuccess('💿 Album created successfully!')
      setTitle('')
      setSelectedMusics([])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create album')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="form-container">
        <h2>Create Album</h2>

        {success && <p className="success-msg">{success}</p>}
        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Album Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter album title"
              required
            />
          </div>

          <div className="form-group">
            <label>Select Songs ({selectedMusics.length} selected)</label>
            <div className="music-selector">
              {allMusics.map(music => (
                // Clicking toggles this song in/out of album
                <div
                  key={music._id}
                  className={`music-option ${selectedMusics.includes(music._id) ? 'selected' : ''}`}
                  onClick={() => handleMusicToggle(music._id)}
                >
                  <span>{selectedMusics.includes(music._id) ? '✅' : '⬜'}</span>
                  <span>{music.title}</span>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Album'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateAlbum