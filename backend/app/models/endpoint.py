from datetime import datetime
from pydantic import BaseModel


class EndpointModel(BaseModel):
    id: str
    project_id: str
    method: str
    path: str
    summary: str | None = None
    description: str | None = None
    request_body: dict | None = None
    response_body: dict | None = None
    auth_required: bool = False
    roles: list[str] = []
    created_at: datetime
