import json


def format_json_response(data: dict | list, indent: int = 2) -> str:
    return json.dumps(data, indent=indent, default=str)


def mask_secret(secret: str, visible_start: int = 4, visible_end: int = 4) -> str:
    if len(secret) <= visible_start + visible_end:
        return "••••••••"
    return f"{secret[:visible_start]}{'•' * (len(secret) - visible_start - visible_end)}{secret[-visible_end:]}"


def sanitize_filename(name: str) -> str:
    return re.sub(r"[^\w\-_\.]", "_", name)


import re
