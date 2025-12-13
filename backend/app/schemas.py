# backend\app\schemas.py
from pydantic import BaseModel
from typing import List, Optional


class TodoBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False


class TodoCreate(TodoBase):
    pass


class Todo(TodoBase):
    id: int
    owner_id: int
    class Config:
        from_attributes = True # 允許讀取 ORM 物件


class UserBase(BaseModel):
    username: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    todos: List[Todo] = []
    class Config:
        from_attributes = True
