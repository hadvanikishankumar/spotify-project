const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "artist"],
        default: "user"
    },
    // Songs liked by this user
    likedSongs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "music"
    }],
    // Last 20 played songs (newest first)
    recentlyPlayed: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "music"
    }]
})

const userModel = mongoose.model("user", userSchema)

module.exports = userModel