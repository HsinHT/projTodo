# backend\app\database.py
import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


# 優先讀取環境變數 DATABASE_URL，如果沒有則使用本地 SQLite
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")


# (Debug)
print(f"--- DEBUG: Current Database URL ---")
# 只印出前 20 個字，避免把密碼印在 Log 裡造成資安問題
print(f"URL Start with: {SQLALCHEMY_DATABASE_URL[:20]}...")
print(f"URL Type: {type(SQLALCHEMY_DATABASE_URL)}")
print(f"---------------------------------")


# 如果網址開頭是 postgres:// (舊標準)，要改成 postgresql:// (SQLAlchemy 新標準)
if SQLALCHEMY_DATABASE_URL and SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)


# 設定連線參數
connect_args = {}
# 只有 SQLite 需要 check_same_thread 設定
if "sqlite" in SQLALCHEMY_DATABASE_URL:
    connect_args = {"check_same_thread": False}

try:
    # check_same_thread 是 SQLite 特有的設定，用 Postgres 時不需要
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args=connect_args)
except Exception as e:
    print(f"!!! FATAL ERROR creating engine: {e}")
    # 這裡會讓你在 Log 看到完整的錯誤網址 (注意：包含密碼，除錯完記得刪除)
    print(f"!!! Problematic URL: {SQLALCHEMY_DATABASE_URL}")
    raise e

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


Base = declarative_base()


# Dependency Injection for DB Session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
