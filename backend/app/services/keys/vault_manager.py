"""
Hardware KMS Enveloped Secret Vault Manager
"""

from app.services.keys.encryption import encrypt_secret, decrypt_secret


class VaultManagerService:
    def __init__(self):
        self._store: dict[str, str] = {}

    def set_secret(self, key_name: str, raw_value: str) -> str:
        encrypted = encrypt_secret(raw_value)
        self._store[key_name] = encrypted
        return encrypted

    def get_secret(self, key_name: str) -> str | None:
        encrypted = self._store.get(key_name)
        if not encrypted:
            return None
        return decrypt_secret(encrypted)


vault_manager = VaultManagerService()
