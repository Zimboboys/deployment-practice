# User Authentication (Google OAuth)

Most of our work with Google OAuth is done, we just have a couple of adjustments
to make so we don't run into any permission errors.

## Publishing your app

There's a button that says "Publish App" under the publishing status heading.
Just click that, confirm, and you should be good. You can now handle a lot more
users (up to 10k new users per day or something)! Since we aren't dealing with
any sensitive or restricted scopes, there isn't any type of approval process
to go through.

## Adding authorized URIs

Under the "Credentials" tab, select your project. Here you should find a section
for both "Authorized JavaScript origins" and "Authorized redirect URIs". For
both of these, you will need your production APIs URL. If you don't have a
production API, check out [the backend deployment guide](backend/).

**Authorized JavaScript origins**: the base URL of your API
(ex: https://my-api.example.com)

**Authorized redirect URIs**: the callback URL that you use in your backend
(ex: https://my-api.example.com/auth/google/callback)

After setting these and saving, you should be good to go.
