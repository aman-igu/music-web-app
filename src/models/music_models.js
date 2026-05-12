const mongoose=require('mongoose');

const musicSchema=new mongoose.Schema({
    uri:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    artist:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true 
    }
})

const MusicModel=new mongoose.model('Music', musicSchema);

module.exports=MusicModel;