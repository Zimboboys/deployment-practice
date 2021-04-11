# Backend

Setting up the API will take a little work, but hopefully just following these
steps will be enough to go live. Once these steps are done, you'll never have
to think about deployment again!

## Preflight Checks

> Make sure authentication (and everything else) is stateless

Since we're using Lambda to replace traditional servers, we lose certainty that
our code will be executed on the same physical server each time, meaning we can't
trust that sessions will be persistent. This is unfortunate if you're relying on
something like Express sessions to keep track logged-in users, but there are
certainly ways around this.

Right now, I have to tell you to do your own searching for solutions. Sorry
about that. I'll try and get some reference going soon.

**Recommendations**
- JWTs ([this package](https://www.npmjs.com/package/passport-jwt) may help if
  you're using something like Passport to deal with auth)
- Amplify also has [their own auth solution](https://docs.amplify.aws/lib/auth/getting-started/q/platform/js)

> Make necessary changes to your server files

Cryptic, I know, but there are a couple of things we have to do before our
deployment process will work.

1. Make sure your files are in the right places

All of the backend should live in a directory called `backend`. The deployment
tool is looking for a specific file in this directory called `server.js`. This
"server" file should contain your `app.listen()`

2. Make `app.listen()` a "dev only" process

The Lambda + API Gateway combo means we're responding to requests, not waiting
for them. This means `app.listen()` needs to be moved to a "dev only" process,
otherwise our Lambda function will get caught up waiting for other requests.

Here's my approach to this if you just want to copy and paste. _This lets me
use `nodemon server.js dev` for my dev mode._
```
if (process.argv.includes('dev')) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`server running on port ${PORT}`));
}
```

3. Export the Express app from `backend/server`

The build tool we're using needs to import our Node/Express app to get it ready
for it's life in the cloud, so we need to make sure we can build properly!

In the bottom of your `backend/server.js`, you'll need to add `module.exports = app;`
where "app" is your Express app.

> Make sure you're not using protected environment variables

When building on Github Actions, the server's environment is included in the
build which shouldn't be a problem if you avoid name collisions. I don't think
it's a problem if names overlap, but better safe than sorry! Here's [a list of
environment variables](backend/protected-env) that Actions uses.

## Configuring an IAM User

To programmatically deploy from Github Actions, we need to get credentials from
AWS. To do this, we'll head over to [IAM](https://console.aws.amazon.com/iam)
and create a new user with "Programmatic access". The policies you need can be
[found here](backend/IAM-policies). Make sure to hold onto the credentials
after creating the user.

## Setting up the Github Action

Now that everything is configured, it's time to setup the actual deployment
process!

To start, let's add our AWS credentials to our Github repo by going to
`Settings > Secrets` and then creating a new secret for "AWS_ACCESS_KEY_ID"
and "AWS_SECRET_ACCESS_KEY".

Then, create a file that lives in `.github/workflows/` called `deploy.yaml`.
The following code should be good enough to copy and paste into this new file.
As always, modify this as needed.

```
on: [push]

jobs:
  deploy:
    name: Deployment
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2

    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-west-1

    - id: backend-deployment
      uses: Zimboboys/express-deployment-aws@v0.1.0
      with:
        s3-bucket: 'example-api-deployment'
        stack-name: 'example-api-deployment-stack'
      env:
        DATABASE_URL: ${{ secrets.DATABASE_URL }}

    - run: echo API is at ${{ steps.backend-deployment.outputs.api-url }}
      shell: bash
```

### Environment Variables

Under the "backend-deployment" step, you should add all of the environment
variables that your backend needs. In my example, I only have one to connect
to my database, but if you have more, add them here! Make sure you **don't
expose any secrets** either, you have the repo secrets for this.

## Takeoff

Everything should be set up now! To deploy, simply make a push to your repo
and this action should start running.  If everything works properly, the action
should spit out a URL to your API! :tada:

> You now have an action that'll redeploy your API every time a change is pushed
to your `main` branch

You're free to do whatever you want with this URL, but I'd recommend taking it
over to the [frontend section](frontend/) and building your React app with it.
