from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.exceptions import HTTPException
from fastapi.staticfiles import StaticFiles
import os
from pathlib import Path


app = FastAPI()
static_dir = os.path.join(os.path.dirname(__file__), "static")

print("app started")


@app.get("/api/downloads")
def downloads():
    return {"message": "success", "result": "data from server"}


@app.post("/api/download")
def download():
    return {"message": "success", "result": "post"}


@app.get("/{path:path}")
async def frontend_handler(path: str):
    fp = Path("static") / path
    if not fp.exists() or not fp.is_file():
        fp = Path("static") / "index.html"
    print(f"Returning file at: {fp}")
    return FileResponse(fp)


app.mount("/", frontend_handler(path="static"), name="static")
