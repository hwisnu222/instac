# function dependecy injection
from sqlmodel import Session
from ..model import engine


def get_session():
    with Session(engine) as session:
        yield session
