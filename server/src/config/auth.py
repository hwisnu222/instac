from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from sqlmodel import Session, select
from dotenv import load_dotenv
import os

from .database import get_session
from ..model import User

load_dotenv()

SECRET_KEY = os.environ.get(
    "SECRET_KEY", "MHLslqW+7R0IklZYAZb2SWGiAK7uJMxTqv/A8grMAco="
)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRES_MINUTES = 60 * 24 * 2  # 2 days


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()

    dateutc = datetime.now(timezone.utc)

    if expires_delta:
        expire = dateutc + expires_delta
    else:
        expire = dateutc + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encode_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encode_jwt


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def verify_password(plain_password, hashed_password):
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    """Generate a hash for a password."""
    return pwd_context.hash(password)


def authenticate_user(user, password: str):

    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


async def get_current_user(
    token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)
):
    print(token)
    """Get the current user from the JWT token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub", "")
        if username is None:
            raise credentials_exception
    except JWTError as err:
        print(err)
        raise credentials_exception

    user = session.exec(select(User).where(User.username == username)).one()
    if user is None:
        print("user is not found")
        raise credentials_exception

    return user


async def get_current_active_user(current_user: User = Depends(get_current_user)):
    """Get the current active user (not disabled)."""
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
