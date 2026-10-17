"""
AI Endpoint Planner Service
Extracts REST / GraphQL endpoints from requirements and maps input/output schemas.
"""

import json
from loguru import logger
from app.services.ai.provider_router import ai_router


class EndpointPlannerService:
    SYSTEM_PROMPT = """You are StaticFlow's REST Endpoint Architect.
Plan a complete set of REST endpoints following industry best practices.
Output valid JSON containing route methods, paths, summaries, auth requirements, and status codes.

Output Format:
{
  "endpoints": [
    {
      "method": "POST",
      "path": "/api/v1/auth/register",
      "summary": "Register user",
      "authRequired": false,
      "expectedStatus": 201
    }
  ]
}"""

    async def plan_endpoints(self, prompt: str, entities: list[str]) -> list[dict]:
        user_prompt = f"Plan all CRUD and business logic endpoints for entities: {', '.join(entities)}. Requirements: {prompt}"
        logger.info(f"📋 Planning API endpoints for: {prompt[:50]}...")

        result = await ai_router.query(user_prompt, self.SYSTEM_PROMPT)
        raw = result["content"]

        try:
            start = raw.find("{")
            end = raw.rfind("}") + 1
            data = json.loads(raw[start:end])
            return data.get("endpoints", [])
        except Exception:
            return [
                {"method": "GET", "path": "/health", "summary": "Health check", "authRequired": False, "expectedStatus": 200},
                {"method": "GET", "path": "/api/v1/items", "summary": "List items", "authRequired": True, "expectedStatus": 200},
                {"method": "POST", "path": "/api/v1/items", "summary": "Create item", "authRequired": True, "expectedStatus": 201},
            ]


endpoint_planner = EndpointPlannerService()
