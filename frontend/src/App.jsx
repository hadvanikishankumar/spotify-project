import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { PlayerProvider } from './context/PlayerContext'
import Sidebar from './components/Sidebar'
import MusicPlayer from './components/MusicPlayer'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Albums from './pages/Albums'
import AlbumDetail from './pages/AlbumDetail'
import UploadMusic from './pages/UploadMusic'
import CreateAlbum from './pages/CreateAlbum'
import Search from './pages/Search'
import LikedSongs from './pages/LikedSongs'
import Playlists from './pages/Playlists'
import PlaylistDetail from './pages/PlaylistDetail'
import Profile from './pages/Profile'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading">Loading...</div>
  if (!user) return <Navigate to="/login" />
  return children
}

function ArtistRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading">Loading...</div>
  if (!user) return <Navigate to="/login" />
  if (user.role !== 'artist') return <Navigate to="/" />
  return children
}

function AppRoutes() {
  const { user } = useAuth()

  // Auth pages — no sidebar
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    )
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/albums" element={<ProtectedRoute><Albums /></ProtectedRoute>} />
          <Route path="/albums/:albumId" element={<ProtectedRoute><AlbumDetail /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/liked" element={<ProtectedRoute><LikedSongs /></ProtectedRoute>} />
          <Route path="/playlists" element={<ProtectedRoute><Playlists /></ProtectedRoute>} />
          <Route path="/playlists/:playlistId" element={<ProtectedRoute><PlaylistDetail /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/upload" element={<ArtistRoute><UploadMusic /></ArtistRoute>} />
          <Route path="/create-album" element={<ArtistRoute><CreateAlbum /></ArtistRoute>} />
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="/register" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <MusicPlayer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PlayerProvider>
          <AppRoutes />
        </PlayerProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App