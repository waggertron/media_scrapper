const express = require('express');
const mongo = require('mongod');
const request = require('request');
const mongoose = require('mongoose');
const cheerio = require('cheerio');
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser');

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


let videoSchema = new Schema({
  title: { type: String },
  subreddit: { type: String },
  numComments: { type: Number },
  created: { type: Date },
  url: { type: String, unique: true, dropDups: true },
  upvotes: { type: Number },
  thumbnailUrl: { type: String },
  commentLink: { type: String }
});

const Video = mongoose.model('Video', videoSchema);
app.use(express.static('public'));

let url = 'https://www.reddit.com/domain/youtube.com/top/?sort=top&t=all&limit=100';
const urls = [];
const promiseArr = [];

/** middleWare,  */
function getUrl(req, res, next) {
  url = url + 'top/?sort=top&t=all&limit=100'
  request(url, (err, res, data) => {
    if (err) {
      console.error(err);
    } else {
      urls.push(url.replace(/youtube\.com\/top\//, 'youtube.com\/top\/.json'));
      let $ = cheerio.load(data);
      url = $('.next-button a').attr('href');
      if (url) {
        getUrl(url, ++linkNum);
      } else {
        console.log("reached the end of this subreddit, now scraping the data, total urls: ", urls.length);
        urls.forEach(scrape);
        next();
      }
    }
  });
}

app.set('view engine', 'ejs');

/** creates array of promises, pushes array of promises to promiseArr */
function scrape(url) {
  promiseArr.push(new Promise((resolve, reject) => {
    request(url, (err, res, data) => {
      if (err) {
        reject(err);
      } else {
        let json = JSON.parse(data);
        let items = [];
        json.data.children.forEach((item) => {
          items.push(new Video({
            title: item.data.title,
            subreddit: item.data.subreddit,
            numComments: item.data.num_comments,
            url: item.data.url,
            upvotes: item.data.score,
            created: new Date(item.data.created_utc),
            thumbnailUrl: item.data.media.oembed.thumbnail_url,
            commentLink: 'https://www.reddit.com/' + item.data.permalink
          }))
        });
        resolve(items);
      }
    });
  }));
}
/**
 *stores array of mongoose items in database
 */
function store(itemArrs) {


}
/**
 *controls scrapping cascade
 */
function scraperMiddleware(req, res, next) {
  
}

/**parses body for submitted subreddit, generates json urls until exhausted
 *creates array of promise arrays for each page, stores in database,
 then in final post route displays videos (need to complete)
 */
app.post('/scrape', bodyParser, getUrl, scraperMiddleware, (req, res) => {

});

app.listen(PORT, console.log(`server listening on port ${PORT}`));


// 'https://www.reddit.com/domain/youtube.com/top/.json';
// 'https://www.reddit.com/domain/youtube.com/top/.json?count=25&after=t3_3hagu3'
// 'https://www.reddit.com/domain/youtube.com/top/.json?count=50&after=t3_2cpbf6'
