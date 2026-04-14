const playlistModel = require("../models/playlist.model")

// Create a new playlist
async function createPlaylist(req, res) {
    const { name } = req.body

    if (!name || name.trim() === "") {
        return res.status(400).json({ message: "Playlist name is required" })
    }

    const playlist = await playlistModel.create({
        name: name.trim(),
        owner: req.user.id,
        songs: []
    })

    res.status(201).json({ message: "Playlist created", playlist })
}

// Get all playlists of logged-in user
async function getMyPlaylists(req, res) {
    const playlists = await playlistModel
        .find({ owner: req.user.id })
        .populate({ path: "songs", populate: { path: "artist", select: "username" } })
        .sort({ createdAt: -1 })

    res.status(200).json({ message: "Playlists fetched", playlists })
}

// Get a single playlist by ID
async function getPlaylistById(req, res) {
    const { playlistId } = req.params

    const playlist = await playlistModel
        .findById(playlistId)
        .populate("owner", "username")
        .populate({ path: "songs", populate: { path: "artist", select: "username email" } })

    if (!playlist) return res.status(404).json({ message: "Playlist not found" })

    // Only owner can view (or make it public later)
    if (playlist.owner._id.toString() !== req.user.id) {
        return res.status(403).json({ message: "Access denied" })
    }

    res.status(200).json({ message: "Playlist fetched", playlist })
}

// Add a song to playlist
async function addSongToPlaylist(req, res) {
    const { playlistId, musicId } = req.params

    const playlist = await playlistModel.findById(playlistId)
    if (!playlist) return res.status(404).json({ message: "Playlist not found" })

    if (playlist.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not your playlist" })
    }

    if (playlist.songs.includes(musicId)) {
        return res.status(400).json({ message: "Song already in playlist" })
    }

    playlist.songs.push(musicId)
    await playlist.save()

    res.status(200).json({ message: "Song added to playlist" })
}

// Remove a song from playlist
async function removeSongFromPlaylist(req, res) {
    const { playlistId, musicId } = req.params

    const playlist = await playlistModel.findById(playlistId)
    if (!playlist) return res.status(404).json({ message: "Playlist not found" })

    if (playlist.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not your playlist" })
    }

    await playlistModel.findByIdAndUpdate(playlistId, {
        $pull: { songs: musicId }
    })

    res.status(200).json({ message: "Song removed from playlist" })
}

// Delete entire playlist
async function deletePlaylist(req, res) {
    const { playlistId } = req.params

    const playlist = await playlistModel.findById(playlistId)
    if (!playlist) return res.status(404).json({ message: "Playlist not found" })

    if (playlist.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not your playlist" })
    }

    await playlistModel.findByIdAndDelete(playlistId)

    res.status(200).json({ message: "Playlist deleted" })
}

module.exports = {
    createPlaylist,
    getMyPlaylists,
    getPlaylistById,
    addSongToPlaylist,
    removeSongFromPlaylist,
    deletePlaylist
}