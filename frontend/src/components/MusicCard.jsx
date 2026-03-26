// Receives: music object, onPlay callback, isPlaying boolean
function MusicCard({ music, onPlay, isPlaying }) {
  return (
    // Add "playing" class when this song is currently selected
    <div className={`music-card ${isPlaying ? 'playing' : ''}`}>
      <div className="music-icon">🎵</div>

      <div className="music-info">
        <h4>{music.title}</h4>
        {/* artist is populated from backend with .populate("artist", "username email") */}
        <p>{music.artist?.username || 'Unknown Artist'}</p>
      </div>

      {/* Clicking calls parent's onPlay handler with this music object */}
      <button className="play-btn" onClick={() => onPlay(music)}>
        {isPlaying ? '⏸' : '▶'}
      </button>
    </div>
  )
}

export default MusicCard