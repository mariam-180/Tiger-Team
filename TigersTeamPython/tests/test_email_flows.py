from datetime import datetime, timedelta
from html import unescape
from urllib.parse import urlsplit, parse_qs
import re
import pytest
from sqlmodel import select
from src.core.config import settings
from src.infra.db.tables import User
from src.utils import email_util


@pytest.mark.parametrize("field", ["user_name", "email", "phone_number"])
def test_signup_duplicate_returns_conflict_without_sending_email(client, users, monkeypatch, field):
    account = dict(first_name="New", last_name="Driver", user_name="unique-driver", email="unique-driver@example.com", phone_number="unique-123", password="OriginalPassword123")
    account[field] = getattr(users[0], field)
    def unexpected_mail(*args):
        pytest.fail("Duplicate accounts must not send email")
    monkeypatch.setattr("src.api.endpoints.user_router.send_verification_email", unexpected_mail)
    response = client.post("/users/", json=account)
    assert response.status_code == 409, response.text
    assert "already exists" in response.text


def link_from_preview(folder, fragment):
    for file in folder.glob("*.html"):
        text = file.read_text(encoding="utf-8")
        for link in re.findall(r'href="([^"]+)"', text):
            if fragment in link:
                return unescape(link)
    raise AssertionError("Expected email link missing")


def test_real_verification_and_reset_links_work_from_outbox(client, db, tmp_path, monkeypatch):
    monkeypatch.setattr(settings, "EMAIL_DELIVERY", "file")
    monkeypatch.setattr(settings, "ENV", "test")
    monkeypatch.setenv("MAIL_OUTBOX", str(tmp_path))
    monkeypatch.setenv("PUBLIC_API_URL", "http://127.0.0.1:3000/api")
    monkeypatch.setenv("FRONTEND_URL", "http://127.0.0.1:3000")
    account = dict(first_name="Test", last_name="Driver", user_name="maildriver", email="driver@example.com", phone_number="mail-123", password="OriginalPassword123")
    created = client.post("/users/", json=account)
    assert created.status_code == 201, created.text
    assert created.json()["email_delivery"] == "file"
    assert client.post("/users/token", data={"username": account["email"], "password": account["password"]}).status_code == 403
    url = urlsplit(link_from_preview(tmp_path, "/verify-email"))
    token = parse_qs(url.query)["token"][0]
    assert url.netloc == "127.0.0.1:3000"
    verified = client.get("/users/verify-email", params={"token": token}, follow_redirects=False)
    assert verified.status_code == 307
    assert verified.headers["location"].endswith("/registration?verified=1")
    assert client.get("/users/verify-email", params={"token": token}, follow_redirects=False).status_code == 404
    assert client.post("/users/token", data={"username": account["email"], "password": account["password"]}).status_code == 200
    requested = client.post("/users/request-password-reset", json={"email": account["email"]})
    assert requested.status_code == 200, requested.text
    reset_url = urlsplit(link_from_preview(tmp_path, "/reset-password"))
    params = parse_qs(reset_url.query)
    assert reset_url.netloc == "127.0.0.1:3000"
    assert datetime.fromisoformat(params["expires_at"][0]).tzinfo is not None
    reset = {"token": params["token"][0], "new_password": "ReplacementPassword123"}
    assert client.post("/users/reset-password", json=reset).status_code == 200
    assert client.post("/users/reset-password", json=reset).status_code == 404
    assert client.post("/users/token", data={"username": account["email"], "password": account["password"]}).status_code == 401
    assert client.post("/users/token", data={"username": account["email"], "password": reset["new_password"]}).status_code == 200


def test_resend_rotates_link_and_failure_preserves_existing_link(client, db, users, monkeypatch):
    user = users[0]
    user.is_verified = False
    user.verification_token = "original-verification"
    db.add(user)
    db.commit()
    sent = []
    monkeypatch.setattr("src.api.endpoints.user_router.send_verification_email", lambda name, email, token: sent.append(token))
    response = client.post("/users/resend-verification", json={"email": user.email})
    assert response.status_code == 200, response.text
    assert sent[0] != "original-verification"
    assert client.get("/users/verify-email", params={"token": "original-verification"}).status_code == 404
    def fail(*args):
        raise OSError("Mail unavailable")
    monkeypatch.setattr("src.api.endpoints.user_router.send_verification_email", fail)
    assert client.post("/users/resend-verification", json={"email": user.email}).status_code == 503
    db.refresh(user)
    assert user.verification_token == sent[0]
    assert client.get("/users/verify-email", params={"token": sent[0]}, follow_redirects=False).status_code == 307


def test_failed_reset_delivery_preserves_previous_reset_and_validates_email(client, db, users, monkeypatch):
    user = users[0]
    user.reset_token = "previous-reset"
    user.reset_token_expiry = datetime.utcnow() + timedelta(hours=1)
    db.add(user)
    db.commit()
    def fail(*args):
        raise OSError("Mail unavailable")
    monkeypatch.setattr("src.api.endpoints.user_router.send_reset_password_email", fail)
    assert client.post("/users/request-password-reset", json={"email": user.email}).status_code == 503
    db.refresh(user)
    assert user.reset_token == "previous-reset"
    assert client.post("/users/request-password-reset", json={"email": "not-an-email"}).status_code == 422
    assert client.post("/users/resend-verification", json={"email": "not-an-email"}).status_code == 422
    assert client.post("/users/request-password-reset", json={"email": "missing@example.com"}).status_code == 200


@pytest.mark.parametrize("security,port,expected", [("starttls", "587", "tls"), ("ssl", "465", "ssl")])
def test_smtp_delivery_uses_encryption_and_credentials(monkeypatch, security, port, expected):
    monkeypatch.setattr(settings, "EMAIL_DELIVERY", "smtp")
    for key, value in {"FROM_EMAIL":"sender@example.com", "EMAIL_API_TOKEN":"test-password", "SMTP_SECURITY":security, "SMTP_PORT":port}.items():
        monkeypatch.setenv(key, value)
    monkeypatch.delenv("SMTP_PASSWORD", raising=False)
    monkeypatch.delenv("SMTP_USERNAME", raising=False)
    events = []
    class MailServer:
        def __enter__(self): return self
        def __exit__(self, *args): pass
        def ehlo(self): pass
        def starttls(self, **kwargs): events.append("tls")
        def login(self, username, password): assert (username, password) == ("sender@example.com", "test-password")
        def send_message(self, message): events.append(message["To"]); return {}
    def connection(*args, **kwargs):
        if "context" in kwargs: events.append("ssl")
        return MailServer()
    monkeypatch.setattr(email_util.smtplib, "SMTP", connection)
    monkeypatch.setattr(email_util.smtplib, "SMTP_SSL", connection)
    email_util.send_email("Test subject", "<p>Test</p>", "recipient@example.com")
    assert expected in events
    assert "recipient@example.com" in events
