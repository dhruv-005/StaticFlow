import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health_endpoint(client: AsyncClient):
    response = await client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "uptime_seconds" in data


@pytest.mark.asyncio
async def test_code_generation_offline(client: AsyncClient, sample_prompt: str):
    response = await client.post(
        "/api/v1/generate/",
        json={
            "prompt": sample_prompt,
            "language": "node-express",
            "database": "postgresql",
            "includeAuth": True,
            "includeDocker": True,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["codeBlocks"]) > 0
    assert "src/index.ts" in [b["fileName"] for b in data["codeBlocks"]] or len(data["codeBlocks"]) >= 1


@pytest.mark.asyncio
async def test_intent_parsing(client: AsyncClient):
    response = await client.post(
        "/api/v1/generate/intent",
        json={"prompt": "I need an e-commerce store with orders and checkout"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "entities" in data
    assert "features" in data
    assert "suggestedStack" in data
