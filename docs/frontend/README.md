# Frontend

Once you have your API setup, it's time to tackle the frontend!

When in doubt, I would default to [AWS documentation](https://docs.aws.amazon.com/amplify/latest/userguide/welcome.html),
since it's written by people who know what they're doing. In fact, we'll
follow one of their tutorials for the actual deployment portion. Before that,
there are a few things to check.

## Preflight Checks

> Make sure all calls to the API use an environment variable

Since we're building something that'll live in the cloud, we can no longer get
away with using `localhost:3001` for API calls. Instead, we'll want to go
through our app and replace every instance of that with `process.env.REACT_APP_SERVER_URL`
and then add an environment variable for this.

For development, `REACT_APP_SERVER_URL="https://localhost:3001"` in the `.env`
file should make it seem like nothing has changed, but this lets us change
where our API calls are being made to, especially useful for production!

**Notes**
- the environment variable doesn't have to be `REACT_APP_SERVER_URL`, but it
  must start with `REACT_APP_`, as per [the React docs](https://create-react-app.dev/docs/adding-custom-environment-variables/)

## Takeoff

Once you've passed all the preflight checks, it's time to go live. You'll
basically follow [these instructions](https://aws.amazon.com/getting-started/hands-on/host-static-website/),
but there's one thing that we'll have to add, so I'll just re-tell those
instructions with our modification.

> Creating an app

Head over to [AWS Amplify](https://console.aws.amazon.com/amplify/home) and
find a button for hosting a web app (**not** develop).

From here, connect your GitHub repo and, since we're building with a monorepo,
check that box and use your `frontend` folder.

You can now name your app whatever you want! All of the default build settings
should be correct, so we're just left with one more thing. Environment variables.

Under the "Advanced settings" dropdown, supply the environment variables needed
to properly run your app. This is where we'll put our `REACT_APP_SERVER_URL`
along with the actual API URL that we should have gotten from our work on the
[backend](backend/).

After all that, click next, check that everything looks good, and then deploy! :tada:

It'll take a minute or so, but then you should have a live site! The URL may be
a little ugly, but Amplify makes it easy to change this. Check out the [configuring
domains](frontend/domains.md) page for some guidance.
