from typing import List, Optional

from sqlalchemy.exc import IntegrityError, NoResultFound
from sqlmodel import Session, select, and_

from src.infra.crud.event_crud import read_event_by_name, read_events
from src.infra.db.tables import EventRegistration
from src.infra.errors import DuplicateRecordException, RecordNotFoundException
from src.infra.models.event_registrations import RegistrationCreate, RegistrationUpdate


def create(session: Session, user_input: RegistrationCreate) -> EventRegistration:
    user = EventRegistration(**user_input.model_dump())

    try:
        session.add(user)
        session.commit()
        session.refresh(user)
    except IntegrityError as ie:
        session.rollback()
        raise DuplicateRecordException("This email or phone number is already registered for the event") from ie
    return user


def read(session: Session, event_name: Optional[str] = None) -> List[EventRegistration]:
    if event_name:
        try:
            event = read_event_by_name(session, event_name)
        except RecordNotFoundException:
            raise RecordNotFoundException(f"Event with name '{event_name}' not found")

        return session.exec(
            select(EventRegistration).where(EventRegistration.event_id == event.id)
        ).all()
    else:
        active_event = read_events(session, is_active=True)
        if not active_event:
            return []

        return session.exec(
            select(EventRegistration).where(
                EventRegistration.event_id == active_event[0].id
            )
        ).all()


def update(
    session: Session, user_id: int, user_input: RegistrationUpdate
) -> EventRegistration:
    try:
        user = session.exec(
            select(EventRegistration).where(EventRegistration.id == user_id)
        ).one()
    except NoResultFound:
        raise RecordNotFoundException()

    if user_input.status:
        user.status = user_input.status

    if user_input.event_id:
        user.event_id = user_input.event_id

    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def read_by_email(session: Session, email: str) -> EventRegistration:
    try:
        active_event = read_events(session, is_active=True)
        if not active_event:
            return None
        user = session.exec(
            select(EventRegistration).where(
                and_(
                    EventRegistration.email == email,
                    EventRegistration.event_id == active_event[0].id,
                )
            )
        ).one()
        return user
    except NoResultFound:
        return None


def delete(session: Session, user_id: int) -> None:
    try:
        user = session.exec(
            select(EventRegistration).where(EventRegistration.id == user_id)
        ).one()
        session.delete(user)
        session.commit()
        return user
    except NoResultFound:
        raise RecordNotFoundException(f"User with ID {user_id} not found")
    except Exception as e:
        session.rollback()
        raise e
