from typing import List, Optional

from sqlalchemy.exc import IntegrityError, NoResultFound
from sqlmodel import Session, select

from src.infra.db.tables import Event
from src.infra.errors import DuplicateRecordException, RecordNotFoundException
from src.infra.models.event import EventCreate, EventUpdate


def create_event(session: Session, event_input: EventCreate) -> Event:
    
    event = Event(**event_input.model_dump())

    try:
        if event.is_active:
            for previous in session.exec(select(Event).where(Event.is_active == True).with_for_update()).all():
                previous.is_active = False
                session.add(previous)
        session.add(event)
        session.commit()
        session.refresh(event)
    except IntegrityError as ie:
        raise DuplicateRecordException(ie.orig.args[1])
    
    return event


def read_events(session: Session, is_active: Optional[bool] = None) -> List[Event]:
    query = select(Event)
    if is_active is not None:
        query = query.where(Event.is_active == is_active)
    
    return session.exec(query).all()


def update_event(session: Session, event_id: int, event_input: EventUpdate) -> Event:
    try:
        event = session.exec(select(Event).where(Event.id == event_id)).one()
    except NoResultFound:
        raise RecordNotFoundException()

    if event_input.name is not None:
        event.name = event_input.name
    if event_input.is_active is not None:
        if event_input.is_active:
            for previous in session.exec(select(Event).where(Event.is_active == True, Event.id != event_id).with_for_update()).all():
                previous.is_active = False
                session.add(previous)
        event.is_active = event_input.is_active
    if event_input.date is not None:
        event.date = event_input.date

    session.add(event)
    session.commit()
    session.refresh(event)
    return event


def read_event_by_id(session: Session, event_id: int) -> Event:
    try:
        event = session.exec(select(Event).where(Event.id == event_id)).one()
        return event
    except NoResultFound:
        raise RecordNotFoundException(f"Event with ID {event_id} not found")


def read_event_by_name(session: Session, event_name: str) -> Event:
    try:
        event = session.exec(select(Event).where(Event.name == event_name)).one()
        return event
    except NoResultFound:
        raise RecordNotFoundException(f"Event with name '{event_name}' not found")


def delete_event(session: Session, event_id: int) -> None:
    try:
        event = session.exec(select(Event).where(Event.id == event_id)).one()
        session.delete(event)
        session.commit()
    except NoResultFound:
        raise RecordNotFoundException(f"Event with ID {event_id} not found")
    except Exception as e:
        session.rollback()
        raise e
