const express = require('express');
const musicController = require("../controllers/music.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() })

const router = express.Router();

// Upload + create
router.post("/upload", authMiddleware.authArtist, upload.single("music"), musicController.createMusic)
router.post("/album", authMiddleware.authArtist, musicController.createAlbum)

// Get all
router.get("/", authMiddleware.authUser, musicController.getAllMusics)
router.get("/albums", authMiddleware.authUser, musicController.getAllAlbums)
router.get("/albums/:albumId", authMiddleware.authUser, musicController.getAlbumById)

// Search
router.get("/search", authMiddleware.authUser, musicController.searchAll)

// Like / Unlike
router.post("/:musicId/like", authMiddleware.authUser, musicController.toggleLike)
router.get("/liked", authMiddleware.authUser, musicController.getLikedSongs)

// Recently played
router.post("/:musicId/played", authMiddleware.authUser, musicController.addToRecentlyPlayed)
router.get("/recent", authMiddleware.authUser, musicController.getRecentlyPlayed)

// Album song management (artist only)
router.post("/album/:albumId/songs/:musicId", authMiddleware.authArtist, musicController.addSongToAlbum)
router.delete("/album/:albumId/songs/:musicId", authMiddleware.authArtist, musicController.removeSongFromAlbum)

// Delete (artist only, owner only)
router.delete("/:musicId", authMiddleware.authArtist, musicController.deleteMusic)
router.delete("/album/:albumId", authMiddleware.authArtist, musicController.deleteAlbum)

module.exports = router;
