import pytest
from app.workers.deploy_worker import deploy_worker


@pytest.mark.asyncio
async def test_deploy_worker_execution():
    res = await deploy_worker.execute_deployment(
        project_id="proj-123",
        project_name="Order Service API",
        platform="vercel",
    )
    assert res.status == "LIVE"
    assert "https://order-service-api.vercel.dev" in res.url
    assert len(res.logs) >= 3
