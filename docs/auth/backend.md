# User Authentication (Backend)

For the sake of making things easy on the frontend side of things, most of the
heavy lifting with user auth takes place on the backend. There may be better
ways to handle all of this, but the following works and is relatively easy to
plug-in to your current setup (especially if you used the
[Passport + Google OAuth tutorial](https://maartendebaecke2.medium.com/mern-stack-implementing-sign-in-with-google-made-easy-9bfdfe00d21c)).

## Migrating from sessions to JWTs

Assuming you have your User collection setup in accordance with the tutorial
above, we can work on using JWTs instead of sessions! First things first,
uninstall `express-session` and get rid of any code that looks like the
following

```js
app.use(session({ ... }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser( ... );
passport.deserializeUser( ... );
```

Now create a file `auth.js` in your `backend/` directory. You'll only
include the following for now, but we'll add more in the next section.

```js
// backend/auth.js
const JWT_secret = process.env.JWT_SECRET || 'secretkey';
module.exports = { JWT_secret };
```

The only other change to move from sessions to JWTs takes place in the
callback function from Google. Before we can make that change, you'll have to
`npm i jsonwebtoken` then make the following changes.

```js
const jsonwebtoken = require('jsonwebtoken');
const { JWT_secret } = require('./auth');   // path to backend/auth.js
...
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
```

With that, you're now creating a JWT after someone has authenticated with
Google! The next steps will go into making something useful with this token.

## Endpoints and middleware

To keep things light on the client side of things, we'll be storing our token
in a cookie that will be _automatically_ passed by the client with each request.
We can then take a look at this cookie and figure out who is making each
request + require users be authenticated to perform certain actions. For this
to happen, we must first send a cookie to the client. After that we can get
into auth on the server side.

### Creating and deleting the cookie

After returning from the OAuth callback, we'll have the client send a POST
request to the following endpoint to set a cookie. This has to be done from
the client (instead of just returning a cookie from the callback) due to
cookie security things.

```js
app.post('/auth/token', (req, res) => {
  const { token } = req.body;
  const options = { secure: true, httpOnly: true, sameSite: 'none' };

  res.cookie('auth_token', token, options);
  res.sendStatus(200);
});
```

While we're dealing with actual cookie stuff, let's set up our logout function
(which simply deletes the cookie from the user's browser). Ideally, there would
be a little more going on here with token invalidation, but this is sufficient
for our use case.

```js
app.post('/auth/logout', (req, res) => {
  // must be consistent with the cookie's options, otherwise the browser will not delete
  const options = { secure: true, httpOnly: true, sameSite: 'none' };

  res.clearCookie('auth_token', options);
  res.sendStatus(200);
});
```

### Securing endpoints + getting user info

Before we can actually check the `auth_token` cookie, we have to install some
more middleware that allows us to read tokens sent in requests. Thankfull, we
can `npm i cookie-parser` and then setup the following middleware

```js
const cookieParser = require('cookie-parser');
...
app.use(cookieParser());
```

Now we can `npm i express-jwt` and then head back over to our `backend/auth.js`
so it looks something like the following

```js
// backend/auth.js
const ejwt = require('express-jwt');
const { User } = require('./models');  // or however you want to get your User collection

const JWT_secret = process.env.JWT_SECRET || 'secretkey';

const jwt_options = {
  secret: JWT_secret,
  algorithms: ['sha1', 'RS256', 'HS256'],
  getToken: (req) => (req.cookies.auth_token),
};

const getUser = async (req, res, next) => {
  const { user } = req;

  if (user) {
    const { id } = req.user;
    await User.findById(id, function(err, user) {
      req.user = user;
    });
  }
  next();
};

const auth = [ejwt(jwt_options), getUser];

module.exports = { auth, JWT_secret };
```

The `auth` function array is a collection of middleware that we can use to
validate the JWT and then populate `req.user` with information about the user
for later use!

### Quick example

How can we put this middleware to use? Let's see with a simple endpoint that
will just return the logged in user's object.

```js
const { auth } = require('./auth');  // backend/auth.js
...
app.get('/auth/user', auth, (req, res) => {
  res.json({ user: req.user });
});
```

Notice that all we had to do was include `auth` before handling the logic of
our request! If an unauthorized user attempts to call this endpoint, they'll
be greeted with an "unathorized" error, meaning our endpoints are now secure!

## Configuring networking stuff

Since we're dealing with credentials, we have to be explicit with the response
headers we are using, otherwise our cookie will get blocked somewhere in the
request (and that's just sad). Adding the following middleware will allow the
cookie to be delievered properly (as well as bypass CORS restrictions).

```js
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
```

Please note that `process.env.CLIENT_URL` must be set to a single URL. For
development, this is likely `https://localhost:3000`. Only you know what will
go here for production. Just be aware that `*` will not work if we want
to pass credentials though!
