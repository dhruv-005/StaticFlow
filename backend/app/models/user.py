from datetime import datetime
from pydantic import BaseModel, EmailStr


class UserModel(BaseModel):
    id: str
    email: EmailStr
    name: str | None = None
    avatar_url: str | None = None
    role: str = "USER"
    plan: str = "FREE"
    created_at: datetime
    updated_at: datetime
