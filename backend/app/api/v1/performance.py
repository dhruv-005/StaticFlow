from fastapi import APIRouter, HTTPException
from app.schemas.performance import PerformanceTestRequest, PerformanceTestResponse
from app.services.performance.load_tester import load_tester

router = APIRouter()

@router.post("/test", response_model=PerformanceTestResponse)
async def run_perf_test(request: PerformanceTestRequest):
    try:
        return await load_tester.execute_test(
            project_id=request.projectId,
            test_type=request.testType,
            users=request.concurrentUsers,
            duration=request.durationSeconds,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
