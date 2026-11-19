import datetime
import secrets
from typing import List

import bcrypt
from sqlalchemy.exc import IntegrityError, NoResultFound, SQLAlchemyError
from sqlmodel import Session, select

from src.infra.db.tables import User, UserRole
from src.infra.errors import (
    DuplicateRecordException,
    RecordNotFoundException,
    DatabaseOperationException,
)
from src.infra.models.user import UserCreate, UserUpdate


def create(session: Session, user_input: UserCreate, commit: bool = True, verification_token: str = None) -> User:
    user = User(**user_input.model_dump())
    # Public registration must never grant privileges or trust account state.
    user.role = UserRole.END_USER
    user.credit = 0
    user.is_verified = False
    user.reset_token = None
    user.reset_token_expiry = None
    user.verification_token = verification_token

    try:
        session.add(user)
        if commit:
            session.commit()
        else:
            session.flush()
        session.refresh(user)
    except IntegrityError as ie:
        session.rollback()
        error_msg = str(ie.orig)
        field = None

        if "uq_user_name" in error_msg or "user.user_name" in error_msg:
            field = "user_name"
        elif "uq_phone_number" in error_msg or "user.phone_number" in error_msg:
            field = "phone_number"
        elif "uq_email" in error_msg or "user.email" in error_msg:
            field = "email"

        label = {"user_name": "Username", "phone_number": "Phone number", "email": "Email address"}.get(field, "Account")
        raise DuplicateRecordException(error_msg=f"{label} already exists.", field=field) from ie
    return user


def read(session: Session) -> List[User]:
    return session.exec(select(User)).all()


def read_non_end_user(session: Session) -> List[User]:
    try:
        user = session.exec(select(User).where(User.role != UserRole.END_USER)).all()
        return user
    except NoResultFound:
        raise RecordNotFoundException("User does not exist.")


def read_by_id(session: Session, id: int) -> User:
    try:
        user = session.exec(select(User).where(User.id == id)).one()
        return user
    except NoResultFound:
        raise RecordNotFoundException("User does not exist.")


def report_read_by_id(session: Session, id: int) -> User:
    try:
        user = session.exec(select(User).where(User.id == id)).one()
        if user:
            return {
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "phone_number": user.phone_number,
                "credit": user.credit,
            }
    except NoResultFound:
        return None


def read_by_email(session: Session, email: str) -> User:
    try:
        user = session.exec(select(User).where(User.email == email)).one()
        return user
    except NoResultFound:
        return read_by_userName(session, email)


def read_by_userName(session: Session, userName: str) -> User:
    try:
        user = session.exec(select(User).where(User.user_name == userName)).one()
        return user
    except NoResultFound:
        raise RecordNotFoundException("User does not exist.")


def read_by_verification_token(session: Session, token: str) -> User:
    try:
        user = session.exec(select(User).where(User.verification_token == token)).one()
        return user
    except NoResultFound:
        raise RecordNotFoundException("User does not exist.")


def update(session: Session, user_id: int, user_input: UserUpdate) -> User:
    try:
        user = session.exec(select(User).where(User.id == user_id)).one()
    except NoResultFound:
        raise RecordNotFoundException()

    for field, value in user_input.dict(exclude_unset=True).items():
        setattr(user, field, value)

    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def delete(session: Session, user_id: int) -> None:
    from fastapi import HTTPException
    from src.infra.db.tables import Order, Reservation
    if (session.exec(select(Order).where(Order.user_id == user_id)).first()
            or session.exec(select(Reservation).where(Reservation.user_id == user_id)).first()):
        raise HTTPException(status_code=409, detail="Users with order or reservation history cannot be deleted")
    try:
        user = session.exec(select(User).where(User.id == user_id)).one()
        session.delete(user)
        session.commit()
    except NoResultFound:
        raise RecordNotFoundException("User does not exist.")


def generate_reset_token(session: Session, user: User, commit: bool = True) -> None:
    try:
        reset_token = secrets.token_urlsafe(32)
        user.reset_token = reset_token
        user.reset_token_expiry = datetime.datetime.utcnow() + datetime.timedelta(
            hours=1
        )
        session.add(user)
        if commit:
            session.commit()
        else:
            session.flush()
    except SQLAlchemyError as e:
        session.rollback()
        raise DatabaseOperationException(f"Error generating reset token: {e}")


def update_password(session: Session, user: User, new_password: str) -> None:
    try:
        hashed_password = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt())
        user.password = hashed_password.decode("utf-8")
        user.reset_token = None
        user.reset_token_expiry = None
        session.add(user)
        session.commit()
    except SQLAlchemyError as e:
        session.rollback()
        raise DatabaseOperationException(f"Error updating password: {e}")


def read_by_reset_token(session: Session, token: str) -> User:
    try:
        user = session.exec(select(User).where(User.reset_token == token)).one()
        return user
    except NoResultFound:
        raise RecordNotFoundException("User does not exist.")
    except SQLAlchemyError as e:
        raise DatabaseOperationException(f"Error reading by reset token: {e}")
