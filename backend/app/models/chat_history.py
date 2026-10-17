from datetime import datetime
from pydantic import BaseModel


class ChatMessageModel(BaseModel):
    id: str
    project_id: str | None = None
    user_id: str
    role: str
    content: str
    code_blocks: list[dict] = []
    created_at: datetime
