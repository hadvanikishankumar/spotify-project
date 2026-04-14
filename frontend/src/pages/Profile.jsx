import { useState, useEffect } from 'react'
import axios from 'axios'
import { API } from '../context/AuthContext'
import { usePlayer } from '../context/PlayerContext'
import MusicCard from '../components/MusicCard'

function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('recent')
  const { playFromQueue, currentMusic } = usePlayer()

  useEffect(() => {
    axios.get(`${API}/auth/profile`, { withCredentials: true })
      .then(res => setProfile(res.data.user))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handlePlay = (music, list) => {
    playFromQueue(list, list.findIndex(m => m._id === music._id))
  }

  if (loading) return <div className="loading" />
  if (!profile) return <div className="error">Profile load nahi hua</div>

  return (
    <div className="page" style={{ padding: 0 }}>
      <div className="profile-hero">
        <div className="profile-avatar">{profile.username?.charAt(0).toUpperCase()}</div>
        <div className="profile-details">
          <h2>{profile.username}</h2>
          <p>{profile.email}</p>
          <span className={`role-badge ${profile.role}`}>{profile.role}</span>
        </div>
      </div>

      <div style={{ padding: '0 2.5rem 2rem' }}>
        <div className="profile-stats">
          <div className="stat-card">
            <h3>{profile.likedSongs?.length || 0}</h3>
            <p>Liked Songs</p>
          </div>
          <div className="stat-card">
            <h3>{profile.recentlyPlayed?.length || 0}</h3>
            <p>Recently Played</p>
          </div>
          {profile.role === 'artist' && (
            <div className="stat-card">
              <h3>{profile.uploadedCount || 0}</h3>
              <p>Uploads</p>
            </div>
          )}
        </div>

        <div className="profile-tabs">
          <button className={`tab-btn ${activeTab === 'recent' ? 'active' : ''}`} onClick={() => setActiveTab('recent')}>Recently Played</button>
          <button className={`tab-btn ${activeTab === 'liked' ? 'active' : ''}`} onClick={() => setActiveTab('liked')}>Liked Songs</button>
        </div>

        <div className="tab-content">
          {activeTab === 'recent' && (
            profile.recentlyPlayed?.length === 0
              ? <div className="empty-state"><span className="empty-icon">📊</span><h3>No history yet</h3><p>Play some songs!</p></div>
              : <div className="music-list">{profile.recentlyPlayed?.map(music => (
                  <MusicCard key={music._id} music={music} onPlay={(m) => handlePlay(m, profile.recentlyPlayed)} isPlaying={currentMusic?._id === music._id} />
                ))}</div>
          )}
          {activeTab === 'liked' && (
            profile.likedSongs?.length === 0
              ? <div className="empty-state"><span className="empty-icon">❤️</span><h3>No liked songs</h3></div>
              : <div className="music-list">{profile.likedSongs?.map(music => (
                  <MusicCard key={music._id} music={music} onPlay={(m) => handlePlay(m, profile.likedSongs)} isPlaying={currentMusic?._id === music._id} />
                ))}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
