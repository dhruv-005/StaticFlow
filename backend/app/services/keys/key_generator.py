"""
Cryptographic API Key Generator
"""

import secrets
from app.core.security import get_password_hash


class KeyGeneratorService:
    def generate_key(self, prefix: str = "sf_live_") -> tuple[str, str, str]:
        token = secrets.token_urlsafe(32)
        full_key = f"{prefix}{token}"
        key_prefix = full_key[:12] + "..."
        key_hash = get_password_hash(full_key)
        return full_key, key_prefix, key_hash


key_generator = KeyGeneratorService()
