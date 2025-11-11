import enum
from sqlmodel import Field, SQLModel, create_engine

# create engine for connect to database
engine = create_engine("sqlite:///instac_db.db", echo=True)


# enum
class StatusDownload(str, enum.Enum):
    FAILED = "failed"
    DONE = "done"


class Media(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    path: str


class InstaUrl(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    url: str | None = Field(default=None, nullable=True)
    status: StatusDownload = Field(default=StatusDownload.DONE)
    username: str | None = Field(default=None, nullable=True)
