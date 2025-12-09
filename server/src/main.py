from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel

from .config.settings import Settings
from .model import engine
from fastapi_pagination import add_pagination
from .routes.user import user_router
from .routes.downloader import downloader_router

origins = [
    "http://localhost",
    "http://localhost:8080",
]


app = FastAPI()
app.mount("/static", StaticFiles(directory=Settings.DOWNLOAD_PATH), name="static")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
add_pagination(app)

static_dir = os.path.join(os.path.dirname(__file__), "static")


# init database
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)


# custom page size pagination
# from fastapi_pagination.customization import CustomizedPage, UseParamsFields
#
# T = TypeVar("T")
#
# CustomPage = CustomizedPage[
#     Page[T],
#     UseParamsFields(
#         size=Query(2, ge=1, le=50),
#     ),
# ]
#

app.include_router(user_router)
app.include_router(downloader_router)


# handle redirect route react
@app.get("/{path:path}")
async def frontend_handler(path: str):
    fp = Path("static") / path
    if not fp.exists() or not fp.is_file():
        fp = Path("static") / "index.html"
    print(f"Returning file at: {fp}")
    return FileResponse(fp)


app.mount("/", frontend_handler(path="static"), name="static")
