# ForgeCloud IDE Launch Readiness

## Production Checklist

- Deploy the frontend with GitHub Pages or another static host.
- Deploy the Node backend with Railway, Render, Cloud Run, Fly.io, or another server host.
- Set `APP_ORIGIN` to the public frontend origin.
- Set `DATABASE_URL` and `DATABASE_SSL=true` for managed Postgres.
- Configure Stripe checkout and webhook secrets before accepting paid users.
- Configure email verification and password reset with Resend or a transactional email webhook.
- Configure `UNSTOPPABLE_DOMAINS_API_KEY` only on the backend host, never in frontend code.
- Enable HTTPS and verify custom domains in GitHub Pages or the deployment provider.

## Deployment Notes

GitHub Pages can host the static frontend at `https://www.forgecloudide.com`. It cannot run the Node API. For live auth, billing, persistence, and domain automation, deploy the backend separately and set `VITE_API_BASE_URL` during the frontend build.
