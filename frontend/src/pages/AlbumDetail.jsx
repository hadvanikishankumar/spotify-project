import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { API, useAuth } from '../context/AuthContext'
import { usePlayer } from '../context/PlayerContext'
import MusicCard from '../components/MusicCard'

function AlbumDetail() {
  const { albumId } = useParams()
  const { user } = useAuth()
  const [album, setAlbum] = useState(null)
  const [loading, setLoading] = useState(true)
  const [allSongs, setAllSongs] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [addLoading, setAddLoading] = useState(null)
  const { playFromQueue, currentMusic } = usePlayer()

  useEffect(() => { fetchAlbum() }, [albumId])

  const fetchAlbum = async () => {
    try {
      const res = await axios.get(`${API}/music/albums/${albumId}`, { withCredentials: true })
      setAlbum(res.data.album)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const openAddModal = async () => {
    setShowAddModal(true)
    if (allSongs.length === 0) {
      try {
        const res = await axios.get(`${API}/music/`, { withCredentials: true })
        setAllSongs(res.data.musics)
      } catch (err) { console.error(err) }
    }
  }

  const handlePlay = (music) => {
    const songs = album?.musics || []
    playFromQueue(songs, songs.findIndex(m => m._id === music._id))
  }

  const handleRemoveFromAlbum = async (musicId) => {
    if (!window.confirm('Is song ko album se hatana chahte ho?')) return
    try {
      await axios.delete(`${API}/music/album/${albumId}/songs/${musicId}`, { withCredentials: true })
      setAlbum(prev => ({ ...prev, musics: prev.musics.filter(m => m._id !== musicId) }))
    } catch (err) {
      alert(err.response?.data?.message || 'Remove failed')
    }
  }

  const handleAddToAlbum = async (musicId) => {
    setAddLoading(musicId)
    try {
      await axios.post(`${API}/music/album/${albumId}/songs/${musicId}`, {}, { withCredentials: true })
      await fetchAlbum()
    } catch (err) {
      alert(err.response?.data?.message || 'Add failed')
    } finally {
      setAddLoading(null)
    }
  }

  const handleDeleteSong = async (musicId) => {
    if (!window.confirm('Song permanently delete karna chahte ho?')) return
    try {
      await axios.delete(`${API}/music/${musicId}`, { withCredentials: true })
      setAlbum(prev => ({ ...prev, musics: prev.musics.filter(m => m._id !== musicId) }))
    } catch (err) { alert('Delete failed') }
  }

  if (loading) return <div className="loading" />
  if (!album) return <div className="error">Album not found</div>

  const isOwner = user?.role === 'artist' && user?.id === album.artist?._id
  const songsNotInAlbum = allSongs.filter(s => !album.musics?.some(m => m._id === s._id))

  return (
    <div className="page" style={{ padding: 0 }}>
      <div className="detail-header">
        <div className="detail-cover">💿</div>
        <div className="detail-info">
          <p className="detail-type">Album</p>
          <h2>{album.title}</h2>
          <p className="detail-meta">by {album.artist?.username}</p>
          <p className="detail-meta">{album.musics?.length || 0} songs</p>
          <div className="detail-actions">
            {album.musics?.length > 0 && (
              <button className="play-all-btn" onClick={() => playFromQueue(album.musics, 0)}>▶</button>
            )}
            {isOwner && (
              <button className="btn-ghost" onClick={openAddModal}>+ Add Songs</button>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 0rem 10rem' }}>
        {album.musics?.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🎵</span>
            <h3>No songs in this album</h3>
            {isOwner && <p>Click "+ Add Songs" above to add songs</p>}
          </div>
        ) : (
          <div className="music-list">
            {album.musics?.map(music => (
              <div key={music._id} className="album-song-row">
                <MusicCard
                  music={music}
                  onPlay={handlePlay}
                  isPlaying={currentMusic?._id === music._id}
                  onDelete={isOwner ? handleDeleteSong : undefined}
                />
                {isOwner && (
                  <button
                    className="remove-from-album-btn"
                    onClick={() => handleRemoveFromAlbum(music._id)}
                    title="Remove from album"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Songs to "{album.title}"</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              {songsNotInAlbum.length === 0 ? (
                <p className="muted" style={{ textAlign: 'center', padding: '2rem' }}>
                  {allSongs.length === 0 ? 'Loading songs...' : 'Saare songs already is album mein hain!'}
                </p>
              ) : (
                <div className="modal-song-list">
                  {songsNotInAlbum.map(song => (
                    <div key={song._id} className="modal-song-item">
                      <div className="modal-song-icon">🎵</div>
                      <div className="modal-song-info">
                        <p>{song.title}</p>
                        <small>{song.artist?.username || 'Unknown'}</small>
                      </div>
                      <button
                        className="btn-inline"
                        style={{ padding: '0.35rem 0.9rem', fontSize: '0.82rem' }}
                        onClick={() => handleAddToAlbum(song._id)}
                        disabled={addLoading === song._id}
                      >
                        {addLoading === song._id ? '...' : '+ Add'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AlbumDetail
