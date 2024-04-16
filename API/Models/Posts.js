const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  username: { type: String, required: true },
  caption: { type: String },
  alt: { type: String },
  media: [{
    fileId: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    url: { 
      type: String 
    }
  }],
  Star: [{ type: String }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tags: [{ type: String }],
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = { Post };
