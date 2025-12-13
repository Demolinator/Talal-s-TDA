# Hackathon II - Evolution of Todo - Complete Directory Structure

**Project Root**: `/mnt/d/Talal/Work/Hackathons-Panaversity/phase-1/`

**Last Updated**: 2025-12-13

---

## Complete Directory Tree

```
phase-1/                                       # Root directory (Hackathon II project)
│
├── phase-1/                                   # PHASE I: CLI Console App (✅ COMPLETED)
│   ├── src/
│   │   └── todo_app/
│   │       ├── main.py                       # CLI entry point
│   │       ├── models.py                     # Task model definition
│   │       ├── storage.py                    # In-memory storage implementation
│   │       ├── operations.py                 # CRUD operations (add, list, complete, delete, update)
│   │       ├── ui.py                         # Menu UI and user interaction
│   │       ├── banner.py                     # CLI banner display
│   │       └── __init__.py
│   │
│   ├── tests/                                # Unit & integration tests
│   │   ├── test_models.py                   # Task model tests
│   │   ├── test_storage.py                  # Storage backend tests
│   │   ├── test_operations.py               # CRUD operation tests
│   │   ├── test_ui.py                       # UI component tests
│   │   ├── test_banner.py                   # Banner tests
│   │   ├── test_integration.py              # Full workflow tests
│   │   └── __init__.py
│   │
│   ├── pyproject.toml                        # Python dependencies (pytest, uv)
│   ├── README.md                             # Phase I documentation
│   └── PHASE_COMPLETION.md                   # Phase I completion report
│
│   **Statistics**: 87 passing tests, 77% code coverage, complete CRUD functionality
│
├── phase-2/                                   # PHASE II: Full-Stack Web App (✅ COMPLETED)
│   │
│   ├── frontend/                             # Next.js 16+ React 19+ TypeScript
│   │   ├── app/                              # Next.js App Router structure
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx            # Login page
│   │   │   │   └── signup/page.tsx           # Signup page
│   │   │   │
│   │   │   ├── (dashboard)/
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── page.tsx              # Dashboard page
│   │   │   │   │   ├── loading.tsx           # Loading state
│   │   │   │   │   └── tasks/
│   │   │   │   │       ├── page.tsx          # Tasks page
│   │   │   │   │       ├── loading.tsx       # Tasks loading state
│   │   │   │   │       └── TasksPageClient.tsx # Client component
│   │   │   │   │
│   │   │   │   ├── layout.tsx                # Dashboard layout
│   │   │   │   └── loading.tsx               # Dashboard loading
│   │   │   │
│   │   │   ├── layout.tsx                    # Root layout
│   │   │   ├── page.tsx                      # Home page
│   │   │   ├── error.tsx                     # Error boundary
│   │   │   ├── global-error.tsx              # Global error handler
│   │   │   └── globals.css                   # Global styles
│   │   │
│   │   ├── components/                       # Reusable React components
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.tsx             # Login form component
│   │   │   │   ├── SignupForm.tsx            # Signup form component
│   │   │   │   └── SessionExpirationWarning.tsx # Session expiration alert
│   │   │   │
│   │   │   ├── tasks/
│   │   │   │   ├── TaskList.tsx              # Task list container
│   │   │   │   ├── TaskCard.tsx              # Individual task card
│   │   │   │   └── TaskForm.tsx              # Task form (create/edit)
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx                # App header
│   │   │   │   └── Sidebar.tsx               # Navigation sidebar
│   │   │   │
│   │   │   └── SessionCheck.tsx              # Session validation component
│   │   │
│   │   ├── lib/                              # Utility libraries
│   │   │   └── api/                          # API client functions
│   │   │       ├── auth.ts                   # Auth API client
│   │   │       └── tasks.ts                  # Tasks API client
│   │   │
│   │   ├── types/                            # TypeScript type definitions
│   │   │   ├── api.ts                        # API response types
│   │   │   ├── task.ts                       # Task types
│   │   │   └── user.ts                       # User types
│   │   │
│   │   ├── tests/                            # Frontend tests
│   │   │   ├── e2e/                          # Playwright E2E tests
│   │   │   │   ├── auth.spec.ts              # Authentication flow tests
│   │   │   │   ├── authorization.spec.ts     # Authorization tests
│   │   │   │   ├── tasks.spec.ts             # Task management tests
│   │   │   │   ├── responsive.spec.ts        # Responsive design tests
│   │   │   │   └── regression.spec.ts        # Regression test suite
│   │   │   │
│   │   │   └── unit/                         # Vitest unit tests
│   │   │       ├── LoginForm.test.tsx
│   │   │       ├── SignupForm.test.tsx
│   │   │       ├── TaskCard.test.tsx
│   │   │       ├── TaskForm.test.tsx
│   │   │       └── session-expiration.test.ts
│   │   │
│   │   ├── public/                           # Static assets
│   │   │   ├── file.svg
│   │   │   ├── globe.svg
│   │   │   ├── next.svg
│   │   │   ├── vercel.svg
│   │   │   └── window.svg
│   │   │
│   │   ├── middleware.ts                     # Next.js middleware (auth)
│   │   ├── next.config.ts                    # Next.js configuration
│   │   ├── tsconfig.json                     # TypeScript config
│   │   ├── tailwind.config.ts                # Tailwind CSS config
│   │   ├── postcss.config.mjs                # PostCSS config
│   │   ├── vitest.config.ts                  # Vitest configuration
│   │   ├── playwright.config.ts              # Playwright configuration
│   │   ├── eslint.config.mjs                 # ESLint configuration
│   │   ├── package.json                      # Dependencies (pnpm)
│   │   ├── package-lock.json                 # Dependency lock file
│   │   ├── CLAUDE.md                         # Frontend-specific guidelines
│   │   └── README.md                         # Frontend documentation
│   │
│   ├── backend/                              # FastAPI 0.110+ Python 3.13+ SQLModel
│   │   ├── src/
│   │   │   ├── main.py                       # FastAPI app entry point
│   │   │   │
│   │   │   ├── api/                          # API route handlers
│   │   │   │   ├── auth.py                   # Authentication endpoints
│   │   │   │   ├── tasks.py                  # Task CRUD endpoints
│   │   │   │   └── health.py                 # Health check endpoint
│   │   │   │
│   │   │   ├── services/                     # Business logic
│   │   │   │   ├── auth_service.py           # JWT token management
│   │   │   │   └── task_service.py           # Task business logic
│   │   │   │
│   │   │   ├── models/                       # SQLModel data models
│   │   │   │   ├── user.py                   # User model
│   │   │   │   └── task.py                   # Task model
│   │   │   │
│   │   │   ├── auth/                         # Authentication utilities
│   │   │   │   ├── jwt.py                    # JWT token handling
│   │   │   │   └── dependencies.py           # Auth FastAPI dependencies
│   │   │   │
│   │   │   └── db/                           # Database utilities
│   │   │       ├── session.py                # SQLModel session management
│   │   │       └── migrations/               # Alembic migration scripts
│   │   │           ├── env.py
│   │   │           ├── script.py.mako
│   │   │           ├── README
│   │   │           └── versions/
│   │   │               ├── 001_add_users_table.py
│   │   │               ├── 002_add_tasks_table.py
│   │   │               └── 003_add_performance_indexes.py
│   │   │
│   │   ├── tests/                            # Backend tests
│   │   │   ├── unit/                         # Unit tests
│   │   │   │   ├── test_auth.py
│   │   │   │   └── test_task_service.py
│   │   │   │
│   │   │   └── integration/                  # Integration tests
│   │   │       ├── test_auth_api.py
│   │   │       ├── test_authorization.py
│   │   │       └── test_tasks_api.py
│   │   │
│   │   ├── alembic.ini                       # Alembic configuration
│   │   ├── pytest.ini                        # Pytest configuration
│   │   ├── pyproject.toml                    # Python dependencies (uv)
│   │   ├── CLAUDE.md                         # Backend-specific guidelines
│   │   ├── README.md                         # Backend documentation
│   │   └── START_HERE.md                     # Quick start guide
│   │
│   ├── auth-server/                          # Better Auth integration (Optional TypeScript)
│   │   ├── src/
│   │   │   ├── server.ts                     # Auth server entry point
│   │   │   ├── auth.ts                       # Better Auth configuration
│   │   │   ├── db.ts                         # Database setup
│   │   │   └── migrate.ts                    # Migration helper
│   │   │
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── README.md                             # Phase II overview
│   └── README_COMPLETION.md                  # Phase II completion report
│
│   **Statistics**: Full-stack web app with auth, 80%+ test coverage, responsive UI
│
├── phase-3/                                   # PHASE III: AI-Powered Chatbot (🚧 SPECS READY)
│   └── README.md                              # Phase III placeholder
│
│   **Implementation Location**: Can extend phase-2/ or create phase-3/
│   **Specification Location**: `specs/features/phase-3-chatbot/` (see below)
│
├── phase-4/                                   # PHASE IV: Kubernetes Deployment (📋 PLANNED)
│   └── README.md
│
├── phase-5/                                   # PHASE V: Cloud Deployment (📋 PLANNED)
│   └── README.md
│
├── specs/                                     # Specification Documents (by feature type)
│   └── features/
│       ├── console-todo-app/                 # Phase I specifications
│       │   ├── spec.md                       # Feature spec
│       │   ├── plan.md                       # Implementation plan
│       │   ├── tasks.md                      # Task breakdown
│       │   └── ... other spec files
│       │
│       ├── web-todo-app/                     # Phase II specifications
│       │   ├── spec.md
│       │   ├── plan.md
│       │   ├── tasks.md
│       │   └── ... other spec files
│       │
│       ├── phase-3-chatbot/                  # PHASE III SPECIFICATIONS (NEW)
│       │   ├── CONSTITUTION.md               # v3.0.0 governance document
│       │   ├── spec.md                       # Feature specification (8 user stories)
│       │   ├── agent-spec.md                 # Agent behavior patterns
│       │   ├── mcp-tools-spec.md             # 5 MCP tool specifications
│       │   ├── plan.md                       # 4-phase implementation plan
│       │   └── tasks.md                      # 40+ granular tasks
│       │
│       └── ... other features
│
├── history/                                   # Development History & Artifacts
│   ├── adr/                                   # Architecture Decision Records
│   │   ├── 0001-in-memory-storage-phase-i.md
│   │   ├── 0002-uv-package-manager.md
│   │   ├── 0003-next-js-app-router.md
│   │   ├── 0004-fastapi-sqlmodel.md
│   │   ├── 0005-neon-serverless-postgresql.md
│   │   ├── 0006-jwt-httponly-cookies.md
│   │   ├── 0007-monorepo-phase-organization.md
│   │   └── README.md
│   │
│   └── prompts/                              # Prompt History Records (PHRs)
│       ├── constitution/                     # Constitution-related prompts
│       │   ├── 001-phase-1-constitution.constitution.prompt.md
│       │   ├── 002-phase-2-constitution.constitution.prompt.md
│       │   ├── 003-phase-3-constitution.constitution.prompt.md
│       │   └── 004-phase-3-v3-update.constitution.prompt.md
│       │
│       ├── console-todo-app/                 # Phase I prompts
│       │   └── ... PHR files
│       │
│       ├── web-todo-app/                     # Phase II prompts
│       │   └── ... PHR files
│       │
│       ├── phase-3-chatbot/                  # Phase III prompts (NEW)
│       │   └── 001-phase-3-specifications.spec.prompt.md
│       │
│       └── general/                          # General development prompts
│
├── .specify/                                  # Spec-Kit Plus Infrastructure
│   ├── memory/
│   │   └── constitution.md                   # v2.0.0 (Phase II base constitution)
│   │
│   ├── templates/                            # Specification templates
│   │   ├── spec-template.md                  # Feature spec template
│   │   ├── plan-template.md                  # Implementation plan template
│   │   ├── tasks-template.md                 # Task breakdown template
│   │   ├── adr-template.md                   # ADR template
│   │   ├── phr-template.prompt.md            # PHR template
│   │   └── checklist-template.md
│   │
│   └── scripts/bash/                         # Automation scripts
│       ├── create-new-feature.sh             # Create new feature spec
│       ├── setup-plan.sh                     # Setup implementation plan
│       ├── create-phr.sh                     # Create PHR file
│       ├── create-adr.sh                     # Create ADR file
│       ├── validate-migration.sh
│       ├── check-prerequisites.sh
│       └── common.sh                         # Shared functions
│
├── .claude/                                   # Claude Code Configuration
│   ├── agents/                               # Specialized subagents
│   │   ├── auth-better-auth.md               # Better Auth implementation
│   │   ├── cloud-blueprint-generator.md      # Infrastructure templates
│   │   ├── content-personalizer.md
│   │   ├── deployment-architect.md
│   │   ├── docusaurus-book-architect.md
│   │   ├── project-structure-architect.md
│   │   ├── rag-chatbot-architect.md
│   │   ├── robotics-content-writer.md
│   │   ├── testing-qa-validator.md
│   │   ├── todo-orchestrator.md
│   │   ├── ui-design-architect.md
│   │   └── urdu-translation-architect.md
│   │
│   ├── commands/                             # Slash commands
│   │   ├── sp.specify.md                     # Create specifications
│   │   ├── sp.plan.md                        # Create implementation plan
│   │   ├── sp.implement.md                   # Execute tasks
│   │   ├── sp.tasks.md                       # Break down tasks
│   │   ├── sp.analyze.md                     # Analyze artifacts
│   │   ├── sp.adr.md                         # Create ADR
│   │   ├── sp.checklist.md
│   │   ├── sp.clarify.md
│   │   ├── sp.constitution.md
│   │   ├── sp.git.commit_pr.md
│   │   └── sp.phr.md
│   │
│   └── skills/                               # Reusable capabilities
│       ├── python-tdd-implementation.md
│       ├── create-fastapi-endpoint.md
│       ├── create-react-component.md
│       ├── generate-database-migration.md
│       ├── python-pytest-comprehensive.md
│       ├── python-crud-patterns.md
│       ├── write-e2e-test.md
│       └── ... more skills
│
├── docs/                                      # Documentation
│   └── neon-setup.md                          # Neon PostgreSQL setup guide
│
├── shared/                                    # Shared utilities (future)
│   ├── types/
│   │   └── README.md
│   └── utils/
│       └── README.md
│
├── CLAUDE.md                                  # Root-level instructions (THIS FILE)
├── DIRECTORY_STRUCTURE.md                     # THIS FILE
├── README.md                                  # Project overview
├── pyproject.toml                             # Root Python config
├── .gitignore
├── .python-version
├── .git/                                      # Git repository (initialized 2025-12-13)
└── .env.local (ignored)                       # Local environment variables
```

---

## Directory Summary by Purpose

### Implementation Directories (Code)

| Directory | Purpose | Status |
|-----------|---------|--------|
| `phase-1/` | Phase I CLI application | ✅ Complete (87 tests, 77% coverage) |
| `phase-2/frontend/` | Phase II Next.js frontend | ✅ Complete (full-stack web app) |
| `phase-2/backend/` | Phase II FastAPI backend | ✅ Complete (auth, tasks API) |
| `phase-2/auth-server/` | Better Auth integration | ✅ Complete (optional) |
| `phase-3/` | Phase III chatbot (placeholder) | 🚧 Specs ready, implementation TBD |
| `phase-4/` | Phase IV Kubernetes (placeholder) | 📋 Future |
| `phase-5/` | Phase V Cloud deployment (placeholder) | 📋 Future |

### Specification Directories

| Directory | Purpose |
|-----------|---------|
| `specs/features/console-todo-app/` | Phase I specs |
| `specs/features/web-todo-app/` | Phase II specs |
| `specs/features/phase-3-chatbot/` | **Phase III specs (NEWLY CREATED)** |

### Infrastructure & Configuration

| Directory | Purpose |
|-----------|---------|
| `.specify/` | Spec-Kit Plus templates & scripts |
| `.claude/` | Claude Code agents, commands, skills |
| `history/adr/` | Architecture Decision Records |
| `history/prompts/` | Prompt History Records (development journal) |

---

## Key File Locations

### Phase III Implementation (Specs Ready)

**All specifications**:
- `specs/features/phase-3-chatbot/CONSTITUTION.md` (v3.0.0)
- `specs/features/phase-3-chatbot/spec.md`
- `specs/features/phase-3-chatbot/agent-spec.md`
- `specs/features/phase-3-chatbot/mcp-tools-spec.md`
- `specs/features/phase-3-chatbot/plan.md`
- `specs/features/phase-3-chatbot/tasks.md`

**Development history**:
- `history/prompts/phase-3-chatbot/001-phase-3-specifications.spec.prompt.md`

### Phase II Reference (Use as Template)

**Frontend patterns**:
- `phase-2/frontend/src/components/` - React component examples
- `phase-2/frontend/app/(dashboard)/dashboard/tasks/page.tsx` - Page structure
- `phase-2/frontend/lib/api/` - API client patterns

**Backend patterns**:
- `phase-2/backend/src/api/tasks.py` - FastAPI endpoint example
- `phase-2/backend/src/models/task.py` - SQLModel example
- `phase-2/backend/src/services/task_service.py` - Service layer pattern

**Database migrations**:
- `phase-2/backend/src/db/migrations/versions/` - Migration examples

---

## Quick Navigation

### Start Here
1. **Project Overview**: `README.md`
2. **Root Instructions**: `CLAUDE.md`
3. **Directory Guide**: `DIRECTORY_STRUCTURE.md` (this file)

### Phase III Development
1. **Read Specifications**: `specs/features/phase-3-chatbot/`
2. **Review Plan**: `specs/features/phase-3-chatbot/plan.md`
3. **Execute Tasks**: `specs/features/phase-3-chatbot/tasks.md`
4. **Reference Code**: `phase-2/backend/` and `phase-2/frontend/`

### Phase II Reference (for patterns)
1. **Backend**: `phase-2/backend/README.md`
2. **Frontend**: `phase-2/frontend/README.md`
3. **Auth**: `phase-2/auth-server/`

### Development Tools
1. **Templates**: `.specify/templates/`
2. **Agents**: `.claude/agents/`
3. **Commands**: `.claude/commands/`
4. **Skills**: `.claude/skills/`

---

## File Paths for Common Tasks

### Phase III Development

**Create new conversation table migration**:
```bash
cd phase-2/backend
uv run alembic revision --autogenerate -m "Add conversation tables"
```

**Add chat endpoint**:
```
Edit: phase-2/backend/src/api/chat.py (NEW FILE)
```

**Create ChatBot component**:
```
Edit: phase-2/frontend/src/components/ChatBot.tsx (NEW FILE)
```

**Run backend tests**:
```bash
cd phase-2/backend
uv run pytest tests/
```

**Run frontend tests**:
```bash
cd phase-2/frontend
pnpm test
```

---

## Database Schema Locations

**Phase II Database** (already exists):
- User table: `phase-2/backend/src/models/user.py`
- Task table: `phase-2/backend/src/models/task.py`
- Migrations: `phase-2/backend/src/db/migrations/versions/`

**Phase III Database** (to be created):
- Conversation table: `phase-2/backend/src/models/conversation.py` (NEW)
- Message table: `phase-2/backend/src/models/conversation.py` (NEW)
- Migration: `phase-2/backend/src/db/migrations/versions/003_*.py` (NEW)

---

## Environment & Configuration

**Environment files** (git-ignored):
- `.env` - Root environment variables
- `phase-2/frontend/.env.local` - Frontend config
- `phase-2/backend/.env` - Backend config
- `phase-2/auth-server/.env` - Auth server config

**See examples**:
- `phase-2/frontend/.env.local.example`
- `phase-2/backend/.env.example`

---

## Git Repository

**Repository Status**:
- ✅ Initialized: 2025-12-13
- ✅ Initial commit: Phase III specifications + PHR
- ✅ Second commit: Directory structure updates

**Check status**:
```bash
git log --oneline
git status
```

---

**Last Updated**: 2025-12-13
**Phase Status**: Phase I & II Complete, Phase III Specs Ready, Phase IV-V Planned
