// Web Server
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// Routes
const routes = require('./routes');

// Authentication
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { auth, JWT_secret } = require('./auth');

const { User } = require('./models');

// Standard web server stuff
const app = express();

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
.then(() => console.log('connected to DB'))
.catch((e) => console.error(e));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Referrer-Policy", "same-origin");
  next();
});

app.use(express.json());
app.use(cookieParser());
app.set('trust proxy', true);


// Auth config
passport.use(User.createStrategy());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.API_URL}/auth/google/callback`,
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    const name = profile.name.givenName || profile.displayName;
    const user = {
      googleId: profile.id,
      name: name
    };

    User.findOrCreate(user, (err, user) => cb(err, user));
  }
));

// Auth routes
app.get('/auth/user', auth, (req, res) => {
  res.json({ user: req.user });
});

app.post('/auth/token', (req, res) => {
  const token = req.body.token;
  const options = {
    secure: true,
    httpOnly: true,
  };

  res.cookie('auth_token', token, options);
  res.sendStatus(200);
});

app.post('/auth/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.sendStatus(200);
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: process.env.CLIENT_URL
  }),
  function(req, res) {
    const token = jsonwebtoken.sign({id: req.user._id}, JWT_secret);
    res.redirect(`${process.env.CLIENT_URL}/auth/login/${token}`);
  }
);

app.use('/api', routes);

if (process.argv.includes('dev')) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`server running on port ${PORT}`));
}

module.exports = app;
