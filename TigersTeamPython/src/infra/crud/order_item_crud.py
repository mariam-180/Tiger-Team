from sqlalchemy.orm import Session
from sqlmodel import select
from fastapi import HTTPException
from src.infra.db.tables import OrderItem, Order, Product
from src.infra.models.commonEnums import Availability, OrderStatus
from src.infra.models.order_item import OrderItemCreate, OrderItemUpdate
from src.infra.errors import RecordNotFoundException


def create_order_item(session: Session, order_item_input: OrderItemCreate) -> OrderItem:
    try:
        if order_item_input.order_id is None:
            raise HTTPException(status_code=422, detail="order_id is required")
        order = editable_order(session, order_item_input.order_id)
        product = locked_product(session, order_item_input.product_id)
        change_stock(product, -order_item_input.quantity)
        order_item = OrderItem(order_id=order.id, product_id=product.id,
                               quantity=order_item_input.quantity, price=product.price)
        order.total_amount = round(order.total_amount + order_item.quantity * order_item.price, 2)
        session.add(product)
        session.add(order)
        session.add(order_item)
        session.commit()
        session.refresh(order_item)
        return order_item
    except Exception:
        session.rollback()
        raise


def editable_order(session, order_id):
    order = session.exec(select(Order).where(Order.id == order_id).with_for_update().execution_options(populate_existing=True)).one_or_none()
    if order is None:
        raise RecordNotFoundException("Order does not exist")
    if order.status not in {OrderStatus.PENDING, OrderStatus.PROCESSING}:
        raise HTTPException(status_code=409, detail="This order can no longer be edited")
    return order


def locked_product(session, product_id):
    product = session.exec(select(Product).where(Product.id == product_id).with_for_update().execution_options(populate_existing=True)).one_or_none()
    if product is None:
        raise RecordNotFoundException("Product does not exist")
    return product


def change_stock(product, delta):
    if product.availability == Availability.IN_STOCK:
        if product.stock_quantity + delta < 0:
            raise HTTPException(status_code=409, detail="Insufficient product stock")
        product.stock_quantity += delta


def read_order_item_by_id(session: Session, order_item_id: int) -> OrderItem:
    order_item = session.exec(select(OrderItem).where(OrderItem.id == order_item_id)).one_or_none()
    if order_item is None:
        raise RecordNotFoundException(f"OrderItem with ID {order_item_id} not found")
    return order_item


def read_all_order_items(session: Session):
    return session.exec(select(OrderItem)).all()


def update_order_item(session: Session, order_item_id: int, order_item_input: OrderItemUpdate) -> OrderItem:
    try:
        item = read_order_item_by_id(session, order_item_id)
        order = editable_order(session, item.order_id)
        session.refresh(item, with_for_update=True)
        if order_item_input.order_id not in (None, item.order_id):
            raise HTTPException(status_code=422, detail="Items cannot be moved to another order")
        if order_item_input.product_id not in (None, item.product_id):
            raise HTTPException(status_code=422, detail="Delete and add a new item to change the product")
        if order_item_input.price is not None and order_item_input.price != item.price:
            raise HTTPException(status_code=422, detail="Item prices are set by the server")
        quantity = order_item_input.quantity or item.quantity
        product = locked_product(session, item.product_id)
        change_stock(product, item.quantity - quantity)
        order.total_amount = round(order.total_amount + (quantity - item.quantity) * item.price, 2)
        item.quantity = quantity
        session.add(product)
        session.add(order)
        session.add(item)
        session.commit()
        session.refresh(item)
        return item
    except Exception:
        session.rollback()
        raise


def delete_order_item(session: Session, order_item_id: int) -> None:
    try:
        item = read_order_item_by_id(session, order_item_id)
        order = editable_order(session, item.order_id)
        session.refresh(item, with_for_update=True)
        if len(order.items) <= 1:
            raise HTTPException(status_code=409, detail="Cancel the order instead of removing its last item")
        product = locked_product(session, item.product_id)
        change_stock(product, item.quantity)
        order.total_amount = round(order.total_amount - item.quantity * item.price, 2)
        session.add(product)
        session.add(order)
        session.delete(item)
        session.commit()
    except Exception:
        session.rollback()
        raise
