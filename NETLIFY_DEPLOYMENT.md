# Netlify deployment

## 1. Import the repository

In Netlify, choose **Add new site > Import an existing project**, select GitHub, and choose `kadz23dev/acessmend`.

The included `netlify.toml` sets the build command to `npm run build` and enables the Next.js runtime plugin.

## 2. Add environment variables

Add these in **Site configuration > Environment variables** for the Production and Deploy Preview scopes:

```text
BETTER_AUTH_SECRET=<long-random-secret>
BETTER_AUTH_URL=https://<your-netlify-domain>
DATABASE_URL=<pooled-postgresql-connection-string>
```

Use the final custom domain in `BETTER_AUTH_URL`, without a trailing slash. For Deploy Previews, the app also accepts Netlify's `URL` and `DEPLOY_PRIME_URL` values.

`DATABASE_URL` is required for persistent production accounts. Without it, the app uses an in-memory adapter intended only for local demos; users and sessions disappear when a serverless instance is replaced.

## 3. Create the Better Auth tables

Before testing sign-in, create the tables represented by `lib/db/schema.ts` in the configured PostgreSQL database. The required tables are `user`, `session`, `account`, `verification`, and `security_run`. Use the Better Auth/Drizzle schema migration workflow for your database provider.

## 4. Deploy and verify

Trigger a deploy from Netlify, then open `/login` on the deployed domain and click **Use demo analyst account**. Check the browser network panel for successful requests to `/api/auth/sign-up/email`, `/api/auth/sign-in/email`, and `/api/auth/get-session`.

Never commit `.env.local` or production secrets. The repository ignore rules already exclude local environment files.