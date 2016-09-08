const express = require('express');
const mongo = require('mongod');
const request = require('request');
const mongoose = require('mongoose');
const cheerio = require('cheerio');
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userController = require('./user/userController');
const cookieController = require('./utils/cookieController');
const videoController = require('./video/videoController');
const PORT = process.env.PORT || 3000;
const app = express();
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/Videos', (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log('connected to database');
  }
});
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', cookieController.checkCookie, (req, res) => {
  if (req.query.error == '1') {
    res.render('index', { error: "User Email and Password do not match" });
  } else if (req.query.error == '2') { 
    res.render('index', { error: "That email is not in our database" });
  } else if (req.query.error == '3') {  
    res.render('index', { error: "Please login"})
  } else {
    res.render('index', {error: false});
  }
  
})

app.post('/login', userController.verifyUser, (req, res) => res.redirect('/watch'));
app.post('/signup', userController.createUser, (req, res) => res.redirect('/watch'));

app.get('/watch', (req, res) => {
  if (req.cookies.id && req.cookies.gravatarEmail) {
    res.render('watch', { gravatarEmail: req.cookies.gravatarEmail, id: req.cookies.id });
  } else {
    res.redirect('/?error=3');
  }
});

app.get('/videos', videoController.getVideos);
app.get('/watched', videoController.getWatched);
app.post('/watched', test, videoController.recordWatched);
function test(req, res, next) {
  
} 

app.listen(PORT, console.log(`server listening on port ${PORT}`));





// db.videos.aggregate({ "$group" : { "_id": "$subreddit", "avg_upvotes" : {"$avg": "$upvotes"}}})
// { "_id" : "PlayItAgainSam", "avg_upvotes" : 204.88084112149534 }
// { "_id" : "AccidentalComedy", "avg_upvotes" : 154.0822060353798 }
// { "_id" : "EducativeVideos", "avg_upvotes" : 6.839130434782609 }
// { "_id" : "mealtimevideos", "avg_upvotes" : 87.11304347826086 }
// { "_id" : "MotivationVideos", "avg_upvotes" : 6.866125760649087 }
// { "_id" : "youtubehaiku", "avg_upvotes" : 3038.892781316348 }
// { "_id" : "VideoPorn", "avg_upvotes" : 15.691056910569106 }
// { "_id" : "WoahTube", "avg_upvotes" : 13.448167539267017 }
// { "_id" : "videos", "avg_upvotes" : 6346.396032329169 }
//  db.videos.aggregate({ "$group" : { "_id": "$subreddit", "avg_upvotes" : {"$avg": "$upvotes"}, "avg_comments" : {"$avg": "$numComments"}}})
// { "_id" : "PlayItAgainSam", "avg_upvotes" : 204.88084112149534, "avg_comments" : 8.559579439252337 }
// { "_id" : "AccidentalComedy", "avg_upvotes" : 154.0822060353798, "avg_comments" : 12.758584807492195 }
// { "_id" : "EducativeVideos", "avg_upvotes" : 13.969696969696969, "avg_comments" : 1.0404040404040404 }
// { "_id" : "mealtimevideos", "avg_upvotes" : 87.11304347826086, "avg_comments" : 8.659782608695652 }
// { "_id" : "MotivationVideos", "avg_upvotes" : 18.29, "avg_comments" : 0.87 }
// { "_id" : "youtubehaiku", "avg_upvotes" : 3038.892781316348, "avg_comments" : 94.61464968152866 }
// { "_id" : "VideoPorn", "avg_upvotes" : 19.39970282317979, "avg_comments" : 2.222882615156018 }
// { "_id" : "WoahTube", "avg_upvotes" : 18.775665399239543, "avg_comments" : 2.2338403041825097 }
// { "_id" : "videos", "avg_upvotes" : 6346.396032329169, "avg_comments" : 1771.3791329904482 }

// db.test.remove( { upvotes: { $lt: 3 } }, true )
// db.videos.aggregate( [
//   { $match: { upvotes: { $lt: 30 } } },
//   { $group: { _id: null, count: { $sum: 1 } } }
// ] );
// db.videos.find({}, { subbreddit: "WoahTube" })
