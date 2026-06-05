const express = require('express');
const router = express.Router();
const musicController = require('../Controllers/music.controller');
const { verifyToken, isArtist } = require('../middlewares/auth.middleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure disk storage for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Public route to view music
router.get('/', musicController.getAllMusic);

// Artist-only routes
router.post('/create-music', verifyToken, isArtist, upload.single('file'), musicController.createMusic);
router.post('/create-album', verifyToken, isArtist, musicController.createAlbum);
router.get('/artist', verifyToken, isArtist, musicController.getArtistMusic);

module.exports = router;