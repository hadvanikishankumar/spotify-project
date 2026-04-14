import { useAuth } from '../context/AuthContext'
import { usePlayer } from '../context/PlayerContext'

function MusicCard({ music, onPlay, onDelete }) {
  const { user } = useAuth()
  const { likedSongs, toggleLike, currentMusic, isPlaying, togglePlayPause } = usePlayer()

  const isLiked = likedSongs.includes(music._id)
  const isOwner = user?.role === 'artist' && user?.id === music.artist?._id
  const isCurrentSong = currentMusic?._id === music._id

  return (
    <div className={`music-card ${isCurrentSong ? 'playing' : ''}`}>
      <div className="music-icon">🎵</div>

      <div className="music-info">
        <h4>{music.title}</h4>
        <p>{music.artist?.username || 'Unknown Artist'}</p>
      </div>

      <div className="music-actions">
        <button
          className={`like-btn ${isLiked ? 'liked' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            toggleLike(music._id)
          }}
          title={isLiked ? 'Unlike' : 'Like'}
        >
          {isLiked ? '❤️' : '🤍'}
        </button>

        <button
          className="play-btn"
          onClick={() => {
            if (isCurrentSong) {
              togglePlayPause()
            } else {
              onPlay(music)
            }
          }}
        >
          {isCurrentSong && isPlaying ? '⏸' : '▶'}
        </button>

        {isOwner && onDelete && (
          <button
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(music._id)
            }}
            title="Delete song"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  )
}

export default MusicCard
