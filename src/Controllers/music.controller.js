const MusicModel = require('../models/music_models');
const AlbumModel = require('../models/album_models');

// ─── Create Music ────────────────────────────────────────────────────────────
// Protected by: verifyToken, isArtist  (applied in router)
async function createMusic(req, res) {
    const { title } = req.body;
    const file = req.file;

    if (!title) {
        return res.status(400).json({ message: "Title is required" });
    }

    if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    try {
        // Set URI to access the local file via the static route
        const musicUri = `/uploads/${file.filename}`;

        const music = await MusicModel.create({
            title,
            uri: musicUri,
            artist: req.user.id,
        });

        return res.status(201).json({ message: "Music uploaded successfully", music });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

// ─── Create Album ────────────────────────────────────────────────────────────
// Protected by: verifyToken, isArtist  (applied in router)
async function createAlbum(req, res) {
    const { title, description, coverImage, songs } = req.body;

    if (!title) {
        return res.status(400).json({ message: "Album title is required" });
    }

    // songs should be an array of existing Music ObjectIds (optional at creation)
    const songList = Array.isArray(songs) ? songs : [];

    try {
        // Verify all provided song IDs belong to this artist
        if (songList.length > 0) {
            const validSongs = await MusicModel.find({
                _id: { $in: songList },
                artist: req.user.id
            });

            if (validSongs.length !== songList.length) {
                return res.status(400).json({
                    message: "One or more songs are invalid or do not belong to you"
                });
            }
        }

        const album = await AlbumModel.create({
            title,
            description: description || '',
            coverImage: coverImage || '',
            artist: req.user.id,
            songs: songList
        });

        return res.status(201).json({ message: "Album created successfully", album });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

// ─── Get All Music ───────────────────────────────────────────────────────────
async function getAllMusic(req, res) {
    try {
        const music = await MusicModel.find().populate('artist', 'username email');
        return res.status(200).json(music);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

// ─── Get Artist Music ────────────────────────────────────────────────────────
// Protected by: verifyToken, isArtist  (applied in router)
async function getArtistMusic(req, res) {
    try {
        const music = await MusicModel.find({ artist: req.user.id }).populate('artist', 'username email');
        return res.status(200).json(music);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = { createMusic, createAlbum, getAllMusic, getArtistMusic };