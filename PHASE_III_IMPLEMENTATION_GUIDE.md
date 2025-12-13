# Phase III Implementation Guide
## AI-Powered Todo Chatbot - Complete Reference

**Last Updated**: 2025-12-13
**Status**: Specifications Complete, Ready for Implementation

---

## Quick Start

### 1. Understand the Specifications (Read in Order)

```bash
# Go to project root
cd /mnt/d/Talal/Work/Hackathons-Panaversity/phase-1

# Read these files in order
cat specs/features/phase-3-chatbot/CONSTITUTION.md    # Governance (v3.0.0)
cat specs/features/phase-3-chatbot/spec.md            # Requirements (8 user stories)
cat specs/features/phase-3-chatbot/agent-spec.md      # Agent behavior patterns
cat specs/features/phase-3-chatbot/mcp-tools-spec.md  # Tool specifications
cat specs/features/phase-3-chatbot/plan.md            # Implementation plan
cat specs/features/phase-3-chatbot/tasks.md           # Task breakdown (45 tasks)
```

### 2. Review Reference Code (Phase II)

```
phase-2/backend/src/api/tasks.py       ← FastAPI endpoint pattern
phase-2/backend/src/models/task.py     ← SQLModel pattern
phase-2/backend/src/services/         ← Service layer pattern
phase-2/frontend/src/components/       ← React component patterns
```

### 3. Execute Implementation

Follow `specs/features/phase-3-chatbot/tasks.md` step by step.

---

## Project Location

**Root Directory**: `/mnt/d/Talal/Work/Hackathons-Panaversity/phase-1/`

### Specification Files
- **CONSTITUTION.md (v3.0.0)**: 754 lines - AI governance document
- **spec.md**: 964 lines - Feature specification with 8 user stories
- **agent-spec.md**: 1,017 lines - Agent behavior and intent patterns
- **mcp-tools-spec.md**: 1,210 lines - 5 MCP tool specifications
- **plan.md**: 942 lines - 4-phase implementation roadmap
- **tasks.md**: 1,494 lines - 40+ granular implementation tasks

All in: `specs/features/phase-3-chatbot/`

### Implementation Locations (Choose One)

**Option A: Extend Phase II (Recommended)**
```
phase-2/backend/src/
├── api/chat.py                      (NEW - POST /api/{user_id}/chat)
├── services/
│   ├── agent_service.py             (NEW - OpenAI Agents SDK wrapper)
│   └── mcp_service.py               (NEW - MCP tool server)
├── models/
│   └── conversation.py              (NEW - Conversation & Message models)
└── db/migrations/versions/
    └── 003_add_conversation_tables.py (NEW - Alembic migration)

phase-2/frontend/src/
├── components/ChatBot.tsx           (NEW - ChatKit UI component)
├── lib/chatApi.ts                   (NEW - Chat API client)
└── types/chat.ts                    (NEW - Chat types)
```

**Option B: Create Separate Phase III Directory**
```
phase-3/
├── backend/src/
│   ├── api/chat.py
│   ├── services/
│   │   ├── agent_service.py
│   │   └── mcp_service.py
│   └── models/conversation.py
│
└── frontend/src/
    └── components/ChatBot.tsx
```

**Recommendation**: Use Option A (extend Phase II) for better code organization and reusability.

---

## Architecture Overview

### 4-Phase Implementation Plan

**Phase 1: Database Setup (Days 1-2)**
- Create Alembic migration for conversation tables
- Define SQLModel Conversation & Message models
- Create database indexes
- Verify schema

**Phase 2: Backend API & MCP (Days 3-4)**
- Implement chat endpoint (POST /api/{user_id}/chat)
- Build MCP server with 5 tools (add_task, list_tasks, complete_task, delete_task, update_task)
- Integrate with OpenAI Agents SDK
- Add error handling and validation

**Phase 3: Frontend Integration (Days 5-6)**
- Create ChatBot UI component with ChatKit
- Build chat API client
- Implement message history display
- Add real-time message updates

**Phase 4: Testing & Polish (Days 7-8)**
- Unit tests for agent behavior
- Integration tests for chat endpoint
- E2E tests with Playwright
- Performance optimization

### Key Technologies

- **OpenAI Agents SDK**: gpt-4-turbo model with temperature 0.7
- **MCP (Model Context Protocol)**: Official SDK for tool standardization
- **FastAPI**: Chat endpoint and MCP server
- **Next.js**: ChatBot UI component (ChatKit integration)
- **SQLModel**: Conversation & Message data models
- **PostgreSQL (Neon)**: Message history persistence
- **Better Auth**: Authentication (from Phase II)

### Architecture Diagram

```
User (Web Browser)
    ↓
ChatBot UI Component (Next.js + ChatKit)
    ↓
Chat API Client (chatApi.ts)
    ↓
POST /api/{user_id}/chat (FastAPI)
    ↓
Agent Service (OpenAI Agents SDK)
    ↓
MCP Server (5 Tools)
    ├── add_task          → Task table insert
    ├── list_tasks        → Task table query
    ├── complete_task     → Task table update
    ├── delete_task       → Task table delete
    └── update_task       → Task table update
    ↓
Response Back to User
    ↓
Store Message in Database (Conversations & Messages tables)
```

---

## 45 Implementation Tasks

### Epic 1: Database Infrastructure (5 tasks)
- TASK-001: Create Alembic migration for conversation tables
- TASK-002: Define SQLModel Conversation models
- TASK-003: Define SQLModel Message models
- TASK-004: Create database indexes for performance
- TASK-005: Verify schema and test migrations

### Epic 2: Backend API & Endpoints (8 tasks)
- TASK-006: Create chat endpoint skeleton
- TASK-007: Implement message validation and sanitization
- TASK-008: Add conversation history retrieval
- TASK-009: Implement conversation creation
- TASK-010: Add error handling and rate limiting
- TASK-011: Implement message persistence
- TASK-012: Add structured logging
- TASK-013: Create API documentation

### Epic 3: MCP Server & Tools (10 tasks)
- TASK-014: Define MCP server structure
- TASK-015: Implement add_task MCP tool
- TASK-016: Implement list_tasks MCP tool
- TASK-017: Implement complete_task MCP tool
- TASK-018: Implement delete_task MCP tool
- TASK-019: Implement update_task MCP tool
- TASK-020: Add JSON schema validation
- TASK-021: Implement tool request/response handling
- TASK-022: Add error handling for tool failures
- TASK-023: Create MCP server tests

### Epic 4: OpenAI Agent Integration (8 tasks)
- TASK-024: Initialize OpenAI Agents SDK
- TASK-025: Design system prompt
- TASK-026: Implement agent initialization
- TASK-027: Wire agent with MCP tools
- TASK-028: Implement tool invocation loop
- TASK-029: Add confirmation flows for destructive operations
- TASK-030: Implement pronoun resolution
- TASK-031: Add multi-turn context management

### Epic 5: Frontend & Integration (10 tasks)
- TASK-032: Create ChatBot UI component structure
- TASK-033: Implement message list display
- TASK-034: Create message input form
- TASK-035: Build chat API client (chatApi.ts)
- TASK-036: Implement message sending
- TASK-037: Add real-time message updates
- TASK-038: Implement conversation history loading
- TASK-039: Add typing indicators
- TASK-040: Create error state handling
- TASK-041: Add loading states

### Epic 6: Testing & Polish (4 tasks)
- TASK-042: Write agent behavior unit tests
- TASK-043: Write integration tests
- TASK-044: Write E2E tests with Playwright
- TASK-045: Performance optimization and final polish

---

## Key Specifications to Know

### 5 MCP Tools

Each tool has:
- JSON Schema input validation
- Standardized response format
- Error handling
- Logging

**Tool 1: add_task**
```json
{
  "name": "add_task",
  "description": "Create a new task",
  "inputSchema": {
    "type": "object",
    "properties": {
      "user_id": {"type": "string"},
      "title": {"type": "string", "minLength": 1, "maxLength": 200},
      "description": {"type": "string", "maxLength": 2000}
    },
    "required": ["user_id", "title"]
  }
}
```

**Tool 2: list_tasks**
```json
{
  "name": "list_tasks",
  "description": "Retrieve tasks with optional status filter",
  "inputSchema": {
    "type": "object",
    "properties": {
      "user_id": {"type": "string"},
      "status": {"type": "string", "enum": ["all", "pending", "completed"]}
    },
    "required": ["user_id"]
  }
}
```

**Tools 3-5**: complete_task, delete_task, update_task (see mcp-tools-spec.md)

### Chat Endpoint API

```
POST /api/{user_id}/chat
Content-Type: application/json

Request:
{
  "conversation_id": "uuid" | null,
  "message": "string"
}

Response (200 OK):
{
  "conversation_id": "uuid",
  "message_id": "uuid",
  "response": "string",
  "tool_calls": [
    {
      "name": "tool_name",
      "parameters": {...},
      "result": {...}
    }
  ],
  "timestamp": "2025-12-13T10:30:00Z"
}
```

### Agent System Prompt

```
You are a helpful todo assistant. Your role is to:
1. Help users manage their todo lists through natural conversation
2. Execute task operations (add, delete, update, complete) via available tools
3. Provide summaries and insights about user's tasks
4. Confirm destructive operations (delete, complete all)

Available Tools:
- add_task: Create a new task
- list_tasks: Retrieve tasks with optional filters
- complete_task: Mark a task as done
- delete_task: Remove a task
- update_task: Modify task details

Behavior:
- Always confirm before deleting tasks
- Use friendly, conversational language
- Provide context when executing tools
- Ask clarifying questions if intent is unclear
- Never make assumptions about user's intent
```

---

## Testing Requirements

### Unit Tests
- Agent behavior (intent parsing, tool selection)
- MCP tools with mock database
- Message storage and retrieval
- Error handling

### Integration Tests
- Full chat endpoint request/response cycle
- Agent + real MCP tools with test database
- Multi-turn conversations with context

### E2E Tests (Playwright)
- User opens chat UI
- User sends message
- AI responds and creates task
- Verify task in database
- User asks to list tasks
- AI returns task list

### Test Coverage Target: 80%+

---

## Database Schema

### Conversation Table
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL (FK),
  title VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  INDEX (user_id, created_at)
);
```

### Message Table
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID NOT NULL (FK),
  user_id UUID NOT NULL (FK),
  role VARCHAR(10),          -- "user" or "assistant"
  content TEXT,
  tool_calls JSONB,
  created_at TIMESTAMP,
  INDEX (conversation_id, created_at)
);
```

---

## Success Criteria

Phase III implementation is complete when:

1. **Natural Language Interface**
   - Users can manage tasks via conversation
   - Agent understands task-related commands
   - Responses are helpful and contextual

2. **Tool Execution**
   - All 5 MCP tools execute correctly
   - Tool failures handled gracefully
   - Database remains consistent

3. **Conversation Persistence**
   - History survives server restarts
   - Multi-turn conversations maintain context
   - Users can resume conversations by ID

4. **Scalable Architecture**
   - Stateless endpoints enable horizontal scaling
   - No in-memory state per request
   - Database handles concurrent conversations

5. **Observable Operations**
   - All tool invocations logged
   - Errors tracked and alertable
   - Agent decisions traceable through logs

6. **Test Coverage**
   - 80%+ code coverage
   - All user stories testable
   - E2E tests passing

---

## Common Commands

### Backend Development

```bash
cd phase-2/backend

# Create migration
uv run alembic revision --autogenerate -m "Add conversation tables"

# Apply migration
uv run alembic upgrade head

# Run tests
uv run pytest tests/

# Run server
uv run uvicorn src.main:app --reload
```

### Frontend Development

```bash
cd phase-2/frontend

# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Run tests
pnpm test

# Run E2E tests
pnpm exec playwright test
```

### Git Commands

```bash
# View commits
git log --oneline | head -10

# Check status
git status

# Make commit
git add .
git commit -m "Your message"

# View diff
git diff
```

---

## Important Files

### Core Specifications
- `specs/features/phase-3-chatbot/CONSTITUTION.md` - Governance
- `specs/features/phase-3-chatbot/spec.md` - Requirements
- `specs/features/phase-3-chatbot/plan.md` - Implementation plan
- `specs/features/phase-3-chatbot/tasks.md` - Tasks (START HERE)

### Reference Code (Phase II)
- `phase-2/backend/src/api/tasks.py` - FastAPI example
- `phase-2/backend/src/models/task.py` - SQLModel example
- `phase-2/frontend/src/components/TaskForm.tsx` - React example

### Project Documentation
- `DIRECTORY_STRUCTURE.md` - Project layout reference
- `CLAUDE.md` - Project instructions
- `README.md` - Project overview

### Development History
- `history/prompts/phase-3-chatbot/` - Development notes
- `history/adr/` - Architecture decisions

---

## Quick Reference

**Project Root**: `/mnt/d/Talal/Work/Hackathons-Panaversity/phase-1/`

**Key Directories**:
- Specs: `specs/features/phase-3-chatbot/`
- Backend (Phase II): `phase-2/backend/`
- Frontend (Phase II): `phase-2/frontend/`
- Documentation: `DIRECTORY_STRUCTURE.md`, `CLAUDE.md`, `README.md`

**Implementation Approach**:
1. Extend Phase II (recommended) rather than create new phase-3/
2. Add new files to existing structure:
   - `phase-2/backend/src/api/chat.py`
   - `phase-2/backend/src/services/agent_service.py`
   - `phase-2/backend/src/services/mcp_service.py`
   - `phase-2/backend/src/models/conversation.py`
   - `phase-2/frontend/src/components/ChatBot.tsx`

**Timeline**: 8 days (Dec 14-21, 2025)
**Points**: 200 points
**Requirements**: Follow `specs/features/phase-3-chatbot/tasks.md` in order

---

**Generated**: 2025-12-13
**Status**: Ready for Implementation ✅
