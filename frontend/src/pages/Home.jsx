import { useState, useEffect } from 'react'
import axios from 'axios'
import { API } from '../context/AuthContext'
import { usePlayer } from '../context/PlayerContext'
import MusicCard from '../components/MusicCard'

function Home() {
  const [musics, setMusics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { playFromQueue, currentMusic, initLikedSongs } = usePlayer()

  useEffect(() => {
    fetchMusics()
    fetchLikedIds()
  }, [])

  const fetchMusics = async () => {
    try {
      const res = await axios.get(`${API}/music/`, { withCredentials: true })
      setMusics(res.data.musics)
    } catch (err) {
      setError('Failed to load music')
    } finally {
      setLoading(false)
    }
  }

  const fetchLikedIds = async () => {
    try {
      const res = await axios.get(`${API}/music/liked`, { withCredentials: true })
      const ids = res.data.musics.map((m) => m._id)
      initLikedSongs(ids)
    } catch (err) {
      console.error(err)
    }
  }

  const handlePlay = (music) => {
    const index = musics.findIndex((m) => m._id === music._id)
    playFromQueue(musics, index)
  }

  const handleDelete = async (musicId) => {
    if (!window.confirm('Kya aap is song ko delete karna chahte ho?')) return

    try {
      await axios.delete(`${API}/music/${musicId}`, { withCredentials: true })
      setMusics((prev) => prev.filter((m) => m._id !== musicId))
    } catch (err) {
      alert('Delete failed')
    }
  }

  if (loading) return <div className="loading">Loading music...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="page">
      <h2>All Music</h2>

      {musics.length === 0 ? (
        <p>No music uploaded yet.</p>
      ) : (
        <div className="music-list">
          {musics.map((music) => (
            <MusicCard
              key={music._id}
              music={music}
              onPlay={handlePlay}
              isPlaying={currentMusic?._id === music._id}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
