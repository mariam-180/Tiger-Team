from typing import Any, Optional

from pydantic import MySQLDsn, ValidationInfo, field_validator, model_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """ """

    # Project-specific settings
    ENV: str
    PROJECT_NAME: str = "Tigers Team"
    BUSINESS_TIMEZONE: str = "Asia/Amman"
    API_ROOT_PATH: str = ""
    SRS_INGEST_URL: str = "rtmp://localhost/live"
    SRS_STREAM_KEY: str = "OBS_Stream"
    SRS_PUBLISH_TOKEN: str = ""
    SRS_API_URL: str = "http://srs:1985"
    SRS_HLS_URL: Optional[str] = None
    SRS_WEBRTC_URL: Optional[str] = None

    # TODO
    # BACKEND_CORS_ORIGINS is a JSON-formatted list of origins
    # e.g: '["http://localhost", "http://localhost:4200", "http://localhost:3000", \
    # "http://localhost:8080", "http://local.dockertoolbox.tiangolo.com"]'
    # BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    # DB-specific settings
    MYSQL_USER: str
    MYSQL_PASSWORD: str
    MYSQL_DATABASE: str
    MYSQL_HOST: str
    MYSQL_PORT: int
    SQLALCHEMY_DATABASE_URI: Optional[MySQLDsn] = None

    _EXPIRE_DAYS: int = 2
    _EXPIRE_HOURS: int = 0
    _EXPIRE_MINUTES: int = 0

    SECRET_KEY: str
    DATABASE_URL: Optional[str] = None
    EMAIL_DELIVERY: str = "smtp"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = (
        (_EXPIRE_DAYS * 24 * 60) + (_EXPIRE_HOURS * 60) + _EXPIRE_MINUTES
    )

    @model_validator(mode="after")
    def validate_production(self):
        if self.ENV.lower() in {"production", "prod"}:
            if len(self.SECRET_KEY) < 32 or any(value in self.SECRET_KEY.lower() for value in ("change-me", "change_me", "local-development")):
                raise ValueError("Production requires a unique SECRET_KEY of at least 32 characters")
            if self.DATABASE_URL and self.DATABASE_URL.startswith("sqlite"):
                raise ValueError("SQLite is only supported for local development")
        return self

    @field_validator("SQLALCHEMY_DATABASE_URI", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: Optional[str], info: ValidationInfo) -> Any:
        if isinstance(v, str):
            return v
        return MySQLDsn.build(
            scheme="mysql",
            username=info.data.get("MYSQL_USER"),
            password=info.data.get("MYSQL_PASSWORD"),
            host=info.data.get("MYSQL_HOST"),
            port=info.data.get("MYSQL_PORT"),
            path=info.data.get("MYSQL_DATABASE"),
        )


settings = Settings()
