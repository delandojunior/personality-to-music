var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/userData');

var userDataSchema = new mongoose.Schema({
    _id: String,
    personality: Object,
    musics: Object
}, { collection: 'usercollection' }
);

module.exports = { Mongoose: mongoose, UserSchema: userDataSchema }