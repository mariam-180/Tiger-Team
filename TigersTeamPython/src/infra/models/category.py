from datetime import datetime
from typing import Annotated, Optional
from pydantic import BaseModel, BeforeValidator, ConfigDict, Field

def fill_id_with_zeroes(v: int) -> str:
    stringified_value = str(v)
    return stringified_value.zfill(6)

ZeroFilledId = Annotated[str, BeforeValidator(fill_id_with_zeroes)]

class CategoryBase(BaseModel):
    name: str = Field(...)
    img_url: Optional[str] = Field(None)

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None)
    img_url: Optional[str] = Field(None)

class CategoryResponse(CategoryBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: ZeroFilledId
    created_at: datetime
    updated_at: datetime

class CategoryInDB(CategoryBase):
    id: str
    created_at: datetime
    updated_at: datetime
