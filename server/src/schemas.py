from sqlmodel import SQLModel
from pydantic import BaseModel


class DownloadItem(BaseModel):
    url: str


class UserCreate(SQLModel):
    username: str
    full_name: str
    password: str


class UserRead(SQLModel):
    id: int
    username: str
    full_name: str | None
    disabled: bool | None
