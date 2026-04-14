const express = require("express")
const playlistController = require("../controllers/playlist.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const router = express.Router()

// All playlist routes need login
router.post("/", authMiddleware.authUser, playlistController.createPlaylist)
router.get("/", authMiddleware.authUser, playlistController.getMyPlaylists)
router.get("/:playlistId", authMiddleware.authUser, playlistController.getPlaylistById)
router.post("/:playlistId/songs/:musicId", authMiddleware.authUser, playlistController.addSongToPlaylist)
router.delete("/:playlistId/songs/:musicId", authMiddleware.authUser, playlistController.removeSongFromPlaylist)
router.delete("/:playlistId", authMiddleware.authUser, playlistController.deletePlaylist)

module.exports = router