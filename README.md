# SMERN

This is a somewhat meaningless app, but it's a decent showcase of having an app
with user auth deployed serverlessly. It's also where I was testing while
writing the [SMERN deployment docs](https://zimboboys.com/smern).

The example app
- connects to an Atlas hosted MongoDB instance
- uses Passport and Google OAuth + cookies and JWTs to handle user authentication
- automatically redeploys it's API or frontend when changes are pushed
- is hosted using Amazon's Amplify and API Gateway/Lambda

Quick links:
- [Deployment docs](https://zimboboys.com/smern)
- [Example app](https://example.h4i-cp.org)
- [express-deployment-aws](https://github.com/Zimboboys/express-deployment-aws)
