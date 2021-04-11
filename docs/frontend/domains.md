# Configuring Domains

The default URL that Amplify spits out is a little "not user friendly", but we
can (and should) easily change this.

From our apps page in Amplify, find the tab in the sidebar labeled "Domain
mangagement". If you already have a domain in [Route 53](https://console.aws.amazon.com/route53/home),
you're pretty much set! Just type it in, configure it as you wish, and then
save. As most networking things do, this'll take a little while before it goes
live, but it'll get there. Be patient.

## Registering a Domain

If you haven't bought the domain yet, I'd highly recommend going through
[Route 53](https://console.aws.amazon.com/route53/home) just so all of your AWS
services work nicely together. This process should be somewhat straightforward.

If you've bought the domain from another provider, see if you can transfer it
to AWS. It's probably possible to make do without doing this, just more work.
