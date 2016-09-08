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
videoController.getVideos = function (req, res, next) {
  //convert to two promises, on to users, one to videos, only send unwatched;
  // const a = new Promise(resolve, reject) {}
  //use next function, define 'checkWatched middleware', pass that the processing
  //do not send vimeo, check video model;
  //
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
      //this was to fix a error on resetting the database, may not be needed
      if (user) {
        res.json(user.watched)
      } else {
        res.json([]);
      }
      
    }
  });
}
videoController.recordWatched = function (req, res, next) {
  // refactor to use a promise for the updating, simply send back a response imediately
  //sockets??
  //make sure not to add already added items;
  console.log(req.body.data);
  User.update({ _id: req.cookies.id }, { $push: { watched: { $each: req.body.data } } }, { upsert: true }, (err, user) => {
    console.log('inside find one and update, user', user);
    if (err) {
      console.log(err.message);
      res.status(400).send();
    } else {
      console.log('inside elese of record watched', user);
      res.status(200).send('OK');
    }
  });
}


module.exports = videoController;