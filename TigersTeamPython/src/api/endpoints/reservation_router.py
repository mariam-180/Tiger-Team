from typing import List, Optional

from fastapi import APIRouter, Depends, Header, status, HTTPException
from sqlmodel import Session

from src.api.dependencies import get_db
from src.infra.crud import reservation_crud, user_crud, branch_crud, pc_crud
from src.infra.models.reservation import (
    ReservationCreate,
    ReservationResponse,
    ReservationUpdate,
)
from src.infra.security.authentication import (
    get_current_user,
    has_permission,
    require_permission,
)
from src.infra.models.user import UserInDB, UserRole
from src.utils.reporting import ReportManager
# from src.core.socket_config import sio

router = APIRouter(prefix="/reservations", tags=["Reservations"])


@router.get(
    "/",
    response_model=List[ReservationResponse],
    status_code=status.HTTP_200_OK,
    operation_id="reservation_get_all_reservations",
)
def get_reservations(
    history: Optional[bool] = Header(False),
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
):
    """
    Retrieve reservations. If 'history' header is True, retrieve all reservations;
    otherwise, retrieve only active reservations.
    """
    has_permission(UserRole.EMPLOYEE_USER, current_user)
    if history:
        reservations = reservation_crud.read_active(session, include_history=True)
    else:
        reservations = reservation_crud.read_active(session)
    response = []
    for reservation in reservations:
        user = user_crud.read_by_id(session, reservation.user_id)
        branch = branch_crud.read_by_id(session, reservation.branch_id)
        pc = pc_crud.read_by_id(session, reservation.pc_id)
        reservation_response = ReservationResponse(
            **reservation.dict(),
            user_name=user.user_name,
            branch_name=branch.name,
            pc_number=pc.pc_number,
        )
        response.append(reservation_response)
    return response


@router.get(
    "/{reservation_id}",
    response_model=ReservationResponse,
    status_code=status.HTTP_200_OK,
    operation_id="reservation_get_reservation_by_id",
)
def get_reservation(
    reservation_id: int,
    history: Optional[bool] = Header(False),
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
):
    """
    Retrieve a reservation by ID.
    """
    has_permission(UserRole.EMPLOYEE_USER, current_user)
    if history:
        reservation = reservation_crud.read_by_id(session, reservation_id)
    else:
        reservation = reservation_crud.read_active_by_id(session, reservation_id)

    if not reservation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Reservation not found"
        )
    return reservation


@router.get(
    "/by-user/{user_name}",
    response_model=List[ReservationResponse],
    status_code=status.HTTP_200_OK,
    operation_id="reservation_get_by_user_name",
)
def get_reservations_by_user_name(
    user_name: str,
    history: Optional[bool] = Header(False),
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
):
    """
    Retrieve reservations by user name.
    """
    has_permission(UserRole.END_USER, current_user)
    if user_name != current_user.user_name:
        has_permission(UserRole.EMPLOYEE_USER, current_user)
    user = user_crud.read_by_userName(session, user_name)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    if history:
        reservations = reservation_crud.read_by_user_id(session, user.id)
    else:
        reservations = reservation_crud.read_active_by_user_id(session, user.id)

    response = []
    for reservation in reservations:
        branch = branch_crud.read_by_id(session, reservation.branch_id)
        pc = pc_crud.read_by_id(session, reservation.pc_id)
        reservation_response = ReservationResponse(
            **reservation.dict(),
            user_name=user.user_name,
            branch_name=branch.name,
            pc_number=pc.pc_number,
        )
        response.append(reservation_response)
    return response


@router.post(
    "/",
    response_model=ReservationResponse,
    status_code=status.HTTP_201_CREATED,
    operation_id="reservation_create_new_reservation",
)
async def create_reservation(
    reservation: ReservationCreate,
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
):
    """
    Create a new reservation.
    """
    reservation.user_id = current_user.id
    new_reservation = reservation_crud.create(session, reservation)
    if require_permission(UserRole.EMPLOYEE_USER, current_user):
        report_manager = ReportManager(session, current_user.id)
        report_manager.report_create_reservation(new_reservation)

    return new_reservation


@router.post(
    "/bulk",
    response_model=List[ReservationResponse],
    status_code=status.HTTP_201_CREATED,
    operation_id="reservation_create_bulk_reservation",
)
async def create_bulk_reservation(
    reservation: ReservationCreate,
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
):
    """
    Create multiple new reservations.
    """
    reservation.user_id = current_user.id
    created_reservations = reservation_crud.create_bulk(session, reservation)
    for new_reservation in created_reservations:
        if require_permission(UserRole.EMPLOYEE_USER, current_user):
            report_manager = ReportManager(session, current_user.id)
            report_manager.report_create_reservation(new_reservation)

    return created_reservations


@router.patch(
    "/{reservation_id}",
    response_model=ReservationResponse,
    status_code=status.HTTP_200_OK,
    operation_id="reservation_update_existing_reservation",
)
async def update_reservation(
    reservation_id: int,
    reservation: ReservationUpdate,
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
):
    """
    Update an existing reservation.
    """
    has_permission(UserRole.EMPLOYEE_USER, current_user)

    existing_reservation = reservation_crud.read_by_id(session, reservation_id)
    existing_reservation = ReservationResponse(**existing_reservation.dict())
    updated_reservation = reservation_crud.update(session, reservation_id, reservation)
    if require_permission(UserRole.EMPLOYEE_USER, current_user):
        report_manager = ReportManager(session, current_user.id)
        report_manager.report_update_reservation(
            reservation_id, existing_reservation, updated_reservation
        )

    # await sio.emit("update_reservation", json.loads(json.dumps(updated_reservation.dict(), default=reservation_crud.convert_to_serializable)))
    return updated_reservation


@router.delete(
    "/{reservation_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    operation_id="reservation_delete_existing_reservation",
)
async def delete_reservation(
    reservation_id: int,
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
):
    """
    Delete an existing reservation.
    """
    has_permission(UserRole.SUPER_USER, current_user)

    reservation = reservation_crud.read_by_id(session, reservation_id)
    reservation_crud.delete(session, reservation_id)
    if require_permission(UserRole.EMPLOYEE_USER, current_user):
        report_manager = ReportManager(session, current_user.id)
        report_manager.report_delete_reservation(reservation)

    # await sio.emit("delete_reservation", {"reservation_id": reservation_id})
    return {"detail": "Reservation deleted successfully"}
