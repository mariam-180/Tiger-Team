# Tigers Team deployment

For the repaired local preview, use http://localhost:3001 and the `tigers-validation` commands in the root README. The existing `tigers-team` deployment is separate.

Frontend builds now use Vite, Node.js 22, and the root `TigersTeamReact/index.html`. API requests retain the `/api/` gateway prefix. `npm start` supplies a development proxy; `BACKEND_PROXY_TARGET` overrides its upstream for Docker development.

The gateway uses Docker DNS with dynamic upstream resolution so recreated containers are picked up automatically. This configuration requires Nginx 1.27.3 or newer, as supplied by the stable image; see the [Nginx upstream documentation](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#resolve).

## Local or single-server start

1. Copy `.env.example` to `.env` and replace all placeholder secrets.
2. Run `./ops/tigers-team.sh`, then choose `1`.
3. Open `http://localhost` (or the server IP). The public gateway routes the React app, `/api/*` to FastAPI, and `/hls/*`/`/rtc/*` to SRS.
4. Choose `8` in the operations menu to create or update a verified `SUPER_USER`; the password is prompted securely and is not saved in the repository.
5. Choose `9` to back up `/etc/hosts` and add `tigers-team-local.com` to `127.0.0.1`, then browse to `http://tigers-team-local.com`.
6. Choose `10` to safely seed branches, PCs, events, categories, and sample products. It can be rerun without duplicates.

Seeders can also be run directly from the API container:

```bash
docker compose run --rm api python -m scripts.seeders --only all
docker compose run --rm api python -m scripts.seeders --only categories
```

The old `insert*.py` scripts were removed because they contained expired bearer tokens, production URLs, and non-portable local file paths.

The first start runs Alembic migrations after MySQL becomes healthy. Persistent data is stored in named Docker volumes. Do not commit `.env`.

## Streaming

Use the admin Streaming page to retrieve the configured OBS server and stream key. The SRS ingest endpoint is RTMP; playback is HLS by default and WebRTC is available for lower latency. Browsers require HTTPS for camera/microphone capture and WebRTC in production.

## Operations

The operations menu supports Compose start/stop/status/logs, gateway smoke tests, SSH/rsync deployment, and Certbot HTTPS activation. It never accepts SSH passwords; configure an SSH key. Certbot is webroot-based so certificate files stay in Docker volumes. The SSL option keeps a backup at `ops/nginx/default.conf.bak` before enabling the TLS config.

Before production, set a unique `SECRET_KEY`, database credentials, stream key, domain, and SRS WebRTC candidate/public address. Restrict ports `3306`, `1985`, and `8080`; only expose HTTP/HTTPS, RTMP, and the required WebRTC UDP port.

Set `PUBLIC_API_URL=https://your-domain/api` and `FRONTEND_URL=https://your-domain` for email links. `BACKEND_APIs` is only the static image base (normally `/static`). Configure `FROM_EMAIL`, `EMAIL_API_TOKEN`, `SMTP_HOST`, and `SMTP_PORT` for real mail. `EMAIL_DELIVERY=file` is development-only.

Set a long random `SRS_PUBLISH_TOKEN`; the admin streaming page supplies the OBS stream key including its authentication query. The SRS callback enforces that token. Keep `SRS_STREAM_KEY` as the stream name, for example `OBS_Stream`; HLS/WebRTC URLs are derived from it. Configure public WebRTC addressing before using it outside the local network. The hook configuration follows the [SRS HTTP callback protocol](https://ossrs.io/lts/en-us/docs/v5/doc/http-callback).

Orders reserve inventory when created; order cancellation restores it. Checkout does not claim to capture a payment. Reservation charges use the internal user balance; a future cancellation refunds it. These rules are enforced server-side and covered by regression tests.
