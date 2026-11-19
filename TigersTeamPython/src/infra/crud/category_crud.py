from sqlalchemy.orm import Session
from sqlmodel import select
from src.infra.db.tables import Category
from sqlalchemy.exc import IntegrityError

from src.infra.models.category import CategoryCreate, CategoryUpdate
from src.infra.errors import DuplicateRecordException, RecordNotFoundException


def create_category(session: Session, category_input: CategoryCreate) -> Category:
    category = Category(**category_input.dict())
    session.add(category)
    try:
        session.commit()
        session.refresh(category)
    except IntegrityError as ie:
        session.rollback()
        raise DuplicateRecordException(ie.orig.args[1])
    return category


def read_category_by_id(session: Session, category_id: int) -> Category:
    category = session.exec(select(Category).where(Category.id == category_id)).one_or_none()
    if category is None:
        raise RecordNotFoundException(f"Category with ID {category_id} not found")
    return category


def read_all_categories(session: Session):
    return session.exec(select(Category)).all()


def update_category(session: Session, category_id: int, category_input: CategoryUpdate) -> Category:
    category = read_category_by_id(session, category_id)
    for key, value in category_input.dict(exclude_unset=True).items():
        setattr(category, key, value)
    session.add(category)
    session.commit()
    session.refresh(category)
    return category


def delete_category(session: Session, category_id: int) -> None:
    from fastapi import HTTPException
    from src.infra.db.tables import Product
    if session.exec(select(Product).where(Product.category_id == category_id)).first():
        raise HTTPException(status_code=409, detail="Move or delete products before deleting this category")
    category = read_category_by_id(session, category_id)
    session.delete(category)
    session.commit()
