# Security Policy

ForgeCloud IDE should be treated as a production SaaS control plane. Keep API keys and provider secrets on the backend only.

## Implemented Controls

- Security headers on the Node server.
- Environment-variable based provider configuration.
- `.env` and local data files excluded by `.gitignore`.
- GitHub Pages DNS guidance avoids pointing custom domains at `pages.github.com` directly.

## Required Before Customer Launch

- Managed Postgres with backups and restore drills.
- Real auth, email verification, and password reset flows.
- Stripe checkout and webhook validation.
- CSRF protection for cookie-authenticated writes.
- Audit logging and export.
- Dependency, secret, and container scanning in CI/CD.
- External security review before broad paid rollout.
