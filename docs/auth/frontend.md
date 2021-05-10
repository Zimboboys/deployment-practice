# User Authentication (Frontend)

On the frontend, there's only a few things that we have to concern ourselves
with, and most of those things have to do with sending cookies properly.

## Passing credentials to the API

The backend takes care of creating and setting the cookie, but to make sure
it gets sent _to_ the backend, we have to make some changes to our `fetch` calls.

For any GET request that you need credentials for, add `{ credentials: 'include' }`
to the options section of your fetch request. POST requests require a little
more work. See the following:

```js
// GET requests
fetch(URL, { credentials: 'include' }).then(...);

// POST requests
fetch(URL, { method: 'POST', mode: 'cors', credentials: 'include' }).then(...);
```

## Logging in/out

We [setup some endpoints](auth/backend?id=endpoints-and-middleware) as well
as [configured our Google OAuth callback URL](auth/backend?id=migrating-from-sessions-to-jwts)
in such a way that we can easily handle logging users in and out, we just
have to get a little creative with how things are moving behind the scenes.

### Logging in

Logging people in is a two-step process. First (and easiest), you just have to
send people to the sign-in URL (ex: https://my-api.example.com/auth/google).
The second step (after we return from our callback function) is where we have
to get creative.

If you're using react-router to handle your routing needs, add a route that
looks a bit like `<Route path="/auth/login/:token" component={SetAuthToken} />`.
The actual `SetAuthToken` component takes care of making the necessary API
call and setting the token and it will look as follows

```js
const SetAuthToken = () => {
  const { token } = useParams(); // import from react-router-dom

  fetch(`${process.env.REACT_APP_SERVER_URL}/auth/token`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({token}),
  })
  .then(() => window.location.assign('/'));

  return <p>Loading...</p>;
};
```

Together, this should be enough to handle creating accounts/logging people in!
Note that this whole process lacks a lot of error checking. It's worth the time
to implement this, but if you don't have that time, this is a fairly reliable
process.

### Logging out

Logging people out follows a very similar process to logging people in, as
you make a POST request, but this time it **in**validates the `auth_token`
cookie. You could certainly handle this cookie removal on the client side,
but that may require an extra package installation.

A logout link may look as follows:

```js
const logoutURL = `${process.env.REACT_APP_SERVER_URL}/auth/logout`;

const logout = () => {
  fetch(`${logoutURL}`, { method: 'POST', mode: 'cors', credentials: 'include' })
  .then(() => window.location.reload());
};

// the actual link
<a href="#" onClick={logout}>Logout</a>
```

## Getting the user

The final piece to this puzzle is getting the actual user object so we may use
it on the frontend (ex: to say "Hi {user.name}!"). To do this, we'll take
advantage of the endpoint we made as [a quick example](auth/backend?id=quick-example).

At the highest possible level of your React app, add the following to get and
store the user object

```js
import { useState, useEffect } from 'react';
...
const [user, setUser] = useState();

useEffect(() => {
  const URL = `${process.env.REACT_APP_SERVER_URL}/auth/user`;
  fetch(URL, { credentials: 'include' })
  .then(res => res.json())
  .then(data => setUser(data.user))
  .catch(err => console.error(err)); // catches when users aren't logged in
}, []);
```

Assuming everything up to this point has worked, you'll now be able to pass
the user object as a prop!
