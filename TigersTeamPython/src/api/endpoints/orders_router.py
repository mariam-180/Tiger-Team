from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from src.infra.security.authentication import get_current_user, has_permission, require_permission
from src.api.dependencies import get_db
from src.infra.crud.order_crud import (
    create_order,
    read_order_by_id,
    read_all_orders,
    read_orders_by_username,
    update_order,
    delete_order,
)
from src.infra.models.order import OrderCreate, OrderUpdate, OrderResponse
from src.infra.models.user import UserInDB, UserRole
from src.infra.errors import CustomHTTPException

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.get(
    "/",
    response_model=List[OrderResponse],
    status_code=status.HTTP_200_OK,
    operation_id="order_get_all_orders",
)
async def get_orders(
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user)
):
    if not require_permission(UserRole.EMPLOYEE_USER, current_user):
        return read_orders_by_username(session, current_user.user_name)
    return read_all_orders(session)

@router.get(
    "/{order_id}",
    response_model=OrderResponse,
    status_code=status.HTTP_200_OK,
    operation_id="order_get_order_by_id",
)
async def get_order_by_id(
    order_id: int,
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user)
):
    order = read_order_by_id(session, order_id)
    if order.user_id != current_user.id:
        has_permission(UserRole.EMPLOYEE_USER, current_user)
    if not order:
        raise CustomHTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order not found"
        )
    return order

@router.post(
    "/",
    response_model=OrderResponse,
    status_code=status.HTTP_201_CREATED,
    operation_id="order_create_new_order",
)
async def create_new_order(
    order: OrderCreate,
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user)
):
    has_permission(UserRole.END_USER, current_user)
    return create_order(session, order, current_user)

@router.get(
    "/by-username/{username}",
    response_model=List[OrderResponse],
    status_code=status.HTTP_200_OK,
    operation_id="order_get_orders_by_username",
)
async def get_orders_by_username(
    username: str,
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user)
):
    if username != current_user.user_name:
        has_permission(UserRole.EMPLOYEE_USER, current_user)
    orders = read_orders_by_username(session, username)
    return orders

@router.patch(
    "/{order_id}",
    response_model=OrderResponse,
    status_code=status.HTTP_200_OK,
    operation_id="order_update_existing_order",
)
async def update_order_by_id(
    order_id: int,
    order: OrderUpdate,
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user)
):
    has_permission(UserRole.EMPLOYEE_USER, current_user)

    updated_order = update_order(session, order_id, order)
    if not updated_order:
        raise CustomHTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order not found"
        )

    return updated_order

@router.delete(
    "/{order_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    operation_id="order_delete_existing_order",
)
async def delete_order_by_id(
    order_id: int,
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user)
):
    has_permission(UserRole.SUPER_USER, current_user)

    delete_order(session, order_id)
    return {"detail": "Order deleted successfully"}
