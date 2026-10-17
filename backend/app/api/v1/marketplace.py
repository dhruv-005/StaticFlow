from fastapi import APIRouter

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
