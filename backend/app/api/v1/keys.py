from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utils.helpers import generate_secure_token
from app.core.security import get_password_hash

router = APIRouter()

class CreateKeyRequest(BaseModel):
    projectId: str
    keyName: str
    permissions: list[str] = ["read"]

@router.post("/")
async def create_api_key(request: CreateKeyRequest):
    try:
        raw_key = f"sf_live_{generate_secure_token(24)}"
        key_hash = get_password_hash(raw_key)
        return {
            "keyName": request.keyName,
            "keyPrefix": raw_key[:12] + "...",
            "fullKey": raw_key,
            "permissions": request.permissions,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
