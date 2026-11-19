from datetime import datetime
from typing import List
from sqlalchemy.exc import IntegrityError, NoResultFound
from sqlmodel import Session, select, and_
from src.infra.db.tables import PC, Branch, Reservation
from src.infra.errors import DuplicateRecordException, RecordNotFoundException
from src.infra.models.pc import PCCreate, PCUpdate, PCResponse


def create(session: Session, pc_input: PCCreate) -> PC:
    branch = session.exec(select(Branch).where(Branch.id == pc_input.branch_id)).one_or_none()
    if not branch:
        raise RecordNotFoundException("Branch does not exist.")
    
    pc = PC(**pc_input.dict())

    try:
        session.add(pc)
        session.commit()
        session.refresh(pc)
    except IntegrityError as ie:
        raise DuplicateRecordException(ie.orig.args[1])
    return pc

def read_all(session: Session) -> List[PC]:
    statement = select(PC).order_by(PC.pc_number)
    return session.exec(statement).all()

def read_pcs_by_branch_and_availability(session: Session, branch_name: str, start_time: datetime, end_time: datetime) -> List[PCResponse]:
    branch = session.exec(select(Branch).where(Branch.name == branch_name)).one_or_none()
    if not branch:
        raise RecordNotFoundException("Branch does not exist.")
    pcs = session.exec(select(PC).where(PC.branch_id == branch.id)).all()
    pc_responses = []
    for pc in pcs:
        reservations = session.exec(
            select(Reservation)
            .where(Reservation.pc_id == pc.id)
            .where(Reservation.reservation_start < end_time)
            .where(Reservation.reservation_end > start_time)
        ).all()
        is_available = len(reservations) == 0
        pc_dict = pc.dict()
        pc_dict['is_available'] = is_available

        pc_response = PCResponse(**pc_dict)
        pc_responses.append(pc_response)
    return pc_responses


def read_by_id(session: Session, pc_id: int) -> PC:
    try:
        pc = session.exec(select(PC).where(PC.id == pc_id)).one()
        return pc
    except NoResultFound:
        raise RecordNotFoundException("PC does not exist.")


def read_by_pc_number(session: Session, pc_number: int, branch_id: int) -> PC:
    try:
        pc = session.exec(select(PC).where(and_(PC.branch_id == branch_id, PC.pc_number == pc_number))).one()
        return pc
    except NoResultFound:
        raise RecordNotFoundException("PC does not exist.")


def update(session: Session, pc_id: int, pc_input: PCUpdate) -> PC:
    try:
        pc = session.exec(select(PC).where(PC.id == pc_id)).one()
    except NoResultFound:
        raise RecordNotFoundException()

    if pc_input.branch_id is not None:
        pc.branch_id = pc_input.branch_id
    if pc_input.pc_number is not None:
        pc.pc_number = pc_input.pc_number

    session.add(pc)
    session.commit()
    session.refresh(pc)
    return pc


def delete(session: Session, pc_id: int) -> None:
    from fastapi import HTTPException
    if session.exec(select(Reservation).where(Reservation.pc_id == pc_id)).first():
        raise HTTPException(status_code=409, detail="PCs with booking history cannot be deleted")
    try:
        pc = session.exec(select(PC).where(PC.id == pc_id)).one()
        session.delete(pc)
        session.commit()
    except NoResultFound:
        raise RecordNotFoundException("PC does not exist.")
