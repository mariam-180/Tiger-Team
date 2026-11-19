from src.core.config import settings
from datetime import datetime, timedelta
from typing import List, Optional
from decimal import Decimal, ROUND_HALF_UP
from zoneinfo import ZoneInfo
from fastapi import HTTPException
from pydantic import ValidationError
from sqlalchemy.exc import IntegrityError, NoResultFound
from sqlmodel import Session, and_, select
from src.infra.db.tables import Reservation, PC, Branch, User
from src.infra.errors import (
    DuplicateRecordException,
    RecordNotFoundException,
    InsufficientCreditException,
)
from src.infra.models.reservation import ReservationCreate, ReservationUpdate
from src.infra.crud.pc_crud import read_by_pc_number
from src.infra.crud.user_crud import read_by_id as read_user_by_id


def local_now():
    return datetime.now(ZoneInfo(settings.BUSINESS_TIMEZONE)).replace(tzinfo=None)


def booking_cost(branch: Branch, duration: int) -> float:
    if "".join(character for character in branch.name.lower() if character not in " _-") == "snokardo":
        raise HTTPException(status_code=409, detail="This branch is permanently closed and cannot accept reservations")
    configured = (branch.total_price or {}).get(str(duration))
    cost = Decimal(str(configured)) if configured is not None else Decimal(str(branch.price)) * Decimal(duration) / 60
    if not cost.is_finite() or cost < 0:
        raise HTTPException(status_code=422, detail="Branch pricing is invalid")
    return float(cost.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))


def ensure_available(session, pc_id, start, end, exclude_id=None):
    query = select(Reservation).where(
        Reservation.pc_id == pc_id,
        Reservation.reservation_start < end,
        Reservation.reservation_end > start,
    )
    if exclude_id is not None:
        query = query.where(Reservation.id != exclude_id)
    if session.exec(query.with_for_update().execution_options(populate_existing=True)).first() is not None:
        raise HTTPException(status_code=409, detail="This PC is already booked for the selected time")


def create_bulk(session: Session, reservation_input: ReservationCreate) -> List[Reservation]:
    try:
        if reservation_input.reservation_start < local_now():
            raise HTTPException(status_code=422, detail="Reservations must start in the future")
        user = session.exec(select(User).where(User.id == reservation_input.user_id).with_for_update().execution_options(populate_existing=True)).one()
        branch = session.exec(select(Branch).where(Branch.id == reservation_input.branch_id)).one_or_none()
        if branch is None:
            raise RecordNotFoundException("Branch does not exist")
        numbers = reservation_input.pc_id if isinstance(reservation_input.pc_id, list) else [reservation_input.pc_id]
        cost = booking_cost(branch, reservation_input.duration)
        total = round(cost * len(numbers), 2)
        if user.credit < total:
            raise InsufficientCreditException(user.id, user.credit, total)
        reservations = []
        for number in sorted(numbers):
            pc = session.exec(select(PC).where(PC.branch_id == branch.id, PC.pc_number == str(number)).with_for_update().execution_options(populate_existing=True)).one_or_none()
            if pc is None:
                raise RecordNotFoundException("PC does not exist in this branch")
            ensure_available(session, pc.id, reservation_input.reservation_start, reservation_input.reservation_end)
            data = reservation_input.model_dump(exclude={"pc_id", "total_cost"})
            reservation = Reservation(**data, pc_id=pc.id, total_cost=cost)
            session.add(reservation)
            reservations.append(reservation)
        user.credit = round(user.credit - total, 2)
        session.add(user)
        session.commit()
        for reservation in reservations:
            session.refresh(reservation)
        return reservations
    except Exception:
        session.rollback()
        raise


def create(session: Session, reservation_input: ReservationCreate) -> Reservation:
    if isinstance(reservation_input.pc_id, list):
        raise HTTPException(status_code=422, detail="Use bulk booking for multiple PCs")
    return create_bulk(session, reservation_input)[0]


def read_all(session: Session) -> List[Reservation]:
    return session.exec(select(Reservation)).all()


def read_by_id(session: Session, reservation_id: int) -> Reservation:
    try:
        reservation = session.exec(
            select(Reservation).where(Reservation.id == reservation_id)
        ).one()
        return reservation
    except NoResultFound:
        raise RecordNotFoundException("Reservation does not exist.")


def report_read_by_id(session: Session, reservation_id: int) -> Reservation:
    try:
        reservation = session.exec(
            select(Reservation).where(Reservation.id == reservation_id)
        ).one()
        return reservation
    except NoResultFound:
        return None


def read_by_user_id(session: Session, user_id: int) -> List[Reservation]:
    reservations = session.exec(
        select(Reservation).where(Reservation.user_id == user_id)
    ).all()
    if not reservations:
        raise RecordNotFoundException("No reservations found for the user.")
    return reservations


def read_active(session: Session, include_history: bool = False) -> List[Reservation]:
    current_time = local_now()
    if include_history:
        return session.exec(select(Reservation)).all()
    else:
        return session.exec(
            select(Reservation).where(Reservation.reservation_end >= current_time)
        ).all()


def read_active_by_id(session: Session, reservation_id: int) -> Optional[Reservation]:
    current_time = local_now()
    return session.exec(
        select(Reservation).where(
            and_(
                Reservation.id == reservation_id,
                Reservation.reservation_end >= current_time,
            )
        )
    ).one_or_none()


def read_active_by_user_id(session: Session, user_id: int) -> List[Reservation]:
    current_time = local_now()
    return session.exec(
        select(Reservation).where(
            and_(
                Reservation.user_id == user_id,
                Reservation.reservation_end >= current_time,
            )
        )
    ).all()


def update(
    session: Session, reservation_id: int, reservation_input: ReservationUpdate
) -> Reservation:
    try:
        reservation = session.exec(select(Reservation).where(Reservation.id == reservation_id).with_for_update().execution_options(populate_existing=True)).one_or_none()
        if reservation is None:
            raise RecordNotFoundException("Reservation does not exist")
        if reservation.reservation_start <= local_now():
            raise HTTPException(status_code=409, detail="Started reservations cannot be edited")
        changes = reservation_input.model_dump(exclude_unset=True, exclude_none=True)
        branch_id = changes.get("branch_id", reservation.branch_id)
        pc_id = changes.get("pc_id", reservation.pc_id)
        if "pc_number" in changes:
            pc = session.exec(select(PC).where(PC.branch_id == branch_id, PC.pc_number == changes["pc_number"]).with_for_update().execution_options(populate_existing=True)).one_or_none()
        else:
            pc = session.exec(select(PC).where(PC.id == pc_id, PC.branch_id == branch_id).with_for_update().execution_options(populate_existing=True)).one_or_none()
        if pc is None:
            raise HTTPException(status_code=422, detail="PC does not belong to this branch")
        data = reservation.model_dump()
        data.update({key: value for key, value in changes.items() if key != "pc_number"})
        data["pc_id"] = pc.id
        validated = ReservationCreate(**data)
        if validated.reservation_start < local_now():
            raise HTTPException(status_code=422, detail="Reservations must start in the future")
        ensure_available(session, pc.id, validated.reservation_start, validated.reservation_end, reservation.id)
        branch = session.get(Branch, branch_id)
        cost = booking_cost(branch, validated.duration)
        users = session.exec(select(User).where(User.id.in_(sorted({reservation.user_id, validated.user_id}))).order_by(User.id).with_for_update().execution_options(populate_existing=True)).all()
        by_id = {user.id: user for user in users}
        if validated.user_id not in by_id:
            raise RecordNotFoundException("User does not exist")
        by_id[reservation.user_id].credit = round(by_id[reservation.user_id].credit + reservation.total_cost, 2)
        new_user = by_id[validated.user_id]
        if new_user.credit < cost:
            raise InsufficientCreditException(new_user.id, new_user.credit, cost)
        new_user.credit = round(new_user.credit - cost, 2)
        for key, value in validated.model_dump(exclude={"total_cost"}).items():
            setattr(reservation, key, value)
        reservation.total_cost = cost
        for user in users:
            session.add(user)
        session.add(reservation)
        session.commit()
        session.refresh(reservation)
        return reservation
    except ValidationError:
        session.rollback()
        raise HTTPException(status_code=422, detail="Reservation times and duration must be valid and consistent")
    except Exception:
        session.rollback()
        raise


def delete(session: Session, reservation_id: int) -> None:
    try:
        reservation = session.exec(
            select(Reservation).where(Reservation.id == reservation_id).with_for_update().execution_options(populate_existing=True)
        ).one()
        if reservation.reservation_start > local_now():
            user = session.exec(select(User).where(User.id == reservation.user_id).with_for_update().execution_options(populate_existing=True)).one()
            user.credit = round(user.credit + reservation.total_cost, 2)
            session.add(user)
        session.delete(reservation)
        session.commit()
    except NoResultFound:
        raise RecordNotFoundException("Reservation does not exist.")


def convert_to_serializable(obj):
    """
    Helper function to convert non-serializable objects to serializable format.
    """
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Object of type {obj.__class__.__name__} is not JSON serializable")
