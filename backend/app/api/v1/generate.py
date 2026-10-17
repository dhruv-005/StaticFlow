from fastapi import APIRouter, HTTPException
from app.schemas.generate import GenerateRequest, GenerateResponse, IntentRequest, IntentResponse
from app.services.ai.code_generator import code_generator
from app.services.ai.intent_parser import intent_parser

router = APIRouter()

@router.post("/", response_model=GenerateResponse)
async def generate_api(request: GenerateRequest):
    try:
        return await code_generator.generate(
            prompt=request.prompt,
            language=request.language,
            database=request.database,
            include_auth=request.includeAuth,
            include_docker=request.includeDocker,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/intent", response_model=IntentResponse)
async def parse_prompt_intent(request: IntentRequest):
    try:
        return await intent_parser.parse_intent(request.prompt)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
