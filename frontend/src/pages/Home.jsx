import { useState, useEffect } from 'react'
import axios from 'axios'
import { API } from '../context/AuthContext'
import MusicCard from '../components/MusicCard'
import MusicPlayer from '../components/MusicPlayer'

function Home() {
  const [musics, setMusics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentMusic, setCurrentMusic] = useState(null)  // Track what's playing

  // useEffect with [] = run once when page loads
  useEffect(() => {
    fetchMusics()
  }, [])

  const fetchMusics = async () => {
    try {
      // withCredentials: true = send JWT cookie with request
      // Backend's authUser middleware reads this cookie
      const res = await axios.get(`${API}/music/`, { withCredentials: true })
      setMusics(res.data.musics)
    } catch (err) {
      setError('Failed to load music')
    } finally {
      setLoading(false)
    }
  }

  const handlePlay = (music) => {
    // If clicking same song that's playing → stop it
    // Otherwise → play the new song
    if (currentMusic?._id === music._id) {
      setCurrentMusic(null)
    } else {
      setCurrentMusic(music)
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
          {/* Map over every song and render a MusicCard */}
          {musics.map(music => (
            <MusicCard
              key={music._id}         // React needs unique key for lists
              music={music}
              onPlay={handlePlay}
              isPlaying={currentMusic?._id === music._id}  // True for currently playing
            />
          ))}
        </div>
      )}

      {/* Fixed player at bottom of screen */}
      <MusicPlayer
        currentMusic={currentMusic}
        onClose={() => setCurrentMusic(null)}
      />
    </div>
  )
}

export default Home