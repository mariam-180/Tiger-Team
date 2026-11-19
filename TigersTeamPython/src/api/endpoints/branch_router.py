from typing import Any, Dict, List

from fastapi import APIRouter, Depends, status, HTTPException
from sqlmodel import Session

from src.api.dependencies import get_db
from src.infra.crud import branch_crud
from src.infra.models.branch import BranchCreate, BranchResponse, BranchUpdate
from src.infra.security.authentication import get_current_user, has_permission
from src.infra.models.user import UserInDB, UserRole

router = APIRouter(prefix="/branches", tags=["Branches"])

@router.get("/", response_model=List[BranchResponse], status_code=status.HTTP_200_OK, operation_id="branch_get_all_branches")
def get_branches(session: Session = Depends(get_db)):
    """
    Retrieve all branches.
    """
    return branch_crud.read_all(session)

@router.get("/{branch_id}", response_model=BranchResponse, status_code=status.HTTP_200_OK, operation_id="branch_get_branch_by_id")
def get_branch(branch_id: int, session: Session = Depends(get_db), current_user: UserInDB = Depends(get_current_user)):
    """
    Retrieve a branch by ID.
    """
    branch = branch_crud.read_by_id(session, branch_id)
    if not branch:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Branch not found")
    return branch

@router.post("/", response_model=BranchResponse, status_code=status.HTTP_201_CREATED, operation_id="branch_create_new_branch")
def create_branch(branch: BranchCreate, session: Session = Depends(get_db), current_user: UserInDB = Depends(get_current_user)):
    """
    Create a new branch.
    """
    has_permission(UserRole.SUPER_USER, current_user)
    return branch_crud.create(session, branch)

@router.patch("/{branch_id}", response_model=BranchResponse, status_code=status.HTTP_200_OK, operation_id="branch_update_existing_branch")
def update_branch(branch_id: int, branch: BranchUpdate, session: Session = Depends(get_db), current_user: UserInDB = Depends(get_current_user)):
    """
    Update an existing branch.
    """
    has_permission(UserRole.SUPER_USER, current_user)
    return branch_crud.update(session, branch_id, branch)

@router.delete("/{branch_id}", status_code=status.HTTP_204_NO_CONTENT, operation_id="branch_delete_existing_branch")
def delete_branch(branch_id: int, session: Session = Depends(get_db), current_user: UserInDB = Depends(get_current_user)):
    """
    Delete an existing branch.
    """
    has_permission(UserRole.SUPER_USER, current_user)
    branch_crud.delete(session, branch_id)
    return {"detail": "Branch deleted successfully"}
