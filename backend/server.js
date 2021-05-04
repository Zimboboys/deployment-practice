// Web Server
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// Routes
const routes = require('./routes');

// Authentication
const ejwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

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
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());
app.use(cookieParser());


// Auth config
const JWT_secret = process.env.JWT_SECRET || 'secretkey';

passport.use(User.createStrategy());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.API_URL}/auth/google/callback`,
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    const user = {
      googleId: profile.id,
      name: profile.displayName,
    };

    User.findOrCreate(user, (err, user) => cb(err, user));
  }
));

// Auth middleware
const jwt_options = {
  secret: JWT_secret,
  algorithms: ['sha1', 'RS256', 'HS256'],
  getToken: (req) => (req.cookies.auth_token),
};

const setUser = async (req, res, next) => {
  const { id } = req.user;
  await User.findById(id, function(err, user) {
    req.user = user;
  });
  next();
};

// middleware array to authenticate, then populate `req.user`
const auth = [ejwt(jwt_options), setUser];


// Auth routes
app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get("/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: process.env.CLIENT_URL
  }),
  function(req, res) {
    const token = jsonwebtoken.sign({id: req.user._id}, JWT_secret);
    const options = {
      secure: true,
      httpOnly: true,
      sameSite: true,
    };

    res.cookie('auth_token', token, options);
    res.redirect(process.env.CLIENT_URL);
  }
);


app.use('/', routes);

// notice the `auth` middleware!
app.get('/protected', auth, (req, res) => {
  console.log('safe');
  res.json(req.user);
});


if (process.argv.includes('dev')) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`server running on port ${PORT}`));
}

module.exports = app;
