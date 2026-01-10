# backend\app\schemas.py
from typing import Annotated, List, Optional
from pydantic import BaseModel, Field


class TodoBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False
    order: int = 0

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    order: Optional[int] = None

class Todo(TodoBase):
    id: int
    owner_id: int
    priority: Optional[str] = None
    tags: Optional[List[str]] = None
    class Config:
        from_attributes = True

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    avatar: Optional[str] = None

class User(UserBase):
    id: int
    display_name: Optional[str] = None
    avatar: Optional[str] = None
    todos: List[Todo] = []
    class Config:
        from_attributes = True

class TodoOrder(BaseModel):
    id: int
    order: Annotated[int, Field(ge=0)]
