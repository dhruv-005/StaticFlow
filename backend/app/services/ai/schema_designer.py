"""
AI Database Schema Designer Service
Generates normalized PostgreSQL / MongoDB schemas with indexes, constraints, and foreign keys.
"""

import json
from loguru import logger
from app.services.ai.provider_router import ai_router


class SchemaDesignerService:
    SYSTEM_PROMPT = """You are StaticFlow's Database Architect. 
Design an optimized, normalized database schema based on entities.
Output a JSON schema specification with tables, columns, data types, primary keys, foreign keys, and indexes.

Output Format:
{
  "database": "postgresql",
  "tables": [
    {
      "name": "users",
      "columns": [
        {"name": "id", "type": "UUID", "primaryKey": true, "nullable": false},
        {"name": "email", "type": "VARCHAR(255)", "unique": true, "nullable": false},
        {"name": "password_hash", "type": "VARCHAR(255)", "nullable": false},
        {"name": "created_at", "type": "TIMESTAMP", "default": "NOW()"}
      ],
      "indexes": ["email"]
    }
  ],
  "prismaSchema": "datasource db {...}"
}"""

    async def design_schema(self, entities: list[str], database: str = "postgresql") -> dict:
        prompt = f"Design a complete {database} schema for these entities: {', '.join(entities)}. Include Prisma schema definition."
        logger.info(f"🗄️  Designing {database} schema for entities: {entities}")

        result = await ai_router.query(prompt, self.SYSTEM_PROMPT)
        raw = result["content"]

        try:
            start = raw.find("{")
            end = raw.rfind("}") + 1
            return json.loads(raw[start:end])
        except Exception:
            return {
                "database": database,
                "tables": [
                    {
                        "name": "items",
                        "columns": [
                            {"name": "id", "type": "UUID", "primaryKey": True},
                            {"name": "name", "type": "VARCHAR(255)", "nullable": False},
                            {"name": "created_at", "type": "TIMESTAMP", "default": "NOW()"},
                        ],
                        "indexes": ["name"],
                    }
                ],
                "prismaSchema": f"// Fallback {database} schema",
            }


schema_designer = SchemaDesignerService()
