from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from src.infra.security.authentication import get_current_user, has_permission
from src.api.dependencies import get_db
from src.infra.crud.category_crud import (
    create_category,
    read_category_by_id,
    read_all_categories,
    update_category,
    delete_category,
)
from src.infra.models.category import CategoryCreate, CategoryUpdate, CategoryResponse
from src.infra.models.user import UserInDB, UserRole
from src.infra.errors import CustomHTTPException

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get(
    "/",
    response_model=List[CategoryResponse],
    status_code=status.HTTP_200_OK,
    operation_id="category_get_all_categories",
)
async def get_categories(
    session: Session = Depends(get_db),
):
    return read_all_categories(session)

@router.get(
    "/{category_id}",
    response_model=CategoryResponse,
    status_code=status.HTTP_200_OK,
    operation_id="category_get_category_by_id",
)
async def get_category_by_id(
    category_id: int,
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user)
):
    category = read_category_by_id(session, category_id)
    if not category:
        raise CustomHTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Category not found"
        )
    return category

@router.post(
    "/",
    response_model=CategoryResponse,
    status_code=status.HTTP_201_CREATED,
    operation_id="category_create_new_category",
)
async def create_new_category(
    category: CategoryCreate,
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user)
):
    has_permission(UserRole.EMPLOYEE_USER, current_user)
    return create_category(session, category)

@router.patch(
    "/{category_id}",
    response_model=CategoryResponse,
    status_code=status.HTTP_200_OK,
    operation_id="category_update_existing_category",
)
async def update_category_by_id(
    category_id: int,
    category: CategoryUpdate,
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user)
):
    has_permission(UserRole.EMPLOYEE_USER, current_user)

    updated_category = update_category(session, category_id, category)
    if not updated_category:
        raise CustomHTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Category not found"
        )

    return updated_category

@router.delete(
    "/{category_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    operation_id="category_delete_existing_category",
)
async def delete_category_by_id(
    category_id: int,
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user)
):
    has_permission(UserRole.SUPER_USER, current_user)

    delete_category(session, category_id)
    return {"detail": "Category deleted successfully"}
