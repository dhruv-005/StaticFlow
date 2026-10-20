from fastapi import APIRouter
import time, random

router = APIRouter()

@router.get("/{project_id}")
async def get_project_telemetry(project_id: str):
    now = int(time.time() * 1000)
    metrics_24h = [
        {
            "timestamp": now - (i * 3600000),
            "avgResponseTime": round(random.uniform(22.0, 48.0), 1),
            "requestCount": random.randint(200, 1800),
            "errorCount": random.randint(0, 3),
        }
        for i in range(24)
    ]
    return {
        "projectId": project_id,
        "uptimePercentage": 99.985,
        "avgResponseTimeMs": 34.2,
        "totalRequests": sum(m["requestCount"] for m in metrics_24h),
        "errorRate": 0.02,
        "metrics24h": metrics_24h,
        "status": "operational",
    }
