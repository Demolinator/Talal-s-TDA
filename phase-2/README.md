# Phase II: Web Todo App

**Status**: 🚧 In Progress (65%)
**Stack**: Next.js 16 + FastAPI + PostgreSQL (Neon)

## Architecture
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Backend**: FastAPI 0.110, SQLModel, Alembic
- **Database**: Neon Serverless PostgreSQL
- **Auth**: JWT with HttpOnly cookies

## Running

### Backend
```bash
cd phase-2/backend
cp .env.example .env  # Configure DATABASE_URL, JWT_SECRET
uv run alembic upgrade head
uv run uvicorn src.main:app --reload --port 8000
```

### Frontend
```bash
cd phase-2/frontend
cp .env.local.example .env.local  # Configure NEXT_PUBLIC_API_URL
pnpm install
pnpm dev  # http://localhost:3000
```

### Docker Compose (Full Stack)
```bash
cd phase-2
docker-compose up
```

## Testing

### Backend Tests
```bash
cd phase-2/backend
uv run pytest tests/ -v
```

### Frontend Tests
```bash
cd phase-2/frontend
pnpm test          # Unit tests (Vitest)
pnpm test:e2e      # E2E tests (Playwright)
```

## Progress
- ✅ User signup/login API
- ✅ JWT authentication
- ✅ Task model + migrations
- ✅ Basic UI scaffolding
- ⚠️ Missing: Update/delete endpoints, task filters, search

See `backend/CLAUDE.md` and `frontend/CLAUDE.md` for detailed instructions.
