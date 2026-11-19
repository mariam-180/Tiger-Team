from datetime import datetime
from typing import Annotated, Optional

from pydantic import BaseModel, BeforeValidator, ConfigDict, EmailStr, Field, field_validator

from src.infra.db.tables import UserRole


class UserBase(BaseModel):
    first_name: str = Field(...)
    last_name: str = Field("None")

    email: EmailStr = Field(...)
    phone_number: str = Field(...)

    user_name: str = Field(...)
    password: str = Field(...)

    credit: float = Field(0)

    role: UserRole = Field(default=UserRole.END_USER)
    is_verified: bool = Field(default=False)
    verification_token: Optional[str] = Field(default=None)
    reset_token: Optional[str] = Field(default=None)
    reset_token_expiry: Optional[datetime] = Field(default=None)


class UserCreate(BaseModel):
    first_name: str = Field(..., min_length=1)
    last_name: str = ""
    email: EmailStr
    phone_number: str = Field(..., min_length=1)
    user_name: str = Field(..., min_length=1)
    password: str = Field(..., min_length=8, max_length=72)

    @field_validator("password")
    @classmethod
    def password_bytes(cls, value):
        if len(value.encode("utf-8")) > 72:
            raise ValueError("Password must be at most 72 UTF-8 bytes")
        return value


class UserUpdate(BaseModel):
    first_name: Optional[str] = Field(default=None)
    last_name: Optional[str] = Field(default=None)
    email: Optional[EmailStr] = Field(default=None)
    phone_number: Optional[str] = Field(default=None)
    user_name: Optional[str] = Field(default=None)
    credit: Optional[float] = Field(default=None, ge=0, allow_inf_nan=False)
    role: Optional[UserRole] = Field(default=None)
    is_verified: Optional[bool] = Field(default=None)


def fill_id_with_zeroes(v: int) -> str:
    stringified_value = str(v)
    return stringified_value.zfill(6)

ZeroFilledId = Annotated[str, BeforeValidator(fill_id_with_zeroes)]

class UserInDB(UserBase):
    id: str
    created_at: datetime


class UserResponseV2(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: ZeroFilledId
    created_at: datetime
    first_name: str = Field(...)
    last_name: str = Field("None")

    email: EmailStr = Field(...)
    phone_number: str = Field(...)

    user_name: str = Field(...)

    credit: float = Field(0)

    role: UserRole = Field(default=UserRole.END_USER)
    is_verified: Optional[bool] = Field(default=None)


class UserInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: ZeroFilledId
    created_at: datetime
    first_name: str = Field(...)
    last_name: str = Field("None")

    email: EmailStr = Field(...)
    phone_number: str = Field(...)


UserResponse = UserResponseV2
