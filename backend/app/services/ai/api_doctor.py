"""
AI API Doctor Service
Inspects existing API code for bugs, security vulnerabilities, and optimizes architecture.
Can convert between frameworks (Express -> FastAPI, Django -> Spring Boot, etc.)
"""

from loguru import logger
from app.services.ai.provider_router import ai_router


class ApiDoctorService:
    SYSTEM_PROMPT = """You are StaticFlow's AI API Doctor.
Analyze the provided API code.
1. Identify logic bugs and missing error handling
2. Find security flaws and insecure queries
3. Suggest performance optimizations
4. Provide refactored, production-ready code with explanations."""

    async def diagnose_and_fix(self, code: str, language: str = "typescript") -> dict:
        prompt = f"Diagnose this {language} API code and provide improvements with full refactored code:\n\n```\n{code}\n```"
        logger.info(f"🩺 API Doctor diagnosing {language} codebase...")

        result = await ai_router.query(prompt, self.SYSTEM_PROMPT)
        return {
            "diagnosis": result["content"],
            "provider": result["provider"],
        }

    async def convert_framework(self, code: str, from_framework: str, to_framework: str) -> dict:
        prompt = f"Convert this API codebase from {from_framework} to {to_framework}. Maintain all routes, validation, and database operations:\n\n```\n{code}\n```"
        logger.info(f"🔄 Converting codebase: {from_framework} -> {to_framework}")

        result = await ai_router.query(prompt, self.SYSTEM_PROMPT)
        return {
            "convertedCode": result["content"],
            "provider": result["provider"],
        }


api_doctor = ApiDoctorService()
