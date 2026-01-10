# backend\app\crud.py
from sqlalchemy.orm import Session
from . import models, schemas, auth


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def create_user(db: Session, user: schemas.UserCreate):
    # 使用 auth.py 裡面的 get_password_hash 來加密
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


def create_user_todo(db: Session, todo: schemas.TodoCreate, user_id: int):
    # 使用 **todo.dict() 將 Pydantic 模型轉為參數
    # 注意： Pydantic v2 建議使用 todo.model_dump()，但為了相容性這裡使用 dict()
    db_todo = models.Todo(**todo.dict(), owner_id=user_id)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)

    return db_todo

def get_todos(db: Session, skip: int = 0, limit: int =100):
    return db.query(models.Todo).offset(skip).limit(limit).all()

def get_user_todos(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Todo).filter(models.Todo.owner_id == user_id).offset(skip).limit(limit).all()
