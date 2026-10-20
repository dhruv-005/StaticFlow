"""
Nuclei Automated Vulnerability Scanner Service
Runs ProjectDiscovery Nuclei template scans against target endpoints.
"""

import subprocess
import json
import shutil
from loguru import logger
from app.schemas.security import VulnerabilityItem


class NucleiRunnerService:
    def __init__(self):
        self.nuclei_path = shutil.which("nuclei") or "/root/go/bin/nuclei"

    async def scan_target(self, target_url: str) -> list[VulnerabilityItem]:
        logger.info(f"🛡️  [Nuclei] Starting template scan on: {target_url}")
        findings: list[VulnerabilityItem] = []

        try:
            cmd = [
                self.nuclei_path,
                "-u", target_url,
                "-tags", "cve,owasp,exposure,misconfig",
                "-severity", "critical,high,medium,low",
                "-jsonl",
                "-silent",
                "-timeout", "5",
                "-retries", "1",
            ]
            process = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
            
            for line in process.stdout.strip().split("\n"):
                if not line:
                    continue
                try:
                    data = json.loads(line)
                    info = data.get("info", {})
                    findings.append(
                        VulnerabilityItem(
                            id=data.get("template-id", "nuclei-finding"),
                            severity=info.get("severity", "low").lower(),
                            category=f"CVE/Template: {data.get('template-id', '')}",
                            title=info.get("name", "Vulnerability Detected"),
                            description=info.get("description", "Vulnerability detected via Nuclei template rule."),
                            endpoint=data.get("matched-at", target_url),
                            fix=info.get("remediation", "Update components and verify input validation."),
                            autoFixable=False,
                        )
                    )
                except Exception:
                    continue

        except Exception as e:
            logger.warning(f"[Nuclei] Scan fallback (executable not available or timed out): {e}")

        return findings


nuclei_runner = NucleiRunnerService()
