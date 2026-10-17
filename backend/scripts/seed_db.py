"""
Database Seeding Script for FastAPI / Standalone Tests
"""

import sys
import asyncio
from loguru import logger
from app.utils.helpers import generate_uuid, utc_now
from app.models.project import ProjectModel
from app.models.user import UserModel


async def seed():
    logger.info("🌱 Seeding Standalone Backend Entities...")

    demo_user = UserModel(
        id=generate_uuid("usr"),
        email="developer@staticflow.dev",
        name="Lead Architect",
        role="ADMIN",
        plan="PRO",
        created_at=utc_now(),
        updated_at=utc_now(),
    )
    logger.info(f"  ✅ Created User: {demo_user.name} ({demo_user.email})")

    demo_project = ProjectModel(
        id=generate_uuid("proj"),
        user_id=demo_user.id,
        name="Microservice Store Gateway",
        description="Auto-generated e-commerce REST backend",
        language="node-express",
        framework="express",
        database="postgresql",
        status="ACTIVE",
        code={"src/index.ts": "// Express Server"},
        endpoints_count=18,
        security_score=95,
        created_at=utc_now(),
        updated_at=utc_now(),
    )
    logger.info(f"  ✅ Created Project: {demo_project.name} (Score: {demo_project.security_score})")
    logger.info("🎉 Backend seeding completed successfully.")


if __name__ == "__main__":
    asyncio.run(seed())
