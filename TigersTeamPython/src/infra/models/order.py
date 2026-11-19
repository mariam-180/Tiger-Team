from datetime import datetime
from typing import List, Annotated, Optional
from pydantic import BaseModel, BeforeValidator, ConfigDict, Field, validator
from src.infra.models.commonEnums import OrderStatus
from src.infra.models.user import UserInfo
from src.infra.models.order_item import OrderItemResponse, OrderItemCreate


def fill_id_with_zeroes(v: int) -> str:
    stringified_value = str(v)
    return stringified_value.zfill(6)

ZeroFilledId = Annotated[str, BeforeValidator(fill_id_with_zeroes)]

class OrderBase(BaseModel):
    status: OrderStatus = Field(OrderStatus.PENDING)

class OrderCreate(OrderBase):
    items: List[OrderItemCreate] = Field(..., min_length=1)

class OrderUpdate(BaseModel):
    total_amount: Optional[float] = Field(None, ge=0, allow_inf_nan=False)
    status: Optional[OrderStatus] = Field(None)
    items: Optional[List[OrderItemResponse]] = Field(None)


class OrderResponse(OrderBase):
    model_config = ConfigDict(from_attributes=True)

    id: ZeroFilledId
    user: UserInfo
    total_amount: float
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse] = Field(...)

class OrderInDB(OrderBase):
    id: str
    user_id: int
    total_amount: float
    created_at: datetime
    updated_at: datetime
