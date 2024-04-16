const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  posts: [postSchema],
});

module.exports = mongoose.model('Tag', tagSchema);
