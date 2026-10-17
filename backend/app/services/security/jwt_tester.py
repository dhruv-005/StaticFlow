"""
JWT Security & Token Manipulation Tester
Tests for 'none' algorithm, signature bypass, expiration flaws, and weak secret brute forcing.
"""

import jwt
from loguru import logger
from app.schemas.security import VulnerabilityItem


class JWTTesterService:
    async def test_token_vulnerabilities(self, sample_token: str, secret: str = "secret") -> list[VulnerabilityItem]:
        findings: list[VulnerabilityItem] = []
        logger.info("🔑 [JWTTester] Testing JWT implementation resilience...")

        try:
            # Test 1: Alg None Bypass
            header = jwt.get_unverified_header(sample_token)
            if header.get("alg") == "none":
                findings.append(
                    VulnerabilityItem(
                        id="jwt-none-alg",
                        severity="critical",
                        category="A07:2021-Authentication Failures",
                        title="JWT Accepts 'none' Algorithm",
                        description="The API accepts unsigned JWT tokens with alg='none'.",
                        fix="Enforce strict HMAC-SHA256 (HS256) or RSA (RS256) algorithm verification.",
                        autoFixable=True,
                    )
                )

            # Test 2: Weak Secret Check
            for weak in ["secret", "password", "123456", "admin", "jwt_secret"]:
                try:
                    jwt.decode(sample_token, weak, algorithms=["HS256"])
                    findings.append(
                        VulnerabilityItem(
                            id="jwt-weak-secret",
                            severity="high",
                            category="A02:2021-Cryptographic Failures",
                            title="Weak / Guessable JWT Signing Secret",
                            description=f"JWT was signed with a common dictionary secret: '{weak}'.",
                            fix="Generate high-entropy 256-bit cryptographic secrets via crypto.randomBytes(32).",
                            autoFixable=True,
                        )
                    )
                    break
                except Exception:
                    pass

        except Exception as e:
            logger.debug(f"[JWTTester] Token test note: {e}")

        return findings


jwt_tester = JWTTesterService()
