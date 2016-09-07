var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let userSchema = new Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  gravatarEmail: { type: String },
  password: { type: String }
})
