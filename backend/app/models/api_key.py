from datetime import datetime
from pydantic import BaseModel


class ApiKeyModel(BaseModel):
    id: str
    project_id: str
    user_id: str
    key_name: str
    key_prefix: str
    api_key_hash: str
    permissions: list[str] = []
    ip_whitelist: list[str] = []
    expires_at: datetime | None = None
    is_active: bool = True
    last_used_at: datetime | None = None
    created_at: datetime
