from re import fullmatch
from fastapi import FastAPI, Request, status, HTTPException
from fastapi.responses import FileResponse
from fastapi.exceptions import HTTPException
from fastapi.staticfiles import StaticFiles
import os
from pathlib import Path
import instaloader
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from .utils import Util
import mimetypes

origins = [
    "http://localhost",
    "http://localhost:8080",
]

DOWNLOAD_PATH = "downloads"


class DownloadItem(BaseModel):
    url: str


app = FastAPI()
app.mount("/static", StaticFiles(directory=DOWNLOAD_PATH), name="static")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

static_dir = os.path.join(os.path.dirname(__file__), "static")


@app.get("/api/download/media")
def downloads(request: Request):
    download_dir = os.listdir("downloads")
    util = Util()

    links = []
    for link in download_dir:
        full_host = util.get_download_path(request)
        filename = os.path.basename(link)
        mimetype = mimetypes.guess_type(filename)[0]

        links.append(
            {"url": f"{full_host}/{link}", "filename": filename, "mimetype": mimetype}
        )

    return {"message": "success get media", "results": links}


@app.post("/api/download")
def download(item: DownloadItem):
    post_url = item.url

    L = instaloader.Instaloader(
        dirname_pattern="downloads",
        post_metadata_txt_pattern="",
        compress_json=False,
        save_metadata=False,
        filename_pattern="{owner_username}-{date_utc:%Y%m%d_%H%M%S}",
        quiet=True,
        download_video_thumbnails=False,
    )

    # download_path = []
    try:

        shortcode = post_url.split("/")[-2]

        post = instaloader.Post.from_shortcode(L.context, shortcode)

        # get filename
        # if post.typename == "GraphSidecar":
        #     for sidecar_node in post.get_sidecar_nodes():
        #         filename = L.format_filename(sidecar_node)
        #         fullpath = filename + ".jpg"
        #         download_path.append(fullpath)
        # else:
        #     if post.is_video:
        #         extension = ".mp4"
        #     else:
        #         extension = ".jpg"
        #
        #     filename = L.format_filename(post)
        #     fullpath = filename + extension
        #     download_path.append(fullpath)
        #
        # print(download_path)

        L.download_post(post, "./")

        return {
            "message": "success download post",
        }
    except Exception as e:
        print(f"Terjadi kesalahan umum: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@app.get("/{path:path}")
async def frontend_handler(path: str):
    fp = Path("static") / path
    if not fp.exists() or not fp.is_file():
        fp = Path("static") / "index.html"
    print(f"Returning file at: {fp}")
    return FileResponse(fp)


app.mount("/", frontend_handler(path="static"), name="static")
