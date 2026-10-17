from fastapi import APIRouter, HTTPException
from app.schemas.deploy import DeployRequest, DeployResponse
from app.workers.deploy_worker import deploy_worker

router = APIRouter()

@router.post("/", response_model=DeployResponse)
async def deploy_project(request: DeployRequest):
    try:
        return await deploy_worker.execute_deployment(
            project_id=request.projectId,
            project_name=request.projectName,
            platform=request.platform,
            env_vars=request.envVars,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
