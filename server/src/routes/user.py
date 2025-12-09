from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, func, select

from ..schemas import UserCreate

from ..config.auth import get_current_active_user
from ..model import User
from ..schemas import UserRead

from ..config.database import get_session
from ..config.auth import (
    authenticate_user,
    create_access_token,
    ACCESS_TOKEN_EXPIRES_MINUTES,
    get_password_hash,
)


user_router = APIRouter(prefix="/api/auth")


@user_router.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session),
):
    """Authenticate user and return access token."""
    user = session.exec(select(User).where(User.username == form_data.username)).one()

    if user == None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="user not found"
        )

    user = authenticate_user(user, form_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRES_MINUTES)

        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )

        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@user_router.post("/register", response_model=UserRead)
def create_user_host(user: UserCreate, session: Session = Depends(get_session)):
    print(user)
    try:
        user_exist = session.exec(select(User)).first()

        if user_exist:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="user is exist"
            )

        hash_password = get_password_hash(user.password)
        new_user = User(
            **user.model_dump(exclude={"password"}), hashed_password=hash_password
        )

        session.add(new_user)
        session.commit()

        return new_user

    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@user_router.get("/users/me", response_model=UserRead)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    """Get current user information."""

    return current_user


@user_router.get("/users/count")
async def get_users_count(
    session: Session = Depends(get_session),
):

    statement = select(func.count()).select_from(User)
    users_count = session.exec(statement).first()

    return {"items": {"count": users_count}}
