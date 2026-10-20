from datetime import datetime
from pydantic import BaseModel


class DeploymentModel(BaseModel):
    id: str
    project_id: str
    platform: str
    status: str = "BUILDING"
    url: str = ""
    domain: str | None = None
    ssl_enabled: bool = False
    env_vars: dict = {}
    deploy_logs: list[str] = []
    created_at: datetime
