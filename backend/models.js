const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  msg: String,
  googleId: String,
  secret: String,
  clicks: { type: Number, default: 0 },
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const clickSchema = new mongoose.Schema({
  count: Number,
  session: Number,
});

const User = mongoose.model('User', userSchema);
const Click = mongoose.model('Click', clickSchema);

module.exports = { Click, User };
