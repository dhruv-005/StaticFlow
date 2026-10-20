"""
AI Performance Bottleneck Analyzer
Detects N+1 queries, missing cache opportunities, and blocking operations.
"""

from loguru import logger
from app.services.ai.provider_router import ai_router


class PerformanceAnalyzerService:
    SYSTEM_PROMPT = """You are StaticFlow's Performance Optimization Engineer.
Analyze code and latency telemetry to find bottlenecks.
Suggest concrete fixes (Redis caching, database composite indexes, async batching, payload compression)."""

    async def analyze_bottlenecks(self, code_snippet: str, avg_latency_ms: float) -> str:
        prompt = f"Average response latency is {avg_latency_ms}ms. Analyze this endpoint code for bottlenecks and suggest optimizations:\n\n```\n{code_snippet}\n```"
        logger.info("⚡ Analyzing performance bottlenecks...")

        result = await ai_router.query(prompt, self.SYSTEM_PROMPT)
        return result["content"]


performance_analyzer = PerformanceAnalyzerService()
