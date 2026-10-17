"""
SQLMap Automated SQL Injection Testing Engine
"""

import subprocess
import shutil
from loguru import logger
from app.schemas.security import VulnerabilityItem


class SQLMapRunnerService:
    def __init__(self):
        self.sqlmap_path = shutil.which("sqlmap") or "sqlmap"

    async def test_endpoint(self, target_url: str, method: str = "GET", data: str | None = None) -> list[VulnerabilityItem]:
        logger.info(f"💉 [SQLMap] Fuzzing SQL injection vectors on: {target_url}")
        findings: list[VulnerabilityItem] = []

        try:
            cmd = [
                self.sqlmap_path,
                "-u", target_url,
                "--batch",
                "--random-agent",
                "--level=1",
                "--risk=1",
                "--timeout=10",
                "--smart",
            ]
            if data and method == "POST":
                cmd.extend(["--data", data])

            process = subprocess.run(cmd, capture_output=True, text=True, timeout=90)
            output = process.stdout

            if "is vulnerable" in output.lower() or "sqlmap identified" in output.lower():
                findings.append(
                    VulnerabilityItem(
                        id="sqlmap-injection-found",
                        severity="critical",
                        category="A03:2021-Injection",
                        title="SQL Injection Vulnerability Confirmed",
                        description=f"Endpoint {target_url} was confirmed vulnerable to SQL injection by automated fuzzing.",
                        endpoint=target_url,
                        fix="Use parameterized prepared statements or an ORM like Prisma/SQLAlchemy.",
                        autoFixable=True,
                    )
                )
        except Exception as e:
            logger.warning(f"[SQLMap] Execution skipped: {e}")

        return findings


sqlmap_runner = SQLMapRunnerService()
