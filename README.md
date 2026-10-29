# Tigers Team

React frontend, FastAPI backend, MySQL database, and SRS streaming behind Nginx.

## Open the running development site

The isolated Docker preview is at **http://localhost:3001**. Its local administrator credentials are in `.local/docker-admin-access.txt`. This preview uses its own database and volumes; the pre-existing `tigers-team` containers are kept separate.

Restart the preview from the repository root:

```powershell
docker compose --env-file .local/compose-validation.env -p tigers-validation up -d --build
```

The generated `.local` files are specific to this computer and are intentionally ignored by Git.

## Development without Docker

Install Node.js 22 and Python 3.12, then run:

```powershell
cd TigersTeamReact
npm ci --legacy-peer-deps
npm run build
cd ..
python -m pip install -r TigersTeamPython/requirements.dev.txt
node ops/start-local.cjs
```

This starts http://localhost:3000 with an isolated SQLite development database. It uses the project-local Python runtime when available, otherwise `python` on PATH. Set `PYTHON` to choose another executable. Credentials are in `.local/admin-access.txt`.

For daily development and after restarting the laptop, use one terminal:

```powershell
cd TigersTeamReact
npm.cmd start
```

This starts the local API on 8081, waits for it to be ready, then starts Vite with hot reload on http://127.0.0.1:3000. Keep that terminal open. Ctrl+C stops both services started by this command. Existing database edits are preserved. A healthy API already running on 8081 is reused and left running when you stop Vite.

`npm.cmd start` always uses the local API; old `BACKEND_PROXY_TARGET` shell values do not affect it. For an intentionally separate backend or Docker gateway, set `BACKEND_PROXY_TARGET` and use `npm.cmd run start:frontend` instead. This command starts only Vite, so that backend must already be running.

The Live page checks broadcast status every five seconds. Actual broadcasting requires SRS and an OBS publisher in addition to the frontend and API. For a separately running local SRS server, expose its HTTP playback port 8080 and API port 1985 on localhost; the local API and Vite use those ports by default. Override `SRS_API_URL` for backend status checks, `SRS_HTTP_PROXY_TARGET` for Vite HLS playback, and `SRS_API_PROXY_TARGET` for Vite WebRTC. Restart the development command after changing these environment variables. Production Docker uses the existing Nginx media proxies and the internal SRS service instead.

Development verification/reset emails are saved as HTML in `.local/outbox` (or the Docker API logs volume's `outbox` directory). SMTP credentials are not required for development. Normal production delivery uses SMTP.

To deliver development emails to real inboxes, edit `.local/mail.env`. Set `EMAIL_DELIVERY=smtp`, `FROM_EMAIL` to your sender address, and `EMAIL_API_TOKEN` to its SMTP app password. Gmail-compatible defaults are `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, and `SMTP_SECURITY=starttls`; use your provider's settings for other senders. Port 465 supports `SMTP_SECURITY=ssl`. Recipients can use any email provider. A valid sender credential is required; never put credentials in chat or commit this ignored file. Restart the local API and frontend after changing it. Production settings belong in the deployed backend environment, not this local file.

With `EMAIL_DELIVERY=file`, no inbox email is sent: open the newest HTML file in `.local/outbox` to use its verification or reset link. The signup and reset dialogs explicitly identify this preview mode. Verification emails can be resent from the signup confirmation dialog. Password reset links expire and can only be used once.

## Checks

```powershell
cd TigersTeamReact
npm run lint
npm test
npm run build
cd ..
python -m pytest TigersTeamPython/tests -q
python ops/check_mysql.py --host 127.0.0.1 --port 13306
python ops/smoke_gateway.py
```

The MySQL check creates a disposable database, tests every migration and API regression, and removes that database afterward. It reads the password from `MYSQL_ROOT_PASSWORD` or `--password-file`. The two concurrency tests require MySQL and are skipped for SQLite. The gateway smoke test targets only the isolated Docker preview on port 3001.

The MySQL check requires a running MySQL server with permission to create/drop test databases; choose its port with `--port`. It is independent of the MySQL container used by the preview.

See [deployment instructions](docs/DEPLOYMENT.md) and [completed fixes and verification](docs/PROJECT_STATUS.md).
