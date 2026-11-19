from datetime import  datetime, timezone, date as dateType
from typing import List, Optional, Annotated

from pydantic import BaseModel, Field


class EventBase(BaseModel):
    name: str = Field(..., max_length=255)
    is_active: bool = Field(default=False)
    date: dateType = Field(...)


class EventCreate(EventBase):
    pass


class EventUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    is_active: Optional[bool] = Field(None)
    date: Optional[dateType] = Field(None)


class EventResponse(EventBase):
    id: int

    class Config:
        from_attributes = True


class EventListResponse(BaseModel):
    events: List[EventResponse]
    total_count: int

    class Config:
        from_attributes = True