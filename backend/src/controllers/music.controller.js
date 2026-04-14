const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
const userModel = require("../models/user.model");
const { uploadFile } = require("../services/storage.services")

async function createMusic(req, res) {
    const { title } = req.body;
    const file = req.file;

    const result = await uploadFile(file.buffer.toString('base64'))

    const music = await musicModel.create({
        uri: result.url,
        title,
        artist: req.user.id,
    })

    res.status(201).json({
        message: "Music created successfully",
        music: {
            id: music._id,
            uri: music.uri,
            title: music.title,
            artist: music.artist,
        }
    })
}

async function createAlbum(req, res) {
    const { title, musics } = req.body;

    const album = await albumModel.create({
        title,
        artist: req.user.id,
        musics: musics,
    })

    res.status(201).json({
        message: "Album created successfully",
        album: {
            id: album._id,
            title: album.title,
            artist: album.artist,
            musics: album.musics,
        }
    })
}

async function getAllMusics(req, res) {
    const musics = await musicModel
        .find()
        .populate("artist", "username email")

    res.status(200).json({
        message: "Musics fetched successfully",
        musics: musics,
    })
}

async function getAllAlbums(req, res) {
    const albums = await albumModel.find().select("title artist").populate("artist", "username email")

    res.status(200).json({
        message: "Albums fetched successfully",
        albums: albums,
    })
}

async function getAlbumById(req, res) {
    const albumId = req.params.albumId;

    const album = await albumModel
        .findById(albumId)
        .populate("artist", "username email")
        .populate({ path: "musics", populate: { path: "artist", select: "username email" } })

    return res.status(200).json({
        message: "Album fetched successfully",
        album: album,
    })
}

// ─── ADD SONG TO ALBUM ─────────────────────────────────────────────────────────
async function addSongToAlbum(req, res) {
    const { albumId, musicId } = req.params

    const album = await albumModel.findById(albumId)
    if (!album) return res.status(404).json({ message: "Album not found" })

    if (album.artist.toString() !== req.user.id) {
        return res.status(403).json({ message: "Sirf album owner song add kar sakta hai" })
    }

    if (album.musics.map(id => id.toString()).includes(musicId)) {
        return res.status(400).json({ message: "Song already in this album" })
    }

    album.musics.push(musicId)
    await album.save()

    res.status(200).json({ message: "Song added to album" })
}

// ─── REMOVE SONG FROM ALBUM ────────────────────────────────────────────────────
async function removeSongFromAlbum(req, res) {
    const { albumId, musicId } = req.params

    const album = await albumModel.findById(albumId)
    if (!album) return res.status(404).json({ message: "Album not found" })

    if (album.artist.toString() !== req.user.id) {
        return res.status(403).json({ message: "Sirf album owner song remove kar sakta hai" })
    }

    await albumModel.findByIdAndUpdate(albumId, { $pull: { musics: musicId } })

    res.status(200).json({ message: "Song removed from album" })
}

// ─── DELETE SONG ───────────────────────────────────────────────────────────────
async function deleteMusic(req, res) {
    const { musicId } = req.params;

    const music = await musicModel.findById(musicId)
    if (!music) return res.status(404).json({ message: "Music not found" })

    // Only the artist who uploaded it can delete
    if (music.artist.toString() !== req.user.id) {
        return res.status(403).json({ message: "You can only delete your own songs" })
    }

    // Remove song from all albums that contain it
    await albumModel.updateMany(
        { musics: musicId },
        { $pull: { musics: musicId } }
    )

    // Remove from all users' liked songs and recently played
    await userModel.updateMany(
        {},
        { $pull: { likedSongs: musicId, recentlyPlayed: musicId } }
    )

    await musicModel.findByIdAndDelete(musicId)

    res.status(200).json({ message: "Song deleted successfully" })
}

// ─── DELETE ALBUM ──────────────────────────────────────────────────────────────
async function deleteAlbum(req, res) {
    const { albumId } = req.params;

    const album = await albumModel.findById(albumId)
    if (!album) return res.status(404).json({ message: "Album not found" })

    // Only the artist who created it can delete
    if (album.artist.toString() !== req.user.id) {
        return res.status(403).json({ message: "You can only delete your own albums" })
    }

    await albumModel.findByIdAndDelete(albumId)

    res.status(200).json({ message: "Album deleted successfully" })
}

// ─── SEARCH ────────────────────────────────────────────────────────────────────
async function searchAll(req, res) {
    const { q } = req.query;

    if (!q || q.trim() === "") {
        return res.status(200).json({ musics: [], albums: [] })
    }

    // Case-insensitive search using regex
    const regex = new RegExp(q, "i")

    const [musics, albums] = await Promise.all([
        musicModel.find({ title: regex }).populate("artist", "username email").limit(20),
        albumModel.find({ title: regex }).populate("artist", "username email").limit(10)
    ])

    res.status(200).json({
        message: "Search results",
        musics,
        albums
    })
}

// ─── LIKE / UNLIKE SONG ────────────────────────────────────────────────────────
async function toggleLike(req, res) {
    const { musicId } = req.params;
    const userId = req.user.id;

    const user = await userModel.findById(userId)
    if (!user) return res.status(404).json({ message: "User not found" })

    const isLiked = user.likedSongs.includes(musicId)

    if (isLiked) {
        // Unlike: remove from array
        await userModel.findByIdAndUpdate(userId, { $pull: { likedSongs: musicId } })
        return res.status(200).json({ message: "Song unliked", liked: false })
    } else {
        // Like: add to array
        await userModel.findByIdAndUpdate(userId, { $addToSet: { likedSongs: musicId } })
        return res.status(200).json({ message: "Song liked", liked: true })
    }
}

// ─── GET LIKED SONGS ───────────────────────────────────────────────────────────
async function getLikedSongs(req, res) {
    const user = await userModel.findById(req.user.id).populate({
        path: "likedSongs",
        populate: { path: "artist", select: "username email" }
    })

    res.status(200).json({
        message: "Liked songs fetched",
        musics: user.likedSongs
    })
}

// ─── RECENTLY PLAYED ───────────────────────────────────────────────────────────
async function addToRecentlyPlayed(req, res) {
    const { musicId } = req.params;
    const userId = req.user.id;

    // Remove if already exists, then push to front, keep max 20
    await userModel.findByIdAndUpdate(userId, {
        $pull: { recentlyPlayed: musicId }
    })

    await userModel.findByIdAndUpdate(userId, {
        $push: {
            recentlyPlayed: {
                $each: [musicId],
                $position: 0,
                $slice: 20
            }
        }
    })

    res.status(200).json({ message: "Added to recently played" })
}

async function getRecentlyPlayed(req, res) {
    const user = await userModel.findById(req.user.id).populate({
        path: "recentlyPlayed",
        populate: { path: "artist", select: "username email" }
    })

    res.status(200).json({
        message: "Recently played fetched",
        musics: user.recentlyPlayed
    })
}

module.exports = {
    createMusic,
    createAlbum,
    getAllMusics,
    getAllAlbums,
    getAlbumById,
    addSongToAlbum,
    removeSongFromAlbum,
    deleteMusic,
    deleteAlbum,
    searchAll,
    toggleLike,
    getLikedSongs,
    addToRecentlyPlayed,
    getRecentlyPlayed
}