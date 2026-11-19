from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from enum import Enum

class ValueType(str, Enum):
    STRING = "STRING"
    INTEGER = "INTEGER"
    BOOLEAN = "BOOLEAN"
    DATE = "DATE"
    JSON = "JSON"

class ControllerBase(BaseModel):
    name: str
    value: str
    value_type: ValueType = ValueType.STRING
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

class ControllerCreate(ControllerBase):
    pass

class ControllerUpdate(BaseModel):
    name: Optional[str] = None
    value: Optional[str] = None
    value_type: Optional[ValueType] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

class ControllerResponse(ControllerBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
