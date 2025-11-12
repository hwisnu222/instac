import enum
from pathlib import Path
from sqlmodel import Field, SQLModel, create_engine
from typing import Optional
from datetime import datetime

# move sqlite file from root to db directory
BASE_DIR = Path(__file__).resolve().parent
DB_DIR = BASE_DIR / "database"
DB_DIR.mkdir(exist_ok=True)
DB_PATH = DB_DIR / "instac_db.db"

# create engine for connect to database
engine = create_engine(f"sqlite:///{DB_PATH}", echo=True)


# enum
class StatusDownload(str, enum.Enum):
    FAILED = "failed"
    DONE = "done"


class Media(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    path: str
    created_at: Optional[datetime] = Field(
        default_factory=datetime.utcnow, nullable=False
    )


class InstaUrl(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    url: str = Field(index=True)
    status: StatusDownload = Field(default=StatusDownload.DONE)
    username: str = Field(index=True)
    created_at: Optional[datetime] = Field(
        default_factory=datetime.utcnow, nullable=False
    )
