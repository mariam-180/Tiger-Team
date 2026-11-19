from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

class BranchBase(BaseModel):
    name: str = Field(...)
    location: str = Field(...)
    description: Optional[str] = Field(None)
    price: float = Field(...)
    total_price: dict = Field(...)

class BranchCreate(BranchBase):
    pass

class BranchUpdate(BaseModel):
    name: Optional[str] = Field(None)
    location: Optional[str] = Field(None)
    description: Optional[str] = Field(None)
    price: Optional[float] = Field(None)
    total_price: Optional[dict] = Field(None)

class BranchResponse(BranchBase):
    id: int
    created_at: datetime
    updated_at: datetime

class BranchInDB(BranchBase):
    id: int
    created_at: datetime
    updated_at: datetime
