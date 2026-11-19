from fastapi import APIRouter, Depends, Query
from typing import List, Optional
from datetime import datetime

from sqlmodel import Session
from src.infra.models.user import UserInDB
from src.infra.security.authentication import get_current_user, has_permission
from src.infra.crud import user_crud, reservation_crud
from src.api.dependencies import get_db as get_session
from src.infra.db.tables import ActionType, UserRole
from src.infra.errors import RecordNotFoundException
from src.infra.models.reports import (
    ReportCreate,
    ReportRead,
    ReportUpdate,
    ReportReadWithUser,
)
from src.infra.crud.reports_crud import (
    create_report,
    read_reports,
    read_report_by_id,
    update_report,
    delete_report,
)

def require_report_access(current_user: UserInDB = Depends(get_current_user)):
    has_permission(UserRole.SUPER_USER, current_user)
    return current_user


router = APIRouter(prefix="/reports", tags=["Reports"], dependencies=[Depends(require_report_access)])


@router.post("/", response_model=ReportRead)
def create(report_input: ReportCreate, session: Session = Depends(get_session)):
    return create_report(session, report_input)


@router.get("/", response_model=List[ReportReadWithUser])
def get_reports(
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    action: Optional[ActionType] = Query(None),
    table_name: Optional[str] = Query(None),
    user_id: Optional[int] = Query(None),
    session: Session = Depends(get_session),
    current_user: UserInDB = Depends(get_current_user),
):
    has_permission(UserRole.SUPER_USER, current_user)

    reports = read_reports(
        session=session,
        start_date=start_date,
        end_date=end_date,
        action=action,
        table_name=table_name,
        user_id=user_id,
    )

    reports_with_user = []
    for report in reports:
        try:
            user = user_crud.read_by_id(session, report.user_id)
        except RecordNotFoundException:
            user = None
        additional_details = {}

        if report.table_name == "users":
            record = user_crud.report_read_by_id(session, report.record_id)
            additional_details = {"user": record}
        elif report.table_name == "reservations":
            record = reservation_crud.report_read_by_id(session, report.record_id)
            additional_details = {"reservation": record}

        report_dict = {
            "id": report.id,
            "timestamp": report.timestamp,
            "user_id": report.user_id,
            "action": report.action.value,
            "table_name": report.table_name,
            "record_id": report.record_id,
            "description": report.description,
            "details": {**(report.details or {}), **additional_details},
        }

        report_with_user = ReportReadWithUser(**report_dict, user=user)
        reports_with_user.append(report_with_user)

    return reports_with_user


@router.get("/{report_id}", response_model=ReportRead)
def get_report(report_id: int, session: Session = Depends(get_session)):
    return read_report_by_id(session, report_id)


@router.put("/{report_id}", response_model=ReportRead)
def update(
    report_id: int, report_input: ReportUpdate, session: Session = Depends(get_session)
):
    return update_report(session, report_id, report_input)


@router.delete("/{report_id}")
def delete(report_id: int, session: Session = Depends(get_session)):
    delete_report(session, report_id)
    return {"message": "Report deleted successfully"}
