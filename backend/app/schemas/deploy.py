from pydantic import BaseModel
from typing import Optional, Dict, List

class DeployRequest(BaseModel):
    projectId: str
    projectName: str
    platform: str
    envVars: Optional[Dict[str, str]] = None

class DeployResponse(BaseModel):
    deploymentId: str
    url: str
    platform: str
    status: str
    logs: List[str] = []
