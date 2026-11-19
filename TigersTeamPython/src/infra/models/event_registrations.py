from datetime import datetime, timezone
from typing import List, Optional, Annotated

from pydantic import BaseModel, BeforeValidator, EmailStr, Field


class RegistrationBase(BaseModel):
    first_name: str = Field(..., max_length=100)
    last_name: str = Field(default=None, max_length=100)
    email: EmailStr = Field(...)
    phone_number: str = Field(..., max_length=15)


class RegistrationCreate(RegistrationBase):
    status: str = Field(
        default="REGISTERED", pattern="^(REGISTERED|CONFIRMED|CANCELLED)$"
    )
    event_id: Optional[int] = Field(None)


class RegistrationUpdate(BaseModel):
    status: Optional[str] = Field(None, pattern="^(REGISTERED|CONFIRMED|CANCELLED)$")
    event_id: Optional[int] = Field(None)


def fill_id_with_zeroes(v: int) -> str:
    stringified_value = str(v)
    return stringified_value.zfill(6)


ZeroFilledId = Annotated[str, BeforeValidator(fill_id_with_zeroes)]


class RegistrationResponse(RegistrationBase):
    id: ZeroFilledId
    status: str = Field(...)
    event_id: int = Field(...)
    registration_time: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    class Config:
        from_attributes = True


class EventRegistrationsResponse(BaseModel):
    users: List[RegistrationResponse]
    total_count: int
    total_unpaid: int
    total_paid: int
    total_cancelled: int

    class Config:
        from_attributes = True
