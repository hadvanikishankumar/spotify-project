import { useState } from 'react'
import axios from 'axios'
import { API } from '../context/AuthContext'

function UploadMusic() {
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return setError('Please select an audio file')

    setLoading(true)
    setError('')
    setSuccess('')

    // FormData is REQUIRED when sending files (multipart/form-data)
    // Normal axios.post with JSON object CANNOT send files
    const formData = new FormData()
    formData.append('title', title)
    formData.append('music', file)  // Key "music" matches upload.single("music") in backend

    try {
      await axios.post(`${API}/music/upload`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'  // Tell server this is a file upload
        }
      })
      setSuccess('🎵 Music uploaded successfully!')
      setTitle('')
      setFile(null)
      e.target.reset()   // Reset file input (can't do this via state for file inputs)
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="form-container">
        <h2>Upload Music</h2>

        {success && <p className="success-msg">{success}</p>}
        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Song Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter song title"
              required
            />
          </div>

          <div className="form-group">
            <label>Audio File</label>
            {/* accept="audio/*" filters file picker to only show audio files */}
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setFile(e.target.files[0])}  // files[0] = first selected file
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Uploading to ImageKit...' : 'Upload Music'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default UploadMusic