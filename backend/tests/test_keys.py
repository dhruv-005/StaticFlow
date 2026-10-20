from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    decode_access_token,
)


def test_password_hashing():
    raw = "SuperSecretPassword123!"
    hashed = get_password_hash(raw)
    assert hashed != raw
    assert verify_password(raw, hashed) is True
    assert verify_password("WrongPassword", hashed) is False


def test_jwt_generation_and_decoding():
    payload = {"sub": "usr_9981", "email": "alex@staticflow.dev", "role": "ADMIN"}
    token = create_access_token(payload)
    assert isinstance(token, str)

    decoded = decode_access_token(token)
    assert decoded is not None
    assert decoded["sub"] == "usr_9981"
    assert decoded["email"] == "alex@staticflow.dev"
    assert decoded["role"] == "ADMIN"
