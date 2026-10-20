"""
Key Rotation & Grace Period Engine
"""

from loguru import logger
from app.services.keys.key_generator import key_generator


class KeyRotatorService:
    async def rotate_key(self, old_key_id: str) -> dict:
        logger.info(f"🔄 Rotating cryptographic key: {old_key_id}")
        full_key, key_prefix, key_hash = key_generator.generate_key()

        return {
            "oldKeyId": old_key_id,
            "newKeyPrefix": key_prefix,
            "newFullKey": full_key,
            "status": "ACTIVE",
            "gracePeriodHours": 24,
        }


key_rotator = KeyRotatorService()
