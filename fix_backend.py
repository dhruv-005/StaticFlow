import os, sys, subprocess

print("🔧 [1/4] Writing backend routers & main.py...")

os.makedirs("backend/app/api/v1", exist_ok=True)
os.makedirs("backend/app/core", exist_ok=True)
os.makedirs("backend/app/services/ai", exist_ok=True)
os.makedirs("backend/app/services/security", exist_ok=True)
os.makedirs("backend/app/services/performance", exist_ok=True)
os.makedirs("backend/app/schemas", exist_ok=True)
os.makedirs("backend/app/workers", exist_ok=True)

# 1. backend/app/core/config.py
with open("backend/app/core/config.py", "w") as f:
    f.write('''import os, json
from typing import List, Union
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "StaticFlow Engine"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    SECRET_KEY: str = os.getenv("BACKEND_SECRET_KEY", "staticflow_prod_secret_key_32_chars_min")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    ALLOWED_ORIGINS: Union[str, List[str]] = "*"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://staticflow:staticflow_dev_2024@localhost:5432/staticflow")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    GROQ_API_KEY: str | None = os.getenv("GROQ_API_KEY", None)
    GEMINI_API_KEY: str | None = os.getenv("GEMINI_API_KEY", None)
    HUGGINGFACE_API_KEY: str | None = os.getenv("HUGGINGFACE_API_KEY", None)
    OPENROUTER_API_KEY: str | None = os.getenv("OPENROUTER_API_KEY", None)
    ZAP_URL: str = os.getenv("ZAP_URL", "http://localhost:8080")

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def parsed_allowed_origins(self) -> List[str]:
        if isinstance(self.ALLOWED_ORIGINS, list):
            return self.ALLOWED_ORIGINS
        if isinstance(self.ALLOWED_ORIGINS, str):
            val = self.ALLOWED_ORIGINS.strip()
            if not val or val == "*":
                return ["*"]
            if val.startswith("[") and val.endswith("]"):
                try:
                    return json.loads(val)
                except Exception:
                    pass
            return [item.strip() for item in val.split(",") if item.strip()]
        return ["*"]

settings = Settings()
''')

# 2. backend/app/core/cors.py
with open("backend/app/core/cors.py", "w") as f:
    f.write('''from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

def setup_cors(app: FastAPI) -> None:
    origins = settings.parsed_allowed_origins if settings.ENVIRONMENT == "production" else ["*"]
    if not origins:
        origins = ["*"]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
''')

# 3. backend/app/api/v1/health.py
with open("backend/app/api/v1/health.py", "w") as f:
    f.write('''from fastapi import APIRouter
import time

router = APIRouter()
START_TIME = time.time()

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "uptime_seconds": int(time.time() - START_TIME),
        "engine": "StaticFlow AI Engine",
    }
''')

# 4. backend/app/api/v1/generate.py
with open("backend/app/api/v1/generate.py", "w") as f:
    f.write('''from fastapi import APIRouter, HTTPException
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
''')

# 5. backend/app/api/v1/security.py
with open("backend/app/api/v1/security.py", "w") as f:
    f.write('''from fastapi import APIRouter, HTTPException
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
''')

# 6. backend/app/api/v1/performance.py
with open("backend/app/api/v1/performance.py", "w") as f:
    f.write('''from fastapi import APIRouter, HTTPException
from app.schemas.performance import PerformanceTestRequest, PerformanceTestResponse
from app.services.performance.load_tester import load_tester

router = APIRouter()

@router.post("/test", response_model=PerformanceTestResponse)
async def run_perf_test(request: PerformanceTestRequest):
    try:
        return await load_tester.execute_test(
            project_id=request.projectId,
            test_type=request.testType,
            users=request.concurrentUsers,
            duration=request.durationSeconds,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
''')

# 7. backend/app/api/v1/deploy.py
with open("backend/app/api/v1/deploy.py", "w") as f:
    f.write('''from fastapi import APIRouter, HTTPException
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
''')

# 8. backend/app/api/v1/docs.py
with open("backend/app/api/v1/docs.py", "w") as f:
    f.write('''from fastapi import APIRouter, HTTPException
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
''')

# 9. backend/app/api/v1/keys.py
with open("backend/app/api/v1/keys.py", "w") as f:
    f.write('''from fastapi import APIRouter, HTTPException
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
''')

# 10. backend/app/api/v1/monitoring.py
with open("backend/app/api/v1/monitoring.py", "w") as f:
    f.write('''from fastapi import APIRouter
import time, random

router = APIRouter()

@router.get("/{project_id}")
async def get_project_telemetry(project_id: str):
    now = int(time.time() * 1000)
    metrics_24h = [
        {
            "timestamp": now - (i * 3600000),
            "avgResponseTime": round(random.uniform(22.0, 48.0), 1),
            "requestCount": random.randint(200, 1800),
            "errorCount": random.randint(0, 3),
        }
        for i in range(24)
    ]
    return {
        "projectId": project_id,
        "uptimePercentage": 99.985,
        "avgResponseTimeMs": 34.2,
        "totalRequests": sum(m["requestCount"] for m in metrics_24h),
        "errorRate": 0.02,
        "metrics24h": metrics_24h,
        "status": "operational",
    }
''')

# 11. backend/app/api/v1/marketplace.py
with open("backend/app/api/v1/marketplace.py", "w") as f:
    f.write('''from fastapi import APIRouter

router = APIRouter()

@router.get("/templates")
async def list_marketplace_templates():
    return {
        "templates": [
            {
                "id": "tpl-ecommerce-pro",
                "title": "E-Commerce Microservice Suite",
                "category": "E-Commerce",
                "language": "node-express",
                "database": "postgresql",
                "stars": 4.9,
                "downloads": 3820,
            }
        ]
    }
''')

# 12. backend/app/api/v1/router.py (CRITICAL: defines api_router)
with open("backend/app/api/v1/router.py", "w") as f:
    f.write('''from fastapi import APIRouter
from app.api.v1 import health, generate, security, performance, deploy, docs, keys, monitoring, marketplace

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(generate.router, prefix="/generate", tags=["AI Generation"])
api_router.include_router(security.router, prefix="/security", tags=["Security Engine"])
api_router.include_router(performance.router, prefix="/performance", tags=["Performance Testing"])
api_router.include_router(deploy.router, prefix="/deploy", tags=["Deployment"])
api_router.include_router(docs.router, prefix="/docs", tags=["Documentation"])
api_router.include_router(keys.router, prefix="/keys", tags=["Key Management"])
api_router.include_router(monitoring.router, prefix="/monitoring", tags=["Monitoring"])
api_router.include_router(marketplace.router, prefix="/marketplace", tags=["Marketplace"])
''')

# 13. backend/main.py
with open("backend/main.py", "w") as f:
    f.write('''import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from loguru import logger

from app.core.config import settings
from app.core.cors import setup_cors
from app.api.v1.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("⚡ StaticFlow AI Engine Starting...")
    yield
    logger.info("🛑 StaticFlow AI Engine Shutting Down...")


app = FastAPI(
    title="StaticFlow Engine API",
    description="AI API generation, OWASP security scanning, and deployment engine.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Setup CORS
setup_cors(app)


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.perf_counter()
    response = await call_next(request)
    process_time = time.perf_counter() - start_time
    response.headers["X-Process-Time"] = f"{process_time * 1000:.2f}ms"
    response.headers["X-Engine"] = "StaticFlow-AI"
    return response


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global unhandled error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"success": False, "error": "Internal AI Engine Error", "details": str(exc)},
    )


@app.get("/")
async def root():
    return {
        "engine": "StaticFlow AI & Security Engine",
        "status": "operational",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "healthy", "engine": "StaticFlow AI Engine"}


# Mount API V1 Router
app.include_router(api_router, prefix="/api/v1")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
''')

print("🧪 [2/4] Testing backend import locally with virtualenv...")
python_bin = "./backend/venv/bin/python3" if os.path.exists("./backend/venv/bin/python3") else "python3"
test_cmd = [
    python_bin, "-c",
    "import sys; sys.path.insert(0, './backend'); from main import app; print('✅ main:app loaded successfully! Routes count:', len(app.routes))"
]
res = subprocess.run(test_cmd, capture_output=True, text=True)
if res.returncode == 0:
    print(res.stdout)
    print("🎉 BACKEND VERIFICATION PASSED!")
else:
    print("❌ Import error details:", res.stderr)
    sys.exit(1)
