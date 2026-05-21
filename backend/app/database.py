from pathlib import Path

from .config import settings

DB_PATH = Path('saathi.db')


def initialize_database() -> dict:
    return {
        'database_url': settings.database_url,
        'path': str(DB_PATH),
        'mode': settings.saathi_env
    }
