import os
from typing import List, Optional
from urllib.parse import urlparse
from fastapi import File, UploadFile, HTTPException
from sqlalchemy.orm import Session
from sqlmodel import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy import or_

from src.infra.errors import DuplicateRecordException, RecordNotFoundException
from src.infra.models.product import ProductCreate, ProductUpdate
from src.infra.crud.category_crud import read_category_by_id
from src.infra.db.tables import Product, Category, OrderItem
from src.utils.upload_image import delete_image, save_image

base_url = os.getenv("BACKEND_APIs", "http://localhost:8081/static")


def create_product(
    session: Session,
    product_input: ProductCreate,
    image: Optional[UploadFile] = File(None),
) -> Product:
    category: Category = read_category_by_id(session, product_input.category_id)
    img_url = save_image(
            image=image, product_name=product_input.name, category=category.name
        )

    product_input.img_url = f"{base_url}/{img_url}" if img_url else None
    product = Product(**product_input.dict())
    session.add(product)
    try:
        session.commit()
        session.refresh(product)
    except IntegrityError as ie:
        session.rollback()
        raise DuplicateRecordException(ie.orig.args[1])
    return product


def read_product_by_id(session: Session, product_id: int) -> Product:
    product = session.exec(
        select(Product).where(Product.id == product_id)
    ).one_or_none()
    if product is None:
        raise RecordNotFoundException(f"Product with ID {product_id} not found")
    return product


def read_products_by_category(session: Session, category_name: str) -> List[Product]:
    """
    Fetches all products that belong to a specific category by its name.

    Args:
        session (Session): SQLAlchemy session object.
        category_name (str): The name of the category to filter products by.

    Returns:
        List[Product]: A list of products that belong to the specified category.
    """
    return (
        session.query(Product)
        .join(Category)
        .filter(Category.name == category_name)
        .all()
    )


def read_products_with_pagination(
    session: Session, skip: int = 0, limit: int = 10
) -> List[Product]:
    """
    Fetches a paginated list of products.

    Args:
        session (Session): SQLAlchemy session object.
        skip (int): The number of records to skip (for pagination).
        limit (int): The maximum number of records to return.

    Returns:
        List[Product]: A paginated list of products.
    """
    return session.query(Product).order_by(Product.id).offset(skip).limit(limit).all()


def search_products(session: Session, query: str) -> List[Product]:
    """
    Searches for products based on a query string.

    Args:
        session (Session): SQLAlchemy session object.
        query (str): The search query string.

    Returns:
        List[Product]: A list of products that match the search query.
    """
    search = f"%{query}%"
    return (
        session.query(Product)
        .join(Category)
        .filter(
            or_(
                Product.name.ilike(search),
                Product.description.ilike(search),
                Category.name.ilike(search),
            )
        )
        .all()
    )


def read_all_products(session: Session):
    return session.exec(select(Product)).all()


def update_product(
    session: Session,
    product_id: int,
    product_input: ProductUpdate,
    image: Optional[UploadFile] = None,
) -> Product:
    product = read_product_by_id(session, product_id)
    if not product:
        raise RecordNotFoundException(f"Product with ID {product_id} not found")

    updated_fields = False

    updated_product = {
        key: value
        for key, value in product_input.dict(exclude_unset=True).items()
        if value is not None
    }
    for key, value in updated_product.items():
        current_value = getattr(product, key)
        if current_value != value:
            setattr(product, key, value)
            updated_fields = True

    if image:
        category: Category = read_category_by_id(session, product.category_id)
        img_url = save_image(
            image=image, product_name=product.name, category=category.name
        )
        img_url = f"{base_url}/{img_url}"
        if product.img_url != img_url:
            product.img_url = img_url
            updated_fields = True

    if updated_fields:
        session.add(product)
        session.commit()
        session.refresh(product)

    return product


def delete_product(session: Session, product_id: int) -> None:
    product = read_product_by_id(session, product_id)
    if session.exec(select(OrderItem).where(OrderItem.product_id == product_id)).first():
        raise HTTPException(status_code=409, detail="Products referenced by orders cannot be deleted")
    if product.img_url:
        image_path = urlparse(product.img_url).path.lstrip("/")
        if image_path.startswith("static/"):
            image_path = image_path.removeprefix("static/")
        delete_image(image_path)

    session.delete(product)
    session.commit()
