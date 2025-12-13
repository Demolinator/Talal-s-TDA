# Phase-Wise Structure Migration Guide

**Version**: 1.0.0
**Date**: 2025-12-11
**Estimated Time**: 10-12 hours
**Approach**: Option A (Fix-Then-Build)

---

## 📋 Overview

This guide outlines the complete migration from the current flat structure to a phase-wise organization:

**Current Structure**:
```
phase-1/
├── src/todo_app/          # Phase I
├── backend/               # Phase II
├── frontend/              # Phase II
└── specs/001-, 002-, ...  # Mixed organization
```

**Target Structure**:
```
talal-todo-app/
├── phase-1/               # ✅ Complete Phase I
├── phase-2/               # 🚧 In-progress Phase II
│   ├── backend/
│   └── frontend/
├── phase-3/, phase-4/, phase-5/  # 🔮 Future phases
├── specs/                 # Organized by type
│   ├── features/
│   ├── api/
│   ├── database/
│   └── ui/
└── history/
    ├── prompts/
    └── adr/               # ✅ NEW
```

---

## ⚡ Quick Start

### Option 1: Automated Migration (Recommended)

```bash
# 1. Dry run (see what will happen)
bash .specify/scripts/bash/migrate-to-phase-structure.sh --dry-run

# 2. Review output, then execute
bash .specify/scripts/bash/migrate-to-phase-structure.sh

# 3. Validate migration
bash .specify/scripts/bash/validate-migration.sh

# 4. Run tests
cd phase-1 && uv run pytest tests/ -v
cd ../phase-2/backend && uv run pytest tests/ -v

# 5. Commit changes
git add .
git commit -m "feat: migrate to phase-wise structure

- Reorganize specs by type (features, api, database, ui)
- Move Phase I to phase-1/ directory
- Move Phase II to phase-2/ directory
- Create history/adr/ for architectural decisions
- Update workspace configuration

BREAKING CHANGE: Project structure reorganized for multi-phase development"
```

### Option 2: Manual Migration

Follow the detailed steps in this guide.

---

## 📊 Migration Checklist

### Phase 1: Critical Fixes (P0) - 8 hours

- [ ] **1.1** Create new directory structure
- [ ] **1.2** Reorganize specs to type-based organization
- [ ] **1.3** Create `history/adr/` directory
- [ ] **1.4** Write 7 retroactive ADRs
- [ ] **1.5** Update PHR references
- [ ] **1.6** Move Phase I implementation to `phase-1/`
- [ ] **1.7** Move Phase II implementation to `phase-2/`
- [ ] **1.8** Update root `pyproject.toml` (workspace config)
- [ ] **1.9** Create phase-specific READMEs

### Phase 2: High Priority Fixes (P1) - 2 hours

- [ ] **2.1** Move Phase I tests to `phase-1/tests/`
- [ ] **2.2** Install missing frontend dependencies (better-auth, shadcn/ui)
- [ ] **2.3** Migrate frontend from npm to pnpm
- [ ] **2.4** Update all documentation references

### Phase 3: Nice-to-Have (P2) - 4 hours

- [ ] **3.1** Create `shared/types/` directory with common types
- [ ] **3.2** Add pre-commit hooks (`.pre-commit-config.yaml`)
- [ ] **3.3** Replace python-jose with PyJWT in backend
- [ ] **3.4** Create utility scripts (`reset-db.sh`, `seed-data.sh`)

### Phase 4: Validation & Testing

- [ ] **4.1** Run Phase I tests (87 tests should pass)
- [ ] **4.2** Run Phase II backend tests
- [ ] **4.3** Run Phase II frontend tests
- [ ] **4.4** Validate directory structure
- [ ] **4.5** Clean up old directories

---

## 📝 Detailed Migration Steps

### Step 1: Create New Directory Structure (5 minutes)

```bash
# Create phase directories
mkdir -p {phase-1,phase-2,phase-3,phase-4,phase-5}

# Create shared directories
mkdir -p shared/{types,utils}
mkdir -p docs
mkdir -p scripts

# Create spec type directories
mkdir -p specs/{features,api/{auth,tasks},database/todo-app,ui/dashboard}

# Create ADR directory
mkdir -p history/adr
```

### Step 2: Reorganize Specs (Type-Based) - 3 hours

**Why**: Constitution v2.0.0 requires type-based organization for better spec discovery and subagent coordination.

```bash
# Move Phase I feature specs
mv specs/001-console-todo-app specs/features/console-todo-app
mv specs/002-cli-banner specs/features/cli-banner
mv specs/003-project-readme specs/features/project-readme

# Split Phase II specs
mkdir -p specs/features/web-todo-app
mkdir -p specs/api/{auth,tasks}
mkdir -p specs/database/todo-app

# Move API contracts
mv specs/004-phase-2-web-app/contracts/auth.md specs/api/auth/spec.md
mv specs/004-phase-2-web-app/contracts/tasks.md specs/api/tasks/spec.md

# Move database schema
mv specs/004-phase-2-web-app/data-model.md specs/database/todo-app/schema.md

# Move remaining Phase II files
mv specs/004-phase-2-web-app/* specs/features/web-todo-app/
rmdir specs/004-phase-2-web-app
```

**Validation**:
```bash
# Should see type-based structure
tree specs/
# specs/
# ├── features/
# ├── api/
# ├── database/
# └── ui/
```

### Step 3: Update PHR References - 30 minutes

```bash
# Rename to match new spec structure
mv history/prompts/001-console-todo-app history/prompts/console-todo-app
mv history/prompts/002-cli-banner history/prompts/cli-banner
mv history/prompts/003-project-readme history/prompts/project-readme
mv history/prompts/004-phase-2-web-app history/prompts/web-todo-app
```

### Step 4: Create Retroactive ADRs - 3 hours

Use `/sp.adr` command to document key decisions:

```bash
# ADR-001: In-Memory Storage for Phase I
/sp.adr in-memory-storage-phase-1

# ADR-002: UV Package Manager
/sp.adr uv-package-manager

# ADR-003: Next.js 16 with App Router
/sp.adr nextjs-app-router

# ADR-004: FastAPI + SQLModel Backend
/sp.adr fastapi-sqlmodel-backend

# ADR-005: Neon PostgreSQL Database
/sp.adr neon-postgresql

# ADR-006: JWT with HttpOnly Cookies
/sp.adr jwt-httponly-cookies

# ADR-007: Monorepo with Phase-Wise Organization
/sp.adr monorepo-phase-wise
```

**Manual ADR Creation** (if `/sp.adr` not available):

```bash
# Example: ADR-004
cat > history/adr/004-fastapi-sqlmodel.md <<'EOF'
# ADR-004: FastAPI + SQLModel for Backend

## Status
✅ Accepted (2025-12-07)

## Context
Phase II requires a modern, type-safe REST API backend with:
- Fast performance for real-time operations
- Strong typing for reliability
- ORM for database abstraction
- Easy integration with PostgreSQL

## Decision
Use **FastAPI 0.110+** with **SQLModel** for the Phase II backend.

## Rationale

### Why FastAPI?
1. **Performance**: Built on Starlette + uvloop (fastest Python framework)
2. **Type Safety**: Native Pydantic v2 integration
3. **Developer Experience**: Auto-generated OpenAPI docs, excellent DX
4. **Async Support**: Native async/await for concurrent requests
5. **Ecosystem**: Large community, many integrations

### Why SQLModel?
1. **Unified Models**: Single class for both API and database
2. **Type Safety**: SQLAlchemy + Pydantic = type-checked ORM
3. **Simplicity**: Less boilerplate than separate ORM + serialization
4. **Migration Path**: Uses SQLAlchemy under the hood (proven)

## Consequences

### Positive
✅ Excellent performance (can handle 10K+ req/sec)
✅ Type safety catches bugs at dev time
✅ Auto-generated API documentation
✅ Fast development with minimal boilerplate
✅ Easy testing with async test clients

### Negative
⚠️ SQLModel still 0.0.x (early stage)
⚠️ Smaller community than Django
⚠️ Requires learning async patterns

### Neutral
- Alembic required for migrations (standard in SQLAlchemy)
- Need to be mindful of N+1 queries (common ORM issue)

## Alternatives Considered

### Alternative 1: Django + DRF
**Pros**: Mature, batteries included, large community
**Cons**: Slower, more boilerplate, sync-first (async support limited)
**Why rejected**: Overkill for API-only backend, performance concerns

### Alternative 2: Flask + SQLAlchemy
**Pros**: Lightweight, mature ecosystem
**Cons**: More manual setup, no built-in validation, sync-only
**Why rejected**: FastAPI provides better DX with auto docs and validation

### Alternative 3: Express.js (Node.js)
**Pros**: JavaScript everywhere, large ecosystem
**Cons**: Different language from Phase I, weaker typing than Python
**Why rejected**: Team expertise in Python, type safety priority

## Implementation Notes

1. **Version Constraints**: FastAPI >=0.110, SQLModel >=0.0.27
2. **Database**: PostgreSQL (Neon Serverless) via psycopg2-binary
3. **Migrations**: Alembic (standard SQLAlchemy migrations)
4. **Validation**: Pydantic v2 models for request/response
5. **Testing**: pytest + httpx for async test client

## References
- FastAPI docs: https://fastapi.tiangolo.com/
- SQLModel docs: https://sqlmodel.tiangolo.com/
- Related specs: `specs/api/`, `specs/database/todo-app/`
- Related ADRs: ADR-005 (Neon PostgreSQL), ADR-006 (JWT Auth)

## Review History
- **2025-12-07**: Initial decision during Phase II planning
- **2025-12-11**: Documented retroactively during migration

---
*This ADR follows the Constitution v2.0.0 Principle I (Spec-Driven Development)*
EOF
```

### Step 5: Move Phase I to `phase-1/` - 1 hour

```bash
# Copy source code
cp -r src/todo_app phase-1/src/

# Copy tests
cp -r tests phase-1/

# Copy config files
cp pyproject.toml phase-1/
cp pytest.ini phase-1/
cp .python-version phase-1/

# Move completion report
mv TEST_IMPLEMENTATION_REPORT.md phase-1/PHASE_COMPLETION.md

# Create Phase I README
cat > phase-1/README.md <<'EOF'
# Phase I: Console Todo App

**Status**: ✅ Complete (100%)
**Tests**: 87 passing
**Coverage**: 77%

## Running
```bash
uv run python -m phase-1.src.todo_app.main
```

## Testing
```bash
cd phase-1
uv run pytest tests/ -v --cov=src/todo_app
```
EOF
```

### Step 6: Move Phase II to `phase-2/` - 1 hour

```bash
# Move backend and frontend
mv backend phase-2/
mv frontend phase-2/

# Create Phase II README
cat > phase-2/README.md <<'EOF'
# Phase II: Web Todo App

**Status**: 🚧 In Progress (65%)

## Running

### Backend
```bash
cd phase-2/backend
uv run uvicorn src.main:app --reload
```

### Frontend
```bash
cd phase-2/frontend
pnpm dev
```
EOF
```

### Step 7: Update Root Workspace Config - 1 hour

Edit `pyproject.toml`:

```toml
[project]
name = "talal-tda-workspace"
version = "1.0.0"
description = "Monorepo workspace for multi-phase Todo App (Phases I-V)"
requires-python = ">=3.13"
dependencies = []

[tool.uv.workspace]
members = [
    "phase-1",
    "phase-2/backend",
    # Future:
    # "phase-3/chatbot",
]

[dependency-groups]
dev = [
    "pytest>=9.0.1",
    "pytest-cov>=7.0.0",
    "ruff>=0.1.0",
]
```

### Step 8: Install Missing Dependencies (P1) - 1 hour

```bash
cd phase-2/frontend

# Migrate to pnpm
rm -rf node_modules package-lock.json
corepack enable
pnpm install

# Install missing deps
pnpm add better-auth
pnpm add -D @types/better-auth

# Setup shadcn/ui
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button input card dialog form
```

---

## 🧪 Validation & Testing

### Run All Tests

```bash
# Phase I tests (87 should pass)
cd phase-1
uv run pytest tests/ -v --cov=src/todo_app

# Phase II backend tests
cd ../phase-2/backend
uv run pytest tests/ -v

# Phase II frontend tests
cd ../frontend
pnpm test          # Unit tests
pnpm test:e2e      # E2E tests
```

### Validate Structure

```bash
cd ..  # Back to root
bash .specify/scripts/bash/validate-migration.sh
```

Expected output:
```
🔍 Validating Phase-Wise Structure Migration

✅ Directory exists: specs/features
✅ Directory exists: specs/api
✅ Directory exists: history/adr
✅ Directory exists: phase-1
✅ Directory exists: phase-2
...
✅ MIGRATION VALIDATED SUCCESSFULLY
```

---

## 🧹 Cleanup

After validation passes, clean up old structure:

```bash
# Remove old directories (now in phase-1/ and phase-2/)
rm -rf src/
rm -rf tests/
rm -rf backend/  # Now in phase-2/
rm -rf frontend/  # Now in phase-2/

# Remove old numbered spec directories (if any remain)
rm -rf specs/001-* specs/002-* specs/003-* specs/004-*
```

---

## 🚀 Using Subagents for Parallel Execution

### Pattern 1: Parallel ADR Creation

Launch 7 agents simultaneously:

```bash
# In Claude Code:
# Launch ADR creation agents in parallel
/sp.adr in-memory-storage & \
/sp.adr uv-package-manager & \
/sp.adr nextjs-app-router & \
/sp.adr fastapi-sqlmodel & \
/sp.adr neon-postgresql & \
/sp.adr jwt-auth & \
/sp.adr monorepo-phases
```

### Pattern 2: Spec Reorganization Agents

```python
# Launch 4 agents for spec migration
Task(subagent_type="general-purpose",
     prompt="Move specs/001-003 to specs/features/ and rename")

Task(subagent_type="general-purpose",
     prompt="Extract API contracts to specs/api/")

Task(subagent_type="general-purpose",
     prompt="Extract database schema to specs/database/")

Task(subagent_type="general-purpose",
     prompt="Extract UI specs to specs/ui/")
```

---

## 🆘 Troubleshooting

### Issue: Tests fail after migration

**Solution**: Update import paths
```python
# Old import
from src.todo_app.models import Task

# New import
from phase-1.src.todo_app.models import Task
```

### Issue: Frontend can't connect to backend

**Solution**: Update API URL in `.env.local`
```bash
# phase-2/frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Issue: Database migrations fail

**Solution**: Update Alembic config
```ini
# phase-2/backend/alembic.ini
script_location = phase-2/backend/alembic
```

---

## 📚 Next Steps After Migration

1. **Complete Phase II Implementation**:
   - Add missing CRUD endpoints (update, delete)
   - Implement task filters and search
   - Add comprehensive tests
   - Generate OpenAPI documentation

2. **Plan Phase III**:
   - Create `specs/features/chatbot/`
   - Design MCP tools for task operations
   - Plan RAG integration

3. **Update Documentation**:
   - Update root README with new structure
   - Update CLAUDE.md references
   - Add architecture diagrams

---

## 🎯 Success Criteria

Migration is complete when:

- ✅ All 87 Phase I tests pass
- ✅ Phase II backend tests pass
- ✅ Phase II frontend builds successfully
- ✅ Specs organized by type (features, api, database, ui)
- ✅ 7 ADRs created in `history/adr/`
- ✅ Old structure cleaned up
- ✅ `validate-migration.sh` passes with 0 errors
- ✅ Changes committed to git

---

## 📞 Support

If you encounter issues:
1. Review this guide's troubleshooting section
2. Check the validation script output
3. Consult Constitution v2.0.0 for principles
4. Ask Claude Code for assistance

**Migration Script**: `.specify/scripts/bash/migrate-to-phase-structure.sh`
**Validation Script**: `.specify/scripts/bash/validate-migration.sh`
**Constitution**: `.specify/memory/constitution.md`

---

*Last Updated: 2025-12-11*
