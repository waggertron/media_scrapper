const Video = require('./videoModel');
const User = require('./../user/userModel');

const videoController = {};


videoController.storeVideo = function (itemArr) {
  Video.create(flattened, (err, items) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log('items saved to the database!!');
    }
  });
}
videoController.getVideos = function(req,res, next) {
  Video.find({}).sort({ 'upvotes': -1 }).limit(100).exec((err, videos) => {
    if (err) {
      console.log(err.message);
    } else {
      res.json(videos);
    }
  });

}
videoController.getWatched = function (req, res, next) {
  User.findOne({ _id: req.cookies.id }, (err, user) => {
    if (err) {
      console.log(err.message)
    } else {
      res.json(user.watched)
    }
  });
}
videoController.recordWatched = function (req, res, next) {
  User.findOneAndUpdate({ _id: req.cookies.id }, { watched: req.body.data }, (err) => { 
    if (err) {
      console.log(err.message);
      res.status(400).send();
    }
    res.status(200).send('OK');
  });
}

module.exports = videoController;