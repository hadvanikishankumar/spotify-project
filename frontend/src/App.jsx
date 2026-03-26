import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Albums from './pages/Albums'
import AlbumDetail from './pages/AlbumDetail'
import UploadMusic from './pages/UploadMusic'
import CreateAlbum from './pages/CreateAlbum'

// ProtectedRoute: If not logged in, redirect to /login
// Used for pages both "user" and "artist" can see
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading">Loading...</div>
  if (!user) return <Navigate to="/login" />  // Redirect
  return children  // Render the actual page
}

// ArtistRoute: Only artists can access these pages
// Non-artists get redirected to home
function ArtistRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading">Loading...</div>
  if (!user) return <Navigate to="/login" />
  if (user.role !== 'artist') return <Navigate to="/" />  // Not an artist? go home
  return children
}

// AppRoutes must be INSIDE AuthProvider to use useAuth()
function AppRoutes() {
  return (
    <>
      <Navbar />   {/* Always visible (hides itself on auth pages) */}
      <Routes>
        {/* Public routes - no login needed */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes - need login */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/albums" element={<ProtectedRoute><Albums /></ProtectedRoute>} />
        <Route path="/albums/:albumId" element={<ProtectedRoute><AlbumDetail /></ProtectedRoute>} />

        {/* Artist-only routes */}
        <Route path="/upload" element={<ArtistRoute><UploadMusic /></ArtistRoute>} />
        <Route path="/create-album" element={<ArtistRoute><CreateAlbum /></ArtistRoute>} />
      </Routes>
    </>
  )
}

function App() {
  return (
    // BrowserRouter enables URL-based navigation
    <BrowserRouter>
      {/* AuthProvider wraps everything so all pages can access user state */}
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App