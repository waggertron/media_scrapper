const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = new Schema({
  domain: { type: String },
  title: { type: String },
  subreddit: { type: String },
  numComments: { type: Number },
  created: { type: Date },
  url: { type: String, unique: true },
  upvotes: { type: Number },
  thumbnailUrl: { type: String },
  commentLink: { type: String, unique: true }
}, { strict: true });

module.exports = mongoose.model('Video', videoSchema);