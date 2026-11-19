from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

class PCBase(BaseModel):
    branch_id: int = Field(...)
    pc_number: str = Field(...)
    is_available: bool = Field(default=True)

class PCCreate(PCBase):
    pass

class PCUpdate(BaseModel):
    branch_id: Optional[int] = Field(None)
    pc_number: Optional[str] = Field(None)
    is_available: Optional[bool] = Field(None)

class PCResponse(PCBase):
    id: int
    created_at: datetime
    updated_at: datetime
    is_available: Optional[bool] = Field(None)

class PCInDB(PCBase):
    id: int
    created_at: datetime
    updated_at: datetime
