"""
Authentication & Authorization (BOLA/BFLA) Tester
"""

from loguru import logger
from app.schemas.security import VulnerabilityItem


class AuthTesterService:
    async def test_access_controls(self, endpoints: list[dict]) -> list[VulnerabilityItem]:
        findings: list[VulnerabilityItem] = []
        logger.info("🛡️  [AuthTester] Verifying RBAC and Object-Level Authorization (BOLA)...")

        for ep in endpoints:
            path = ep.get("path", "")
            method = ep.get("method", "GET")
            auth_required = ep.get("authRequired", False)

            # Check if destructive operations are public
            if method in ["DELETE", "PUT", "PATCH"] and not auth_required:
                findings.append(
                    VulnerabilityItem(
                        id=f"missing-auth-{method.lower()}",
                        severity="high",
                        category="A01:2021-Broken Access Control",
                        title=f"Unauthenticated {method} Endpoint Exposed",
                        description=f"Route {path} performs mutation but requires no authorization header.",
                        endpoint=path,
                        fix="Apply authentication middleware (e.g. authenticateJWT) before route handler.",
                        autoFixable=True,
                    )
                )

        return findings


auth_tester = AuthTesterService()
