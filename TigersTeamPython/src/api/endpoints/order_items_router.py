from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from src.infra.security.authentication import get_current_user, has_permission
from src.api.dependencies import get_db
from src.infra.crud.order_item_crud import (
    create_order_item,
    read_order_item_by_id,
    read_all_order_items,
    update_order_item,
    delete_order_item,
)
from src.infra.models.order_item import OrderItemCreate, OrderItemUpdate, OrderItemResponse
from src.infra.models.user import UserInDB, UserRole
from src.infra.errors import CustomHTTPException

def require_item_access(current_user: UserInDB = Depends(get_current_user)):
    has_permission(UserRole.EMPLOYEE_USER, current_user)


router = APIRouter(prefix="/order-items", tags=["OrderItems"], dependencies=[Depends(require_item_access)])

@router.get(
    "/",
    response_model=List[OrderItemResponse],
    status_code=status.HTTP_200_OK,
    operation_id="order_item_get_all_order_items",
)
async def get_order_items(
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user)
):
    return read_all_order_items(session)

@router.get(
    "/{order_item_id}",
    response_model=OrderItemResponse,
    status_code=status.HTTP_200_OK,
    operation_id="order_item_get_order_item_by_id",
)
async def get_order_item_by_id(
    order_item_id: int,
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user)
):
    order_item = read_order_item_by_id(session, order_item_id)
    if not order_item:
        raise CustomHTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order item not found"
        )
    return order_item

@router.post(
    "/",
    response_model=OrderItemResponse,
    status_code=status.HTTP_201_CREATED,
    operation_id="order_item_create_new_order_item",
)
async def create_new_order_item(
    order_item: OrderItemCreate,
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user)
):
    has_permission(UserRole.END_USER, current_user)
    return create_order_item(session, order_item)

@router.patch(
    "/{order_item_id}",
    response_model=OrderItemResponse,
    status_code=status.HTTP_200_OK,
    operation_id="order_item_update_existing_order_item",
)
async def update_order_item_by_id(
    order_item_id: int,
    order_item: OrderItemUpdate,
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user)
):
    has_permission(UserRole.EMPLOYEE_USER, current_user)

    updated_order_item = update_order_item(session, order_item_id, order_item)
    if not updated_order_item:
        raise CustomHTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order item not found"
        )

    return updated_order_item

@router.delete(
    "/{order_item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    operation_id="order_item_delete_existing_order_item",
)
async def delete_order_item_by_id(
    order_item_id: int,
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user)
):
    has_permission(UserRole.SUPER_USER, current_user)

    delete_order_item(session, order_item_id)
    return {"detail": "Order item deleted successfully"}
