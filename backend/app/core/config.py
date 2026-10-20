import os, json
from typing import List, Union
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "StaticFlow Engine"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    SECRET_KEY: str = os.getenv("BACKEND_SECRET_KEY", "staticflow_prod_secret_key_32_chars_min")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    ALLOWED_ORIGINS: Union[str, List[str]] = "*"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://staticflow:staticflow_dev_2024@localhost:5432/staticflow")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    GROQ_API_KEY: str | None = os.getenv("GROQ_API_KEY", None)
    GEMINI_API_KEY: str | None = os.getenv("GEMINI_API_KEY", None)
    HUGGINGFACE_API_KEY: str | None = os.getenv("HUGGINGFACE_API_KEY", None)
    OPENROUTER_API_KEY: str | None = os.getenv("OPENROUTER_API_KEY", None)
    ZAP_URL: str = os.getenv("ZAP_URL", "http://localhost:8080")

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def parsed_allowed_origins(self) -> List[str]:
        if isinstance(self.ALLOWED_ORIGINS, list):
            return self.ALLOWED_ORIGINS
        if isinstance(self.ALLOWED_ORIGINS, str):
            val = self.ALLOWED_ORIGINS.strip()
            if not val or val == "*":
                return ["*"]
            if val.startswith("[") and val.endswith("]"):
                try:
                    return json.loads(val)
                except Exception:
                    pass
            return [item.strip() for item in val.split(",") if item.strip()]
        return ["*"]

settings = Settings()
