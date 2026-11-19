import argparse

import bcrypt
from sqlmodel import Session, select

from src.infra.db.engine import engine
from src.infra.db.tables import User, UserRole


def main():
    parser = argparse.ArgumentParser(description="Create or update a local super user")
    parser.add_argument("--username", required=True)
    parser.add_argument("--email", required=True)
    parser.add_argument("--password", required=True)
    args = parser.parse_args()

    with Session(engine) as session:
        user = session.exec(
            select(User).where(User.email == args.email)
        ).first()
        password_hash = bcrypt.hashpw(
            args.password.encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")
        if user:
            user.user_name = args.username
            user.password = password_hash
            user.role = UserRole.SUPER_USER
            user.is_verified = True
        else:
            user = User(
                first_name="Local",
                last_name="Administrator",
                email=args.email,
                phone_number="local_",
                user_name=args.username,
                password=password_hash,
                role=UserRole.SUPER_USER,
                is_verified=True,
            )
            session.add(user)
        session.commit()
    print(f"Admin ready: {args.username} ({args.email})")


if __name__ == "__main__":
    main()
