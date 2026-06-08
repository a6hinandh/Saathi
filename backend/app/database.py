from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from typing import Generator

from .config import settings

# SQLite-specific configuration for multi-threaded access
connect_args = {}
if settings.database_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    settings.database_url, connect_args=connect_args
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def initialize_database() -> None:
    """Creates database tables if they do not exist."""
    Base.metadata.create_all(bind=engine)


def get_db() -> Generator:
    """Dependency generator to retrieve DB sessions with automatic cleanup."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
