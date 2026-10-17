"""
AES-256-GCM Hardware-Grade Cryptographic Primitive
"""

import os
import base64
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

MASTER_KEY = os.getenv("ENCRYPTION_KEY", "staticflow_32_byte_master_secret_key_!")[:32].encode("utf-8").ljust(32, b"0")


def encrypt_secret(plain_text: str) -> str:
    aesgcm = AESGCM(MASTER_KEY)
    nonce = os.urandom(12)
    cipher_bytes = aesgcm.encrypt(nonce, plain_text.encode("utf-8"), None)
    return base64.b64encode(nonce + cipher_bytes).decode("utf-8")


def decrypt_secret(encrypted_base64: str) -> str:
    aesgcm = AESGCM(MASTER_KEY)
    raw = base64.b64decode(encrypted_base64.encode("utf-8"))
    nonce = raw[:12]
    cipher_bytes = raw[12:]
    return aesgcm.decrypt(nonce, cipher_bytes, None).decode("utf-8")
