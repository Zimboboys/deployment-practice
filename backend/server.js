// Web Server
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// Routes
const routes = require('./routes');

// Authentication
const ejwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();

// Auth config
const JWT_secret = 'JWT_SECRET_KEY_HERE';

// This is usually your database of users
const users = [
  { id: 0, username: 'elena', password: 'example', msg: 'hi!' },
  { id: 1, username: 'eric', password: 'example', msg: 'hello' },
];

// Use whatever strategy, this is just for example
passport.use(new LocalStrategy(function(username, password, cb) {
  const user = users.filter((u) => {
    return u.username === username && u.password === password
  });

  if (user.length === 1) {
    return cb(null, user[0]);
  } else {
    return cb(null, false);
  }
}));

// Auth middleware
const jwt_options = {
  secret: JWT_secret,
  algorithms: ['sha1', 'RS256', 'HS256']
};

const setUser = (req, res, next) => {
  const { id } = req.user;

  // this is where you'd get user info from the database
  user = users.filter((u) => (u.id === id));
  req.user = user[0];

  next();
};

const auth = [ejwt(jwt_options), setUser];

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
.then(() => console.log('connected to DB'))
.catch((e) => console.error(e));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());
app.use('/', routes);

// Auth routes
app.post('/login', function(req, res, next) {
  // again, use whatever strategy you want
  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({ status: 'error', code: 'unauthorized' });
    } else {
      // important for JWTs!
      return res.json({ token: jsonwebtoken.sign({id: user.id}, JWT_secret) });
    }
  })(req, res, next);
});

// notice the `auth` middleware!
app.get('/protected', auth, (req, res) => {
  res.json(req.user);
});

if (process.argv.includes('dev')) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`server running on port ${PORT}`));
}

module.exports = app;
