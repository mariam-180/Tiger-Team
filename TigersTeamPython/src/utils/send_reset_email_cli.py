# PYTHONPATH=. python3 src/utils/send_reset_email_cli.py \
#  --name "Example User" \
#  --email "user@example.com" \
#  --env-file ".env"

import argparse
from dotenv import load_dotenv
from src.utils.email_util import send_reset_password_email, generate_verification_token

def main():
    parser = argparse.ArgumentParser(description="Send a password reset email.")
    parser.add_argument("--name", required=True, help="User's full name")
    parser.add_argument("--email", required=True, help="Recipient email address")
    parser.add_argument("--env-file", default=".env", help="Path to .env file (default: .env)")

    args = parser.parse_args()

    load_dotenv(dotenv_path=args.env_file)

    user_name = args.name
    to_email = args.email
    token = generate_verification_token()

    send_reset_password_email(user_name, to_email, token)

if __name__ == "__main__":
    main()
