from typing import Dict, Optional
from fastapi import HTTPException, status


class BaseException(Exception):
    def __init__(
        self,
        error_msg: str = "Something failed.",
        status_code: int = status.HTTP_418_IM_A_TEAPOT,
    ) -> None:
        self.error_msg = error_msg
        self.status_code = status_code
        super().__init__()


class DuplicateRecordException(BaseException):
    def __init__(self, error_msg: str = "Duplicate record.", field: str = None) -> None:
        self.field = field
        super().__init__(error_msg, status.HTTP_409_CONFLICT)


class RecordNotFoundException(BaseException):
    def __init__(self, error_msg: str = "Record not found.") -> None:
        super().__init__(error_msg, status.HTTP_404_NOT_FOUND)


class UnauthorizedException(BaseException):
    def __init__(self, error_msg: str = "Unauthorized access.") -> None:
        super().__init__(error_msg, status.HTTP_401_UNAUTHORIZED)


class ForbiddenException(HTTPException):
    def __init__(
        self,
        current_user,
        required_role,
        detail: str = "You don't have permission to access this resource.",
    ):
        self.current_user = current_user
        self.required_role = required_role
        super().__init__(
            status_code=403,
            detail=f'{detail} User "{current_user.email}" with role "{current_user.role}" tried to access a resource requiring role "{required_role}"',
        )


class InvalidRoleConfigurationException(HTTPException):
    def __init__(self, current_user, required_role):
        self.current_user = current_user
        self.required_role = required_role
        super().__init__(
            status_code=500,
            detail=f"Invalid role configuration for user '{current_user.email}' with role '{current_user.role}', requiring role '{required_role}'",
        )


class ExpiredSignatureError(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )


class InsufficientCreditException(HTTPException):
    def __init__(
        self,
        user_id: int,
        current_credit: float,
        required_credit: float,
        detail: str = "Insufficient credit for the reservation.",
    ):
        self.user_id = user_id
        self.current_credit = current_credit
        self.required_credit = required_credit
        super().__init__(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"{detail} User ID: {user_id}, Current credit: {current_credit}, required: {required_credit}",
        )

class InsufficientStockException(HTTPException):
    def __init__(
        self,
        product_id: int,
        current_stock: int,
        requested_quantity: int,
        detail: str = "Insufficient stock available.",
    ):
        self.product_id = product_id
        self.current_stock = current_stock
        self.requested_quantity = requested_quantity
        super().__init__(
            status_code=status.HTTP_507_INSUFFICIENT_STORAGE,
            detail=f"{detail} Product ID: {product_id}, Current Stock: {current_stock}, Requested Quantity: {requested_quantity}",
        )

class DatabaseOperationException(Exception):
    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)

class CustomHTTPException(HTTPException):
    def __init__(self, status_code: int, detail: str, headers: Optional[Dict[str, str]] = None):
        super().__init__(status_code=status_code, detail=detail, headers=headers)

class ProductOutOfStockException(BaseException):
    def __init__(self, product_id: int, requested_quantity: int, available_quantity: int):
        self.product_id = product_id
        self.requested_quantity = requested_quantity
        self.available_quantity = available_quantity
        super().__init__(
            error_msg=f"Product ID {product_id} is out of stock. Requested: {requested_quantity}, Available: {available_quantity}",
            status_code=status.HTTP_400_BAD_REQUEST,
        )

