# Overview

Just as a MERN app separates the frontend and backend, we will do the same for
deployment!

This guide assumes that you're working with a mono-repo, with a separate
`frontend` and `backend` directory. If that's not the case, you may still be
able to make it work, I'm not 100% sure.

## Frontend

More details can be found in [the actual frontend section](frontend/), but
you're basically just going to deploy as normal using Amplify. The only thing
to make sure of is that you're using an environment variable for all of your
API calls instead of `localhost:3001` or whatever you used in development.

This part should be relatively simply, but I would save it for last just so you
have the actual API set up for when you get here.

## Backend

Unfortunately, setting up the backend takes a little more work than frontend.
That's okay though, because it's hopefully a quick "follow these steps" kind of
process.

There are some **important** things to note since we are making a "stateless" API

- all authentication must be stateless, meaning no sessions
- you won't be listening for requests, instead you'll just handle them

More info about this can be found in [the backend section](backend/).
