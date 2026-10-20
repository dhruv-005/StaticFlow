from fastapi import APIRouter
import time

router = APIRouter()
START_TIME = time.time()

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "uptime_seconds": int(time.time() - START_TIME),
        "engine": "StaticFlow AI Engine",
    }
