from datetime import datetime
from enum import Enum

from sqlalchemy.orm import Session
from src.infra.models.reports import ReportCreate
from src.infra.crud.reports_crud import create_report
from src.utils.privacy import redact, SENSITIVE


class ReportManager:
    def __init__(self, session: Session, user_id: int):
        self.session = session
        self.user_id = user_id

    def convert_details(self, details):
        if not details:
            return None

        def convert_value(value):
            if isinstance(value, datetime):
                return value.isoformat()
            elif isinstance(value, Enum):
                return value.name
            elif isinstance(value, dict):
                return {k: convert_value(v) for k, v in value.items()}
            elif isinstance(value, list):
                return [convert_value(i) for i in value]
            else:
                return value

        return redact({key: convert_value(value) for key, value in details.items()})

    def log_activity(
        self,
        action: str,
        table_name: str,
        record_id: int,
        description: str,
        details: dict = None,
    ):
        converted_details = self.convert_details(details)

        report_data = ReportCreate(
            user_id=self.user_id,
            action=action,
            table_name=table_name,
            record_id=record_id,
            description=description,
            details=converted_details,
        )
        create_report(self.session, report_data)

    def report_create_reservation(self, new_reservation):
        description = "Created a new reservation"
        details = new_reservation.dict()
        self.log_activity(
            "CREATE", "reservations", new_reservation.id, description, details=details
        )

    def report_update_reservation(
        self, reservation_id: int, existing_reservation, updated_reservation
    ):
        changes = {}
        for field, value in updated_reservation.dict(exclude_unset=True).items():
            old_value = getattr(existing_reservation, field)
            if old_value != value:
                if field == "total_cost":
                    old_value = float(old_value)
                    value = float(value)
                    change_amount = value - old_value
                    change_type = "added" if change_amount > 0 else "removed"
                    changes[field] = {
                        "old": old_value,
                        "new": value,
                        "change": change_type,
                        "change_amount": abs(change_amount),
                    }
                else:
                    changes[field] = {"old": old_value, "new": value}

        description = "Updated an existing reservation"
        self.log_activity(
            "UPDATE", "reservations", reservation_id, description, details=changes
        )

    def report_delete_reservation(self, reservation):
        description = "Deleted an existing reservation"
        details = reservation.dict()
        self.log_activity(
            "DELETE", "reservations", reservation.id, description, details=details
        )

    def report_update_user(self, user_id: int, existing_user, updated_user):
        changes = {}
        for field, value in updated_user.dict(exclude_unset=True).items():
            if field.lower() in SENSITIVE:
                continue
            old_value = getattr(existing_user, field, None)
            if old_value != value:
                if field == "credit":
                    old_value = float(old_value)
                    value = float(value)
                    change_amount = value - old_value
                    change_type = "added" if change_amount > 0 else "removed"
                    changes[field] = {
                        "old": old_value,
                        "new": value,
                        "change": change_type,
                        "change_amount": abs(change_amount),
                    }
                else:
                    changes[field] = {"old": old_value, "new": value}

        description = "Updated an existing user"
        self.log_activity("UPDATE", "users", user_id, description, details=changes)

    def report_delete_user(self, user):
        description = "Deleted an existing user"
        details = user.dict()
        self.log_activity("DELETE", "users", user.id, description, details=details)
