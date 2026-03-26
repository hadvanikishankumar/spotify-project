import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { API } from '../context/AuthContext'
import MusicCard from '../components/MusicCard'
import MusicPlayer from '../components/MusicPlayer'

function AlbumDetail() {
  // useParams reads :albumId from the URL  e.g. /albums/abc123 → albumId = "abc123"
  const { albumId } = useParams()
  const [album, setAlbum] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentMusic, setCurrentMusic] = useState(null)

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        // Backend populates musics array with full music objects
        const res = await axios.get(`${API}/music/albums/${albumId}`, {
          withCredentials: true
        })
        setAlbum(res.data.album)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAlbum()
  }, [albumId])  // Re-run if albumId in URL changes

  if (loading) return <div className="loading">Loading...</div>
  if (!album) return <div className="error">Album not found</div>

  return (
    <div className="page">
      <div className="album-header">
        <div className="album-icon-large">💿</div>
        <div>
          <h2>{album.title}</h2>
          <p>by {album.artist?.username}</p>
          <p>{album.musics?.length || 0} songs</p>
        </div>
      </div>

      <h3>Songs</h3>
      {album.musics?.length === 0 ? (
        <p>No songs in this album yet.</p>
      ) : (
        <div className="music-list">
          {album.musics?.map(music => (
            <MusicCard
              key={music._id}
              music={music}
              onPlay={(m) => setCurrentMusic(m)}
              isPlaying={currentMusic?._id === music._id}
            />
          ))}
        </div>
      )}

      <MusicPlayer
        currentMusic={currentMusic}
        onClose={() => setCurrentMusic(null)}
      />
    </div>
  )
}

export default AlbumDetail