# ForgeCloud IDE

ForgeCloud IDE is an AI-first cloud IDE prototype hardened into a full-stack production foundation. The app now includes a React frontend, a same-origin Node API, persistent storage, real session authentication, CSRF protection, audit evidence export, rate limiting, payment/deployment provider gates, launch readiness scoring, and AI repair-run audit trails.

## Run Locally

Install dependencies:

```bash
npm install
```

Run the frontend only:

```bash
npm run dev
```

Run the production server after building:

```bash
npm run build
npm start
```

The production server listens on `PORT` or `8787` and serves both `/api/*` and the built React app from `dist`.

## Managed Postgres

Paid-customer production requires managed Postgres:

```bash
DATABASE_URL=postgres://user:password@host:5432/forgecloud DATABASE_SSL=true npm run db:migrate
```

When `DATABASE_URL` is present, the API uses Postgres tables for users, sessions, projects, deployments, payments, AI repair runs, and audit logs. Without it, the server uses the local JSON file store for development only.

## Seed Login

On first API boot, the server creates a local seed account:

- Email: `founder@forgecloud.dev`
- Password: `ForgeCloud!2026`

Change these with `SEED_USER_EMAIL` and `SEED_USER_PASSWORD` before client access.

## Production Environment

Copy `.env.example` into your deployment platform and set:

- `SESSION_SECRET`: at least 32 random characters.
- `APP_ORIGIN`: public app origin.
- `DATABASE_URL` and `DATABASE_SSL=true`: required for managed Postgres.
- `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, and `STRIPE_WEBHOOK_SECRET`: required for real checkout and webhook updates.
- `RESEND_API_KEY` or `EMAIL_WEBHOOK_URL`: required for email verification and password reset.
- `DEPLOYMENT_PROVIDER`: `vercel`, `netlify`, `github-pages`, or `webhook`.
- `VERCEL_DEPLOY_HOOK_URL`, `NETLIFY_BUILD_HOOK_URL`, GitHub Pages repo credentials, or `DEPLOYMENT_WEBHOOK_URL`: required for real deployment handoff.
- Domain attachment API credentials:
  - Vercel: `VERCEL_API_TOKEN` and `VERCEL_PROJECT_ID`, plus optional `VERCEL_TEAM_ID` or `VERCEL_TEAM_SLUG`.
  - Netlify: `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID`.
  - GitHub Pages: `GITHUB_TOKEN`, `GITHUB_PAGES_OWNER`, and `GITHUB_PAGES_REPO`.
  - Custom provider: `DEPLOYMENT_WEBHOOK_URL` must accept `domain.attach` and `domain.verify` actions.
- `UNSTOPPABLE_DOMAINS_API_KEY`: required for Unstoppable Domains DNS record automation.
- `DOMAIN_API_LIVE=true`: enables live domain provider and DNS mutation outside production; production calls live APIs when credentials are configured.
- `ALLOW_MOCK_PROVIDERS=false`: fail safely when providers are missing.
- `FORGECLOUD_STORE_PATH`: persistent mounted storage path.

## API Surface

- `GET /api/health`
- `GET /api/auth/csrf`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/auth/sessions`
- `POST /api/auth/sessions/revoke`
- `POST /api/auth/request-verification`
- `POST /api/auth/verify-email`
- `POST /api/auth/request-password-reset`
- `POST /api/auth/reset-password`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/deployments`
- `POST /api/deployments`
- `GET /api/domains`
- `POST /api/domains/attach`
- `POST /api/domains/verify`
- `POST /api/payments/checkout`
- `POST /api/stripe/webhook`
- `GET /api/audit-logs`
- `GET /api/audit-logs/export`
- `GET /api/security/review`
- `GET /api/launch/readiness`
- `POST /api/ai/repair-runs`

## GitHub Pages Custom Domains

Do not point customer DNS at `pages.github.com`. For GitHub Pages:

- First enable Pages on the repository and set the repository custom domain.
- For a subdomain like `app.example.com`, create a `CNAME` record pointing to `<owner>.github.io`.
- For an apex domain like `example.com`, create `A` records pointing to GitHub Pages IPs: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`; add the GitHub Pages `AAAA` records too when IPv6 is supported.
- In ForgeCloud, choose the GitHub Pages deployment target and configure `GITHUB_TOKEN`, `GITHUB_PAGES_OWNER`, and `GITHUB_PAGES_REPO`.
- Verify the custom domain in GitHub account or organization Pages settings to reduce takeover risk, then run the ForgeCloud domain verification check after DNS propagates.

## Security Controls

- HttpOnly SameSite session cookies.
- Signed double-submit CSRF protection for state-changing API requests.
- Session listing and revoke-other-devices controls.
- Scrypt password hashing with per-user salt.
- API rate limiting.
- JSON body size limits.
- Security headers for all API and static responses.
- Provider workflows fail safely in production unless configured.
- Domain attachment and verification require authentication, verified email, CSRF, provider credentials, and server-side secret handling.
- GitHub Pages custom domains use `<owner>.github.io` for subdomain CNAME records and GitHub Pages apex IP records, not `pages.github.com` directly.
- Auth, project, payment, deployment, and error events write audit logs.
- Audit logs can be exported as JSON evidence for security review.
- Launch readiness scoring summarizes auth, billing, data, deployment, monitoring, AI governance, and compliance gaps.
- Stripe webhooks verify signatures with timestamp tolerance.
- Email verification and password reset use hashed, expiring tokens.
- Production boot requires `DATABASE_URL`.
- CI runs lint, build, dependency audit, CodeQL, and secret scanning.

## Next Hardening Steps

Before opening general availability, complete the third-party review checklist in `docs/security/external-review.md`, run staging provider tests, and remediate all critical/high findings.
