# Change: Refactor Code Quality

## Why
修正 Code Review 中發現的架構問題，提升可維護性。程式碼存在 DRY、SOLID、KISS 原則違反，導致重複邏輯、職責不清、潛在安全風險。

## What Changes

### Backend
- 移除 `crud.py` 中重複的 `CryptContext`，統一使用 `auth.get_password_hash()`
- 將 `main.py` 路由中的資料存取邏輯移至 `crud.py`
- 將 `SECRET_KEY` 移至環境變數
- 簡化註冊用戶邏輯，移除雙重檢查
- 重構 `update_todo` 函式，減少重複的 if 條件判斷

### Frontend
- 拆分 `TodoList` 組件，將篩選、Toast 邏輯抽離
- 建立共用的 `Input` 和 `Button` 組件，減少 className 重複
- 建立 API wrapper 統一錯誤處理邏輯
- 抽離 `Avatar` 組件，將 Header 中的 avatar 相關邏輯獨立
- 抽離篩選按鈕樣式邏輯

## Impact
- Affected code:
  - `backend/app/main.py`, `backend/app/crud.py`, `backend/app/auth.py`
  - `frontend/src/components/TodoList.tsx`, `frontend/src/components/Login.tsx`, `frontend/src/components/Register.tsx`
  - `frontend/src/components/Header.tsx`, `frontend/src/api/client.ts`
- Affected specs: None (內部重構，外部行為不變)
