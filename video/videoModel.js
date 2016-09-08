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
// maybe add a prehook to changing domain.com to domain
//work on adding tags
//download video
//hit more subreddits
//scrape recency, maybe incorporate momentjs
module.exports = mongoose.model('Video', videoSchema);