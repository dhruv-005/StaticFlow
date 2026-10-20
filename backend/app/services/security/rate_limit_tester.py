"""
Rate Limiting & Anti-Brute-Force Tester
"""

from loguru import logger
from app.schemas.security import VulnerabilityItem


class RateLimitTesterService:
    async def test_rate_limiting(self, code: str) -> list[VulnerabilityItem]:
        findings: list[VulnerabilityItem] = []

        if "express-rate-limit" not in code and "slowapi" not in code and "RateLimiter" not in code:
            findings.append(
                VulnerabilityItem(
                    id="missing-rate-limiter",
                    severity="medium",
                    category="A04:2021-Insecure Design",
                    title="Missing API Rate Limiting Middleware",
                    description="No rate limiting mechanism detected. Sensitive endpoints are vulnerable to DoS and brute force attacks.",
                    fix="Attach express-rate-limit or Redis sliding-window rate limiters to routes.",
                    autoFixable=True,
                )
            )

        return findings


rate_limit_tester = RateLimitTesterService()
