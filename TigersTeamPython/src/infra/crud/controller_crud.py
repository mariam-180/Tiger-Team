from sqlalchemy.orm import Session
from typing import List, Optional
from src.infra.models.controller import ControllerCreate, ControllerUpdate
from src.infra.db.tables import Controller as ControllerTable

def create_controller(session: Session, controller: ControllerCreate) -> ControllerTable:
    new_controller = ControllerTable(**controller.dict())
    session.add(new_controller)
    session.commit()
    session.refresh(new_controller)
    return new_controller

def get_controller_by_id(session: Session, controller_id: int) -> Optional[ControllerTable]:
    return session.query(ControllerTable).filter(ControllerTable.id == controller_id).first()

def get_all_controllers(session: Session, skip: int = 0, limit: int = 10) -> List[ControllerTable]:
    return session.query(ControllerTable).offset(skip).limit(limit).all()

def update_controller(session: Session, controller_id: int, controller: ControllerUpdate) -> Optional[ControllerTable]:
    db_controller = get_controller_by_id(session, controller_id)
    if not db_controller:
        return None
    for key, value in controller.dict(exclude_unset=True).items():
        setattr(db_controller, key, value)
    session.commit()
    session.refresh(db_controller)
    return db_controller

def delete_controller(session: Session, controller_id: int) -> None:
    db_controller = get_controller_by_id(session, controller_id)
    if db_controller:
        session.delete(db_controller)
        session.commit()
