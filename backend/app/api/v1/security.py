from fastapi import APIRouter, HTTPException
from app.schemas.security import ScanRequest, ScanResponse
from app.services.security.owasp_scanner import owasp_scanner

router = APIRouter()

@router.post("/scan", response_model=ScanResponse)
async def scan_project_security(request: ScanRequest):
    try:
        return await owasp_scanner.run_scan(
            project_id=request.projectId, scan_type=request.scanType
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
