import { useState, useEffect } from 'react'
import axios from 'axios'
import { API } from '../context/AuthContext'
import { usePlayer } from '../context/PlayerContext'
import MusicCard from '../components/MusicCard'

function LikedSongs() {
  const [musics, setMusics] = useState([])
  const [loading, setLoading] = useState(true)
  const { playFromQueue, currentMusic, likedSongs } = usePlayer()

  useEffect(() => { fetchLiked() }, [])
  useEffect(() => { if (!loading) fetchLiked() }, [likedSongs.length])

  const fetchLiked = async () => {
    try {
      const res = await axios.get(`${API}/music/liked`, { withCredentials: true })
      setMusics(res.data.musics)
    } catch (err) {} finally { setLoading(false) }
  }

  const handlePlay = (music) => {
    const index = musics.findIndex(m => m._id === music._id)
    playFromQueue(musics, index)
  }

  if (loading) return <div className="loading" />

  return (
    <div className="page" style={{ padding: 0 }}>
      <div className="detail-header" style={{ background: 'linear-gradient(to bottom, #1a1a3a, transparent)' }}>
        <div className="detail-cover" style={{ background: 'linear-gradient(135deg, #450af5, #c4efd9)' }}>❤️</div>
        <div className="detail-info">
          <p className="detail-type">Playlist</p>
          <h2>Liked Songs</h2>
          <p className="detail-meta">{musics.length} songs</p>
          <div className="detail-actions">
            {musics.length > 0 && (
              <button className="play-all-btn" onClick={() => playFromQueue(musics, 0)}>▶</button>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 2.5rem 2rem' }}>
        {musics.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">❤️</span>
            <h3>No liked songs yet</h3>
            <p>Like songs by clicking the heart icon</p>
          </div>
        ) : (
          <div className="music-list">
            {musics.map(music => (
              <MusicCard key={music._id} music={music} onPlay={handlePlay}
                isPlaying={currentMusic?._id === music._id} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default LikedSongs
