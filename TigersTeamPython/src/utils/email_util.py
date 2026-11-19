import datetime
import os
import base64
import secrets
import smtplib
import ssl
from html import escape
from pathlib import Path
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import urllib.parse

from src.logger.log import setup_logger

logger = setup_logger()


def encode_image_to_base64(image_path):
    try:
        with open(image_path, "rb") as image_file:
            encoded = base64.b64encode(image_file.read()).decode("utf-8")
            logger.info(f"Encoded image: {image_path}")
            return encoded
    except Exception as e:
        logger.error(f"Failed to encode image {image_path}: {e}")
        raise


logo_base64 = encode_image_to_base64(Path(__file__).parent / "images" / "logo.png")


def create_verification_message(user_name, verification_link):
    user_name = escape(user_name)
    verification_link = escape(verification_link, quote=True)
    return f"""
    <html>
    <body>
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: #14141c;">
            <div style="text-align: left; margin-bottom: 20px;">
                <img src="data:image/png;base64,{logo_base64}" alt="Tigers Team Logo" style="max-width: 150px;">
            </div>
            <h2 style="color: #ffffff;">Welcome to Tigers Team, {user_name}!</h2>
            <p style="color: #d4d4df; font-size: 16px;">
                We are thrilled to have you on board. Here at Tigers Team, we aim to provide you with the best drifting simulation experience.
                Whether you're a beginner or an expert, we have something exciting for you.
            </p>
            <p style="color: #d4d4df; font-size: 16px;">
                To get started, please verify your email address by clicking the link below:
            </p>
            <p style="text-align: center;">
                <a href="{verification_link}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #c71935; border-radius: 5px; text-decoration: none;">
                    Verify Email
                </a>
            </p>
            <p style="color: #d4d4df; font-size: 16px;">
                If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:info@tigers-team.com">info@tigers-team.com</a>
            </p>
            <p style="color: #d4d4df; font-size: 16px;">
                Happy drifting!
            </p>
            <p style="color: #d4d4df; font-size: 16px;">
                Tigers Team
            </p>
        </div>
    </body>
    </html>
    """


def create_reset_password_message(user_name, reset_link, expiration_time):
    user_name = escape(user_name)
    reset_link = escape(reset_link, quote=True)
    expiration_time = escape(expiration_time)
    return f"""
    <html>
    <body>
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: #14141c;">
            <div style="text-align: left; margin-bottom: 20px;">
                <img src="data:image/png;base64,{logo_base64}" alt="Tigers Team Logo" style="max-width: 150px;">
            </div>
            <h2 style="color: #ffffff;">Password Reset Request</h2>
            <p style="color: #d4d4df; font-size: 16px;">
                Hi {user_name},
            </p>
            <p style="color: #d4d4df; font-size: 16px;">
                We received a request to reset your password. Click the link below to reset your password:
            </p>
            <p style="text-align: center;">
                <a href="{reset_link}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #c71935; border-radius: 5px; text-decoration: none; text-align: center;">
                    Reset Password
                </a>
            </p>
            <p style="color: #d4d4df; font-size: 16px;">
                This link is valid until {expiration_time}.
            </p>
            <p style="color: #d4d4df; font-size: 16px;">
                If you did not request a password reset, please ignore this email or contact our support team.
            </p>
            <p style="color: #d4d4df; font-size: 16px;">
                Thank you,
            </p>
            <p style="color: #d4d4df; font-size: 16px;">
                Tigers Team
            </p>
        </div>
    </body>
    </html>
    """


def send_email(subject, body, to_email):
    from src.core.config import settings
    if settings.EMAIL_DELIVERY == "file":
        if settings.ENV.lower() not in {"development", "test"}:
            raise ValueError("File email delivery is only available in development")
        outbox = Path(os.getenv("MAIL_OUTBOX", ".local/outbox"))
        outbox.mkdir(parents=True, exist_ok=True)
        preview = f"<!-- To: {escape(to_email)} | Subject: {escape(subject)} -->\n{body}"
        (outbox / f"{secrets.token_hex(12)}.html").write_text(preview, encoding="utf-8")
        return
    if settings.EMAIL_DELIVERY != "smtp":
        raise ValueError("EMAIL_DELIVERY must be smtp or file")
    from_email = os.getenv("FROM_EMAIL", "").strip()
    password = os.getenv("SMTP_PASSWORD") or os.getenv("EMAIL_API_TOKEN", "")
    username = os.getenv("SMTP_USERNAME") or from_email

    if not from_email or not password:
        logger.error("Missing FROM_EMAIL or EMAIL_API_TOKEN environment variables")
        raise ValueError("Email or password environment variable not set")

    logger.info(f"Preparing to send email to {to_email} with subject '{subject}'")

    msg = MIMEMultipart("alternative")
    msg["From"] = from_email
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "html"))

    try:
        host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        port = int(os.getenv("SMTP_PORT", "587"))
        security = os.getenv("SMTP_SECURITY", "ssl" if port == 465 else "starttls").lower()
        context = ssl.create_default_context()
        if security not in {"ssl", "starttls"}:
            raise ValueError("SMTP_SECURITY must be ssl or starttls")
        connection = smtplib.SMTP_SSL(host, port, timeout=15, context=context) if security == "ssl" else smtplib.SMTP(host, port, timeout=15)
        with connection as server:
            server.ehlo()
            if security == "starttls":
                server.starttls(context=context)
                server.ehlo()
            server.login(username, password)
            refused = server.send_message(msg)
            if refused:
                raise smtplib.SMTPRecipientsRefused(refused)
        logger.info("Email accepted by SMTP server")
    except (smtplib.SMTPException, OSError):
        logger.error("Email delivery failed; check SMTP credentials and provider settings")
        raise



def generate_verification_token():
    return secrets.token_urlsafe(32)


def send_verification_email(user_name, to_email, token):
    backEnd_APIs = os.getenv("PUBLIC_API_URL", "http://localhost/api").rstrip("/")
    verification_link = f"{backEnd_APIs}/users/verify-email?{urllib.parse.urlencode({'token': token})}"
    subject = "Email Verification - Welcome to Tigers Team!"
    body = create_verification_message(user_name, verification_link)
    send_email(subject, body, to_email)


def send_reset_password_email(user_name, to_email, token):
    frontEnd_URL = os.getenv("FRONTEND_URL", "http://localhost").rstrip("/")
    expiration_time = (
        datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    ).replace(tzinfo=datetime.timezone.utc).isoformat()
    query_params = urllib.parse.urlencode(
        {"token": token, "expires_at": expiration_time}
    )
    reset_link = f"{frontEnd_URL}/reset-password?{query_params}"
    subject = "Password Reset Request"
    body = create_reset_password_message(user_name, reset_link, expiration_time)
    send_email(subject, body, to_email)
