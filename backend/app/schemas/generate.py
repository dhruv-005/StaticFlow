from pydantic import BaseModel
from typing import List, Dict, Optional

class CodeBlock(BaseModel):
    fileName: str
    language: str
    code: str

class GenerateRequest(BaseModel):
    prompt: str
    language: str = "node-express"
    database: str = "postgresql"
    includeAuth: bool = True
    includeValidation: bool = True
    includeDocker: bool = True

class GenerateResponse(BaseModel):
    success: bool
    summary: str
    codeBlocks: List[CodeBlock]
    providerUsed: str = "ollama"
    generationTimeMs: float = 0.0

class IntentRequest(BaseModel):
    prompt: str

class IntentResponse(BaseModel):
    entities: List[str] = []
    features: List[str] = []
    suggestedStack: Dict[str, str] = {}
    endpoints: List[str] = []
    complexity: str = "medium"
    clarifyingQuestions: List[str] = []
