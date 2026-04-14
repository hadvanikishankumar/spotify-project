import { useEffect, useRef, useState } from 'react'
import { usePlayer } from '../context/PlayerContext'

function MusicPlayer() {
  const {
    currentMusic,
    queue,
    currentIndex,
    isPlaying,
    isShuffled,
    repeatMode,
    playNext,
    playPrev,
    toggleShuffle,
    toggleRepeat,
    closePlayer,
    toggleLike,
    likedSongs,
    togglePlayPause,
    registerAudio,
    setIsPlaying,
  } = usePlayer()

  const audioRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showQueue, setShowQueue] = useState(false)

  useEffect(() => {
    if (currentMusic && audioRef.current) {
      audioRef.current.load()
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error(err))
    } else {
      setProgress(0)
      setDuration(0)
    }
  }, [currentMusic, setIsPlaying])

  if (!currentMusic) return null

  const isLiked = likedSongs.includes(currentMusic._id)

  const handleTimeUpdate = () => {
    if (!audioRef.current) return
    setProgress(audioRef.current.currentTime)
    setDuration(audioRef.current.duration || 0)
  }

  const handleSeek = (e) => {
    if (!audioRef.current) return
    const value = Number(e.target.value)
    audioRef.current.currentTime = value
    setProgress(value)
  }

  const handleEnded = () => {
    playNext()
  }

  const formatTime = (sec) => {
    if (isNaN(sec)) return '0:00'
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, '0')
    return `${m}:${s}`
  }

  const repeatStyle = repeatMode === 'none' ? { opacity: 0.4 } : {}
  const repeatIcon = repeatMode === 'one' ? '🔂' : '🔁'

  return (
    <>
      {showQueue && (
        <div className="queue-sidebar">
          <div className="queue-header">
            <h4>🎵 Queue ({queue.length} songs)</h4>
            <button onClick={() => setShowQueue(false)} className="close-queue">
              ✕
            </button>
          </div>
          <div className="queue-list">
            {queue.map((song, i) => (
              <div key={song._id} className={`queue-item ${i === currentIndex ? 'queue-active' : ''}`}>
                <span className="queue-icon">{i === currentIndex ? '▶' : '🎵'}</span>
                <div className="queue-info">
                  <p>{song.title}</p>
                  <small>{song.artist?.username || 'Unknown'}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="music-player">
        <div className="player-info">
          <div className="player-thumb">🎵</div>
          <div>
            <strong>{currentMusic.title}</strong>
            <p>{currentMusic.artist?.username || 'Unknown'}</p>
          </div>
          <button
            className={`like-btn-player ${isLiked ? 'liked' : ''}`}
            onClick={() => toggleLike(currentMusic._id)}
          >
            {isLiked ? '❤️' : '🤍'}
          </button>
        </div>

        <div className="player-center">
          <div className="player-controls">
            <button className={`ctrl-btn ${isShuffled ? 'active' : ''}`} onClick={toggleShuffle}>
              🔀
            </button>
            <button className="ctrl-btn" onClick={playPrev} disabled={currentIndex === 0}>
              ⏮
            </button>
            <button className="play-pause-btn" onClick={togglePlayPause}>
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button className="ctrl-btn" onClick={playNext}>
              ⏭
            </button>
            <button className="ctrl-btn" style={repeatStyle} onClick={toggleRepeat}>
              {repeatIcon}
            </button>
          </div>

          <div className="player-progress">
            <span className="time">{formatTime(progress)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={progress}
              onChange={handleSeek}
              className="progress-bar"
            />
            <span className="time">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="player-right">
          <button
            className={`ctrl-btn ${showQueue ? 'active' : ''}`}
            onClick={() => setShowQueue(!showQueue)}
          >
            📋
          </button>
          <button onClick={closePlayer} className="close-player">
            ✕
          </button>
        </div>

        <audio
          ref={(node) => {
            audioRef.current = node
            registerAudio(node)
          }}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={currentMusic.uri} />
        </audio>
      </div>
    </>
  )
}

export default MusicPlayer
