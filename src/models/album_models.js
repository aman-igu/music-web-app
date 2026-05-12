const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    coverImage: {
        type: String,        // URL/URI to cover image
        default: ''
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    songs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Music'     // references the Music model
        }
    ]
}, { timestamps: true });

const AlbumModel = mongoose.model('Album', albumSchema);

module.exports = AlbumModel;
