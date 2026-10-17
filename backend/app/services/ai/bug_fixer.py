"""
AI Automated Bug & Vulnerability Fixer
Applies deterministic code patches based on security scan findings.
"""

from loguru import logger
from app.services.ai.provider_router import ai_router


class BugFixerService:
    SYSTEM_PROMPT = """You are StaticFlow's Automated Vulnerability Patch Engine.
Given a vulnerability finding and the affected code file, generate the exact patched file.
Output ONLY the full fixed code inside markdown code blocks."""

    async def apply_vulnerability_fix(self, file_content: str, vulnerability_desc: str, fix_suggestion: str) -> str:
        prompt = f"""Vulnerability: {vulnerability_desc}
Suggested Fix: {fix_suggestion}

Original Code:
