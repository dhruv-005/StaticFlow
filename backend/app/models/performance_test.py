from datetime import datetime
from pydantic import BaseModel


class PerformanceTestModel(BaseModel):
    id: str
    project_id: str
    test_type: str
    status: str = "QUEUED"
    avg_response_ms: int = 0
    p95_response_ms: int = 0
    p99_response_ms: int = 0
    throughput_req_sec: int = 0
    error_rate_percent: float = 0.0
    max_users: int = 0
    metrics: list[dict] = []
    started_at: datetime
    completed_at: datetime | None = None
