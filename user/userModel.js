const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  gravatarEmail: { type: String },
  password: { type: String },
  watched: [],
})
userSchema.pre('save', function (next) {
  const user = this;
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      next(err);
    }
    this.password = hash;
    this.gravatarEmail = gravatar.url(this.email, {protocol: 'https', s: '100'});
    next();
  });
});

module.exports = mongoose.model('User', userSchema);