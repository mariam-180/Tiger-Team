# Project audit — 25 October 2026

This is the historical pre-repair audit. See `PROJECT_STATUS.md` for completed fixes and current verification.

## Scope and limits

Reviewed the root deployment stack, React source and configuration, FastAPI routes, authentication, CRUD operations, SQLModel tables, and Alembic migration history. This is a source audit, not a certification that every feature works. Existing backend changes were preserved. No application fixes or database changes were made.

Frontend ESLint: 206 files, zero reported errors or warnings (raw results: `eslint-audit.json`). Production build passed using `node node_modules/react-scripts/bin/react-scripts.js build`; it reported an outdated Browserslist dataset and a large main bundle (633.85 kB gzip). The test runner reported "No tests found" when run with `--watchAll=false --passWithNoTests`; this is not a passing behavioral test suite. Python, the Python launcher, and Docker were not found on PATH, so backend execution, migration execution, database contents and live frontend-to-backend requests could not be verified.

## Critical findings

1. **Public signup accepts privileged fields.** `TigersTeamPython/src/infra/models/user.py:9–31`, `src/api/endpoints/user_router.py:120`, and `src/infra/crud/user_crud.py:20`: UserCreate inherits role, credit, is_verified and reset-token fields. Public signup persists these fields without forcing safe values. A caller can request an administrator role, verified status and arbitrary balance. Use a dedicated public signup schema and assign these fields only on the server.

2. **Public user lookup exposes authentication data.** `src/api/endpoints/user_router.py:91–105` returns UserResponse without authentication. `src/infra/models/user.py:54` inherits password, verification_token and reset_token from UserBase. This exposes password hashes and potentially active account recovery tokens. Current-user/list schemas also include verification/reset tokens. Return explicit public response fields and restrict lookup access.

3. **Audit records can be modified without authentication.** `src/api/endpoints/reports_router.py:28–30,83–98`: create, read-by-ID, update and delete routes lack authentication and role checks. Protect all report operations and decide whether clients should be allowed to alter audit history at all.

## High-priority correctness and access findings

4. **Order and order-item ownership is not enforced.** `src/api/endpoints/orders_router.py:27–76` and `order_items_router.py:26–48`: any authenticated user can list everyone's orders/items or fetch another user's order. The username lookup also accepts any username. Restrict customer access to their own records; permit broader access only to staff.

5. **Reservation charges are client-controlled.** `src/infra/models/reservation.py:5–17`, `src/infra/crud/reservation_crud.py:19–43`: total_cost and duration are accepted without positivity/time-order validation or server price calculation. A negative total_cost increases credit. Creation does not recheck overlapping bookings or lock the relevant PC/user rows, so availability shown in the UI does not prevent double booking. Calculate charges on the server and validate/lock during the same transaction.

6. **Checkout trusts the customer's price and quantity.** `src/infra/models/order_item.py:12–19`, `src/infra/crud/order_crud.py:30–56`: item.price is used directly for totals; quantity and price lack positive bounds. Fetch product prices on the server and validate quantities. Product stock/balance updates also need transaction locking to handle concurrent requests.

7. **Checkout does not decrement stock.** `src/infra/crud/order_crud.py:44` compares availability with lowercase `in_stock`; the enum value is uppercase `IN_STOCK`. Deletion restores stock using the correct enum, allowing inventory to grow when orders are deleted. Use the same enum comparison in both paths.

8. **Old tokens override current database roles.** `src/infra/security/authentication.py:64` writes the token role onto the loaded user. Demoted staff retain old privileges until token expiry; a later commit in the session can also persist the old role. Authorize against the current database role.

9. **Bulk bookings are not atomic.** `src/api/endpoints/reservation_router.py:158–181` commits each reservation through CRUD separately. A failure can leave a partially booked, partially charged group. An empty pc_id list divides by zero. Validate a nonempty, unique PC list and commit the entire booking once.

10. **Email verification URL is misconfigured by default.** Root `compose.yaml:45` sets BACKEND_APIs to `/static`, which product image URLs need, while `src/utils/email_util.py` uses that same value to build `/users/verify-email`. This generates `/static/users/verify-email?...`, routed to static files rather than the API, and is relative in email. Split the public API origin from the static asset base; verification links need an absolute URL ending in `/api/users/verify-email` for this proxy setup. Signup commits before sending email, so email failures leave an account behind even when the HTTP request fails.

## Database and API consistency

11. **Migration/model drift.** `src/infra/db/tables.py` retains global email/phone uniqueness on EventRegistration, while migration `fc79de5db03c` drops those constraints and replaces them with per-event uniqueness. The model makes event_id required while the migration makes it nullable. Event.date is datetime in the model but Date in the migration, losing time-of-day in the migrated database. Align metadata and migrations, including a deliberate legacy-data backfill strategy. A single linear migration chain is present by source inspection; actual upgrades were not executed.

12. **Profile event lookup crashes when no active event exists.** `src/infra/crud/event_registrations_crud.py:68–81` indexes active_event[0] without checking for an empty result. Multiple active events are also allowed by CRUD, but this lookup arbitrarily uses the first. Handle zero active events and enforce a clear active-event policy.

13. **Order-item create contract is incomplete.** `src/infra/models/order_item.py` omits order_id from OrderItemCreate; `src/infra/crud/order_item_crud.py:8–13` inserts it directly, while the table requires a non-null order_id. The standalone POST cannot create a valid row as written. Prefer creating items through their parent order with ownership and total/stock handling.

14. **Product pagination route is unreachable.** `src/api/endpoints/products_router.py:23–75` registers GET `/products/` twice. The earlier list route wins, so pagination parameters never reach the second handler. Consolidate the routes.

15. **Reservation edits do not reconcile credit.** `src/infra/crud/reservation_crud.py` updates total_cost and user_id directly without charging/refunding the difference. Deletion also does not refund. Establish the intended cancellation policy and enforce consistent accounting in a transaction.

16. **Migration credentials are concatenated into a URL.** `alembic/env.py:get_url` interpolates raw username/password; characters such as `@`, `/` and `%` can break parsing/config interpolation. Build an escaped SQLAlchemy URL and handle Alembic interpolation correctly.

## Frontend/backend connection and unfinished features

The production path wiring is structurally consistent: React `.env.production` calls `/api/...`; `ops/nginx/default.conf` removes `/api/` and forwards to FastAPI's `/users`, `/orders`, `/reservations`, `/products`, etc. Product images use `/static/`; React bundles under `/static/js`, `/static/css` and `/static/media` go to the frontend. This has been checked in source only, not with running services.

- Local npm start/build scripts use POSIX `GENERATE_SOURCEMAP=false command` syntax, which fails in standard Windows npm execution. Set the variable in a cross-platform way. The audit build invokes react-scripts directly to bypass that script issue.
- Only `.env.production` is present in the frontend. A plain local development start does not load production endpoint variables. Docker development runs `handle_env.sh`, but that generator lacks the newer stream config/HLS keys and has placeholder Stage/Prod hosts. Add a documented development environment or a dev proxy and keep environment generation aligned.
- `src/pages/admin/reports/index.js` is an external-link shell and `.env.production` does not configure REACT_APP_ADMIN_REPORTS_URL. It displays an unconfigured message rather than usable reports.
- Legacy `src/pages/stream/index.js` uses Socket.IO plus a browser-visible environment password. The backend Socket.IO mount is commented out in `src/app.py`, its router is not included, and the proxy has no Socket.IO route. This legacy broadcaster is incomplete; the newer admin/SRS streaming path is separate. Browser environment variables cannot protect secrets.
- Live status controller logic in `src/routes.js` is commented out and sets the flag false, while an unconditional Live route is also present. Controller-driven availability is therefore not implemented consistently.
- API `/health` returns a constant response without checking the database. A healthy container does not prove migrations, DB authentication or queries work.
- `src/index.js` and `src/App.js` both mount AuthProvider. They maintain separate authentication state and both validate saved tokens; the outer provider can retain stale state after the inner provider logs out. Keep one provider around the route tree.
- SRS publishes RTMP on host port 1935, but `ops/srs/tigers.conf` has no publish authentication hook. SRS_STREAM_KEY is returned by the API as configuration; it is not enforced by SRS. The root example changes the stream key while HLS/WebRTC paths still use OBS_Stream, so changing only the key also breaks playback. Enforce publishing authorization and derive playback paths from the configured stream name.
- `src/app.py` logs complete request bodies in error handlers, potentially including signup/reset passwords. Redact sensitive fields before logging.
- `src/core/config.py` has a fixed fallback JWT signing key; require an explicit non-default secret for deployed environments. No secret values from local env files were included in this audit.
- `src/utils/upload_image.py` deletes the uploaded source path in finally. If the source filename already equals the generated WebP filename, it deletes the finished image. Save to a separate temporary path and replace the final file only after conversion.

## Suggested completion order

1. Close signup, response-data, report and ownership access flaws.
2. Fix server-calculated pricing, reservation validation, stock updates and transactional accounting.
3. Separate API/static/email URL settings; align models and migrations.
4. Run isolated MySQL migration and backend tests, then test signup/verification/login, permissions, checkout, reservations, uploads and profile through Nginx.
5. Complete reporting/streaming behavior and add regression coverage for these cases.
