# Customer and admin integration verification

## Recheck on 2026-11-19

- GitHub `main` and `New` include actual frontend/backend files, rather than gitlinks. A fresh clone from GitHub completed with 486 tracked files; frontend source and backend application files were present.
- Frontend: all 37 tests passed; full ESLint passed; production build passed. Vite reports a large-chunk performance warning.
- Backend: 54 tests passed on isolated SQLite, with 2 MySQL-only tests skipped. All 56 tests passed against a newly created disposable MySQL database, including concurrency tests. Alembic upgrade and downgrade passed; metadata/schema comparison found zero differences. The disposable database was removed afterward.
- The standard `npm start` command started the local API and Vite. HTTP checks through port 3000 passed for homepage and page routes, API/database health, branches and products, rejection of anonymous current-user access, authenticated login/current-user/reports, and the live update stream. Page HTTP status checks do not constitute visual or interactive browser verification.
- Both Nginx configurations now include the unbuffered live-update endpoint in version control.
- Not revalidated in this round: Docker runtime (Docker was not running), responsive visual layouts, real SMTP inbox delivery, external OBS/SRS broadcasting, public HTTPS/deployment, and real payments. These checks do not establish a blanket production-readiness guarantee. Local databases, credentials, dependencies and build output are intentionally excluded from Git; a new machine must install dependencies and initialize its own development data using the README.

## Earlier integration checks

Checked on 2026-10-29 using isolated SQLite test data. No customer records or real orders were changed.

## Verified API scenarios

- Admin changes a product price; the public catalog returns the new price.
- Customer creates an order; admin sees it with the server-calculated price and deducted stock.
- Admin advances or cancels an order; the customer's own order list shows that status.
- Cancelling and then deleting an order restores stock only once.
- Admin adjusts customer credit; the current-user endpoint returns the new credit.
- Customer books a PC; admin sees the booking and the customer's balance is deducted.
- Admin extends a booking; the customer's booking duration, cost and balance are recalculated.
- Admin deletes a future booking; the customer list is empty and credit is refunded.
- Customer registers for the active event; admin sees the registration and totals.
- Admin confirms or deletes that registration; the customer's profile endpoint reflects it.
- Repeated event registration returns a conflict rather than an internal server error.
- Customers cannot read another customer's bookings, orders or event registration, or access admin changes/reports.

## Open-page updates

Customer profile, product catalog and admin orders, users, catalog, event registrations, reports, controllers and reservations subscribe to a shared Server-Sent Events connection at `/api/updates`. Successful API writes notify connected pages after the response is completed; each page fetches its own authorized data. No customer data or resource identifiers are sent in the public notification.

There is no 30-second data refresh timer. Reconnecting triggers a fresh read; hidden pages catch up when visible again. Multiple components share one connection per tab. Changes arriving during an in-flight read trigger another read, rather than being dropped. Existing edits and dialogs are not remounted. Public price visibility, championship settings, sponsor settings and displayed room availability also subscribe.

The backend sends keepalive comments to maintain the connection; these do not reload page data. Nginx buffering is disabled for this endpoint in both HTTP and HTTPS configurations.

The current API deployment explicitly uses one Gunicorn worker and one API instance because its notification hub is in memory. Before adding workers or API replicas, implement a shared broker such as Redis; do not scale the API horizontally with this process-local hub. Direct database edits or external scripts do not emit API notifications. Live video availability still has its separate media-server status checks.

Refresh tests cover hidden pages, focus, shared connections, reconnect catch-up, overlapping requests, recovery after failure and cleanup. A real HTTP socket test opened two streams, changed a product through the authenticated admin API and verified both streams received the change and the catalog returned the new price.

## Completed checks

- Backend: 52 passed, 2 MySQL-only concurrency tests skipped.
- Frontend: 33 passed, including server rendering and background refresh behavior.
- ESLint for changed JavaScript files: passed.
- Production frontend build: passed after adding server push.
- Running local API and Vite proxy both deliver `/updates` / `/api/updates` as an unbuffered event stream.
- No Docker, mysql or mysqld command was available in the current shell for an isolated MySQL run.

## Limits before deployment

- API tests use SQLite. Two MySQL concurrency tests are skipped unless a disposable MySQL test database is supplied. They must be run against the intended production database engine before a production readiness claim.
- Server-render tests verify React render/prop behavior; they do not replace interactive browser tests or responsive visual checks.
- Real email delivery needs valid mailbox SMTP configuration and an inbox delivery test.
- Actual live video/audio needs an active OBS/SRS broadcast test.
- Production host, HTTPS, reverse proxy, environment variables, migrations and backups must be checked on the actual deployment environment.
- Product checkout currently records orders; successful order creation is not proof of an online payment.
