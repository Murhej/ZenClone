const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    phone: {type: Number},
    username: {type:String, unique:true},
    email: {type:String, unique:true},
    password: String,
    bio: String,
    image: String,
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const User = mongoose.model('User', UserSchema);

module.exports = {User}; 
