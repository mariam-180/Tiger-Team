# Repairs and verification — 26 October 2026

The original findings are preserved in `PROJECT_AUDIT.md`. This document describes the repaired state.

## Changes

- Public signup uses a dedicated schema. Roles, balances, verification state and recovery tokens are controlled by the server.
- User responses omit password hashes and account recovery tokens. User lookup, report operations, orders, event registrations and reservations enforce access/ownership rules.
- Authorization uses the current database role. Changing a password invalidates existing login tokens. Staff cannot modify higher-privilege accounts.
- Orders calculate prices from products, validate quantities, lock inventory rows, and commit atomically. Cancellation/deletion restores stock once; fulfilled orders cannot be deleted. Standalone item edits reconcile quantities, stock and totals.
- Reservations calculate prices from branch settings, validate times/durations, lock PCs and balances, reject overlaps, and create groups atomically. Edits reconcile balances. Cancelling a future reservation refunds its charge. Started reservations cannot be edited.
- Booking timestamps use the business timezone, `Asia/Amman`, independently of the user's computer timezone. Availability checks use the same normalization.
- SQLModel definitions match the migrated MySQL schema. Alembic URL construction escapes credentials correctly. Related order/booking history is protected from cascading deletes.
- API/static/email URL settings are separate. Signup rolls back if email delivery fails. Local development can write verification/reset emails to an HTML outbox.
- Proxy path normalization preserves static image mounts while serving the API and its documentation under `/api`. Gateway upstream addresses refresh through Docker DNS after container replacement.
- Request bodies and URL query secrets are redacted or excluded from application/proxy logs. Production requires a non-placeholder JWT secret.
- SRS publishing uses a server-side token callback. Playback URLs derive from the configured stream name, and the SRS management API is not publicly proxied. The obsolete browser-password streaming page redirects to admin streaming.
- Reports now display activity from the backend. The products page handles errors/empty results, matches numeric foreign keys to padded IDs, and identifies cart items by ID.
- Authentication has one provider. Protected routes show notifications after rendering and reject unknown roles. Unknown routes have a fallback.
- Vite replaces the old React Scripts build chain. React/Router and vulnerable Python packages were upgraded and tested. Route pages load separately. Windows npm commands and local API proxy configuration are supported.
- Docker uses current Node/Python/Nginx base tags and a wheel build stage with explicit MySQL build/runtime libraries. Development caches are excluded from build contexts.

## Verification

- MySQL 8.4.13: migration upgrade from an empty database, regression tests, and downgrade to base passed.
- Schema comparison against a freshly migrated MySQL database: **zero differences**.
- **36 backend tests passed on MySQL**, including real concurrency checks for double booking and overspending.
- **5 frontend contract tests passed**, and production build and lint passed.
- **26 gateway checks passed** against the running Docker stack: authentication, signup/verification, permissions, catalog/images, order prices/stock, bookings/refunds, reports and image uploads. Details are in `gateway-checks.json`.
- The API, database, frontend, Nginx and SRS containers are all running and healthy. The preview ports bind only to `127.0.0.1`.
- npm and Python dependency scans reported **zero known vulnerabilities** after the dependency updates. This is a dated scan result, not a guarantee against all vulnerabilities.
- The homepage was visually verified in Chrome. Further computer/browser control was stopped when the user pressed Escape.

## Runtime scope

The new local Docker deployment uses project name `tigers-validation` and http://localhost:3001. Its database, passwords, administrator account and volumes are separate from the existing `tigers-team` deployment. Existing application data and uncommitted work were preserved.

External SMTP delivery, public domain/HTTPS certificates, and an actual OBS/WebRTC broadcast require the owner's service configuration and were not represented as verified live production services. The isolated preview writes emails to files. Its alternate UDP port is for isolated container testing; public WebRTC deployment must use a correctly advertised address/port.
