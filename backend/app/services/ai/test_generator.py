"""
AI Automated Test Suite Generator
Creates Pytest / Jest / Vitest unit, integration, and security edge-case tests.
"""

from loguru import logger
from app.services.ai.provider_router import ai_router


class TestGeneratorService:
    SYSTEM_PROMPT = """You are StaticFlow's QA Test Automation Engineer.
Generate a comprehensive test suite (Jest for Node.js or Pytest for Python).
Include tests for:
1. Happy path operations (200/201)
2. Input validation failures (400)
3. Authentication and authorization bypass attempts (401/403)
4. Resource not found errors (404)
5. Boundary and edge-case values"""

    async def generate_tests(self, code_snippet: str, language: str = "node-express") -> str:
        prompt = f"Generate complete automated test suite for this {language} API code:\n\n```\n{code_snippet}\n```"
        logger.info(f"🧪 Generating test suite for {language}...")

        result = await ai_router.query(prompt, self.SYSTEM_PROMPT)
        return result["content"]


test_generator = TestGeneratorService()
