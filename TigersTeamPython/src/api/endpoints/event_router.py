from typing import Dict, List

from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from src.api.dependencies import get_db
from src.infra.crud import event_crud as events_crud
from src.infra.models.event import EventCreate, EventResponse, EventUpdate
from src.infra.models.user import UserInDB, UserRole
from src.infra.security.authentication import get_current_user, has_permission

router = APIRouter(prefix="/events", tags=["Events"])

@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=EventResponse,
    operation_id="create_event",
)
def create_event(
    event: EventCreate,
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
) -> EventResponse:
    """
    Create a new event.
    """
    has_permission(UserRole.EMPLOYEE_USER, current_user)
    return events_crud.create_event(session, event)

@router.get(
    "/",
    status_code=status.HTTP_200_OK,
    response_model=List[EventResponse],
    operation_id="get_events",
)
def get_events(
    session: Session = Depends(get_db),
) -> List[EventResponse]:
    """
    Retrieve a list of events.
    """
    return events_crud.read_events(session)

@router.get(
    "/{event_id}",
    status_code=status.HTTP_200_OK,
    response_model=EventResponse,
    operation_id="get_event",
)
def get_event(
    event_id: int,
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
) -> EventResponse:
    """
    Retrieve an event by ID.
    """
    has_permission(UserRole.END_USER, current_user)
    return events_crud.read_event_by_id(session, event_id)

@router.patch(
    "/{event_id}",
    response_model=EventResponse,
    operation_id="update_event",
)
def update_event(
    event_id: int,
    event_update: EventUpdate,
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
):
    """
    Update an existing event.
    """
    has_permission(UserRole.EMPLOYEE_USER, current_user)
    return events_crud.update_event(session, event_id, event_update)

@router.delete(
    "/{event_id}",
    response_model=Dict[str, str],
    operation_id="delete_event",
)
def delete_event(
    event_id: int,
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
):
    """
    Delete an event.
    """
    has_permission(UserRole.SUPER_USER, current_user)
    events_crud.delete_event(session, event_id)
    return {"message": f"Event with ID {event_id} has been deleted."}