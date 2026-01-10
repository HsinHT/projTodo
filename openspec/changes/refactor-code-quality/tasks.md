## 1. Backend Refactoring

- [x] 1.1 移除 `crud.py:7` 的重複 `CryptContext`，改用 `auth.get_password_hash()`
- [x] 1.2 將 `main.py:131` 的資料查詢邏輯移至 `crud.py`，建立 `get_user_todos()` 函式
- [x] 1.3 將 `auth.py:13` 的 `SECRET_KEY` 改從環境變數讀取，並提供預設值
- [x] 1.4 簡化 `main.py:76-94` 的註冊邏輯，移除雙重檢查，僅保留 IntegrityError 處理
- [x] 1.5 重構 `main.py:165-189` 的 `update_todo` 函式，使用迴圈或 dict update 減少重複

## 2. Frontend Component Refactoring

- [x] 2.1 拆分 `TodoList.tsx`：建立 `TodoFilter.tsx` 組件處理篩選按鈕邏輯
- [x] 2.2 拆分 `TodoList.tsx`：建立 `useToast` Hook
- [x] 2.3 建立共用的 `Input.tsx` 組件，統一輸入框樣式
- [x] 2.4 建立共用的 `Button.tsx` 組件，統一按鈕樣式
- [x] 2.5 更新 `Login.tsx` 使用共用的 `Input` 和 `Button` 組件
- [x] 2.6 更新 `Register.tsx` 使用共用的 `Input` 和 `Button` 組件

## 3. Frontend API Refactoring

- [x] 3.1 建立 `api/request.ts` 統一 fetch 包裝器，集中處理錯誤、headers
- [x] 3.2 重構 `client.ts` 使用新的 request wrapper，移除重複錯誤處理

## 4. Frontend Avatar Component

- [x] 4.1 建立獨立的 `Avatar.tsx` 組件
- [x] 4.2 將 `Header.tsx` 的 avatar 邏輯移至 Avatar 組件
- [x] 4.3 更新 `Header.tsx` 使用新的 `Avatar` 組件
