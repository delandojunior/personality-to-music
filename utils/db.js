var mongoose = require('mongoose');


mongoose.connect('mongodb://delandojunior:jr9506@ds161426.mlab.com:61426/userdata');

var userDataSchema = new mongoose.Schema({
    _id: String,
    personalityLikes: Object,
    personalityPosts: Object,
    gender: String,
    posts: Object,
    musics: Object,
    musics2017: Object 
}, { collection: 'usercollection' }
);

module.exports = { Mongoose: mongoose, UserSchema: userDataSchema }