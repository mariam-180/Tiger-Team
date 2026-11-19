from typing import Dict, Optional

from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from src.infra.db.tables import RegistrationStatus
from src.api.dependencies import get_db
from src.infra.crud import event_registrations_crud, event_crud
from src.infra.models.user import UserInDB, UserRole
from src.infra.security.authentication import get_current_user, has_permission
from src.infra.models.event_registrations import (
    RegistrationCreate,
    RegistrationResponse,
    RegistrationUpdate,
    EventRegistrationsResponse,
)

router = APIRouter(prefix="/event_registrations", tags=["Event registers"])


@router.get(
    "/",
    status_code=status.HTTP_200_OK,
    response_model=EventRegistrationsResponse,
    operation_id="event_get_event_registrations",
)
def event_get_users(
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
    event_name: Optional[str] = None,
) -> Dict[str, any]:
    """
    Retrieve event registrations along with counts of different statuses.
    """
    has_permission(UserRole.EMPLOYEE_USER, current_user)
    users = event_registrations_crud.read(session, event_name)

    total_count = len(users)
    total_unpaid = sum(
        1 for user in users if user.status == RegistrationStatus.REGISTERED
    )
    total_paid = sum(1 for user in users if user.status == RegistrationStatus.CONFIRMED)
    total_cancelled = sum(
        1 for user in users if user.status == RegistrationStatus.CANCELLED
    )

    return EventRegistrationsResponse(
        users=users,
        total_count=total_count,
        total_unpaid=total_unpaid,
        total_paid=total_paid,
        total_cancelled=total_cancelled,
    )


@router.get(
    "/by_email/{email}",
    status_code=status.HTTP_200_OK,
    response_model=Optional[RegistrationResponse],
    operation_id="get_event_registrations_by_email",
)
def get_reservations_by_email(
    email: str,
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
) -> Optional[RegistrationResponse]:
    """
    Retrieve event registrations by user email.
    """
    has_permission(UserRole.END_USER, current_user)
    if email.lower() != current_user.email.lower():
        has_permission(UserRole.EMPLOYEE_USER, current_user)
    user = event_registrations_crud.read_by_email(session, email)
    return user


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=RegistrationResponse,
    responses={
        status.HTTP_409_CONFLICT: {
            "description": "Email or phone number already exists."
        }
    },
    operation_id="event_create_event_registration",
)
def event_create_user(
    user: RegistrationCreate, session: Session = Depends(get_db)
) -> RegistrationResponse:
    """
    Create new user.
    """
    from fastapi import HTTPException
    event = event_crud.read_events(session, is_active=True)
    if not event:
        raise HTTPException(status_code=409, detail="There is no active event accepting registrations")
    user.event_id = event[0].id
    user.status = "REGISTERED"
    return event_registrations_crud.create(session, user)


@router.patch(
    "/{user_id}",
    response_model=RegistrationResponse,
    operation_id="event_update_event_registration",
)
def event_update_user(
    user_id: int,
    user_input: RegistrationUpdate,
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
):
    """
    Update existing user.
    """
    has_permission(UserRole.EMPLOYEE_USER, current_user)
    return event_registrations_crud.update(session, user_id, user_input)


@router.delete(
    "/{user_id}",
    response_model=RegistrationResponse,
    operation_id="event_delete_event_registration",
)
def event_delete_user(
    user_id: int,
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
):
    """
    Delete existing user.
    """
    has_permission(UserRole.SUPER_USER, current_user)
    return event_registrations_crud.delete(session, user_id)
