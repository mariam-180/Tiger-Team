from datetime import datetime, timedelta
import bcrypt
from typing import Any, Dict, List

from fastapi import APIRouter, Depends, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from sqlmodel import Session
from pydantic import BaseModel, EmailStr

from src.infra.errors import CustomHTTPException, RecordNotFoundException
from src.infra.db.tables import UserRole
from src.api.dependencies import get_db
from src.core.config import settings
from src.infra.crud import user_crud
from src.infra.security.authentication import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    get_current_user,
    has_permission,
    require_permission,
)
from src.infra.models.user import (
    UserCreate,
    UserResponse,
    UserUpdate,
    UserInDB,
    UserResponseV2,
    UserInfo,
)
from src.infra.security.authentication import (
    verify_password,
    create_access_token,
    role_hierarchy,
)
from src.utils.email_util import (
    generate_verification_token,
    send_verification_email,
    send_reset_password_email,
)
from src.utils.reporting import ReportManager

router = APIRouter(prefix="/users", tags=["Users"])


@router.get(
    "/current",
    status_code=status.HTTP_200_OK,
    response_model=UserResponseV2,
    operation_id="user_get_current_user",
)
async def get_user(current_user: UserInDB = Depends(get_current_user)):
    """
    Retrieve the current user's information.
    """
    return current_user


@router.get(
    "/",
    status_code=status.HTTP_200_OK,
    response_model=List[UserResponseV2],
    operation_id="user_get_all_users",
)
async def get_users(
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
):
    """
    Retrieve users.
    """
    has_permission(UserRole.EMPLOYEE_USER, current_user)
    return user_crud.read(session)


@router.get(
    "/non-end-users",
    status_code=status.HTTP_200_OK,
    response_model=List[UserInfo],
    operation_id="user_get_non_end_users",
)
async def get_non_end_users(
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
):
    """
    Retrieve users.
    """
    has_permission(UserRole.EMPLOYEE_USER, current_user)

    return user_crud.read_non_end_user(session)


@router.get(
    "/by-email/{email}",
    response_model=UserResponse,
    responses={status.HTTP_404_NOT_FOUND: {"description": "User not found"}},
    operation_id="user_get_user_by_email",
)
def get_user_by_email(email: str, session: Session = Depends(get_db), current_user: UserInDB = Depends(get_current_user)) -> UserResponse:
    """
    Retrieve a user by email.
    """
    has_permission(UserRole.EMPLOYEE_USER, current_user)
    user = user_crud.read_by_email(session, email)
    if user is None:
        raise CustomHTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return user


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=Dict[str, Any],
    responses={
        status.HTTP_409_CONFLICT: {
            "description": "Email or phone number already exists."
        }
    },
    operation_id="user_create_new_user",
)
def create_user(user: UserCreate, session: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Create new user.
    """
    hashed_password = bcrypt.hashpw(user.password.encode("utf-8"), bcrypt.gensalt())
    user.password = hashed_password.decode("utf-8")
    verification_token = generate_verification_token()
    created_user = user_crud.create(session, user, commit=False, verification_token=verification_token)
    try:
        send_verification_email(created_user.user_name, created_user.email, verification_token)
        session.commit()
    except Exception:
        session.rollback()
        raise CustomHTTPException(status_code=503, detail="Verification email could not be delivered. Please try again later.")

    return {
        "detail": "User created successfully, please check your email to verify your account.",
        "email_delivery": settings.EMAIL_DELIVERY
    }


@router.patch(
    "/{user_id}", response_model=UserResponse, operation_id="user_update_existing_user"
)
def update_user(
    user_id: int,
    user_input: UserUpdate,
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
):
    """
    Update existing user.
    """
    has_permission(UserRole.EMPLOYEE_USER, current_user)

    user = user_crud.read_by_id(session, user_id)
    if current_user.role != UserRole.SUPER_USER and user.role != UserRole.END_USER:
        has_permission(UserRole.SUPER_USER, current_user)
    user = UserResponse(**user.dict())

    if user_input.role is not None and user_input.role != user.role:
        has_permission(UserRole.SUPER_USER, current_user)

    updated_user = user_crud.update(session, user_id, user_input)

    if require_permission(UserRole.EMPLOYEE_USER, current_user):
        report_manager = ReportManager(session, current_user.id)
        report_manager.report_update_user(user_id, user, updated_user)

    return updated_user


@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    operation_id="user_delete_existing_user",
)
def delete_user(
    user_id: int,
    session: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
):
    """
    Delete an existing user.
    """
    has_permission(UserRole.SUPER_USER, current_user)
    if user_id == current_user.id:
        raise CustomHTTPException(status_code=409, detail="You cannot delete your own administrator account")
    user = UserResponseV2.model_validate(user_crud.read_by_id(session, user_id))

    user_crud.delete(session, user_id)

    if require_permission(UserRole.EMPLOYEE_USER, current_user):
        report_manager = ReportManager(session, current_user.id)
        report_manager.report_delete_user(user)

    return {"detail": "User deleted successfully"}


@router.post(
    "/token", response_model=Dict[str, Any], operation_id="user_login_for_access_token"
)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_db)
):
    try:
        user = user_crud.read_by_email(session, form_data.username)
    except RecordNotFoundException:
        user = None
    if not user or not verify_password(form_data.password, user.password):
        raise CustomHTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_verified:
        raise CustomHTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email address not verified",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(user, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}


@router.get(
    "/check-token", response_model=Dict[str, Any], operation_id="user_check_token"
)
async def check_token_status(current_user: UserInDB = Depends(get_current_user)):
    """
    Check if token is not expired and get the user's role.
    """
    user_role = role_hierarchy.get(current_user.role, "unknown")
    return {"token_valid": True, "user_role": user_role}


@router.get("/verify-email", operation_id="user_verify_email")
def verify_email(token: str, session: Session = Depends(get_db)):
    user: UserCreate = user_crud.read_by_verification_token(session, token)
    if not user:
        raise CustomHTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Invalid or expired token"
        )
    user.is_verified = True
    user.verification_token = None
    user_crud.update(session, user.id, user)

    import os
    return RedirectResponse(url=os.getenv("FRONTEND_URL", "http://localhost").rstrip("/") + "/registration?verified=1")


class EmailRequest(BaseModel):
    email: EmailStr


@router.post("/resend-verification", status_code=status.HTTP_200_OK)
def resend_verification(data: EmailRequest, session: Session = Depends(get_db)):
    message = {"detail": "If this account needs verification, a new link has been sent.", "email_delivery": settings.EMAIL_DELIVERY}
    try:
        user = user_crud.read_by_email(session, str(data.email))
    except RecordNotFoundException:
        return message
    if user.is_verified:
        return message
    try:
        user.verification_token = generate_verification_token()
        session.add(user)
        session.flush()
        send_verification_email(user.user_name, user.email, user.verification_token)
        session.commit()
    except Exception:
        session.rollback()
        raise CustomHTTPException(status_code=503, detail="Verification email could not be delivered. Please try again later.")
    return message


@router.post("/request-password-reset", status_code=status.HTTP_200_OK)
def request_password_reset(data: EmailRequest, session: Session = Depends(get_db)):
    try:
        user = user_crud.read_by_email(session, str(data.email))
    except RecordNotFoundException:
        return {"detail": "If the account exists, password reset instructions have been sent.", "email_delivery": settings.EMAIL_DELIVERY}
    try:
        user_crud.generate_reset_token(session, user, commit=False)
        send_reset_password_email(user.user_name, user.email, user.reset_token)
        session.commit()
    except Exception:
        session.rollback()
        raise CustomHTTPException(status_code=503, detail="Password reset email could not be delivered. Please try again later.")
    return {"detail": "If the account exists, password reset instructions have been sent.", "email_delivery": settings.EMAIL_DELIVERY}


@router.post("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(request: Request, session: Session = Depends(get_db)):
    data = await request.json()
    token = data.get("token")
    new_password = data.get("new_password")

    if not token or not new_password:
        raise CustomHTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token and new password are required",
        )
    if not isinstance(new_password, str) or len(new_password) < 8 or len(new_password.encode("utf-8")) > 72:
        raise CustomHTTPException(status_code=422, detail="Password must have at least 8 characters and at most 72 UTF-8 bytes")

    user = user_crud.read_by_reset_token(session, token)
    if not user:
        raise CustomHTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Invalid token"
        )

    if datetime.utcnow() > user.reset_token_expiry:
        raise CustomHTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Expired token"
        )

    user_crud.update_password(session, user, new_password)
    return {"detail": "Password reset successful"}
