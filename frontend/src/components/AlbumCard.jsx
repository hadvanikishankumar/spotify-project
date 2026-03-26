import { useNavigate } from 'react-router-dom'

function AlbumCard({ album }) {
  const navigate = useNavigate()

  return (
    // Clicking navigates to /albums/ALBUM_ID
    <div className="album-card" onClick={() => navigate(`/albums/${album._id}`)}>
      <div className="album-icon">💿</div>
      <h4>{album.title}</h4>
      <p>by {album.artist?.username || 'Unknown'}</p>
    </div>
  )
}

export default AlbumCard