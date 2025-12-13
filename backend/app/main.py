# backend\app\main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List

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
    "http://localhost:5173", # Vite 預設 port
    "http://127.0.0.1:5173",
    # 之後你會在這裡加入 Vercel 的網址，例如：
    # "https://your-project-name.vercel.app" 
    "*" # 為了方便測試，暫時允許所有來源 (生產環境建議改回特定網域)
]

# 設定 CORS，允許前端呼叫
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins, # 生產環境應設為特定網域
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"]
# )
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # 暫時設為允許所有，以免部署後遇到 CORS 錯誤 debug 很痛苦
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
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
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    # 注意：這裡呼叫 crud.create_user 時，裡面應該要呼叫 auth.get_password_hash
    # 為了確保邏輯完整，我們稍後確認 crud.create_user 的實作
    return crud.create_user(db=db, user=user)


@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    """取得當前登入使用者的資訊"""
    return current_user


# Todo Endpoints (任務路由)

@app.get("/todos/", response_model=List[schemas.Todo])
def read_todos(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user) # 關鍵：需要登入
):
    """取得當前使用者的所有任務"""
    # 這裡我們稍微修改 crud.get_todos 以支援篩選 owner_id
    # 如果你的 crud.py 尚未支援，這裡直接寫 query 也可以
    todos = db.query(models.Todo).filter(models.Todo.owner_id == current_user.id).offset(skip).limit(limit).all()

    return todos


@app.post("/todos/", response_model=schemas.Todo)
def create_todo(
    todo: schemas.TodoCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """為當前使用者建立新任務"""
    return crud.create_user_todo(db=db, todo=todo, user_id=current_user.id)


@app.put("/todos/{todo_id}", response_model=schemas.Todo)
def update_todo(
    todo_id: int,
    todo_update: schemas.TodoCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """更新任務 (確保只能更新自已的)"""
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id, models.Todo.owner_id == current_user.id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    db_todo.title = todo_update.title
    db_todo.description = todo_update.description
    db_todo.completed = todo_update.completed
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
