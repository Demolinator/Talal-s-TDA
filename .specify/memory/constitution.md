<!--
Sync Impact Report (Constitution v3.0.0):
- Version change: 2.0.0 → 3.0.0 (MAJOR - Introduces Phase III AI/Chatbot Architecture)
- Reason: Adding AI-native capabilities, OpenAI Agents SDK, Official MCP SDK, stateless chat architecture, event-driven patterns
- Modified principles (evolved for Phase III context):
  - I. Spec-Driven Development: Added MCP tool specifications and Agent behavior specifications
  - III. Test-First Development: Added Agent behavior testing, MCP tool mocking, conversation flow testing
  - V. Multi-Interface Excellence: Expanded to include OpenAI ChatKit conversational UI (web-based)
  - VI. Modern Technology Stack: Added OpenAI Agents SDK, Official MCP SDK, OpenAI ChatKit, Kafka (Phase V ready)
  - VII. Monorepo Organization: Added Phase III (chatbot) structure under frontend/ and backend/
  - VIII. Full-Stack Architecture: Evolved to include MCP server architecture, Agent subsystem, conversation persistence
  - IX. API Security & Authentication: Expanded for chat endpoint security, conversation ownership
  - X. Database-First Design: Added Conversation and Message models for conversation persistence
- New principles (VI new principles for Phase III):
  - XIII. AI Agent Architecture (NEW): OpenAI Agents SDK patterns, tool invocation, context management, error recovery
  - XIV. MCP Server Design (NEW): Official MCP SDK patterns, stateless tool design, schema validation, performance budgets
  - XV. Conversation State Management (NEW): Stateless endpoints with database persistence, pagination, rate limiting
  - XVI. Natural Language Understanding (NEW): Intent detection, parameter extraction, confirmation flows, context awareness
  - XVII. Error Handling & Resilience (NEW): Tool failure recovery, rate limiting, graceful degradation, error monitoring
  - XVIII. Observability for AI Systems (NEW): Structured logging, trace tracking, metrics collection, debugging for AI operations
- Added sections:
  - Phase III Technology Stack (ChatKit, Agents SDK, MCP SDK, Kafka/Dapr)
  - Chat Architecture Diagrams (Frontend → Backend → MCP Tools → Database)
  - Event-Driven Architecture (Kafka topics, Dapr components for Phase V)
  - Bonus Features (Reusable Intelligence, Cloud Blueprints, Multi-language, Voice)
- Modified sections:
  - Technology Standards: Added ChatKit, Agents SDK, MCP SDK, Kafka, Dapr
  - Project Structure: Added Phase III (chatbot) directory structure
  - Development Workflow: Updated feature cycle for AI/chatbot features
- Templates requiring updates:
  - spec-template.md: Add MCP tool specification section
  - plan-template.md: Add AI/Agent/MCP planning sections
  - tasks-template.md: Add Agent behavior task categories
  - Add phase-3-chatbot/CLAUDE.md with ChatKit and Agent patterns
- Follow-up TODOs:
  - Create frontend/chatbot/ directory structure with ChatKit components
  - Create backend/src/services/agent_service.py for Agents SDK wrapper
  - Create backend/src/services/mcp_service.py for MCP tool definitions
  - Create specs/features/phase-3-chatbot/ with detailed specifications
  - Define MCP tool templates in .claude/skills/
  - Document Agent behavior testing strategies
  - Create monitoring/observability spec for chatbot operations
  - Plan Kafka/Dapr integration for Phase V (event-driven architecture)
-->

# Talal's TDA Constitution (Phases I, II, III & Beyond)

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)
All features MUST be specified before implementation. No code shall be written without a corresponding specification in the `/specs` directory. Specifications must be organized by type and include:

**Specification Organization**:
- **Features**: `/specs/features/<feature-name>/` - User-facing feature specifications
- **APIs**: `/specs/api/<endpoint-group>/` - RESTful API contracts and endpoints
- **Database**: `/specs/database/<domain>/` - Schema designs, migrations, queries
- **UI**: `/specs/ui/<component-group>/` - Component specs, layouts, user flows
- **AI/Chatbot** (Phase III+): `/specs/features/phase-3-chatbot/` - Agent behavior specs, MCP tool specs, conversation flows

**Required Content**:
- Clear user stories and acceptance criteria
- Input/output examples (with TypeScript/Python types)
- Edge cases and error handling requirements
- Security considerations (authentication, authorization, data validation)
- Performance budgets (API latency < 200ms, UI render < 100ms, chat response < 3s)
- Success criteria that can be tested (unit, integration, E2E)

**Agent & MCP Specifications** (Phase III+):
- Agent behavior specification (intent recognition, tool selection, confirmation flows)
- MCP tool schemas (parameters, return types, error cases)
- Conversation flow diagrams (stateless request cycle)
- Natural language command examples

**Rationale**: Spec-driven development ensures clear requirements across frontend/backend boundaries, facilitates Claude Code subagent collaboration, provides comprehensive documentation for multi-phase evolution, and enables AI agent development with precise tool specifications.

### II. Clean Code & Multi-Language Standards
All code MUST adhere to language-specific best practices:

**Python (Backend)**:
- PEP 8 style guidelines (enforced via ruff)
- Type hints for all function parameters and return values (using Pydantic/SQLModel)
- Descriptive variable and function names
- Maximum function length: 50 lines (extract helpers if longer)
- Maximum file length: 300 lines (split into modules if longer)
- Docstrings for all public functions, classes, and API endpoints
- FastAPI dependency injection patterns for database, auth, configuration

**TypeScript (Frontend)**:
- ESLint + Prettier configured for Next.js 16+
- Strict TypeScript mode enabled (`strict: true`)
- React Server Components by default (Client Components only when needed)
- Component file naming: `PascalCase.tsx`
- Utility file naming: `camelCase.ts`
- Maximum component length: 200 lines (extract child components if longer)
- JSDoc comments for complex utilities and hooks

**Python/AI Services** (Phase III+):
- Structured logging with JSON format (timestamp, trace_id, component, level)
- Async/await patterns for I/O-bound operations
- Type hints for OpenAI Agents SDK and MCP tool returns
- Error tracking with context (user_id, conversation_id, tool_name)

**Shared Standards**:
- No single-letter variables except loop counters and common conventions (i, e, x, y)
- DRY principle: Extract reusable logic into utilities/helpers
- SOLID principles for class design
- Functional programming preferred over class-based where appropriate

**Rationale**: Consistent code quality across frontend and backend improves maintainability, facilitates AI-assisted development via Context7 MCP, prepares codebase for team collaboration, and enables structured logging for AI operations.

### III. Test-First Development (TDD)
Testing discipline MUST follow Red-Green-Refactor cycle across all layers:

**Testing Pyramid**:
1. **Unit Tests** (70%): Test individual functions, components, models
   - Backend: pytest for business logic, models, utilities, agent logic
   - Frontend: Vitest + React Testing Library for components, hooks, utilities
   - Agent behavior: Unit tests for intent parsing, tool selection logic
2. **Integration Tests** (20%): Test API endpoints, database interactions
   - Backend: pytest with TestClient for FastAPI routes
   - Chat endpoint: Test with mocked MCP tools and conversation history
   - Database: Test migrations, queries, transactions with test database
   - MCP tools: Test tool invocation, parameter validation, error handling
3. **End-to-End Tests** (10%): Test full user workflows
   - Playwright for critical user journeys (signup, login, CRUD, chat flows)
   - Chat conversation flows (multi-turn, tool usage, error recovery)

**Requirements**:
- All features MUST have unit tests before code review
- Test coverage target: minimum 80% overall (90% for critical paths)
- Backend tests MUST use Neon test database or SQLite in-memory
- Frontend tests MUST mock API calls (no real backend during tests)
- Chat tests MUST mock MCP tools (test agent logic independently)
- E2E tests MUST run in CI/CD pipeline before deployment
- Tests MUST be fast: unit < 1s, integration < 5s, E2E < 30s

**Red-Green-Refactor Cycle**:
1. **Red**: Write failing test(s) for the feature (unit, integration, or E2E)
2. **Green**: Implement minimum code to pass tests
3. **Refactor**: Clean up while keeping tests green

**Agent Behavior Testing** (Phase III+):
- Mock MCP tools for agent logic testing
- Test intent detection for natural language commands
- Test tool parameter extraction from user input
- Test error handling and recovery flows
- Test conversation context management (multi-turn awareness)

**Rationale**: Comprehensive testing prevents regressions across frontend/backend integration points, provides executable documentation, enables confident refactoring, and ensures AI agents behave predictably.

### IV. Database-First Design with Neon PostgreSQL
Data persistence MUST use Neon Serverless PostgreSQL with SQLModel ORM:

**Database Standards**:
- **ORM**: SQLModel for Python (combines SQLAlchemy + Pydantic)
- **Migrations**: Alembic for schema version control
- **Connection**: Neon serverless pooling with secure connection strings
- **Models**: Define once in SQLModel, use for DB schema + API validation
- **Queries**: Prefer SQLModel select() over raw SQL (use raw only for complex analytics)

**Schema Design Principles**:
- Normalize to 3NF (third normal form) unless performance requires denormalization
- Use UUIDs for primary keys (not auto-increment integers)
- Include `created_at`, `updated_at` timestamps on all tables
- Use Postgres JSONB for flexible metadata fields
- Define foreign key constraints with ON DELETE CASCADE where appropriate
- Index columns used in WHERE clauses and JOINs

**Conversation Persistence** (Phase III+):
- **Conversations table**: id, user_id, created_at, updated_at
- **Messages table**: id, conversation_id, user_id, role (user/assistant), content, tool_calls (JSONB), created_at
- **Task operations**: All stored via MCP tools (no direct database writes from agent)
- Pagination: Support 1000+ message conversations with pagination
- Retention: 90-day retention policy for archived conversations

**Transaction Management**:
- Use SQLModel sessions with proper commit/rollback
- Wrap multi-table operations in transactions
- Handle deadlocks and retry transient failures
- Use optimistic locking (version columns) for concurrent updates

**Security**:
- Never expose raw database errors to API responses
- Use parameterized queries (SQLModel handles this automatically)
- Store connection strings in environment variables (`.env.local`)
- Separate read-only user for analytics queries
- Conversation ownership verification on all queries

**Rationale**: Database-first design ensures data integrity, enables type-safe queries, provides foundation for scalable multi-user operations, and supports stateless API architecture.

### V. Multi-Interface Excellence (CLI + Web UI + Chatbot)
User interfaces MUST be intuitive, robust, and professional across all access methods:

**Phase I CLI** (Preserved):
- Numbered menu system for main operations
- Clear input prompts with examples
- Confirmation for destructive operations (delete)
- Formatted output tables for task listing
- Graceful error handling with helpful messages
- Located in `src/todo_app/` (always accessible)

**Phase II Web UI** (Next.js 16+ App Router):
- **Responsive Design**: Mobile-first, works on 320px to 4K screens
- **Accessibility**: WCAG 2.1 AA compliance (semantic HTML, ARIA labels, keyboard navigation)
- **Performance**: First Contentful Paint < 1.5s, Time to Interactive < 3s
- **Server Components**: Default to RSC, use Client Components only for interactivity
- **Loading States**: Skeleton screens during data fetching
- **Error Boundaries**: Graceful error handling with retry options
- **Forms**: Client-side validation + server-side validation (never trust client)

**Phase III Chatbot UI** (OpenAI ChatKit):
- **ChatKit Component**: Pre-built web component for conversational interface
- **Message Display**: User and assistant messages with timestamps
- **Input Area**: Text input with send button, loading indicator
- **Conversation History**: Scrollable message list with pagination
- **Error Display**: User-friendly error messages for tool failures
- **Mobile Responsive**: Touch-friendly interface, auto-scroll to latest message
- **Accessibility**: Proper ARIA labels, keyboard navigation for messages and input

**Design System**:
- Use Tailwind CSS for styling (utility-first approach)
- Define color palette in `tailwind.config.ts` (primary, secondary, error, success)
- Create reusable components in `frontend/src/components/`
- Use shadcn/ui for common UI patterns (buttons, inputs, modals)
- ChatKit styling integration (custom CSS for brand consistency)

**Rationale**: Professional interfaces demonstrate software craftsmanship, excellent UX improves user adoption, CLI preservation allows Phase I demo during Phase II+, and ChatKit integration enables rapid AI chatbot development.

### VI. Modern Technology Stack
Technology standards MUST include latest stable versions and best practices:

**Backend (FastAPI)**:
- Python 3.13+
- FastAPI 0.110+ for REST API
- SQLModel for ORM (combines SQLAlchemy + Pydantic)
- Pydantic v2 for request/response validation
- UV for dependency management
- pytest + httpx for testing

**Frontend (Next.js)**:
- Next.js 16+ with App Router (not Pages Router)
- React 19+ (Server Components by default)
- TypeScript 5+ in strict mode
- Tailwind CSS 4+ for styling
- Vitest + React Testing Library for testing
- Playwright for E2E tests

**AI & Chatbot** (Phase III+):
- **Agent Framework**: OpenAI Agents SDK (official)
- **LLM**: GPT-4-turbo with temperature=0.7
- **UI Framework**: OpenAI ChatKit (web component)
- **Tool Protocol**: Official MCP SDK (Model Context Protocol)
- **Conversation Persistence**: Neon PostgreSQL (from Phase II)

**Event-Driven Architecture** (Phase IV+):
- **Message Broker**: Kafka / Redpanda Cloud
- **Runtime**: Dapr for service communication, state management, pub/sub abstraction
- **Topics**: task-events, reminders, task-updates
- **Dapr Components**: pubsub.kafka, state.postgresql, bindings.cron, secretstores.kubernetes

**Database**:
- Neon Serverless PostgreSQL
- Alembic for migrations
- Connection pooling enabled

**Authentication**:
- Better Auth for authentication infrastructure
- JWT tokens for stateless authentication
- HttpOnly cookies for token storage (prevents XSS)
- CSRF protection enabled

**Development Tools**:
- UV for Python dependency management
- pnpm for Node.js packages (faster than npm/yarn)
- ESLint + Prettier for code formatting
- ruff for Python linting
- Git hooks (pre-commit) for quality checks

**Deployment**:
- Frontend: Vercel (optimized for Next.js)
- Backend: Railway, Render, or similar Python hosting
- Database: Neon serverless (included)
- Chatbot: Same backend, ChatKit on frontend
- Cloud (Phase V): DigitalOcean Kubernetes (DOKS), Docker, Helm

**Rationale**: Modern stack ensures performance, security, developer experience, alignment with industry best practices, and readiness for AI-native development with official SDKs.

### VII. Monorepo Organization
The project MUST support multiple phases coexisting in a single repository:

**Directory Structure**:
```
phase-1/                    # Root directory (unchanged name for compatibility)
├── .specify/               # Spec-Kit Plus configuration (global)
│   ├── memory/
│   │   └── constitution.md # This file (governs all phases)
│   ├── templates/          # Spec/plan/task templates
│   └── scripts/            # Automation scripts
├── .claude/                # Claude Code configuration (global)
│   ├── agents/             # Subagent definitions
│   └── skills/             # Reusable intelligence modules
├── specs/                  # All specifications (organized by type)
│   ├── features/           # User-facing features
│   │   ├── task-crud/      # CRUD operations (all phases)
│   │   ├── authentication/ # User auth (Phase II+)
│   │   ├── phase-3-chatbot/# Chatbot feature (Phase III+)
│   │   │   ├── spec.md
│   │   │   ├── agent-spec.md
│   │   │   ├── mcp-tools-spec.md
│   │   │   └── CONSTITUTION.md
│   │   ├── notifications/  # Notifications (Phase V)
│   │   └── recurring-tasks/# Recurring tasks (Phase V)
│   ├── api/                # API contracts
│   │   ├── rest-endpoints.md
│   │   └── mcp-tools.md
│   ├── database/           # Schema and migrations
│   │   ├── tasks.md
│   │   ├── conversations.md # (Phase III+)
│   │   └── events.md       # (Phase V+)
│   └── ui/                 # Component specs
│       ├── pages.md
│       └── chatbot.md      # (Phase III+)
├── history/                # Global history (all phases)
│   ├── prompts/            # Prompt history records
│   └── adr/                # Architecture decision records
├── src/                    # Source code (phase-specific)
│   └── todo_app/           # Phase I: CLI application (preserved)
│       ├── main.py
│       ├── models.py
│       ├── storage.py
│       ├── operations.py
│       ├── ui.py
│       └── banner.py
├── frontend/               # Phase II+: Next.js application
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   ├── components/     # React components
│   │   │   ├── TaskList.tsx    # (Phase II)
│   │   │   ├── TaskForm.tsx    # (Phase II)
│   │   │   └── ChatBot.tsx     # (Phase III - ChatKit wrapper)
│   │   ├── lib/            # Utilities and API clients
│   │   │   ├── api.ts
│   │   │   └── chatApi.ts  # (Phase III)
│   │   └── types/          # TypeScript type definitions
│   │       ├── task.ts
│   │       └── conversation.ts # (Phase III)
│   ├── public/             # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   └── CLAUDE.md           # Frontend-specific Claude instructions
├── backend/                # Phase II+: FastAPI application
│   ├── src/
│   │   ├── api/            # API route handlers
│   │   │   ├── tasks.py    # (Phase II+)
│   │   │   ├── chat.py     # (Phase III - POST /api/chat)
│   │   │   └── auth.py     # (Phase II+)
│   │   ├── models/         # SQLModel database models
│   │   │   ├── task.py     # (Phase II+)
│   │   │   └── conversation.py # (Phase III)
│   │   ├── services/       # Business logic layer
│   │   │   ├── task_service.py
│   │   │   ├── agent_service.py # (Phase III - Agents SDK wrapper)
│   │   │   ├── mcp_service.py # (Phase III - MCP tool definitions)
│   │   │   └── notification_service.py # (Phase V)
│   │   ├── auth/           # Authentication logic
│   │   │   ├── jwt.py
│   │   │   └── dependencies.py
│   │   └── db/             # Database connection and migrations
│   │       ├── session.py
│   │       └── migrations/
│   ├── tests/              # Backend tests
│   ├── pyproject.toml
│   └── CLAUDE.md           # Backend-specific Claude instructions
├── tests/                  # Phase I tests (preserved)
├── docker-compose.yml      # (Phase IV - Local dev)
├── README.md               # Project overview (all phases)
├── CLAUDE.md               # Root Claude Code instructions
└── pyproject.toml          # Phase I Python dependencies
```

**Phase Independence**:
- Phase I CLI runs independently: `uv run python -m src.todo_app.main`
- Phase II frontend runs independently: `cd frontend && pnpm dev`
- Phase II backend runs independently: `cd backend && uv run uvicorn src.main:app`
- Phase III chatbot runs on Phase II services (no new services, only chat endpoint)
- Each phase can be demoed separately

**Cross-Phase Coordination**:
- Shared specifications in `/specs` inform all phases
- Shared constitution governs all development
- Shared history tracks evolution across phases
- Claude Code subagents work across phase boundaries

**Rationale**: Monorepo enables phase coexistence, allows Phase I demo recording during Phase II+ development, maintains clean separation of concerns, facilitates shared tooling and documentation.

### VIII. Full-Stack Architecture Patterns
Frontend and backend MUST follow clean architecture with clear boundaries:

**Separation of Concerns**:
- **Frontend**: Presentation, user interaction, client-side state, ChatKit UI
- **Backend**: Business logic, data persistence, authentication, agent logic, MCP tools
- **Database**: Data storage, integrity, conversation history, task persistence

**Frontend Architecture**:
```
frontend/src/
├── app/                # Next.js App Router (routes + layouts)
│   ├── page.tsx        # Home page with task list (Phase II)
│   ├── chat/page.tsx   # Chat page with ChatKit (Phase III)
│   └── layout.tsx      # Root layout
├── components/         # React components (UI, forms, layouts)
│   ├── TaskList.tsx    # (Phase II)
│   ├── ChatBot.tsx     # ChatKit wrapper component (Phase III)
│   └── ...
├── lib/                # Utilities, API clients, helpers
│   ├── api.ts          # Fetch wrapper with auth headers
│   ├── chatApi.ts      # Chat endpoint client (Phase III)
│   ├── auth.ts         # Client-side auth state management
│   └── utils.ts        # General utilities
└── types/              # TypeScript interfaces matching backend models
    ├── task.ts
    └── conversation.ts # (Phase III)
```

**Backend Architecture**:
```
backend/src/
├── api/                # FastAPI route handlers (thin controllers)
│   ├── tasks.py        # CRUD endpoints for tasks
│   ├── chat.py         # Chat endpoint (Phase III: POST /api/chat)
│   └── auth.py         # Login, signup, logout endpoints
├── models/             # SQLModel database models
│   ├── task.py         # Task model (DB schema + Pydantic validation)
│   └── conversation.py # Conversation and Message models (Phase III)
├── services/           # Business logic (fat services)
│   ├── task_service.py # Task operations, validation, side effects
│   ├── agent_service.py # OpenAI Agents SDK wrapper (Phase III)
│   ├── mcp_service.py # MCP tool definitions and execution (Phase III)
│   └── notification_service.py # Notification operations (Phase V)
├── auth/               # Authentication logic
│   ├── jwt.py          # JWT creation, validation
│   └── dependencies.py # FastAPI auth dependencies
└── db/                 # Database connection and utilities
    ├── session.py      # SQLModel session management
    └── migrations/     # Alembic migration scripts
```

**Chat Architecture** (Phase III):
```
User Input (ChatKit) → POST /api/chat (FastAPI)
    ↓
Fetch Conversation History (Database)
    ↓
Build Message Array (System Prompt + History + New Message)
    ↓
Initialize Agent (OpenAI Agents SDK + MCP Tools)
    ↓
Agent.run() - LLM evaluates tools
    ↓
Tool Invocation (MCP tools via FastAPI services)
    ↓
Store Messages (Conversation persistence)
    ↓
Return Response to ChatKit UI
```

**Communication Patterns**:
- Frontend → Backend: RESTful HTTP requests with JSON payloads
- Backend → Database: SQLModel ORM queries
- Backend → MCP Tools: HTTP/JSON or direct Python calls
- Authentication: JWT tokens in HttpOnly cookies
- Chat: Single POST endpoint, stateless request cycle
- Error handling: Backend returns structured JSON errors, frontend displays user-friendly messages

**State Management**:
- Server State (fetched data): React Server Components + `fetch()` with caching
- Client State (UI only): React `useState`, `useReducer` for complex state
- Global State (rare): Context API only when needed (avoid prop drilling)
- Form State: React Hook Form for complex forms
- Conversation State: Database only (server-side stateless)

**Rationale**: Clean architecture enables independent frontend/backend development, allows teams/subagents to work in parallel, provides clear API contracts, and supports stateless chat architecture.

### IX. API Security & Authentication
All API endpoints MUST implement secure authentication and authorization:

**Authentication Flow (Better Auth + JWT)**:
1. User signs up/logs in via Better Auth (frontend)
2. Better Auth issues JWT token
3. Token stored in HttpOnly cookie (prevents XSS)
4. Frontend includes cookie in all API requests
5. Backend validates JWT signature with shared secret
6. Backend extracts user ID from token claims
7. Backend authorizes access based on user ID and resource ownership

**JWT Token Standards**:
- Algorithm: HS256 (symmetric) or RS256 (asymmetric for microservices)
- Expiration: 15 minutes (short-lived)
- Refresh tokens: 7 days (stored securely, HttpOnly)
- Claims: `user_id`, `email`, `exp`, `iat`
- Secret: 256-bit random string in environment variable

**API Endpoint Security**:
- **Public endpoints** (no auth): Health check, API docs, OpenAI ChatKit client script
- **Protected endpoints** (auth required): All CRUD operations, chat endpoint
- **Admin endpoints** (role-based): User management, analytics
- Rate limiting: 100 requests/minute per IP, 60 chat messages/minute per user
- CORS: Whitelist frontend domain only (not `*`)

**Chat Endpoint Security** (Phase III):
- `POST /api/{user_id}/chat` requires valid JWT token
- Conversation ownership verified (token user_id must match URL user_id)
- Rate limiting per user (60 messages/minute, prevent abuse)
- Input validation: message length < 5000 characters
- Output sanitization: never expose MCP tool errors directly

**Input Validation**:
- Validate all inputs with Pydantic models (backend)
- Sanitize HTML/SQL to prevent injection attacks
- Limit string lengths, array sizes (prevent DoS)
- Validate file uploads (type, size, content)
- MCP tool parameters validated against JSON schema

**Output Sanitization**:
- Never expose stack traces to clients (log internally)
- Don't leak user existence in error messages ("Invalid credentials" not "User not found")
- Redact sensitive fields in logs (passwords, tokens, credit cards, API keys)
- Sanitize agent responses (no internal tool errors exposed)

**Security Headers** (FastAPI middleware):
- `Strict-Transport-Security`: HTTPS only
- `X-Content-Type-Options: nosniff`: Prevent MIME sniffing
- `X-Frame-Options: DENY`: Prevent clickjacking
- `Content-Security-Policy`: Restrict resource loading

**Rationale**: Security is non-negotiable; JWT stateless auth enables horizontal scaling, Better Auth provides battle-tested authentication flows, defense-in-depth prevents vulnerabilities, conversation ownership prevents cross-user leaks.

### X. Database-First Design Workflow
Database schema MUST be designed before API implementation:

**Design Workflow**:
1. **Spec**: Define database schema in `/specs/database/<domain>/spec.md`
2. **Model**: Create SQLModel model in `backend/src/models/`
3. **Migration**: Generate Alembic migration script
4. **Review**: Verify migration in staging database
5. **Apply**: Run migration in production
6. **Test**: Write tests for model constraints and relationships

**SQLModel Best Practices**:
```python
from sqlmodel import SQLModel, Field
from datetime import datetime
import uuid

class Task(SQLModel, table=True):
    """Task model for database and API validation."""
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(max_length=200, index=True)
    description: str | None = Field(default=None, max_length=2000)
    is_complete: bool = Field(default=False)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Conversation(SQLModel, table=True):
    """Conversation model for chat history."""
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Message(SQLModel, table=True):
    """Message model for conversation persistence."""
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    conversation_id: uuid.UUID = Field(foreign_key="conversation.id", index=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", index=True)
    role: str = Field(max_length=20)  # "user" or "assistant"
    content: str = Field()
    tool_calls: dict | None = Field(default=None, sa_column_kwargs={"type": "JSONB"})
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

**Migration Safety**:
- Never edit existing migrations (create new ones)
- Test migrations on staging data before production
- Include rollback instructions in migration comments
- Use Alembic's `downgrade()` for reversibility
- Back up production database before schema changes

**Performance Optimization**:
- Index columns used in WHERE/ORDER BY clauses
- Use `select_related()` / `joinedload()` to avoid N+1 queries
- Paginate large result sets (limit + offset or cursor-based)
- Use database-level constraints (unique, not null, check)
- Monitor slow queries with Neon's query analytics
- Conversation pagination: 1000 message limit per fetch

**Conversation Persistence**:
- Store all messages in database (user and assistant)
- Store tool calls as JSONB with tool name and parameters
- Pagination support for long conversations (90-day retention)
- Index on conversation_id and user_id for fast lookup
- Support multi-turn context (fetch full history on new message)

**Rationale**: Database-first design prevents schema sprawl, ensures data integrity, enables type-safe API development, supports stateless chat architecture.

### XI. Subagent Coordination & Parallel Execution
Complex tasks MUST leverage Claude Code subagents for efficiency:

**When to Use Subagents**:
- **Parallel Work**: Frontend + backend implementation of same feature
- **Specialized Tasks**: Database migrations, API testing, UI component creation
- **Code Generation**: Using Context7 MCP for up-to-date library patterns
- **Large Refactors**: Multi-file changes requiring coordination

**Subagent Patterns**:
1. **Feature Swarm** (parallel):
   - Subagent A: Implements backend API endpoint
   - Subagent B: Implements frontend UI component
   - Subagent C: Writes integration tests
   - Coordinator: Reviews and integrates results

2. **Sequential Pipeline**:
   - Subagent 1: Generates database migration
   - Subagent 2: Updates SQLModel models
   - Subagent 3: Updates API endpoints
   - Subagent 4: Updates frontend types

3. **Specialist Agents** (defined in `.claude/agents/`):
   - `database-architect`: Schema design and migrations
   - `api-designer`: FastAPI endpoint implementation
   - `ui-builder`: Next.js component creation
   - `agent-builder`: OpenAI Agents SDK integration (Phase III)
   - `test-engineer`: Test suite generation

**Context7 MCP Integration**:
- Use Context7 to fetch latest library documentation (Next.js, FastAPI, Better Auth, OpenAI)
- Generate code following current best practices (not outdated patterns)
- Ask Context7 for TypeScript types, API patterns, configuration examples
- Validate generated code against official docs
- Query Agents SDK docs for agent initialization patterns

**Coordination Protocol**:
- Define clear interfaces before parallel execution (API contracts, types)
- Use shared types file (`types.ts`) for frontend/backend alignment
- Run integration tests after subagent merges
- Document subagent decisions in ADRs if architecturally significant
- For AI features: Validate MCP tool schemas match specifications

**Rationale**: Subagents accelerate development by parallelizing work, Context7 ensures modern code generation, specialist agents capture reusable domain expertise.

### XII. Reusable Intelligence via Skills
Common patterns MUST be extracted into reusable Claude Code skills:

**Skill Creation Guidelines**:
- **When to Create**: After implementing same pattern 2-3 times (DRY principle)
- **Scope**: Single responsibility (one skill = one capability)
- **Documentation**: Clear description, input parameters, example usage
- **Location**: `.claude/skills/<skill-name>/`

**Skill Categories**:
1. **Database Skills**:
   - `create-sqlmodel-model`: Generate SQLModel model from spec
   - `generate-migration`: Create Alembic migration script
   - `seed-test-data`: Populate test database with fixtures

2. **API Skills**:
   - `create-fastapi-endpoint`: Generate CRUD endpoint with validation
   - `add-jwt-auth`: Add JWT authentication to endpoint
   - `write-api-tests`: Generate pytest tests for API routes

3. **Frontend Skills**:
   - `create-next-page`: Generate Next.js App Router page with layout
   - `create-form-component`: Generate form with validation and submission
   - `add-auth-guard`: Protect page/component with authentication check

4. **AI/Chatbot Skills** (Phase III+):
   - `create-mcp-tool`: Generate MCP tool definition with schema
   - `create-agent-service`: Generate OpenAI Agents SDK wrapper
   - `test-agent-behavior`: Generate tests for agent intent parsing

5. **Testing Skills**:
   - `generate-unit-tests`: Create unit tests from function signatures
   - `generate-e2e-test`: Create Playwright test from user story
   - `setup-test-db`: Initialize test database with schema

**Skill Format** (`.claude/skills/<skill-name>/skill.md`):
```markdown
# Skill: Create MCP Tool

## Description
Generates an MCP tool definition with JSON schema validation.

## Inputs
- `tool_name`: Name of the tool (snake_case)
- `description`: Tool description for agent
- `parameters`: JSON schema for parameters
- `implementation`: Python function to implement

## Process
1. Generate MCP tool schema
2. Add JSON Schema validation
3. Create tool handler function
4. Return tool configuration

## Example Usage
/skill create-mcp-tool \
  --name add_task \
  --description "Create a new task" \
  --parameters '{"title": {"type": "string"}, "description": {"type": "string"}}'
```

**Skill Maintenance**:
- Update skills when patterns evolve (Better Auth upgrades, Next.js changes, OpenAI SDK updates)
- Version skills with semantic versioning (skill.version in metadata)
- Deprecate old skills gracefully (add warnings, provide migration path)
- Test skills regularly (run against example inputs)

**Rationale**: Skills capture institutional knowledge, reduce repetitive subagent invocations, ensure consistency across features, accelerate future development.

### XIII. AI Agent Architecture (NEW)
All AI agent implementations MUST use OpenAI Agents SDK following strict patterns:

**Agent Design Pattern**:
```
User Input (Chat Message)
    ↓
Fetch Conversation History (Database)
    ↓
Build Message Array (System Prompt + History + New Message)
    ↓
Initialize Agent with MCP Tools
    ↓
Agent.run() with Message Array
    ↓
Agent Evaluates Tools (LLM Decision)
    ↓
Tool Invocation (via MCP Server)
    ↓
Tool Result Processing
    ↓
Agent Generates Response (with Tool Summary)
    ↓
Store User Message in Database
    ↓
Store Agent Response in Database
    ↓
Return Response to Client
```

**Agent Initialization**:
```python
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

agent = client.agents.agents.create(
    model="gpt-4-turbo",
    tools=mcp_tools,  # MCP tool definitions
    system_prompt="You are a helpful todo assistant. Use the provided tools to manage tasks...",
    temperature=0.7,  # Balance creativity and determinism
)
```

**Agent Behavior Requirements**:
- **Tool Selection**: Agent MUST choose appropriate tool based on user intent
- **Parameter Extraction**: Agent MUST correctly parse user input into tool parameters
- **Confirmation**: Agent SHOULD confirm destructive operations (delete, update) before execution
- **Error Recovery**: Agent MUST handle tool failures gracefully with user-friendly messages
- **Context Awareness**: Agent MUST maintain conversation context across multiple turns
- **Token Management**: Agent MUST respect context window limits (track message count, trim if needed)

**System Prompt Design**:
- Clear instructions for task management operations
- Examples of natural language commands and expected tool invocations
- Error handling guidance (what to do if tool fails)
- Confirmation protocol (always ask before deletion)
- Constraints and limitations (what agent cannot do)

**Tool Selection Logic**:
- `add_task`: When user mentions adding/creating/remembering something
- `list_tasks`: When user asks to see/show/list tasks
- `complete_task`: When user says done/complete/finished/checked
- `delete_task`: When user says delete/remove/cancel/discard
- `update_task`: When user says change/update/rename/modify

**Context Management**:
- Fetch full conversation history on new message (SQLModel query)
- Build message array: [system_prompt, historical_messages, new_message]
- Limit message history: Keep last N messages (or 90 days, whichever comes first)
- Store all exchanges in database (enable conversation resume)

**Error Handling**:
- Tool not found: "I couldn't perform that action. Try saying 'Show me my tasks'"
- Tool parameter error: "I didn't understand that. Could you rephrase?"
- Tool execution error: "That operation failed. Please try again"
- Graceful degradation: Provide helpful alternatives when tool unavailable

**Response Generation**:
- Always confirm successful actions with detail ("Created task: Buy groceries")
- Always summarize tool usage ("I found 3 pending tasks")
- Always provide friendly tone and helpful next steps
- Never expose raw tool errors or stack traces

**Rationale**: Standardized agent architecture ensures predictable behavior, enables testing, provides clear error handling, supports stateless scalability.

### XIV. MCP Server Design (NEW)
Official MCP SDK MUST be used for standardized tool interface:

**MCP Tool Architecture**:
```
OpenAI Agent → MCP Client
                  ↓
            MCP Server (FastAPI)
                  ↓
        Tool Handler (Python function)
                  ↓
        Database Operation (SQLModel)
                  ↓
        Return Result (JSON)
```

**MCP Tool Specification**:
Each tool MUST define:
1. **Name**: Tool identifier (snake_case, e.g., `add_task`)
2. **Description**: Human-readable purpose for agent
3. **Parameters**: JSON Schema with input validation
4. **Returns**: JSON response schema
5. **Error Cases**: Documented failure modes

**Tool: add_task**:
```json
{
  "name": "add_task",
  "description": "Create a new task for the user",
  "parameters": {
    "type": "object",
    "properties": {
      "user_id": {"type": "string", "description": "User UUID"},
      "title": {"type": "string", "minLength": 1, "maxLength": 200},
      "description": {"type": "string", "maxLength": 2000}
    },
    "required": ["user_id", "title"]
  },
  "return": {
    "type": "object",
    "properties": {
      "task_id": {"type": "string"},
      "status": {"type": "string", "enum": ["created", "error"]},
      "title": {"type": "string"}
    }
  }
}
```

**Tool: list_tasks**:
```json
{
  "name": "list_tasks",
  "description": "Retrieve tasks for the user",
  "parameters": {
    "type": "object",
    "properties": {
      "user_id": {"type": "string", "description": "User UUID"},
      "status": {"type": "string", "enum": ["all", "pending", "completed"]}
    },
    "required": ["user_id"]
  }
}
```

**Tool: complete_task**:
```json
{
  "name": "complete_task",
  "description": "Mark a task as complete",
  "parameters": {
    "type": "object",
    "properties": {
      "user_id": {"type": "string"},
      "task_id": {"type": "string"}
    },
    "required": ["user_id", "task_id"]
  }
}
```

**Tool: delete_task, update_task**: (Similar structure)

**Implementation Standards**:
- Each tool is a stateless Python function
- Function signature matches JSON Schema parameters
- Return structured JSON response {success: bool, data: ...}
- Never modify tool parameters after validation
- All database operations wrapped in transactions
- Proper error handling with descriptive messages

**Tool Invocation Flow**:
1. Agent sends tool request with parameters
2. MCP Server validates parameters against JSON Schema
3. Database ownership check (user_id must own resource)
4. Execute tool function (SQLModel operation)
5. Return JSON response
6. Agent processes result and includes in response

**Performance Requirements**:
- Tool execution < 500ms (99th percentile)
- Database queries use indexes
- Connection pooling enabled
- Rate limiting enforced per user

**Error Handling**:
- Input validation errors: Return 400 with error message
- Resource not found: Return 404 with descriptive message
- Authorization failure: Return 403 (never expose reason)
- Tool execution error: Return 500 with generic message (log details internally)

**Stateless Design**:
- Tools never modify state except database
- Tools never maintain in-memory caches
- Tools never depend on previous invocations
- Tools never leak internal errors to agent
- Any server instance can execute any tool

**Rationale**: Standardized MCP tools ensure agent can interact consistently, stateless design enables horizontal scaling, JSON Schema validation prevents invalid requests, error handling provides clear user feedback.

### XV. Conversation State Management (NEW)
Conversation state MUST be persisted to database with stateless endpoints:

**Conversation Models**:
```python
class Conversation(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Message(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    conversation_id: UUID = Field(foreign_key="conversation.id", index=True)
    user_id: UUID = Field(foreign_key="user.id", index=True)
    role: str = Field(max_length=20)  # "user" or "assistant"
    content: str = Field()
    tool_calls: dict | None = Field(default=None, sa_column_kwargs={"type": "JSONB"})
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

**Stateless Endpoint Flow**:
```python
@app.post("/api/{user_id}/chat")
async def chat(user_id: UUID, request: ChatRequest):
    # 1. Validate request
    # 2. Fetch conversation (create if not provided)
    conversation = session.get(Conversation, request.conversation_id) or Conversation(user_id=user_id)

    # 3. Fetch full message history
    messages = session.exec(select(Message).where(
        Message.conversation_id == conversation.id
    ).order_by(Message.created_at)).all()

    # 4. Store user message
    user_msg = Message(conversation_id=conversation.id, user_id=user_id,
                       role="user", content=request.message)
    session.add(user_msg)
    session.commit()

    # 5. Run agent with full history
    agent_response = run_agent(messages + [user_msg], mcp_tools)

    # 6. Store assistant response
    assistant_msg = Message(conversation_id=conversation.id, user_id=user_id,
                           role="assistant", content=agent_response)
    session.add(assistant_msg)
    session.commit()

    # 7. Return response (no in-memory state)
    return ChatResponse(conversation_id=conversation.id, response=agent_response)
```

**Chat Endpoint**:
```
POST /api/{user_id}/chat
Content-Type: application/json

{
  "conversation_id": "uuid (optional, creates new if not provided)",
  "message": "string (user's natural language input)"
}

Response (200):
{
  "conversation_id": "uuid",
  "message_id": "uuid",
  "response": "string (assistant's response)",
  "tool_calls": [
    {
      "name": "tool_name",
      "parameters": {...},
      "result": {...}
    }
  ],
  "timestamp": "ISO8601"
}
```

**Conversation Limits**:
- Message limit: 1000 messages per conversation (paginate if exceeded)
- Retention: 90-day retention policy (archive older conversations)
- Context window: Use last N messages for agent (respect LLM token limits)
- Rate limiting: 60 messages/minute per user, 1000/hour per IP

**Pagination**:
```python
@app.get("/api/{user_id}/conversations/{conversation_id}/messages")
async def get_messages(user_id: UUID, conversation_id: UUID,
                       limit: int = 50, offset: int = 0):
    messages = session.exec(select(Message)
        .where(Message.conversation_id == conversation_id,
               Message.user_id == user_id)
        .order_by(Message.created_at.desc())
        .limit(limit)
        .offset(offset)).all()
    return {"messages": messages, "total": count}
```

**Conversation Listing**:
```python
@app.get("/api/{user_id}/conversations")
async def list_conversations(user_id: UUID, limit: int = 20):
    conversations = session.exec(select(Conversation)
        .where(Conversation.user_id == user_id)
        .order_by(Conversation.updated_at.desc())
        .limit(limit)).all()
    return {"conversations": conversations}
```

**Statelessness Benefits**:
- Any backend instance can handle any request
- Server restarts don't lose conversation state
- Horizontal scaling without session affinity
- Database is single source of truth
- Testability: Each request is independent

**Consistency**:
- All queries filtered by user_id (prevent cross-user leaks)
- Optimistic locking for concurrent updates (version field)
- Transaction isolation (SERIALIZABLE for critical operations)
- Conversation ownership verified on all operations

**Rationale**: Database-backed state enables stateless architecture, supports scalability, provides conversation history, enables recovery after service interruptions.

### XVI. Natural Language Understanding (NEW)
Agent MUST correctly understand and execute natural language commands:

**Intent Recognition**:
| User Says | Detected Intent | Tool Called |
|-----------|-----------------|------------|
| "Add a task to buy groceries" | create_task | add_task(title="Buy groceries") |
| "Show me all my tasks" | list_tasks | list_tasks(status="all") |
| "What's pending?" | list_tasks | list_tasks(status="pending") |
| "Mark task 3 as complete" | complete_task | complete_task(task_id=3) |
| "Delete the meeting task" | delete_task | (first list_tasks, then delete) |
| "I need to remember to pay bills" | create_task | add_task(title="Pay bills") |
| "What have I completed?" | list_tasks | list_tasks(status="completed") |
| "Change task 1 to 'Call mom tonight'" | update_task | update_task(task_id=1, title="Call mom tonight") |

**Parameter Extraction**:
- From direct mention: "Add task 'Buy milk'" → title="Buy milk"
- From context: "Mark it complete" → Reference previous task
- From pronouns: "Delete it" → Last mentioned task
- From numbers: "Show 5" → Limit parameter

**Confirmation Protocol**:
- **Create**: Confirm with task details ("Created: Buy groceries")
- **Update**: Confirm with new details ("Updated to: Call mom tonight")
- **Delete**: ASK FOR CONFIRMATION before deletion ("Are you sure you want to delete 'Old task'?")
- **Complete**: Confirm with task name ("Marked complete: Buy groceries")

**Multi-Turn Context Awareness**:
- Remember task references across turns ("Add it to my list" refers to previously mentioned item)
- Pronoun resolution ("delete it" = last mentioned task)
- State preservation (agent knows which tasks were listed last)
- Clarification requests (ask if ambiguous: "Did you mean task #1 or task #2?")

**Natural Language Examples** (Hackathon II requirement):
```
"Add a task to buy groceries"
→ add_task(title="Buy groceries")

"Reschedule my morning meetings to 2 PM"
→ (Phase V: update_task with time modification)

"Show me pending tasks sorted by priority"
→ (Phase II: list_tasks(status="pending"))

"Which tasks am I completing today?"
→ list_tasks(filter by today's context)

"Remind me about the dentist appointment"
→ (Phase V: add_task with due date + notification)
```

**Error Handling**:
- Ambiguous input: Ask for clarification ("Did you mean task #1 or #2?")
- Missing info: Request details ("What's the task title?")
- No matches: Suggest alternatives ("No tasks found. Create one?")
- Tool failure: User-friendly message ("Couldn't delete that task. Try again?")

**Testing Patterns**:
```python
# Test intent parsing
def test_add_task_intent():
    intent = parse_intent("Add a task to buy groceries")
    assert intent.tool_name == "add_task"
    assert intent.parameters.title == "Buy groceries"

# Test confirmation for delete
def test_delete_confirmation():
    response = run_agent("Delete task 1", mcp_tools)
    assert "Are you sure" in response

# Test multi-turn context
def test_pronoun_resolution():
    messages = [
        Message(role="user", content="Create task 'Fix bug'"),
        Message(role="user", content="Complete it")
    ]
    intent = parse_intent_with_context("Complete it", messages)
    assert intent.task_id == "created_task_id"
```

**Rationale**: Natural language understanding makes agent accessible to non-technical users, context awareness enables multi-turn conversations, confirmation prevents accidental operations.

### XVII. Error Handling & Resilience (NEW)
All error scenarios MUST be handled gracefully with clear user feedback:

**Error Categories**:
1. **User Errors** (4xx): Invalid input, wrong syntax, missing info
2. **Tool Errors** (5xx): Tool invocation failed, resource not found
3. **System Errors** (5xx): Database down, API timeout, LLM error

**Error Handling Examples**:
```python
# Missing required parameter
if not request.message or not request.message.strip():
    raise HTTPException(status_code=400, detail="Message cannot be empty")

# Resource not found
task = session.get(Task, task_id)
if not task:
    raise HTTPException(status_code=404, detail="Task not found")

# Authorization failure
if task.user_id != current_user.id:
    raise HTTPException(status_code=403, detail="Access denied")

# Tool execution error
try:
    result = execute_tool(tool_name, parameters)
except ToolExecutionError as e:
    logger.error(f"Tool error: {e}")
    return {"status": "error", "message": "That operation failed. Please try again"}
```

**User-Friendly Error Messages**:
- ❌ "Traceback: IndexError on line 42"
- ✅ "I couldn't find that task"

- ❌ "Foreign key constraint violation"
- ✅ "Task not found. Try 'Show me my tasks'"

- ❌ "Connection timeout to Neon"
- ✅ "I'm having trouble accessing your tasks. Please try again in a moment"

**Rate Limiting**:
- Per-user limit: 60 messages/minute (prevent LLM token exhaustion)
- Per-IP limit: 1000 messages/hour (prevent abuse)
- Graceful degradation: Return 429 with retry-after header
- User-friendly message: "You're chatting too fast. Please wait a moment"

**Graceful Degradation**:
- Slow MCP tool: Return cached result or fallback message
- Lost database connection: Return 503 with "Service temporarily unavailable"
- LLM rate limit: Queue request or return "I'm busy now, please try again"
- Conversation not found: Create new conversation (don't error)

**Error Monitoring**:
- Structured logging with trace_id for correlation
- Error metrics: Count by error_type, user_id, tool_name
- Alerting: High error rate (>5% of requests) triggers alert
- Debug mode: Include stack trace in logs (never expose to user)

**Resilience Patterns**:
- Retry transient failures (network, timeout) with exponential backoff
- Circuit breaker for failing external services
- Timeout all external calls (LLM, MCP tools)
- Fallback responses when services unavailable

**Rationale**: Clear error messages improve user experience, graceful degradation ensures service resilience, monitoring enables quick issue detection.

### XVIII. Observability for AI Systems (NEW)
AI operations MUST be fully observable with structured logging and metrics:

**Structured Logging Format**:
```json
{
  "timestamp": "2025-12-21T14:30:45.123Z",
  "level": "INFO",
  "message": "Agent response generated",
  "trace_id": "abc123def456",
  "user_id": "user-uuid",
  "conversation_id": "conv-uuid",
  "component": "agent",
  "agent_action": "tool_invoked",
  "tool_name": "add_task",
  "tool_duration_ms": 145,
  "tool_success": true,
  "llm_tokens_used": 342,
  "llm_model": "gpt-4-turbo",
  "request_duration_ms": 2103
}
```

**Logging Points**:
1. **Agent Initialization**:
   ```
   "Agent initialized with 5 tools, model: gpt-4-turbo, temperature: 0.7"
   ```

2. **Message Received**:
   ```
   "Received message: 'Add task...', length: 23, conversation_id: xyz"
   ```

3. **Tool Invocation**:
   ```
   "Tool invoked: add_task, parameters: {title: 'Buy milk'}, duration: 145ms"
   ```

4. **Tool Result**:
   ```
   "Tool result: {task_id: 123, status: 'created'}, success: true"
   ```

5. **Agent Response**:
   ```
   "Agent response generated, tokens_used: 342, duration: 2103ms"
   ```

**Metrics Tracked**:
- **Performance**:
  - Messages processed per minute
  - Response time (p50, p95, p99)
  - Tool execution time by tool
  - LLM token usage per message

- **Reliability**:
  - Tool success rate (%)
  - Tool failures by type
  - Error rate by error_type
  - Timeout rate (%)

- **Usage**:
  - Unique users per day
  - Messages per user per day
  - Tool usage distribution
  - Conversation length (average messages)

- **Cost**:
  - LLM tokens consumed (per message, per day)
  - LLM API costs
  - Database queries per message

**Tracing**:
- Every chat request gets unique `trace_id`
- All logs from same request include trace_id
- Enable end-to-end request tracking
- Correlate logs across microservices (Phase V)

**Debugging Support**:
- Log full request/response for sample of requests (1% sampling)
- Log full MCP tool calls and results for debugging
- Log agent decision rationale (which tool, why)
- Sanitize sensitive data in logs (passwords, tokens)

**Dashboards** (Optional - Phase IV+):
- Chat response time trend
- Error rate trend
- Tool success rate by tool
- LLM token usage trend
- User growth (daily active)

**Alerting Thresholds**:
- Response time p95 > 5s → Alert
- Error rate > 5% → Alert
- Tool success rate < 95% → Alert
- High LLM token usage → Warning

**Rationale**: Structured logging enables quick debugging, metrics track system health, tracing correlates events, alerting enables proactive incident response.

## Technology Standards

**Required Stack**:

**Backend**:
- **Language**: Python 3.13+
- **Framework**: FastAPI 0.110+
- **ORM**: SQLModel (combines SQLAlchemy + Pydantic)
- **Database**: Neon Serverless PostgreSQL
- **Migrations**: Alembic
- **Package Manager**: UV
- **Testing**: pytest + httpx
- **Linting**: ruff

**Frontend**:
- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript 5+ (strict mode)
- **Styling**: Tailwind CSS 4+
- **UI Components**: shadcn/ui + OpenAI ChatKit (Phase III+)
- **Package Manager**: pnpm
- **Testing**: Vitest + React Testing Library + Playwright
- **Linting**: ESLint + Prettier

**AI & Chatbot** (Phase III+):
- **Agent Framework**: OpenAI Agents SDK (official)
- **LLM**: GPT-4-turbo, temperature=0.7
- **UI Framework**: OpenAI ChatKit (web component)
- **Tool Protocol**: Official MCP SDK (Model Context Protocol)
- **Conversation DB**: Neon PostgreSQL (from Phase II)

**Event-Driven & Scaling** (Phase IV+):
- **Message Broker**: Apache Kafka / Redpanda Cloud
- **Runtime**: Dapr (Distributed Application Runtime)
- **Dapr Components**: pubsub.kafka, state.postgresql, bindings.cron, secretstores.kubernetes
- **Container**: Docker + Docker Compose (Phase IV)
- **Orchestration**: Kubernetes / Minikube (Phase IV)
- **Package Manager**: Helm Charts (Phase IV)
- **AI DevOps**: kubectl-ai, kagent, Docker AI (Gordon) (Phase IV+)

**Authentication**:
- **Provider**: Better Auth
- **Tokens**: JWT (HS256 or RS256)
- **Storage**: HttpOnly cookies

**DevOps**:
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway / Render
- **Database**: Neon (managed PostgreSQL)
- **Cloud (Phase V)**: DigitalOcean Kubernetes (DOKS)

**Bonus Technologies** (Optional - +Points):
- **Multi-language**: Urdu translation support (+100 points)
- **Voice**: Voice input for commands (+200 points)
- **Blueprints**: Cloud-native deployment blueprints (+200 points)
- **Reusable Intelligence**: Subagents and Skills (+200 points)

**Dependencies**:
- Prefer framework-recommended libraries (Next.js docs, FastAPI docs)
- Use Context7 MCP to verify latest stable versions
- Justify any non-standard dependencies in ADR
- Pin major versions, allow patch updates (e.g., `fastapi>=0.110,<0.111`)

## Development Workflow

**Feature Implementation Cycle** (Full-Stack with AI):
1. **Specify**: Create specs in `/specs/<type>/<feature-name>/`
   - Database schema spec (if needed)
   - API contract spec (backend)
   - UI component spec (frontend)
   - Agent behavior spec (if AI feature)
   - MCP tool spec (if AI feature)
2. **Review Spec**: Verify acceptance criteria, API contracts, types, agent behaviors
3. **Database First** (if applicable):
   - Create SQLModel model
   - Generate Alembic migration
   - Apply to test database
4. **Parallel Development** (use subagents):
   - Backend: Implement API endpoint + tests (TDD)
   - Frontend: Implement UI component + tests (TDD)
   - AI: Implement agent + MCP tools + tests (if applicable)
5. **Integration**: Connect frontend to backend via API client
6. **Agent Testing** (if applicable): Test agent behavior, tool invocation, error handling
7. **E2E Testing**: Write Playwright test for full user flow
8. **Review**: Code review, type checking, linting pass
9. **Document**: Update README if user-facing changes
10. **Commit**: Descriptive commit with spec references and PHR creation
11. **Deploy**: Push to staging, run E2E tests, deploy to production

**Code Review Standards**:
- All code changes MUST reference a spec file
- Tests MUST pass (unit + integration + E2E)
- Type checking MUST pass (TypeScript strict, Pydantic models)
- Linting MUST pass (ESLint, ruff)
- No commented-out code, console.logs, or debug statements
- API contracts MUST match OpenAPI schema (FastAPI auto-generates)
- Agent behavior MUST match spec (intent detection, tool selection)

**Quality Gates**:
- ✅ All tests pass (backend: pytest, frontend: vitest, E2E: playwright)
- ✅ Type checking passes (tsc --noEmit, mypy)
- ✅ Linting passes (eslint, ruff check)
- ✅ Spec acceptance criteria met
- ✅ README updated for user-facing changes
- ✅ PHR created in appropriate history subdirectory
- ✅ API documentation auto-generated (FastAPI /docs endpoint)
- ✅ Performance budgets met (API < 200ms, UI FCP < 1.5s, chat < 3s)
- ✅ Agent behavior validated (intent recognition, tool usage, error handling)

## Governance

**Amendment Process**:
This constitution governs all project phases. Amendments require:
1. Documented rationale for change
2. Impact analysis on existing code/specs/phases
3. Version increment following semantic versioning
4. Update to this file with new version, amendment date, and sync impact report
5. Update affected templates in `.specify/templates/`
6. Creation of ADR if architecturally significant

**Versioning Policy**:
- **MAJOR** (X.0.0): Backward-incompatible principle changes, phase additions, architecture redesigns
- **MINOR** (x.Y.0): New principles or sections added (backward compatible)
- **PATCH** (x.y.Z): Clarifications, wording improvements, typo fixes

**Compliance**:
- All feature implementations MUST comply with these principles
- Claude Code and subagents MUST verify constitution compliance before code generation
- Deviations require explicit justification in spec or ADR
- Constitution supersedes all other practices (including external docs)
- Phase-specific guidelines in frontend/CLAUDE.md, backend/CLAUDE.md, chatbot/CLAUDE.md supplement but don't override constitution

**Runtime Guidance**:
- Root: `CLAUDE.md` - General workflows, PHR creation, monorepo navigation
- Frontend: `frontend/CLAUDE.md` - Next.js patterns, component guidelines
- Backend: `backend/CLAUDE.md` - FastAPI patterns, database workflows
- Chatbot: `backend/chatbot/CLAUDE.md` or `frontend/chatbot/CLAUDE.md` - Agent patterns, MCP tools, ChatKit integration

**Version**: 3.0.0 | **Ratified**: 2025-12-06 | **Last Amended**: 2025-12-13
