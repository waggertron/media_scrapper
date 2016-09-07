var Video = require('./videoModel');

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
  Video.find({}).sort({ 'upvotes': -1 }).limit(5).exec((err, videos) => {
    if (err) {
      console.log(err.message);
    } else {
      res.json(videos);
    }
  });

}

module.exports = videoController;