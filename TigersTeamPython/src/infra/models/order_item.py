from datetime import datetime
from typing import Annotated, List, Optional
from pydantic import BaseModel, BeforeValidator, ConfigDict, Field
from src.infra.models.product import ProductResponse

def fill_id_with_zeroes(v: int) -> str:
    stringified_value = str(v)
    return stringified_value.zfill(6)

ZeroFilledId = Annotated[str, BeforeValidator(fill_id_with_zeroes)]

class OrderItemBase(BaseModel):
    product_id: int = Field(...)
    quantity: int = Field(..., gt=0)
    price: float = Field(..., ge=0, allow_inf_nan=False)

class OrderItemCreate(OrderItemBase):
    order_id: Optional[int] = Field(None, gt=0)

class OrderItemUpdate(BaseModel):
    order_id: Optional[int] = Field(None)
    product_id: Optional[int] = Field(None)
    quantity: Optional[int] = Field(None, gt=0)
    price: Optional[float] = Field(None, ge=0, allow_inf_nan=False)

class OrderItemResponse(OrderItemBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: ZeroFilledId
    order_id: int = Field(...)
    product: ProductResponse = Field(...)
    created_at: datetime
    updated_at: datetime

class OrderItemInDB(OrderItemBase):
    id: str
    created_at: datetime
    updated_at: datetime
