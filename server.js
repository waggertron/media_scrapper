const express = require('express');
const mongo = require('mongod');
const request = require('request');
const mongoose = require('mongoose');
const cheerio = require('cheerio');
const http = require('http');
const https = require('https');

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
// mongoose.connection.once('open', (err, database) => {
// });

let videoSchema = new Schema({
  title: {type: String},
  subreddit:  {type: String},
  numComments:  {type: Number},
  created: {type: Date},
  url: {type: String},
  upvotes: {type: Number},
  thumbnail_url: {type: String}
});
// , { autoIndex: true }
const Video = mongoose.model('Video', videoSchema);


// let url = 'https://www.reddit.com/domain/youtube.com/top/.json?sort=top&t=all&limit=100';
let url = 'https://www.reddit.com/domain/youtube.com/top/?sort=top&t=all&limit=100';
const urls = [];
let count = 20;
function getUrl(url, linkNum) {
  if (linkNum <= count) {
    console.log(linkNum);
      // return (new Promise((resolve, reject) => {
    request(url, (err, res, data) => {
      if (err) {
        console.error(err);
      }
      urls.push(url.replace(/youtube\.com\/top\//,'youtube.com\/top\/.json'));
      let $ = cheerio.load(data);
      url = $('.next-button a').attr('href');
      if (url) {
        getUrl(url, ++linkNum);
      } else {
        console.log("reached the end");
      }
      
    });
  // }));
  } else {
    console.log(urls);
    return;
  }

}

app.set('view engine', 'ejs');
let items = [];
function scrape(url) {
  request(url, (err, res, data) => {
    console.log(typeof data);
    let json = JSON.parse(data);
    
    json.data.children.forEach((item) => {
      items.push(new Video({
        title: item.data.title,
        subreddit: item.data.subreddit,
        numComments: item.data.num_comments,
        url: item.data.url,
        upvotes: item.data.score,
        created: new Date(item.data.created_utc),
        thumbnail_url: item.data.media.oembed.thumbnail_url,
      }))
    });
    Video.create(items, (err, stuff) => {
      if (err) {
        console.log(err.message)
      } else {
        console.log('number of recoreds created: ' + items.length);
      }
    })
  });
}


app.get('/', (req, res) => {
  // scrape(url);
  getUrl(url, 0);
  res.status(200).send('Welcome to Spacepope Industries');
  return res.end();
})

app.listen(PORT, console.log(`server listening on port ${PORT}`));


// 'https://www.reddit.com/domain/youtube.com/top/.json';
// 'https://www.reddit.com/domain/youtube.com/top/.json?count=25&after=t3_3hagu3'
// 'https://www.reddit.com/domain/youtube.com/top/.json?count=50&after=t3_2cpbf6'
