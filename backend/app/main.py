# backend\app\main.py
from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List
import traceback

# 匯入 IntegrityError 以捕捉資料庫錯誤
from sqlalchemy.exc import IntegrityError

# 匯入定義的模組
from . import models, schemas, crud, database, auth


# 建立資料庫表格 (若不存在)
models.Base.metadata.create_all(bind=database.engine)


app = FastAPI(
    title="Todo List Fullstack API",
    description="React + FastAPI",
    version="1.0.0"
)

#  CORS 設定 (解決前後端跨域問題)
origins = [
    "http://localhost",
    "http://localhost:3000", # Next.js default port
    "http://localhost:5173", # Vite default port
    "http://localhost:5174", # Vite alternative port
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "https://proj-todo-ten.vercel.app" # Vercel frontend URL
]

# 設定 CORS，允許前端呼叫
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"]
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """全局異常處理器 - 捕捉所有未處理的異常並返回 JSON 響應"""
    error_msg = f"Unhandled exception: {exc}"
    stack_trace = traceback.format_exc()
    print(error_msg)
    print(stack_trace)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)}
    )


# Authentication Endpoints (認證路由)

@app.post("/token", response_model=dict)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(database.get_db)
):
    """
    使用者登入接口。
    前端需發送 x-www-form-urlencoded 格式的 username 與 password。
    """
    # 驗證使用者是否存在
    user = crud.get_user_by_username(db, username=form_data.username)

    # 驗證密碼與使用者
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 製作 Access Token
    access_token_expires = auth.timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )

    # 回傳符合 OAuth2 規範的 JSON
    return { "access_token": access_token, "token_type": "bearer" }


@app.post("/users/", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    """註冊新使用者"""
    try:
        return crud.create_user(db=db, user=user)
    except IntegrityError:
        db.rollback()
        print("Registration failed: Username already registered")
        raise HTTPException(status_code=400, detail="Username already registered")
    except Exception as e:
        db.rollback()
        print(f"Registration failed: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    """取得當前登入使用者的資訊"""
    return current_user


@app.put("/users/me", response_model=schemas.User)
def update_user_me(
    user_update: schemas.UserUpdate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """更新當前登入使用者的資訊"""
    if user_update.display_name is not None:
        current_user.display_name = user_update.display_name
    if user_update.avatar is not None:
        current_user.avatar = user_update.avatar
    
    db.commit()
    db.refresh(current_user)
    return current_user


# Todo Endpoints (任務路由)

@app.get("/todos/", response_model=List[schemas.Todo])
def read_todos(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """取得當前使用者的所有任務"""
    return crud.get_user_todos(db=db, user_id=current_user.id, skip=skip, limit=limit)


@app.post("/todos/", response_model=schemas.Todo)
def create_todo(
    todo: schemas.TodoCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """為當前使用者建立新任務"""
    return crud.create_user_todo(db=db, todo=todo, user_id=current_user.id)


@app.put("/todos/reorder")
def reorder_todos(
    todo_orders: List[schemas.TodoOrder],
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """重新排序任務"""
    for todo_order in todo_orders:
        db_todo = db.query(models.Todo).filter(
            models.Todo.id == todo_order.id,
            models.Todo.owner_id == current_user.id
        ).first()
        if db_todo:
            db_todo.order = todo_order.order

    db.commit()
    return { "ok": True }


@app.put("/todos/{todo_id}", response_model=schemas.Todo)
def update_todo(
    todo_id: int,
    todo_update: schemas.TodoUpdate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """更新任務 (確保只能更新自已的)"""
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id, models.Todo.owner_id == current_user.id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    update_data = todo_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_todo, field, value)

    db.commit()
    db.refresh(db_todo)

    return db_todo


@app.delete("/todos/{todo_id}")
def delete_todo(
    todo_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """刪除任務"""
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id, models.Todo.owner_id == current_user.id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    db.delete(db_todo)
    db.commit()

    return { "ok": True }
