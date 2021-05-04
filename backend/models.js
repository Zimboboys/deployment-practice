const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  msg: String,
  googleId: String,
  secret: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const clickSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 0,
    required: true,
  },
  session: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);
const Click = mongoose.model('Click', clickSchema);

module.exports = { Click, User };
