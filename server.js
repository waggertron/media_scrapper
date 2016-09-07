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

const Video = mongoose.model('Video', videoSchema);
const User = mongoose.model('User', userSchema);
app.use(express.static('public'));
app.use(bodyParser.json({ type: 'application/json' }));

let url = 'https://www.reddit.com/domain/youtube.com/top/?sort=top&t=all&limit=100';
const urls = [];


// https://www.reddit.com/r/videos/top/?sort=top&t=year&limit=100
/** middleWare,  */
let count = 1;
function getUrl(req, res, next) {
  console.log('getting url #' + count++);
  url = req.nextUrl || 'https://www.reddit.com/r/' + req.body.subreddit + '/top/?sort=top&t=year&limit=100'

  request(url, (err, res, data) => {
    if (err) {
      console.error(err);
    } else {
      // urls.push(url.replace(/youtube\.com\/top\//, 'youtube.com\/top\/.json'));
      urls.push(url);
      let $ = cheerio.load(data);
      nextUrl = $('.next-button a').attr('href');
      if (nextUrl) {
        req.nextUrl = nextUrl;
        getUrl(req, res, next);
      } else {
        console.log("reached the end of this subreddit, now scraping the data, total urls: ", urls.length);
        next();
      }
    }
  });
}

app.set('view engine', 'ejs');
let scrapeCounter = 1;
/** creates array of promises, pushes array of promises to promiseArr */
function scrape(url, target) {
  // console.log('inside scrape');
  target.push(new Promise((resolve, reject) => {
    // console.log('scraping ' + scrapeCounter++);
    // console.log('url passed to scrape: ', url);
    url = url.replace(/\/top\//, '\/top\/.json')
    // console.log('url with json: ', url);
    request(url, (err, res, data) => {
      if (err) {
        reject(err);
      } else {
        let json = JSON.parse(data);
        let items = [];
        // console.log(json.data.children.length);
        let itemCount = 0;
        json.data.children.forEach((item) => {
          // console.log('item: ' + itemCount++);
          items.push(new Video({
            domain: item.data.domain,
            title: item.data.title,
            subreddit: item.data.subreddit,
            numComments: item.data.num_comments,
            url: item.data.url,
            upvotes: item.data.score,
            created: new Date(Number(item.data.created_utc)*1000),
            thumbnailUrl: item.data.thumbnail,
            commentLink: 'https://www.reddit.com' + item.data.permalink
          }, err => {
            if (err) console.log(err);
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
function store(itemArr) {
  // console.log('inside Store');
  // console.log(Array.isArray(itemArr));
  // console.log('itemarr: ', JSON.stringify(itemArr));
  
  let flattened = [];
  itemArr.forEach((item) => {
    flattened = flattened.concat(item);
  });
  Video.create(flattened, (err, items) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log('items saved to the database!!');
    }
  });
}
/**
 *controls scrapping cascade
 */
function scraperMiddleware(req, res, next) {

  const promiseArr = [];
  console.log('urls in scraperMiddleware: ', urls.length);
  urls.forEach(url => {
    scrape(url, promiseArr);
  });
  Promise.all(promiseArr).then(items => {
    console.log('success! all promises returned, storing items');
    store(items);
    next();
  }, reason => {
    console.log('failed because of: ', reason);
    next();
  });
}

function info(req, res, next) {
  console.log('req at ' + new Date(Date.now()) + '\n subreddit: ' + req.body.subreddit);
  next();
}
/**parses body for submitted subreddit, generates json urls until exhausted
 *creates array of promise arrays for each page, stores in database,
 then in final post route displays videos (need to complete)
 */
app.post('/scrape', info, getUrl, scraperMiddleware, store, (req, res) => {
  res.status(200).send('at /scrap, it worked!!');
});
app.get('/watch',  (req, res) => {

});

app.listen(PORT, console.log(`server listening on port ${PORT}`));


// 'https://www.reddit.com/domain/youtube.com/top/.json';
// 'https://www.reddit.com/domain/youtube.com/top/.json?count=25&after=t3_3hagu3'
// 'https://www.reddit.com/domain/youtube.com/top/.json?count=50&after=t3_2cpbf6'
