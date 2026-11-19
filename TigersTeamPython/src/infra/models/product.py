from datetime import datetime
from typing import Annotated, Optional
from pydantic import BaseModel, BeforeValidator, ConfigDict, Field

from src.infra.models.commonEnums import Availability

def fill_id_with_zeroes(v: int) -> str:
    stringified_value = str(v)
    return stringified_value.zfill(6)

ZeroFilledId = Annotated[str, BeforeValidator(fill_id_with_zeroes)]

class ProductBase(BaseModel):
    name: str = Field(...)
    description: Optional[str] = Field(None)
    price: float = Field(..., ge=0, allow_inf_nan=False)
    stock_quantity: int = Field(..., ge=0)
    is_lowest_price: bool = Field(default=False)
    category_id: int = Field(...)
    img_url: Optional[str] = Field(None)
    availability: Availability = Field(default=Availability.IN_STOCK)
    show_stock_quantity: bool = Field(default=True)

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None)
    description: Optional[str] = Field(None)
    price: Optional[float] = Field(None, ge=0, allow_inf_nan=False)
    stock_quantity: Optional[int] = Field(None, ge=0)
    is_lowest_price: Optional[bool] = Field(None)
    category_id: Optional[int] = Field(None)
    img_url: Optional[str] = Field(None)
    availability: Optional[Availability] = Field(None)
    show_stock_quantity: Optional[bool] = Field(None)

class ProductResponse(ProductBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: ZeroFilledId
    created_at: datetime
    updated_at: datetime

class ProductInDB(ProductBase):
    id: str
    created_at: datetime
    updated_at: datetime
