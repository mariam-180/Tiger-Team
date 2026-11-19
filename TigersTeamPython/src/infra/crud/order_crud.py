from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlmodel import select
from src.infra.models.commonEnums import Availability, OrderStatus
from src.infra.crud.order_item_crud import delete_order_item
from src.infra.crud.product_crud import read_product_by_id
from src.infra.db.tables import Order, OrderItem, Product, User
from src.infra.models.order import OrderCreate, OrderUpdate
from src.infra.errors import (
    InsufficientCreditException,
    InsufficientStockException,
    RecordNotFoundException,
)
from src.infra.models.user import UserInDB


def create_order(
    session: Session, order_input: OrderCreate, current_user: UserInDB
) -> Order:
    try:
        order = Order(
            user_id=current_user.id, total_amount=0, status=OrderStatus.PENDING
        )
        session.add(order)
        session.flush()

        total_amount = 0
        for item in sorted(order_input.items, key=lambda item: item.product_id):
            product: Product = session.exec(
                select(Product).where(Product.id == item.product_id).with_for_update().execution_options(populate_existing=True)
            ).one_or_none()

            if product is None or (
                product.availability == Availability.IN_STOCK
                and product.stock_quantity < item.quantity
            ):
                raise InsufficientStockException(
                    product_id=item.product_id,
                    current_stock=product.stock_quantity if product else 0,
                    requested_quantity=item.quantity,
                )

            if product.availability == Availability.IN_STOCK:
                product.stock_quantity -= item.quantity
                session.add(product)

            order_item = OrderItem(
                order_id=order.id,
                product_id=item.product_id,
                quantity=item.quantity,
                price=product.price,
            )
            order_item.product = product
            session.add(order_item)
            total_amount += item.quantity * product.price
            session.flush()

        order.total_amount = total_amount
        session.add(order)
        session.commit()
        session.refresh(order)
        return order

    except InsufficientStockException as e:
        session.rollback()
        raise e

    except Exception as e:
        session.rollback()
        from sqlalchemy.exc import OperationalError, IntegrityError
        if isinstance(e, (OperationalError, IntegrityError, HTTPException)):
            raise
        raise HTTPException(
            status_code=500, detail="An error occurred while creating the order."
        )


def read_order_by_id(session: Session, order_id: int) -> Order:
    order = session.exec(select(Order).where(Order.id == order_id)).one_or_none()
    if order is None:
        raise RecordNotFoundException(f"Order with ID {order_id} not found")
    return order


def read_all_orders(session: Session):
    return session.exec(select(Order)).all()


def update_order(session: Session, order_id: int, order_input: OrderUpdate) -> Order:
    try:
        order = session.exec(select(Order).where(Order.id == order_id).with_for_update().execution_options(populate_existing=True)).one_or_none()
        if order is None:
            raise RecordNotFoundException("Order does not exist")
        if order_input.total_amount is not None and round(order_input.total_amount, 2) != round(order.total_amount, 2):
            raise HTTPException(status_code=422, detail="Order totals are calculated from items")
        target = order_input.status or order.status
        transitions = {
            OrderStatus.PENDING: {OrderStatus.PROCESSING, OrderStatus.CANCELLED},
            OrderStatus.PROCESSING: {OrderStatus.SHIPPED, OrderStatus.CANCELLED},
            OrderStatus.SHIPPED: {OrderStatus.DELIVERED},
            OrderStatus.DELIVERED: set(),
            OrderStatus.CANCELLED: set(),
        }
        if target != order.status and target not in transitions[order.status]:
            raise HTTPException(status_code=409, detail="Invalid order status transition")
        if target == OrderStatus.CANCELLED and order.status != OrderStatus.CANCELLED:
            for item in sorted(order.items, key=lambda item: item.product_id):
                product = session.exec(select(Product).where(Product.id == item.product_id).with_for_update().execution_options(populate_existing=True)).one()
                if product.availability == Availability.IN_STOCK:
                    product.stock_quantity += item.quantity
                    session.add(product)
        order.status = target
        session.add(order)
        session.commit()
        session.refresh(order)
        return order
    except Exception:
        session.rollback()
        raise


def delete_order(session: Session, order_id: int) -> None:
    try:
        order = session.exec(select(Order).where(Order.id == order_id).with_for_update().execution_options(populate_existing=True)).one_or_none()
        if order is None:
            raise RecordNotFoundException("Order does not exist")
        if order.status in {OrderStatus.SHIPPED, OrderStatus.DELIVERED}:
            raise HTTPException(status_code=409, detail="Fulfilled orders cannot be deleted")
        for item in sorted(order.items, key=lambda item: item.product_id):
            product = session.exec(select(Product).where(Product.id == item.product_id).with_for_update().execution_options(populate_existing=True)).one()
            if order.status != OrderStatus.CANCELLED and product.availability == Availability.IN_STOCK:
                product.stock_quantity += item.quantity
                session.add(product)
            session.delete(item)
        session.flush()
        session.delete(order)
        session.commit()
    except Exception:
        session.rollback()
        raise


def read_orders_by_username(session: Session, username: str) -> list[Order]:
    user = session.exec(select(User).where(User.user_name == username)).one_or_none()

    if not user:
        raise RecordNotFoundException(f"User with username '{username}' not found")

    orders = session.exec(select(Order).where(Order.user_id == user.id)).all()

    return orders
