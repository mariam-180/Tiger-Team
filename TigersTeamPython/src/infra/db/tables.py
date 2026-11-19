from datetime import datetime, date as DateType
from enum import Enum, auto
from typing import List, Optional

from sqlalchemy import Column, func, Float, JSON
from sqlalchemy.dialects.mysql import INTEGER, TEXT, DATETIME

from pydantic import NaiveDatetime
from sqlmodel import Field, SQLModel, UniqueConstraint, ForeignKey, Relationship
import sqlmodel

from sqlalchemy import func, Enum as SQLAlchemyEnum

from src.infra.models.commonEnums import OrderStatus, Availability


class UserRole(Enum):
    @staticmethod
    def _generate_next_value_(name, start, count, last_values):
        """
        Overriding the staticmethod that is used to determine
        the next value returned by auto for this enum class to
        just return the same name of the member.

        See: https://docs.python.org/3/library/enum.html#enum.Enum._generate_next_value_
        """
        return name

    SUPER_USER = auto()
    EMPLOYEE_USER = auto()
    END_USER = auto()


class User(SQLModel, table=True):
    id: int = Field(
        sa_column=Column(INTEGER(display_width=6, zerofill=True), primary_key=True)
    )
    first_name: str = Field(...)
    last_name: str = Field(...)
    email: str = Field(...)
    phone_number: str = Field(...)
    user_name: str = Field(...)
    password: str = Field(...)
    role: UserRole = Field(
        default=UserRole.END_USER,
        sa_column_kwargs={"server_default": UserRole.END_USER.value},
    )
    is_verified: bool = Field(
        default=False, sa_column_kwargs={"server_default": "false"}
    )
    verification_token: str = Field(None, sa_column=Column(sqlmodel.String(length=255)))
    created_at: NaiveDatetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        sa_column_kwargs={"server_default": func.now()},
    )
    credit: float = Field(
        default=0, sa_column=Column(Float(), nullable=False, server_default="0")
    )
    reset_token: str = Field(None, sa_column=Column(sqlmodel.String(length=255)))
    reset_token_expiry: Optional[NaiveDatetime] = Field(default=None, nullable=True)

    orders: List["Order"] = Relationship(back_populates="user")

    __table_args__ = (
        UniqueConstraint("email", name="uq_email"),
        UniqueConstraint("user_name", name="uq_user_name"),
        UniqueConstraint("phone_number", name="uq_phone_number"),
    )


class RegistrationStatus(Enum):
    @staticmethod
    def _generate_next_value_(name, start, count, last_values):
        """
        Overriding the staticmethod that is used to determine
        the next value returned by auto for this enum class to
        just return the same name of the member.

        See: https://docs.python.org/3/library/enum.html#enum.Enum._generate_next_value_
        """
        return name

    REGISTERED = auto()
    CONFIRMED = auto()
    CANCELLED = auto()


class Event(SQLModel, table=True):
    __tablename__ = "events"

    id: int = Field(
        sa_column=Column(INTEGER(display_width=6, zerofill=True), primary_key=True, autoincrement=True)
    )
    name: str = Field(..., max_length=255)  # Updated max_length
    is_active: bool = Field(default=False, nullable=False, sa_column_kwargs={"server_default": '0'})  # New field
    date: DateType = Field(...)
    
    registrations: List["EventRegistration"] = Relationship(back_populates="event")

    __table_args__ = (UniqueConstraint("name", name="uq_events_name"),) 
    

class EventRegistration(SQLModel, table=True):
    __tablename__ = "event_registrations"

    id: int = Field(
        sa_column=Column(INTEGER(display_width=6, zerofill=True), primary_key=True)
    )
    event_id: int = Field(
        sa_column=Column(INTEGER, ForeignKey("events.id"), nullable=True)
    )
    first_name: str = Field(..., max_length=100)
    last_name: str = Field(..., max_length=100)
    email: str = Field(..., max_length=255)
    phone_number: str = Field(..., max_length=15)
    registration_time: NaiveDatetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        sa_column_kwargs={"server_default": func.now()},
    )
    status: RegistrationStatus = Field(
        default=RegistrationStatus.REGISTERED,
        sa_column_kwargs={"server_default": RegistrationStatus.REGISTERED.value},
    )

    event: "Event" = Relationship(back_populates="registrations")

    __table_args__ = (
        UniqueConstraint("email", "event_id", name="uq_event_registrations_email_event"),
        UniqueConstraint("phone_number", "event_id", name="uq_event_registrations_phone_number_event"),
    )

    @property
    def status_name(self):
        return self.status.name if self.status else None

    @status_name.setter
    def status_name(self, value):
        self.status = value


class Branch(SQLModel, table=True):
    id: int = Field(
        sa_column=Column(INTEGER(display_width=6, zerofill=True), primary_key=True)
    )

    name: str = Field(..., max_length=255)
    location: str = Field(..., max_length=255)
    description: Optional[str] = Field(None, max_length=255)
    price: float = Field(...)
    total_price: dict = Field(sa_column=Column(JSON))
    created_at: NaiveDatetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        sa_column_kwargs={"server_default": func.now()},
    )
    updated_at: NaiveDatetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        sa_column_kwargs={"server_default": func.now(), "onupdate": func.now()},
    )

    __table_args__ = (UniqueConstraint("name", name="uq_branch_name"),)


class PC(SQLModel, table=True):
    id: int = Field(
        sa_column=Column(INTEGER(display_width=6, zerofill=True), primary_key=True)
    )

    branch_id: int = Field(
        sa_column=Column(
            INTEGER, ForeignKey("branch.id", ondelete="CASCADE"), nullable=False
        )
    )
    pc_number: str = Field(
        sa_column=Column(sqlmodel.sql.sqltypes.AutoString(), nullable=False)
    )
    created_at: NaiveDatetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        sa_column_kwargs={"server_default": func.now()},
    )
    updated_at: NaiveDatetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        sa_column_kwargs={"server_default": func.now(), "onupdate": func.now()},
    )

    __table_args__ = (
        UniqueConstraint("branch_id", "pc_number", name="uq_branch_pc_number"),
    )


class Reservation(SQLModel, table=True):
    id: int = Field(
        sa_column=Column(INTEGER(display_width=6, zerofill=True), primary_key=True)
    )

    branch_id: int = Field(
        sa_column=Column(INTEGER, ForeignKey("branch.id", ondelete="CASCADE"), nullable=False)
    )
    pc_id: int = Field(sa_column=Column(INTEGER, ForeignKey("pc.id", ondelete="CASCADE"), nullable=False))
    user_id: int = Field(
        sa_column=Column(INTEGER, ForeignKey("user.id"), nullable=False)
    )
    reservation_start: NaiveDatetime = Field(nullable=False)
    reservation_end: NaiveDatetime = Field(nullable=False)
    duration: int = Field(nullable=False)
    total_cost: float = Field(nullable=False)
    created_at: NaiveDatetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        sa_column_kwargs={"server_default": func.now()},
    )
    updated_at: NaiveDatetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        sa_column_kwargs={"server_default": func.now(), "onupdate": func.now()},
    )


class ActionType(Enum):
    @staticmethod
    def _generate_next_value_(name, start, count, last_values):
        return name

    CREATE = auto()
    UPDATE = auto()
    DELETE = auto()

class Reports(SQLModel, table=True):
    id: int = Field(
        sa_column=Column(INTEGER(display_width=6, zerofill=True), primary_key=True)
    )

    timestamp: NaiveDatetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        sa_column_kwargs={"server_default": func.now()},
    )
    user_id: int = Field(
        sa_column=Column(INTEGER, nullable=False)
    )
    action: ActionType = Field(sa_column=Column(SQLAlchemyEnum(ActionType, native_enum=False, length=255), nullable=False))
    table_name: str = Field(..., max_length=255, nullable=False)
    record_id: int = Field(nullable=False)
    description: str = Field(..., max_length=255, nullable=False)
    details: dict = Field(sa_column=Column(JSON, nullable=True))

    __table_args__ = (UniqueConstraint("id", name="uq_report_id"),)

class Category(SQLModel, table=True):
        id: int = Field(
        sa_column=Column(INTEGER(display_width=6, zerofill=True), primary_key=True)
    )
        name: str = Field(..., max_length=100, unique=True)
        img_url: Optional[str] = Field(None, sa_column=Column(sqlmodel.String(length=255)))

        created_at: NaiveDatetime = Field(
            default_factory=datetime.utcnow,
            nullable=False,
            sa_column_kwargs={"server_default": func.now()},
        )
        updated_at: NaiveDatetime = Field(
            default_factory=datetime.utcnow,
            nullable=False,
            sa_column_kwargs={"server_default": func.now(), "onupdate": func.now()},
        )

        __table_args__ = (UniqueConstraint("name", name="uq_category_name"),)


class Product(SQLModel, table=True):
    id: int = Field(
        sa_column=Column(INTEGER(display_width=6, zerofill=True), primary_key=True)
    )
    name: str = Field(..., max_length=100)
    description: str = Field(..., sa_column=Column(TEXT, nullable=False))
    price: float = Field(..., sa_column=Column(Float(), nullable=False))
    stock_quantity: int = Field(..., sa_column=Column(INTEGER(), nullable=False))
    is_lowest_price: bool = Field(
        default=False, sa_column_kwargs={"server_default": "false"}
    )
    category_id: int = Field(
        sa_column=Column(INTEGER, ForeignKey("category.id", ondelete="CASCADE"), nullable=False)
    )
    img_url: str = Field(..., sa_column=Column(sqlmodel.String(length=255), nullable=True))
    availability: Availability = Field(
        default=Availability.IN_STOCK,
        sa_column=Column(SQLAlchemyEnum(Availability), nullable=False, server_default=Availability.IN_STOCK)
    )
    show_stock_quantity: bool = Field(
        default=False, sa_column_kwargs={"server_default": "false"}
    )
    created_at: NaiveDatetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        sa_column_kwargs={"server_default": func.now()},
    )
    updated_at: NaiveDatetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        sa_column_kwargs={"server_default": func.now(), "onupdate": func.now()},
    )

    __table_args__ = (
        UniqueConstraint("name", "category_id", name="uq_product_name_category"),
    )


class Order(SQLModel, table=True):
    id: int = Field(sa_column=Column(INTEGER(display_width=6, zerofill=True), primary_key=True))
    user_id: int = Field(sa_column=Column(INTEGER, ForeignKey("user.id", ondelete="CASCADE"), nullable=False))
    total_amount: float = Field(sa_column=Column(Float(), nullable=False))
    status: OrderStatus = Field(sa_column=Column(SQLAlchemyEnum(OrderStatus), nullable=False, server_default=OrderStatus.PENDING))
    
    created_at: NaiveDatetime = Field(default_factory=datetime.utcnow, nullable=False, sa_column_kwargs={"server_default": func.now()})
    updated_at: NaiveDatetime = Field(default_factory=datetime.utcnow, nullable=False, sa_column_kwargs={"server_default": func.now(), "onupdate": func.now()})

    user: "User" = Relationship(back_populates="orders")
    items: List["OrderItem"] = Relationship(back_populates="order")


class OrderItem(SQLModel, table=True):
    __tablename__ = "order_item"

    id: int = Field(
        sa_column=Column(INTEGER(display_width=6, zerofill=True), primary_key=True)
    )
    order_id: int = Field(
        sa_column=Column(INTEGER, ForeignKey("order.id", ondelete="CASCADE"), nullable=False)
    )
    product_id: int = Field(
        sa_column=Column(INTEGER, ForeignKey("product.id", ondelete="CASCADE"), nullable=False)
    )
    quantity: int = Field(..., sa_column=Column(INTEGER(), nullable=False))
    price: float = Field(..., sa_column=Column(Float(), nullable=False))

    created_at: NaiveDatetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        sa_column_kwargs={"server_default": func.now()},
    )
    updated_at: NaiveDatetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        sa_column_kwargs={"server_default": func.now(), "onupdate": func.now()},
    )

    order: "Order" = Relationship(back_populates="items")
    product: "Product" = Relationship()

class ValueType(Enum):
    @staticmethod
    def _generate_next_value_(name, start, count, last_values):
        return name

    STRING = auto()
    INTEGER = auto()
    BOOLEAN = auto()
    DATE = auto()
    JSON = auto()

class Controller(SQLModel, table=True):
    id: int = Field(
        sa_column=Column(INTEGER(display_width=6, zerofill=True), primary_key=True, index=True)
    )
    name: str = Field(..., sa_column=Column(sqlmodel.String(length=255), unique=True, nullable=False))
    value: str = Field(..., sa_column=Column(TEXT, nullable=False))
    value_type: ValueType = Field(
        default=ValueType.STRING,
        sa_column=Column(SQLAlchemyEnum(ValueType), nullable=False, server_default=ValueType.STRING.name)
    )
    start_date: Optional[NaiveDatetime] = Field(None, sa_column=Column(DATETIME, nullable=True))
    end_date: Optional[NaiveDatetime] = Field(None, sa_column=Column(DATETIME, nullable=True))
    created_at: NaiveDatetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        sa_column_kwargs={"server_default": func.now()},
    )
    updated_at: NaiveDatetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        sa_column_kwargs={"server_default": func.now(), "onupdate": func.now()},
    )
