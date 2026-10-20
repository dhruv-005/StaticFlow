import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_security_scan_endpoint(client: AsyncClient):
    response = await client.post(
        "/api/v1/security/scan",
        json={
            "projectId": "test-project-123",
            "scanType": "quick",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "score" in data
    assert "grade" in data
    assert data["score"] >= 0
    assert isinstance(data["vulnerabilities"], list)
