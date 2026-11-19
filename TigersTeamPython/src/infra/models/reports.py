from pydantic import BaseModel, Field
from typing import Any, Optional, Dict
from datetime import datetime, timezone
from src.infra.models.user import UserInfo
from src.infra.db.tables import ActionType


class ReportBase(BaseModel):
    user_id: int
    action: ActionType
    table_name: str
    record_id: int
    description: str
    details: Optional[Dict] = None


class ReportCreate(ReportBase):
    pass


class ReportUpdate(BaseModel):
    user_id: Optional[int] = None
    action: Optional[ActionType] = None
    table_name: Optional[str] = None
    record_id: Optional[int] = None
    description: Optional[str] = None
    details: Optional[Dict] = None


class ReportRead(ReportBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True


class ReportReadWithUser(BaseModel):
    id: int
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    user_id: int
    action: str
    table_name: str
    record_id: int
    description: str
    details: Optional[Dict[str, Any]]
    user: Optional[UserInfo]

    class Config:
        from_attributes = True
