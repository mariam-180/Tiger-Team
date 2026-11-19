from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List

from src.infra.models.user import UserInDB, UserRole
from src.infra.security.authentication import get_current_user, has_permission
from src.api.dependencies import get_db
from src.infra.crud import controller_crud
from src.infra.models.controller import (
    ControllerCreate,
    ControllerUpdate,
    ControllerResponse,
)

router = APIRouter(prefix="/controllers", tags=["Controllers"])


@router.post(
    "/", response_model=ControllerResponse, status_code=status.HTTP_201_CREATED
)
async def create_new_controller(
    controller: ControllerCreate,
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
):
    has_permission(UserRole.SUPER_USER, current_user)
    return controller_crud.create_controller(session, controller)


@router.get("/", response_model=List[ControllerResponse])
async def get_controllers(
    session: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
):
    return controller_crud.get_all_controllers(session, skip=skip, limit=limit)


@router.get("/{controller_id}", response_model=ControllerResponse)
async def get_controller_by_id(
    controller_id: int,
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
):
    has_permission(UserRole.EMPLOYEE_USER, current_user)
    controller = controller_crud.get_controller_by_id(session, controller_id)
    if not controller:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Controller not found"
        )
    return controller


@router.patch("/{controller_id}", response_model=ControllerResponse)
async def update_controller_by_id(
    controller_id: int,
    controller: ControllerUpdate,
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
):
    has_permission(UserRole.SUPER_USER, current_user)
    updated_controller = controller_crud.update_controller(
        session, controller_id, controller
    )
    if not updated_controller:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Controller not found"
        )
    return updated_controller


@router.delete("/{controller_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_controller_by_id(
    controller_id: int,
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
):
    has_permission(UserRole.SUPER_USER, current_user)
    controller_crud.delete_controller(session, controller_id)
    return {"detail": "Controller deleted successfully"}
