import jwt
import hashlib
import secrets
from datetime import datetime, timedelta

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session
from src.infra.errors import ExpiredSignatureError, ForbiddenException, InvalidRoleConfigurationException, RecordNotFoundException
from src.api.dependencies import get_db
from src.infra.db.tables import UserRole
from passlib.context import CryptContext
from src.core.config import settings
from src.infra.models.user import UserInDB
from src.infra.crud.user_crud import read_by_email


SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

role_hierarchy = {
    UserRole.SUPER_USER: 3,
    UserRole.EMPLOYEE_USER: 2,
    UserRole.END_USER: 1
}

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/token")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(user: UserInDB, expires_delta: timedelta = None):
    to_encode = {"sub": user.email, "role": user.role.name,
                 "pwd": hashlib.sha256(user.password.encode()).hexdigest()}
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        if email is None or role is None:
            raise credentials_exception
    except jwt.ExpiredSignatureError:
        raise ExpiredSignatureError()
    except jwt.InvalidTokenError:
        raise credentials_exception
    
    try:
        user = read_by_email(session, email)
    except RecordNotFoundException:
        raise credentials_exception
    if user is None or not user.is_verified:
        raise credentials_exception
    fingerprint = payload.get("pwd", "")
    if not isinstance(fingerprint, str) or not secrets.compare_digest(fingerprint, hashlib.sha256(user.password.encode()).hexdigest()):
        raise credentials_exception
    
    return user


def has_permission(required_role: UserRole, current_user: UserInDB = Depends(get_current_user)):
    current_user_role_level = role_hierarchy.get(current_user.role)
    required_role_level = role_hierarchy.get(required_role)
    
    if current_user_role_level is None or required_role_level is None:
        raise InvalidRoleConfigurationException(current_user, required_role)
    
    if current_user_role_level < required_role_level:
        raise ForbiddenException(current_user, required_role)

def require_permission(required_role: UserRole, current_user: UserInDB = Depends(get_current_user)):
    current_user_role_level = role_hierarchy.get(current_user.role)
    required_role_level = role_hierarchy.get(required_role)
    
    if current_user_role_level is None or required_role_level is None:
        return False
    
    if current_user_role_level < required_role_level:
        return False

    return True
