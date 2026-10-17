from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ai.doc_generator import doc_generator

router = APIRouter()

class DocGenerateRequest(BaseModel):
    projectId: str
    code: dict[str, str]

@router.post("/generate")
async def generate_api_docs(request: DocGenerateRequest):
    try:
        spec = await doc_generator.generate_openapi_spec(request.code)
        return {"openapi": spec}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
