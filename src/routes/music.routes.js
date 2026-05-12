const express=require('express');
const router=express.Router();
const musicController=require('../Controllers/music.controller');
const multer=require('multer');
const upload=multer({storage:multer.memoryStorage()});


router.post('/create-music',upload.single('file'),musicController.createMusic);
router.post('/create-album',musicController.createAlbum);

module.exports=router;