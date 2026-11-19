from src.core.config import settings
from datetime import datetime
from typing import List, Optional, Union
from pydantic import BaseModel, Field, model_validator

class ReservationBase(BaseModel):
    branch_id: int = Field(...)
    pc_id: Union[int, List[int]] = Field(...)
    user_id: Optional[int] = Field(None)
    reservation_start: datetime = Field(...)
    reservation_end: datetime = Field(...)
    duration: int = Field(..., gt=0)
    total_cost: float = Field(..., ge=0, allow_inf_nan=False)

    @model_validator(mode="after")
    def validate_booking(self):
        from zoneinfo import ZoneInfo
        for field in ("reservation_start", "reservation_end"):
            value = getattr(self, field)
            if value.tzinfo is not None:
                setattr(self, field, value.astimezone(ZoneInfo(settings.BUSINESS_TIMEZONE)).replace(tzinfo=None))
        if self.reservation_end <= self.reservation_start:
            raise ValueError("Reservation end must be after the start")
        if (self.reservation_end - self.reservation_start).total_seconds() != self.duration * 60:
            raise ValueError("Duration must match the reservation times")
        ids = self.pc_id if isinstance(self.pc_id, list) else [self.pc_id]
        if not ids or any(value <= 0 for value in ids) or len(ids) != len(set(ids)):
            raise ValueError("Select at least one unique PC")
        return self

class ReservationCreate(ReservationBase):
    pass

class ReservationUpdate(BaseModel):
    branch_id: Optional[int] = Field(None)
    pc_id: Optional[int] = Field(None)
    pc_number: Optional[str] = Field(None)
    user_id: Optional[int] = Field(None)
    reservation_start: Optional[datetime] = Field(None)
    reservation_end: Optional[datetime] = Field(None)
    duration: Optional[int] = Field(None, gt=0)
    total_cost: Optional[float] = Field(None, ge=0, allow_inf_nan=False)

class ReservationResponse(ReservationBase):
    id: int
    created_at: datetime
    updated_at: datetime
    user_name: Optional[str] = Field(None)
    branch_name: Optional[str] = Field(None)
    pc_number: Optional[str] = Field(None)

class ReservationInDB(ReservationBase):
    id: int
    created_at: datetime
    updated_at: datetime
