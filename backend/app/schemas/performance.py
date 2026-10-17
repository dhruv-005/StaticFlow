from pydantic import BaseModel
from typing import List

class MetricPoint(BaseModel):
    timestamp: int
    virtualUsers: int
    responseTime: float
    throughput: float
    errorRate: float

class PerformanceTestRequest(BaseModel):
    projectId: str
    testType: str = "load"
    durationSeconds: int = 30
    concurrentUsers: int = 100

class PerformanceTestResponse(BaseModel):
    testId: str
    status: str
    avgResponseMs: float
    p95ResponseMs: float
    p99ResponseMs: float
    throughputReqSec: float
    errorRatePercent: float
    metrics: List[MetricPoint] = []
