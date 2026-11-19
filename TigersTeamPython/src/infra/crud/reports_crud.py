from typing import List, Optional
from datetime import datetime
from sqlalchemy.exc import NoResultFound, IntegrityError
from sqlmodel import Session, select
from src.infra.db.tables import Reports, ActionType
from src.infra.errors import RecordNotFoundException, DuplicateRecordException
from src.infra.models.reports import ReportCreate, ReportUpdate


def create_report(session: Session, report_input: ReportCreate) -> Reports:
    try:
        report = Reports(**report_input.model_dump())

        session.add(report)
        session.commit()
        session.refresh(report)
        return report
    except IntegrityError:
        session.rollback()
        raise DuplicateRecordException("A similar report already exists.")


def read_reports(
    session: Session,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    action: Optional[ActionType] = None,
    table_name: Optional[str] = None,
    user_id: Optional[int] = None,
) -> List[Reports]:
    try:

        def timestamp_to_datetime(timestamp: Optional[int]) -> Optional[datetime]:
            if timestamp and isinstance(timestamp, int):
                return datetime.fromtimestamp(timestamp / 1000)
            return timestamp

        start_date = timestamp_to_datetime(start_date)
        end_date = timestamp_to_datetime(end_date)

        query = select(Reports)
        if start_date:
            query = query.where(Reports.timestamp >= start_date)
        if end_date:
            query = query.where(Reports.timestamp <= end_date)
        if action:
            query = query.where(Reports.action == action)
        if table_name:
            query = query.where(Reports.table_name == table_name)
        if user_id:
            query = query.where(Reports.user_id == user_id)

        return session.exec(query).all()
    except NoResultFound:
        raise RecordNotFoundException("No reports found for the given criteria.")


def read_report_by_id(session: Session, report_id: int) -> Reports:
    try:
        report = session.exec(select(Reports).where(Reports.id == report_id)).one()
        return report
    except NoResultFound:
        raise RecordNotFoundException("Report does not exist.")


def update_report(
    session: Session, report_id: int, report_input: ReportUpdate
) -> Reports:
    try:
        report = session.exec(select(Reports).where(Reports.id == report_id)).one()
        for field, value in report_input.dict(exclude_unset=True).items():
            setattr(report, field, value)

        session.add(report)
        session.commit()
        session.refresh(report)
        return report
    except NoResultFound:
        raise RecordNotFoundException("Report does not exist.")
    except IntegrityError:
        session.rollback()
        raise DuplicateRecordException("A similar report already exists.")


def delete_report(session: Session, report_id: int) -> None:
    try:
        report = session.exec(select(Reports).where(Reports.id == report_id)).one()
        session.delete(report)
        session.commit()
    except NoResultFound:
        raise RecordNotFoundException("Report does not exist.")
