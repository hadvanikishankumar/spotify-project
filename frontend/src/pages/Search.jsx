import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API } from '../context/AuthContext'
import { usePlayer } from '../context/PlayerContext'
import MusicCard from '../components/MusicCard'
import AlbumCard from '../components/AlbumCard'
import MusicPlayer from '../components/MusicPlayer'

function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [musics, setMusics] = useState([])
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(false)
  const { playFromQueue, currentMusic } = usePlayer()

  useEffect(() => {
    if (!query) return
    const search = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${API}/music/search?q=${encodeURIComponent(query)}`, {
          withCredentials: true
        })
        setMusics(res.data.musics)
        setAlbums(res.data.albums)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    search()
  }, [query])

  const handlePlay = (music) => {
    const index = musics.findIndex(m => m._id === music._id)
    playFromQueue(musics, index)
  }

  return (
    <div className="page">
      <h2>🔍 Search: "{query}"</h2>

      {loading && <div className="loading">Searching...</div>}

      {!loading && (
        <>
          {/* Songs */}
          <h3>Songs {musics.length > 0 && `(${musics.length})`}</h3>
          {musics.length === 0 ? (
            <p className="muted">No songs found</p>
          ) : (
            <div className="music-list">
              {musics.map(music => (
                <MusicCard
                  key={music._id}
                  music={music}
                  onPlay={handlePlay}
                  isPlaying={currentMusic?._id === music._id}
                />
              ))}
            </div>
          )}

          {/* Albums */}
          <h3 style={{ marginTop: '2rem' }}>Albums {albums.length > 0 && `(${albums.length})`}</h3>
          {albums.length === 0 ? (
            <p className="muted">No albums found</p>
          ) : (
            <div className="albums-grid">
              {albums.map(album => (
                <AlbumCard key={album._id} album={album} />
              ))}
            </div>
          )}
        </>
      )}

      <MusicPlayer />
    </div>
  )
}

export default Search
