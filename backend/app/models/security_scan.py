from datetime import datetime
from pydantic import BaseModel


class SecurityScanModel(BaseModel):
    id: str
    project_id: str
    scan_type: str
    status: str = "PENDING"
    score: int = 0
    grade: str = "F"
    vulnerabilities: list[dict] = []
    report_url: str | None = None
    started_at: datetime
    completed_at: datetime | None = None
