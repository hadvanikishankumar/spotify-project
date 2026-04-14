import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { API } from '../context/AuthContext'
import { usePlayer } from '../context/PlayerContext'
import MusicCard from '../components/MusicCard'
import MusicPlayer from '../components/MusicPlayer'

function PlaylistDetail() {
  const { playlistId } = useParams()
  const [playlist, setPlaylist] = useState(null)
  const [loading, setLoading] = useState(true)
  const { playFromQueue, currentMusic } = usePlayer()

  useEffect(() => {
    fetchPlaylist()
  }, [playlistId])

  const fetchPlaylist = async () => {
    try {
      const res = await axios.get(`${API}/playlists/${playlistId}`, { withCredentials: true })
      setPlaylist(res.data.playlist)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePlay = (music) => {
    const songs = playlist?.songs || []
    const index = songs.findIndex(m => m._id === music._id)
    playFromQueue(songs, index)
  }

  const handleRemoveSong = async (musicId) => {
    try {
      await axios.delete(`${API}/playlists/${playlistId}/songs/${musicId}`, { withCredentials: true })
      setPlaylist(prev => ({
        ...prev,
        songs: prev.songs.filter(s => s._id !== musicId)
      }))
    } catch (err) {
      alert('Remove failed')
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (!playlist) return <div className="error">Playlist not found</div>

  return (
    <div className="page">
      <div className="album-header">
        <div className="album-icon-large">📋</div>
        <div>
          <h2>{playlist.name}</h2>
          <p>{playlist.songs?.length || 0} songs</p>
        </div>
      </div>

      {playlist.songs?.length > 0 && (
        <button
          className="btn-primary"
          onClick={() => playFromQueue(playlist.songs, 0)}
          style={{ marginBottom: '1rem' }}
        >
          ▶ Play All
        </button>
      )}

      {playlist.songs?.length === 0 ? (
        <p className="muted">Is playlist mein koi song nahi hai. Home se songs add karo!</p>
      ) : (
        <div className="music-list">
          {playlist.songs?.map(music => (
            <div key={music._id} className="playlist-song-row">
              <MusicCard
                music={music}
                onPlay={handlePlay}
                isPlaying={currentMusic?._id === music._id}
              />
              <button
                className="remove-btn"
                onClick={() => handleRemoveSong(music._id)}
                title="Remove from playlist"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <MusicPlayer />
    </div>
  )
}

export default PlaylistDetail
