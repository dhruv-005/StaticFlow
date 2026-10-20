from pydantic import BaseModel
from typing import List, Optional

class VulnerabilityItem(BaseModel):
    id: str
    severity: str
    category: str
    title: str
    description: str
    file: Optional[str] = None
    line: Optional[int] = None
    fix: str
    autoFixable: bool = False

class ScanRequest(BaseModel):
    projectId: str
    scanType: str = "quick"
    code: Optional[dict] = None

class ScanResponse(BaseModel):
    scanId: str
    score: int
    grade: str
    vulnerabilities: List[VulnerabilityItem] = []
    testsRun: int = 150
    passed: int = 149
    failed: int = 1
    durationMs: float = 0.0
