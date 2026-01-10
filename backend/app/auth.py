# backend\app\auth.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from typing import Optional
from passlib.context import CryptContext
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from . import schemas, database, models


# 設定密鑰 (在生產環境中，這應該從環境變數 os.getenv 讀取)
SECRET_KEY = "YOUR_SUPER_SECRET_KEY_CHANGE_ME_IN_PRODUCTION"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES =30


# 建立密碼雜湊上下文
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# 設定 OAth2 的 Token 取得網址 (對應 main.py 的 /token 路由)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")


# 密碼處理工具

def verify_password(plain_password, hashed_password):
    """驗證明碼密碼是否與雜湊密碼匹配"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    """將密碼進行雜湊加密"""
    return pwd_context.hash(password)


# JWT Token 工具

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """產生 JWT Access Token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


# 依賴注入 (Dependency)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    """
    驗證 Token 並回傳當前使用者物件。
    如果驗證失敗，直接拋出 401 錯誤。
    """
    credentials_exception = HTTPException(
        status_code = status.HTTP_401_UNAUTHORIZED,
        detail = "Could not validate credentials",
        headers = {"WWW-Authenticate": "Bearer"},
    )

    try:
        # 解碼 JWT
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.UserBase(username=username)
    except JWTError:
        raise credentials_exception

    # 從資料庫查找使用者
    user = db.query(models.User).filter(models.User.username == token_data.username).first()
    if user is None:
        raise credentials_exception

    return user
