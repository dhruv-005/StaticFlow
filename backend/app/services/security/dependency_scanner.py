"""
Package Manifest & Dependency CVE Scanner
"""

import json
from loguru import logger
from app.schemas.security import VulnerabilityItem


class DependencyScannerService:
    async def scan_manifest(self, package_json_content: str) -> list[VulnerabilityItem]:
        findings: list[VulnerabilityItem] = []

        try:
            pkg = json.loads(package_json_content)
            deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}

            # Check known outdated/vulnerable packages
            if "jsonwebtoken" in deps and deps["jsonwebtoken"].startswith("^8."):
                findings.append(
                    VulnerabilityItem(
                        id="cve-jsonwebtoken-old",
                        severity="medium",
                        category="A06:2021-Vulnerable and Outdated Components",
                        title="Vulnerable jsonwebtoken Library Version",
                        description="jsonwebtoken version < 9.0.0 is vulnerable to prototype pollution and key confusion.",
                        fix="Upgrade to jsonwebtoken@^9.0.2.",
                        autoFixable=True,
                    )
                )
        except Exception:
            pass

        return findings


dependency_scanner = DependencyScannerService()
