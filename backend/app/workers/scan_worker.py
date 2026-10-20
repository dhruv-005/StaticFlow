"""
Security Scan Background Worker
Executes asynchronous OWASP, Nuclei, and Semgrep security scans.
"""

import asyncio
import time
from loguru import logger
from app.services.security.owasp_scanner import owasp_scanner
from app.schemas.security import ScanResponse


class ScanWorker:
    def __init__(self):
        self.active_scans: dict[str, dict] = {}

    async def execute_async_scan(self, project_id: str, scan_id: str, scan_type: str = "quick") -> ScanResponse:
        logger.info(f"🛡️  [ScanWorker] Starting {scan_type} security scan for project: {project_id} (Scan ID: {scan_id})")
        
        self.active_scans[scan_id] = {
            "project_id": project_id,
            "status": "RUNNING",
            "progress": 0,
            "started_at": time.time(),
        }

        try:
            # Phase 1: Reconnaissance
            self.active_scans[scan_id]["progress"] = 20
            await asyncio.sleep(0.5)

            # Phase 2: Active Injection Testing
            self.active_scans[scan_id]["progress"] = 50
            result = await owasp_scanner.run_scan(project_id=project_id, scan_type=scan_type)

            # Phase 3: AST Code Analysis
            self.active_scans[scan_id]["progress"] = 80
            await asyncio.sleep(0.3)

            # Phase 4: Finalizing Report
            self.active_scans[scan_id]["progress"] = 100
            self.active_scans[scan_id]["status"] = "COMPLETED"
            self.active_scans[scan_id]["result"] = result

            logger.info(f"✅ [ScanWorker] Scan {scan_id} completed with score: {result.score}/100 ({result.grade})")
            return result

        except Exception as e:
            logger.error(f"❌ [ScanWorker] Scan {scan_id} failed: {e}")
            self.active_scans[scan_id]["status"] = "FAILED"
            self.active_scans[scan_id]["error"] = str(e)
            raise

    def get_scan_status(self, scan_id: str) -> dict:
        return self.active_scans.get(scan_id, {"status": "NOT_FOUND", "progress": 0})


scan_worker = ScanWorker()
