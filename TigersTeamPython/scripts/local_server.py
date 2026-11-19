"""Isolated development server; never reads or changes the production database."""
import json
import os
import secrets
import sys
from pathlib import Path

BACKEND = Path(__file__).resolve().parents[1]
ROOT = BACKEND.parent
LOCAL = ROOT / ".local"
LOCAL.mkdir(exist_ok=True)
# Load only mail-related configuration; local DB and auth isolation stay intact.
from dotenv import dotenv_values
mail_keys = {"EMAIL_DELIVERY", "FROM_EMAIL", "EMAIL_API_TOKEN", "SMTP_USERNAME", "SMTP_PASSWORD", "SMTP_HOST", "SMTP_PORT", "SMTP_SECURITY"}
for mail_key, mail_value in dotenv_values(LOCAL / "mail.env").items():
    if mail_key in mail_keys and mail_value and mail_key not in os.environ:
        os.environ[mail_key] = mail_value
os.chdir(BACKEND)
sys.path.insert(0, str(BACKEND))
secret_file = LOCAL / "development-secret"
if not secret_file.exists():
    secret_file.write_text(secrets.token_urlsafe(48), encoding="utf-8")
os.environ.update({
    "ENV": "development", "SECRET_KEY": secret_file.read_text().strip(),
    "API_ROOT_PATH": "/api",
    "SRS_API_URL": os.environ.get("SRS_API_URL", "http://127.0.0.1:1985"),
    "DATABASE_URL": f"sqlite:///{(LOCAL / 'development.sqlite3').as_posix()}",
    "MYSQL_USER": "local", "MYSQL_PASSWORD": "local", "MYSQL_DATABASE": "local",
    "MYSQL_HOST": "127.0.0.1", "MYSQL_PORT": "3306",
    "EMAIL_DELIVERY": os.environ.get("EMAIL_DELIVERY", "file"), "MAIL_OUTBOX": str(LOCAL / "outbox"),
    "LOG_DIRECTORY": str(LOCAL / "logs"), "BACKEND_APIs": "/static",
    "PUBLIC_API_URL": "http://127.0.0.1:3000/api", "FRONTEND_URL": "http://127.0.0.1:3000",
})

import bcrypt
import uvicorn
from sqlmodel import Session, SQLModel, select
from src.infra.db.engine import engine
from src.infra.db.tables import User, UserRole
from scripts.seeders.runner import seed_branches, seed_categories, seed_pcs, seed_events, seed_products

SQLModel.metadata.create_all(engine)
with Session(engine) as session:
    # Seed once: restarting must not overwrite edits made in the local admin UI.
    marker = LOCAL / "seeded"
    if not marker.exists():
        seed_branches(session)
        seed_categories(session)
        seed_pcs(session)
        seed_events(session)
        seed_products(session)
        marker.write_text("1")
    admin = session.exec(select(User).where(User.user_name == "localadmin")).first()
    if admin is None:
        password = secrets.token_urlsafe(12)
        admin = User(first_name="Local", last_name="Admin", user_name="localadmin",
                     email="admin@example.com", phone_number="local-admin", role=UserRole.SUPER_USER,
                     is_verified=True, credit=1000,
                     password=bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode())
        session.add(admin)
        session.commit()
        (LOCAL / "admin-access.txt").write_text(f"Username: localadmin\nPassword: {password}\n", encoding="utf-8")
print("Local API: http://127.0.0.1:8081; admin login saved in .local/admin-access.txt", flush=True)
print("Email delivery: " + ("SMTP (real email)" if os.environ["EMAIL_DELIVERY"] == "smtp" else "local HTML previews in .local/outbox; messages are NOT sent to inboxes"), flush=True)
uvicorn.run("src.app:app", host="127.0.0.1", port=8081, access_log=False)
