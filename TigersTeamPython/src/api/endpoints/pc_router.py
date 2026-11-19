from src.core.config import settings
from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, status, HTTPException, Query
from sqlmodel import Session

from src.api.dependencies import get_db
from src.infra.crud import pc_crud
from src.infra.models.pc import PCCreate, PCResponse, PCUpdate
from src.infra.security.authentication import get_current_user, has_permission
from src.infra.models.user import UserInDB, UserRole
from src.infra.errors import RecordNotFoundException

router = APIRouter(prefix="/pcs", tags=["PCs"])

@router.get("/", response_model=List[PCResponse], status_code=status.HTTP_200_OK, operation_id="pc_get_all_pcs")
def get_pcs(session: Session = Depends(get_db)):
    """
    Retrieve all PCs.
    """
    return pc_crud.read_all(session)

@router.get("/availability", response_model=List[PCResponse], status_code=status.HTTP_200_OK)
def get_available_pcs(
    branch_name: str,
    start: str = Query(...),
    end: str = Query(...),
    session: Session = Depends(get_db)
):
    """
    Retrieve available PCs for a specific branch within a specified time range.
    """
    try:
        start_time_dt = datetime.fromisoformat(start.replace("Z", "+00:00"))
        end_time_dt = datetime.fromisoformat(end.replace("Z", "+00:00"))
        from zoneinfo import ZoneInfo
        if start_time_dt.tzinfo is not None:
            start_time_dt = start_time_dt.astimezone(ZoneInfo(settings.BUSINESS_TIMEZONE)).replace(tzinfo=None)
        if end_time_dt.tzinfo is not None:
            end_time_dt = end_time_dt.astimezone(ZoneInfo(settings.BUSINESS_TIMEZONE)).replace(tzinfo=None)
        if end_time_dt <= start_time_dt:
            raise ValueError("End must be after start")
        
        pcs = pc_crud.read_pcs_by_branch_and_availability(session, branch_name, start_time_dt, end_time_dt)
        return pcs
    except RecordNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid datetime format: {e}")

@router.get("/{pc_id}", response_model=PCResponse, status_code=status.HTTP_200_OK, operation_id="pc_get_pc_by_id")
def get_pc(pc_id: int, session: Session = Depends(get_db)):
    """
    Retrieve a PC by ID.
    """
    pc = pc_crud.read_by_id(session, pc_id)
    if not pc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="PC not found")
    return pc

@router.post("/", response_model=PCResponse, status_code=status.HTTP_201_CREATED, operation_id="pc_create_new_pc")
def create_pc(pc: PCCreate, session: Session = Depends(get_db), current_user: UserInDB = Depends(get_current_user)):
    """
    Create a new PC.
    """
    has_permission(UserRole.SUPER_USER, current_user)
    return pc_crud.create(session, pc)

@router.patch("/{pc_id}", response_model=PCResponse, status_code=status.HTTP_200_OK, operation_id="pc_update_existing_pc")
def update_pc(pc_id: int, pc: PCUpdate, session: Session = Depends(get_db), current_user: UserInDB = Depends(get_current_user)):
    """
    Update an existing PC.
    """
    has_permission(UserRole.SUPER_USER, current_user)
    return pc_crud.update(session, pc_id, pc)

@router.delete("/{pc_id}", status_code=status.HTTP_204_NO_CONTENT, operation_id="pc_delete_existing_pc")
def delete_pc(pc_id: int, session: Session = Depends(get_db), current_user: UserInDB = Depends(get_current_user)):
    """
    Delete an existing PC.
    """
    has_permission(UserRole.SUPER_USER, current_user)
    pc_crud.delete(session, pc_id)
    return {"detail": "PC deleted successfully"}
