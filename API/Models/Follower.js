const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
  currentUserId:{type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true },
  follower: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true },
  following: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true },
});

module.exports = mongoose.model('Follower', followSchema);
