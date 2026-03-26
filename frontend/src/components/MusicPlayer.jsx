import { useEffect, useRef } from 'react'

// currentMusic = the music object to play, onClose = close player
function MusicPlayer({ currentMusic, onClose }) {
  // useRef gives us direct access to the DOM <audio> element
  const audioRef = useRef(null)

  // Every time currentMusic changes (new song clicked), auto-play it
  useEffect(() => {
    if (currentMusic && audioRef.current) {
      audioRef.current.load()   // Load the new src URL
      audioRef.current.play()   // Auto play
    }
  }, [currentMusic])  // Dependency: re-run when currentMusic changes

  // Hide entire player if nothing is playing
  if (!currentMusic) return null

  return (
    <div className="music-player">
      <div className="player-info">
        <span>🎵 Now Playing: <strong>{currentMusic.title}</strong></span>
        <span>{currentMusic.artist?.username || 'Unknown'}</span>
      </div>

      {/* HTML5 audio tag — browser handles play/pause/seek controls */}
      <audio ref={audioRef} controls className="audio-element">
        {/* currentMusic.uri = ImageKit URL stored in database */}
        <source src={currentMusic.uri} />
        Your browser does not support audio.
      </audio>

      <button onClick={onClose} className="close-player">✕</button>
    </div>
  )
}

export default MusicPlayer