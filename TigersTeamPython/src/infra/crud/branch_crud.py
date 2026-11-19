from typing import List
from sqlalchemy.exc import IntegrityError, NoResultFound
from sqlmodel import Session, select
from src.infra.db.tables import Branch, PC
from src.infra.errors import DuplicateRecordException, RecordNotFoundException
from src.infra.models.branch import BranchCreate, BranchUpdate


def create(session: Session, branch_input: BranchCreate) -> Branch:
    branch = Branch(**branch_input.dict())

    try:
        session.add(branch)
        session.commit()
        session.refresh(branch)
    except IntegrityError as ie:
        raise DuplicateRecordException(ie.orig.args[1])
    return branch


def read_all(session: Session) -> List[Branch]:
    return session.exec(select(Branch)).all()


def read_by_id(session: Session, branch_id: int) -> Branch:
    try:
        branch = session.exec(select(Branch).where(Branch.id == branch_id)).one()
        return branch
    except NoResultFound:
        raise RecordNotFoundException("Branch does not exist.")


def update(session: Session, branch_id: int, branch_input: BranchUpdate) -> Branch:
    try:
        branch = session.exec(select(Branch).where(Branch.id == branch_id)).one()
    except NoResultFound:
        raise RecordNotFoundException()

    if branch_input.name is not None:
        branch.name = branch_input.name
    if branch_input.location is not None:
        branch.location = branch_input.location
    if branch_input.description is not None:
        branch.description = branch_input.description
    if branch_input.price is not None:
        branch.price = branch_input.price
    if branch_input.total_price is not None:
        branch.total_price = branch_input.total_price

    session.add(branch)
    session.commit()
    session.refresh(branch)
    return branch


def delete(session: Session, branch_id: int) -> None:
    from fastapi import HTTPException
    from src.infra.db.tables import PC
    if session.exec(select(PC).where(PC.branch_id == branch_id)).first():
        raise HTTPException(status_code=409, detail="A branch with PCs cannot be deleted")
    try:
        branch = session.exec(select(Branch).where(Branch.id == branch_id)).one()
        session.delete(branch)
        session.commit()
    except NoResultFound:
        raise RecordNotFoundException("Branch does not exist.")
