const User = require('./userModel');
const bcrypt = require('bcryptjs');
const cookieController = require('./../utils/cookieController');

const userController = {};

userController.createUser = function (req, res, next) {
  User.create({ email: req.body.email, password: req.body.password }, (err, user) => {
    if (err) {
      console.log(err.message);
      res.status(403).json({ error: true });
    } else {
      console.log('user created: ', user);
      cookieController.setCookie(req, res, user);
      return next();
    }
  });
};

userController.verifyUser = function (req, res, next) {
  console.log('password', req.body.password)
  User.findOne({ email: req.body.email }, (err, user) => {
    console.log('user in findOne', user);
    if (err) {
      res.redirect('/?error=1');
    }
    if (user) {
      bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
        
        if (err) {
          console.log('inside bcypt err');
          return console.error(err.message);
        }
        if (isMatch) {
          console.log('user is a match', user);
          cookieController.setCookie(req, res, user);
          next()
        } else {
          res.redirect('/?error=1');
        }
      });
    } else {
      res.redirect('/?error=2');
    }
  });
};


module.exports = userController;


