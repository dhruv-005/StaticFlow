"""
Semgrep AST Static Code Analysis Service
"""

import subprocess
import json
import tempfile
import os
from loguru import logger
from app.schemas.security import VulnerabilityItem


class SemgrepRunnerService:
    async def analyze_project_code(self, files: dict[str, str], config_path: str = "/engine/configs/semgrep-rules.yaml") -> list[VulnerabilityItem]:
        findings: list[VulnerabilityItem] = []

        with tempfile.TemporaryDirectory() as temp_dir:
            for file_path, content in files.items():
                full_path = os.path.join(temp_dir, file_path)
                os.makedirs(os.path.dirname(full_path), exist_ok=True)
                with open(full_path, "w", encoding="utf-8") as f:
                    f.write(content)

            try:
                cmd = ["semgrep", "scan", "--json", temp_dir]
                if os.path.exists(config_path):
                    cmd.extend(["--config", config_path])
                else:
                    cmd.extend(["--config", "auto"])

                process = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
                raw = json.loads(process.stdout) if process.stdout else {}

                for result in raw.get("results", []):
                    rule_id = result.get("check_id", "semgrep-rule")
                    extra = result.get("extra", {})
                    rel_path = os.path.relpath(result.get("path", ""), temp_dir)

                    findings.append(
                        VulnerabilityItem(
                            id=rule_id,
                            severity=extra.get("severity", "WARNING").lower().replace("warning", "medium").replace("error", "high"),
                            category=extra.get("metadata", {}).get("category", "A05:2021-Security Misconfiguration"),
                            title=rule_id.replace("-", " ").title(),
                            description=extra.get("message", "Static analysis security finding."),
                            file=rel_path,
                            line=result.get("start", {}).get("line"),
                            fix=extra.get("fix", "Review code according to security best practices."),
                            autoFixable=bool(extra.get("fix")),
                        )
                    )
            except Exception as e:
                logger.warning(f"[Semgrep] Analysis fallback: {e}")

        return findings


semgrep_runner = SemgrepRunnerService()
