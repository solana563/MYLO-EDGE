from __future__ import annotations

from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: Literal["development", "production", "test"] = Field(default="development", alias="APP_ENV")
    database_url: str = Field(default="postgresql+psycopg://postgres:postgres@localhost:5432/mylo_edge", alias="DATABASE_URL")
    redis_url: str = Field(default="redis://localhost:6379/0", alias="REDIS_URL")
    jwt_secret: str = Field(default="change-me-in-production", alias="JWT_SECRET")
    cors_origins: str = Field(default="http://localhost:5173", alias="CORS_ORIGINS")
    market_data_provider: str = Field(default="local", alias="MARKET_DATA_PROVIDER")
    market_data_api_key: str | None = Field(default=None, alias="MARKET_DATA_API_KEY")
    news_provider: str = Field(default="local", alias="NEWS_PROVIDER")
    news_api_key: str | None = Field(default=None, alias="NEWS_API_KEY")
    fundamentals_provider: str = Field(default="local", alias="FUNDAMENTALS_PROVIDER")
    fundamentals_api_key: str | None = Field(default=None, alias="FUNDAMENTALS_API_KEY")
    macro_provider: str = Field(default="local", alias="MACRO_PROVIDER")
    macro_api_key: str | None = Field(default=None, alias="MACRO_API_KEY")
    tradingagents_provider: str = Field(default="local", alias="TRADINGAGENTS_PROVIDER")
    tradingagents_api_key: str | None = Field(default=None, alias="TRADINGAGENTS_API_KEY")

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False, extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()
