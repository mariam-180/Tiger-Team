
from sqlmodel import create_engine

from src.core.config import settings

# SQLite is used only for the isolated local preview and regression tests.
if settings.DATABASE_URL and settings.DATABASE_URL.startswith("sqlite"):
    from sqlalchemy.ext.compiler import compiles
    from sqlalchemy.dialects.mysql import INTEGER

    @compiles(INTEGER, "sqlite")
    def compile_integer(type_, compiler, **kwargs):
        return "INTEGER"

database_url = settings.DATABASE_URL or settings.SQLALCHEMY_DATABASE_URI.unicode_string()
connect_args = {"check_same_thread": False} if database_url.startswith("sqlite") else {}
engine = create_engine(database_url, pool_pre_ping=True, connect_args=connect_args, hide_parameters=True)
if database_url.startswith("sqlite"):
    from sqlalchemy import event

    @event.listens_for(engine, "connect")
    def enable_foreign_keys(connection, record):
        connection.execute("PRAGMA foreign_keys=ON")
# unicode_string() - See: https://stackoverflow.com/a/77173134/5134751
