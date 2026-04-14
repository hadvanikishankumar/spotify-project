import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function AlbumCard({ album, onDelete }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isOwner = user?.role === 'artist' && user?.id === album.artist?._id

  return (
    <div className="album-card" onClick={() => navigate(`/albums/${album._id}`)}>
      <div className="album-icon-wrap">
        <div className="album-icon">💿</div>
        <div className="album-play-overlay">▶</div>
      </div>
      <h4>{album.title}</h4>
      <p>{album.artist?.username || 'Unknown'}</p>
      {isOwner && onDelete && (
        <button className="delete-btn album-delete"
          onClick={(e) => { e.stopPropagation(); onDelete(album._id) }} title="Delete album">
          🗑️
        </button>
      )}
    </div>
  )
}

export default AlbumCard
