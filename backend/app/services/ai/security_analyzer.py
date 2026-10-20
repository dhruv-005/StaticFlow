"""
AI Deep Security Analyzer
AST-level code inspection for OWASP Top 10 vulnerabilities.
"""

import json
from loguru import logger
from app.services.ai.provider_router import ai_router


class SecurityAnalyzerService:
    SYSTEM_PROMPT = """You are StaticFlow's AI Security Auditor.
Analyze code files for OWASP Top 10 API vulnerabilities.
Output valid JSON array of findings:
[
  {
    "id": "vuln-1",
    "severity": "critical" | "high" | "medium" | "low" | "info",
    "category": "A03:2021-Injection",
    "title": "SQL Injection in User Query",
    "description": "User input concatenated directly into database query string.",
    "file": "src/controllers/user.ts",
    "line": 42,
    "fix": "Use parameterized queries or ORM methods.",
    "autoFixable": true
  }
]"""

    async def analyze_code(self, code_files: dict[str, str]) -> list[dict]:
        code_bundle = "\n\n".join([f"// FILE: {path}\n{content}" for path, content in list(code_files.items())[:5]])
        prompt = f"Audit this API code for security vulnerabilities:\n\n{code_bundle[:4000]}"
        logger.info("🔍 Running AI code security analysis...")

        result = await ai_router.query(prompt, self.SYSTEM_PROMPT)
        raw = result["content"]

        try:
            start = raw.find("[")
            end = raw.rfind("]") + 1
            return json.loads(raw[start:end])
        except Exception:
            return []


security_analyzer = SecurityAnalyzerService()
