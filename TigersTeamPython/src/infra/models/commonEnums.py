from enum import Enum

class UserRole(Enum):
    SUPER_USER = "SUPER_USER"
    EMPLOYEE_USER = "EMPLOYEE_USER"
    END_USER = "END_USER"

class OrderStatus(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    SHIPPED = "SHIPPED"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"

class Availability(str, Enum):
    IN_STOCK = "IN_STOCK"
    PRE_ORDER = "PRE_ORDER"
