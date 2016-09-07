function getUrl(req, res, next) {
  url = req.nextUrl || 'https://www.reddit.com/r/' + req.body.subreddit + '/top/?sort=top&t=year&limit=100'
  request(url, (err, res, data) => {
    if (err) {
      console.error(err);
    } else {
      urls.push(url);
      let $ = cheerio.load(data);
      nextUrl = $('.next-button a').attr('href');
      if (nextUrl) {
        req.nextUrl = nextUrl;
        getUrl(req, res, next);
      } else {
        next();
      }
    }
  });
}
function scrape(url, target) {
  target.push(new Promise((resolve, reject) => {

    url = url.replace(/\/top\//, '\/top\/.json')
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

function store(itemArr) {
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
