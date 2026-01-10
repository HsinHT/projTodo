# Fullstack Todo App (FastAPI + React)

> 這是一個現代化的全端待辦事項應用程式，後端採用 Python **FastAPI**，前端使用 **React** (Vite + TypeScript) 建構。

> 專案展示了完整的 **JWT 身份驗證流程** (註冊/登入) 以及 RESTful API 的 **CRUD 操作**。


## 🚀 功能特色

*   **使用者認證**：使用 OAuth2 與 JWT (JSON Web Tokens) 進行安全登入與註冊。
*   **待辦事項管理**：新增、讀取、更新 (標題/完成狀態)、刪除任務。
*   **拖曳排序**：直觀的拖曳界面輕鬆重新排列任務順序。
*   **優先級系統**：為任務設定高、中、低優先級，視覺化區分重要性。
*   **分類標籤**：使用彩色標籤組織任務（工作、個人、購物、健康、其他）。
*   **進度追蹤**：即時進度條顯示任務完成百分比。
*   **個人化設置**：自定義暱稱和頭像（表情符號、漸變顏色或自定義圖片）。
*   **暗黑模式**：支持明亮/暗黑主題切換，並記住偏好設置。
*   **響應式設計**：完美適配桌面、平板和手機設備。
*   **鍵盤快捷鍵**：提高效率的快捷操作方式。
*   **資料隔離**：使用者只能看見並管理自己的任務。
*   **現代化前端**：使用 TailwindCSS 進行響應式設計，並透過 Context API 管理狀態。
*   **高效後端**：FastAPI 提供高效能的非同步處理與自動化文件。

## 🛠️ 技術堆疊

### Backend
*   **Framework**: FastAPI
*   **Database**: SQLite (透過 SQLAlchemy ORM)
*   **Authentication**: Python-Jose (JWT), Passlib (Bcrypt)
*   **Validation**: Pydantic v2
*   **Server**: Uvicorn

### Frontend
*   **Build Tool**: Vite 6.x
*   **Library**: React 19
*   **Language**: TypeScript 5.x
*   **Styling**: TailwindCSS 3.4.17
*   **Package Manager**: npm
*   **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable

### DevOps
*   **Containerization**: Docker Compose for development environment
*   **CI/CD**: GitHub Actions (.github/workflows/ci.yml)
*   **CORS**: Configured for localhost:5173, localhost, and production Vercel URL

---

## 📦 快速開始 (使用 Docker) - 推薦

> 如果您已安裝 Docker Desktop，這是最快的啟動方式。

1. **Clone 專案**
   ```powershell
   git clone https://github.com/您的帳號/repo-name.git
   cd repo-name
   ```

2. 啟動服務
```powershell
docker-compose up --build
```

3. 開啟瀏覽器
   - 前端頁面：http://localhost:5173
   - 後端 API 文件：http://localhost:8000/docs

---

## 💻 本地開發設置 (手動啟動)

> 如果您不使用 Docker，請依照以下步驟在 Windows PowerShell 中分別啟動後端與前端。

### 1. 後端設定 (Backend)

> 請開啟一個 PowerShell 視窗：
```powershell
# 進入 backend 資料夾
cd backend

# 建立 Python 虛擬環境
python -m venv .venv

# 啟動虛擬環境 (Windows)
.\.venv\Scripts\activate

# 安裝依賴套件
pip install -r requirements.txt

# 啟動伺服器 (開發模式)
uvicorn app.main:app --reload
```
- 後端將運行於 http://localhost:8000

### 2. 前端設定 (Frontend)

> 請開啟另一個 PowerShell 視窗：
```powershell
# 進入 frontend 資料夾
cd frontend

# 安裝依賴
npm install

# 確保 .env 檔案存在 (若無請建立)
# 內容應為：VITE_API_URL=http://localhost:8000

# 啟動開發伺服器
npm run dev
```
- 前端將運行於 http://localhost:5173

### 3. 其他可用指令

**Frontend:**
```powershell
npm run build      # 建置生產版本
npm run lint       # 執行程式碼檢查
npm run preview    # 預覽生產版本
```

---

## ⌨️ 鍵盤快捷鍵

為了提高操作效率，Todo List 應用程式提供了以下鍵盤快捷鍵：

### 新增任務
*   **Ctrl + Enter**（Windows/Linux）或 **Cmd + Enter**（Mac）：在輸入框中快速提交新任務

### 刪除已完成任務
*   **Ctrl + Shift + D**（Windows/Linux）或 **Cmd + Shift + D**（Mac）：快速刪除所有已完成的任務

### 拖曳操作
*   直接使用滑鼠拖曳任務卡片進行重新排序

---

## 🏷️ 可用分類（標籤）

使用標籤將任務分類，便於管理和篩選：

*   **工作**（藍色）：與工作相關的任務
*   **個人**（紫色）：個人事務和活動
*   **購物**（粉色）：購物清單和採買任務
*   **健康**（綠色）：健康、運動和醫療相關任務
*   **其他**（灰色）：其他類別的任務

---

## ⚡ 優先級系統

為任務設定優先級以區分重要性：

*   **高**（紅色）：緊急且重要的任務，需要優先處理
*   **中**（黃色）：一般重要性的任務
*   **低**（綠色）：可以延後處理的任務

---

## 📂 專案結構

```
.
├── backend/              # FastAPI 應用程式
│   ├── app/             # 核心邏輯 (Models, Schemas, CRUD, Auth)
│   ├── requirements.txt # Python 依賴
│   └── sql_app.db       # SQLite 資料庫 (自動生成)
├── frontend/            # React 應用程式
│   ├── src/             # 原始碼 (Components, Context, Hooks, Types)
│   ├── package.json     # Node.js 依賴
│   └── .env             # 前端環境變數
├── .github/             # GitHub Actions CI/CD
│   └── workflows/
│       └── ci.yml       # CI/CD 配置
├── docs/                # 專案文件
├── openspec/            # OpenSpec 變更提案與規格
└── docker-compose.yml   # Docker 編排設定
```

---

## 🧪 測試策略

目前專案採用手動測試策略：

*   **後端測試**：透過 FastAPI 自動生成的 API 文件進行測試 (http://localhost:8000/docs)
*   **前端測試**：透過瀏覽器開發者工具進行測試
*   **CI/CD**：GitHub Actions 自動執行建置與基本檢查

未來可考慮加入自動化測試框架（如 pytest for backend, Jest/Vitest for frontend）。

---

## 🔄 Git Workflow

專案使用標準 Git workflow：

*   主要分支：`main`
*   開發流程：建立功能分支 → 提交變更 → 提交 Pull Request → 程式碼審查 → 合併
*   CI/CD：透過 GitHub Actions 自動執行檢查

---

## ⚠️ 注意事項

### 資料庫
*   **開發環境**：預設使用 SQLite (sql_app.db)，該檔案會在後端啟動時自動建立
*   **生產環境**：建議使用 PostgreSQL 以提升效能與可靠性（需修改 database.py 連接設定）
*   **資料持久化**：若使用 Docker，重新建立 Container 可能會導致資料遺失（除非設定 Volume 持久化）

### 依賴版本
*   **Bcrypt 版本**：本專案為了解決相容性問題，指定使用 `bcrypt==3.2.2`
*   **更新依賴**：更新套件時請注意相容性，特別是 bcrypt

### API 配置
*   **API 網址**：前端透過 `.env` 中的 `VITE_API_URL` 連接後端，部署時請記得修改此變數
*   **CORS 設定**：生產環境 URL 硬式編碼為 `https://proj-todo-ten.vercel.app`，部署到其他環境時請更新 `backend/app/main.py` 中的 `origins` 清單

### 認證
*   **Token 存儲**：JWT token 存儲在 localStorage（較不安全但實作簡單）
*   **Token 過期**：Token 有效期為 30 分鐘，過期後需重新登入

---

## 📦 外部相依套件

### Backend
*   FastAPI - 現代化、高效能的 Web 框架
*   Uvicorn - ASGI 伺服器
*   SQLAlchemy - Python SQL 工具包與 ORM
*   Pydantic v2 - 資料驗證與設定管理
*   python-jose[cryptography] - JWT token 處理
*   Passlib - 密碼雜湊庫
*   bcrypt - 密碼加密演算法

### Frontend
*   React 19 - UI 函式庫
*   Vite 6.x - 前端建置工具
*   TypeScript - 型別安全的 JavaScript 超集
*   TailwindCSS 3.4.17 - 實用優先的 CSS 框架
*   @dnd-kit/core, @dnd-kit/sortable - 拖曳排序功能

---

## 📝 License

Distributed under the MIT License. See LICENSE for more information.
