from typing import ClassVar
from pydantic import BaseModel


class Settings(BaseModel):
    DOWNLOAD_PATH: ClassVar[str] = "downloads"
