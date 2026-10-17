import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_performance_test_endpoint(client: AsyncClient):
    response = await client.post(
        "/api/v1/performance/test",
        json={
            "projectId": "test-project-123",
            "testType": "load",
            "durationSeconds": 10,
            "concurrentUsers": 50,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "completed"
    assert data["avgResponseMs"] > 0
    assert len(data["metrics"]) > 0
