from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    saathi_env: str = 'local'
    database_url: str = 'sqlite:///./saathi.db'
    cors_origins: str = 'http://localhost:3000'

    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', extra='ignore')


settings = Settings()
