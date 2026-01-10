# Project Context

## Purpose
Modern fullstack todo application demonstrating complete JWT authentication flow (registration/login) and RESTful API CRUD operations. Users can create, read, update, and delete their own todo items with data isolation ensuring users only see their own tasks.

## Tech Stack

### Backend
- **Framework**: FastAPI
- **Database**: SQLite (via SQLAlchemy ORM)
- **Authentication**: OAuth2 with JWT tokens using python-jose and Passlib (Bcrypt)
- **Validation**: Pydantic v2 with `from_attributes = True` configuration
- **Server**: Uvicorn

### Frontend
- **Build Tool**: Vite 6.x
- **Library**: React 19 with Hooks and Context API
- **Language**: TypeScript 5.x
- **Styling**: TailwindCSS 3.4.17
- **Package Manager**: npm (scripts defined)

### DevOps
- **Containerization**: Docker Compose for development environment
- **CORS**: Configured for localhost:5173, localhost, and production Vercel URL

## Project Conventions

### Code Style

#### Backend (Python)
- Use SQLAlchemy 2.0 style with `Mapped[int]` and `mapped_column()`
- Pydantic models use `from_attributes = True` to support ORM objects
- All API endpoints include `current_user: User = Depends(auth.get_current_user)` for protected routes
- Database operations use `Session` dependency injection
- Error handling includes specific HTTPException with appropriate status codes
- Chinese comments are used throughout the codebase

#### Frontend (TypeScript/React)
- Functional components with React Hooks
- TypeScript strict mode enabled
- Context API for state management (AuthContext, TodoContext)
- Custom hooks for API logic (useAuth, useTodos)
- TailwindCSS utility classes for styling
- Chinese UI text and comments
- All API calls use fetch API with async/await

### Architecture Patterns

#### Backend
- **Layered Architecture**: main.py (routes) → crud.py (business logic) → models.py (data models) → schemas.py (validation)
- **Dependency Injection**: Database sessions and authentication injected via FastAPI `Depends()`
- **ORM Models**: SQLAlchemy with relationship definitions between User and Todo
- **JWT Tokens**: 30-minute expiration, stored in localStorage on frontend
- **Data Isolation**: All todo queries filtered by `owner_id` matching authenticated user

#### Frontend
- **Context Pattern**: AuthProvider wraps entire App, TodoProvider wraps authenticated views
- **Custom Hooks**: useAuth handles login/register/logout, useTodos manages CRUD operations
- **Component Structure**: App → AppContent → (TodoListApp | Login | Register) → TodoItem
- **API Client**: Centralized in api/client.ts with Bearer token auth headers
- **State Management**: React useState for component-level state, Context for app-wide state

### Testing Strategy
- No automated tests currently configured
- Manual testing via API docs at http://localhost:8000/docs
- Frontend testing via browser development tools

### Git Workflow
- Standard Git workflow with main branch
- No enforced commit message conventions
- CI/CD configured via GitHub Actions (.github/workflows/ci.yml)

## Domain Context

### Data Models
- **User**: id, username (unique), hashed_password, relationship to todos
- **Todo**: id, title, description (optional), completed (boolean), owner_id (FK to users)

### Business Rules
- Each user can only CRUD their own todos (owner_id filtering)
- Passwords are hashed with Bcrypt before storage
- JWT tokens expire after 30 minutes
- Username must be unique during registration
- Todo items can be marked as completed (boolean flag)

### API Endpoints
- **POST /token**: Login endpoint returning JWT token
- **POST /users/**: User registration
- **GET /users/me**: Get current authenticated user info
- **GET /todos/**: List user's todos (authenticated)
- **POST /todos/**: Create new todo (authenticated)
- **PUT /todos/{id}**: Update todo (authenticated, user's own)
- **DELETE /todos/{id}**: Delete todo (authenticated, user's own)

## Important Constraints
- **Database**: SQLite for development (sql_app.db auto-generated), consider PostgreSQL for production
- **Bcrypt Version**: Locked to bcrypt==3.2.2 for compatibility
- **API URL**: Configured via VITE_API_URL environment variable (defaults to http://localhost:8000)
- **CORS**: Production URL hardcoded to https://proj-todo-ten.vercel.app - update for production deployments
- **Data Persistence**: Docker containers may lose data unless volumes are properly configured
- **Authentication**: Token stored in localStorage (less secure than cookies but simpler implementation)

## External Dependencies
- **Backend**: FastAPI, Uvicorn, SQLAlchemy, Pydantic, python-jose, Passlib, bcrypt
- **Frontend**: React 19, Vite, TypeScript, TailwindCSS
- **Development**: Docker, Docker Compose
- **Deployment**: Vercel (frontend URL configured in CORS)
