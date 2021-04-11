# IAM Policies

To properly deploy your backend, you need an IAM user with at least the
following permissions:

- `IAMFullAccess`
- `AmazonS3FullAccess`
- `AmazonAPIGatewayAdministrator`
- `AWSCloudFormationFullAccess`
- `AWSLambda_FullAccess`

## Groups vs Users

If you're planning on deploying multiple apps using this process, I'd recommend
creating a group that you attach the necessary policies to. This will let you
easily manage all "users" that are responsible for deploying. You'll still be able
to attach additional policies to specific users within a group, so this shouldn't
limit you.

Otherwise, directly attaching policies to the user will work.

## Policy Explanations

Why does this tool need so many permissions? There's a lot going on behind the
scenes with creating new resources, not just uploading code to the cloud. All
of these services get used in some way, so they get full access!

If you know of a way to restrict these policies further, please let me know.
