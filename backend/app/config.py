# from pydantic_settings import BaseSettings

# class Settings(BaseSettings):
#     database_url: str
#     backend_host: str = "0.0.0.0"
#     backend_port: int = 8000
#     allowed_origins: list = ["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3001"]

#     class Config:
#         env_file = ".env"
#         env_file_encoding = "utf-8"
#         extra = "ignore"  # prevents errors if extra env vars exist

# settings = Settings()

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = "sqlite+aiosqlite:///./flowtrack.db"  # Default to SQLite
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()