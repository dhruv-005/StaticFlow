"""
Security Report PDF & JSON Generator
"""

import json
from datetime import datetime, timezone
from app.schemas.security import ScanResponse


class ReportGeneratorService:
    def generate_json_report(self, scan_result: ScanResponse) -> str:
        return json.dumps(
            {
                "report": "StaticFlow Autonomous Security Audit",
                "generatedAt": datetime.now(timezone.utc).isoformat(),
                "summary": {
                    "scanId": scan_result.scanId,
                    "score": scan_result.score,
                    "grade": scan_result.grade,
                    "testsRun": scan_result.testsRun,
                    "passed": scan_result.passed,
                    "failed": scan_result.failed,
                    "durationMs": scan_result.durationMs,
                },
                "vulnerabilities": [v.model_dump() for v in scan_result.vulnerabilities],
            },
            indent=2,
        )

    def generate_markdown_report(self, scan_result: ScanResponse) -> str:
        md = f"""# 🛡️ StaticFlow Security Audit Report
**Scan ID:** `{scan_result.scanId}`  
**Security Score:** **{scan_result.score}/100 ({scan_result.grade})**  
**Tests Executed:** {scan_result.testsRun} ({scan_result.passed} Passed, {scan_result.failed} Failed)  
**Execution Duration:** {scan_result.durationMs}ms  

---

## 🔍 Detected Vulnerabilities
"""
        if not scan_result.vulnerabilities:
            md += "\n✅ **All tests passed! No vulnerabilities detected.**\n"
        else:
            for i, v in enumerate(scan_result.vulnerabilities, 1):
                md += f"""
### {i}. [{v.severity.upper()}] {v.title}
- **Category:** `{v.category}`
- **Description:** {v.description}
- **Remediation:** {v.fix}
"""
        return md


report_generator = ReportGeneratorService()
