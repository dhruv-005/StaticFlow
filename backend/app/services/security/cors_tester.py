"""
CORS Misconfiguration Tester
"""

from loguru import logger
from app.schemas.security import VulnerabilityItem


class CorsTesterService:
    async def test_cors_policy(self, code: str) -> list[VulnerabilityItem]:
        findings: list[VulnerabilityItem] = []

        if 'origin: "*"' in code or "allow_origins=['*']" in code or "cors()" in code:
            findings.append(
                VulnerabilityItem(
                    id="cors-wildcard",
                    severity="medium",
                    category="A05:2021-Security Misconfiguration",
                    title="Permissive CORS Wildcard Policy",
                    description="Access-Control-Allow-Origin header is set to wildcard '*' without origin validation.",
                    fix="Restrict allowed origins to explicit domain lists and validate request Origin headers.",
                    autoFixable=True,
                )
            )

        return findings


cors_tester = CorsTesterService()
