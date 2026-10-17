"""
Performance & Load Testing Worker
Executes virtual user load generation and telemetry sampling.
"""

import asyncio
from loguru import logger
from app.services.performance.load_tester import load_tester
from app.schemas.performance import PerformanceTestResponse


class TestWorker:
    def __init__(self):
        self.active_tests: dict[str, dict] = {}

    async def execute_async_test(
        self, project_id: str, test_id: str, test_type: str = "load", users: int = 100, duration: int = 30
    ) -> PerformanceTestResponse:
        logger.info(f"⚡ [TestWorker] Launching {test_type} benchmark for {project_id}: {users} VUs for {duration}s")

        self.active_tests[test_id] = {
            "project_id": project_id,
            "status": "RUNNING",
            "users": users,
            "duration": duration,
        }

        try:
            result = await load_tester.execute_test(
                project_id=project_id,
                test_type=test_type,
                users=users,
                duration=duration,
            )

            self.active_tests[test_id]["status"] = "COMPLETED"
            self.active_tests[test_id]["result"] = result
            logger.info(f"✅ [TestWorker] Benchmark {test_id} complete. Throughput: {result.throughputReqSec} req/s")
            return result

        except Exception as e:
            logger.error(f"❌ [TestWorker] Benchmark {test_id} failed: {e}")
            self.active_tests[test_id]["status"] = "FAILED"
            self.active_tests[test_id]["error"] = str(e)
            raise


test_worker = TestWorker()
