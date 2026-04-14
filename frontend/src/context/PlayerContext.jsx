import { createContext, useContext, useState, useRef, useCallback } from 'react'
import axios from 'axios'
import { API } from './AuthContext'

const PlayerContext = createContext()

export function PlayerProvider({ children }) {
  const [queue, setQueue] = useState([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState('none')
  const [shuffledQueue, setShuffledQueue] = useState([])
  const [likedSongs, setLikedSongs] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)

  const audioRef = useRef(null)

  const currentMusic =
    currentIndex >= 0 ? (isShuffled ? shuffledQueue[currentIndex] : queue[currentIndex]) : null

  const registerAudio = useCallback((node) => {
    audioRef.current = node
  }, [])

  const playFromQueue = useCallback(
    (songs, index) => {
      setQueue(songs)
      setCurrentIndex(index)
      setIsPlaying(true)

      if (isShuffled) {
        const shuffled = [...songs].sort(() => Math.random() - 0.5)
        setShuffledQueue(shuffled)
      }

      const song = songs[index]
      if (song) {
        axios.post(`${API}/music/${song._id}/played`, {}, { withCredentials: true }).catch(() => {})
      }
    },
    [isShuffled]
  )

  const togglePlayPause = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      if (audio.paused) {
        await audio.play()
        setIsPlaying(true)
      } else {
        audio.pause()
        setIsPlaying(false)
      }
    } catch (err) {
      console.error(err)
    }
  }, [])

  const playNext = useCallback(() => {
    const list = isShuffled ? shuffledQueue : queue
    if (!list.length) return

    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(() => {})
      }
      return
    }

    if (currentIndex < list.length - 1) {
      const nextIdx = currentIndex + 1
      setCurrentIndex(nextIdx)
      setIsPlaying(true)
      const song = list[nextIdx]
      if (song) {
        axios.post(`${API}/music/${song._id}/played`, {}, { withCredentials: true }).catch(() => {})
      }
    } else if (repeatMode === 'all') {
      setCurrentIndex(0)
      setIsPlaying(true)
      const song = list[0]
      if (song) {
        axios.post(`${API}/music/${song._id}/played`, {}, { withCredentials: true }).catch(() => {})
      }
    } else {
      setIsPlaying(false)
    }
  }, [queue, shuffledQueue, currentIndex, isShuffled, repeatMode])

  const playPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsPlaying(true)
    }
  }, [currentIndex])

  const toggleShuffle = useCallback(() => {
    setIsShuffled((prev) => {
      if (!prev) {
        const shuffled = [...queue].sort(() => Math.random() - 0.5)
        setShuffledQueue(shuffled)
      }
      return !prev
    })
  }, [queue])

  const toggleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === 'none') return 'all'
      if (prev === 'all') return 'one'
      return 'none'
    })
  }, [])

  const closePlayer = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
    setCurrentIndex(-1)
    setQueue([])
  }, [])

  const toggleLike = useCallback(async (musicId) => {
    try {
      const res = await axios.post(`${API}/music/${musicId}/like`, {}, { withCredentials: true })
      if (res.data.liked) {
        setLikedSongs((prev) => [...prev, musicId])
      } else {
        setLikedSongs((prev) => prev.filter((id) => id !== musicId))
      }
      return res.data.liked
    } catch (err) {
      console.error(err)
    }
  }, [])

  const initLikedSongs = useCallback((ids) => {
    setLikedSongs(ids)
  }, [])

  return (
    <PlayerContext.Provider
      value={{
        queue: isShuffled ? shuffledQueue : queue,
        currentMusic,
        currentIndex,
        isPlaying,
        isShuffled,
        repeatMode,
        likedSongs,
        playFromQueue,
        togglePlayPause,
        playNext,
        playPrev,
        toggleShuffle,
        toggleRepeat,
        closePlayer,
        toggleLike,
        initLikedSongs,
        registerAudio,
        setIsPlaying,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  return useContext(PlayerContext)
}
