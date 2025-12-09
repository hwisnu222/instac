from typing import Optional
from fastapi import APIRouter, Depends, Query, Request, status, HTTPException
from fastapi.exceptions import HTTPException
import os
from pathlib import Path
import instaloader
from sqlmodel import SQLModel, Session, col, desc, or_, select

from ..schemas import DownloadItem

from ..config.settings import Settings
from ..utils import Util
from ..model import InstaUrl, Media, StatusDownload
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlmodel import paginate
from ..config.database import get_session
from ..schemas import DownloadItem
from ..config.auth import get_current_user


downloader_router = APIRouter(dependencies=[Depends(get_current_user)])


@downloader_router.get("/api/download/media", response_model=Page[Media])
def downloads(
    request: Request,
    session: Session = Depends(get_session),
):
    media = session.exec(select(Media.path)).all()
    print(media)

    # TODO: check length data media  in database and listdir in folder
    # if length is difference do sync data, otherwise

    download_p = Path(Settings.DOWNLOAD_PATH)
    download_list = {f.name for f in download_p.iterdir() if f.is_file()}

    new_path = download_list - set(media)

    if len(new_path) > 0:
        # change to object tabel
        new_records = [Media(path=name) for name in new_path]

        session.add_all(new_records)
        session.commit()

    util = Util()
    statement = select(Media).order_by(desc(Media.created_at))
    page = paginate(session, statement)
    print(page.items)

    for link in page.items:
        full_host = util.get_download_path(request)
        filename = os.path.basename(link.path)

        link.path = f"{full_host}/{link.path}"
        # link.filename = filename

    return page


@downloader_router.delete("/api/download/media/{id}")
def delete(id: int, session: Session = Depends(get_session)):
    try:
        item_delete = session.exec(select(Media).where(Media.id == id)).first()
        print(item_delete)

        if not item_delete:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="item is not found"
            )

        file_path = os.path.join(Settings.DOWNLOAD_PATH, item_delete.path)
        if Path(file_path).is_file():
            try:

                os.remove(file_path)
            except OSError as e:
                print(e)
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="failed delete file",
                )

        session.delete(item_delete)
        session.commit()

    except Exception as e:
        print(e)
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="internal server error",
        )


@downloader_router.get("/api/download", response_model=Page[InstaUrl])
def get_download(
    q: Optional[str] = Query(None, description="search"),
    session: Session = Depends(get_session),
):
    print(q)
    statement = select(InstaUrl)

    if q:
        statement = statement.where(
            or_(
                col(InstaUrl.url).contains(q),
                col(InstaUrl.username).contains(q),
            )
        )

    try:
        statement = statement.order_by(desc(InstaUrl.created_at))
        return paginate(session, statement)

    except Exception as err:
        print(err)
        return HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="failed get url download",
        )


@downloader_router.post("/api/download")
def download(item: DownloadItem, session: Session = Depends(get_session)):
    post_url = item.url

    if "instagram.com" not in item.url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="please insert correct url"
        )

    L = instaloader.Instaloader(
        dirname_pattern="downloads",
        post_metadata_txt_pattern="",
        compress_json=False,
        save_metadata=False,
        filename_pattern="{owner_username}-{date_utc:%Y%m%d_%H%M%S}",
        quiet=True,
        download_video_thumbnails=False,
    )

    shortcode = post_url.split("/")[-2]

    post = instaloader.Post.from_shortcode(L.context, shortcode)

    download_url = InstaUrl(url=item.url, username=post.owner_username)

    # download_path = []
    try:
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

        download_url.status = StatusDownload.DONE
        session.add(download_url)
        session.commit()

        return {
            "message": "success download post",
        }
    except Exception as e:
        download_url.status = StatusDownload.FAILED

        session.add(download_url)
        session.commit()

        print(f"Terjadi kesalahan umum: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="failed download post",
        )


@downloader_router.delete("/api/download/{id}")
def delete_list_download(id: int, session: Session = Depends(get_session)):
    print(id)
    try:
        item_delete = session.exec(select(InstaUrl).where(InstaUrl.id == id)).first()

        if not item_delete:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="url is not found"
            )

        session.delete(item_delete)
        session.commit()
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="internal server error",
        )
