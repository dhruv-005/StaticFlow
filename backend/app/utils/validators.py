import re


def is_valid_email(email: str) -> bool:
    pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    return bool(re.match(pattern, email))


def is_valid_url(url: str) -> bool:
    pattern = r"^https?:\/\/[^\s/$.?#].[^\s]*$"
    return bool(re.match(pattern, url, re.IGNORECASE))


def is_valid_cidr(cidr: str) -> bool:
    pattern = r"^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$"
    return bool(re.match(pattern, cidr))


def validate_project_name(name: str) -> bool:
    return bool(name and 2 <= len(name) <= 100 and re.match(r"^[a-zA-Z0-9\s\-_]+$", name))
