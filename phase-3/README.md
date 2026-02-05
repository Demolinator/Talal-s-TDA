# Phase III: AI Chatbot with MCP Tools

**Status**: Implemented (integrated into Phase II backend)

---

## Overview

Phase III adds an AI-powered chatbot to the Todo application using the OpenAI Agents SDK and Model Context Protocol (MCP). The chatbot understands natural language and manages tasks through MCP tools.

## Implementation Location

The chatbot is integrated directly into the Phase II backend at `/phase-2/backend/`:

- **MCP Server**: `/phase-2/backend/src/mcp_server.py`
- **MCP Tools**: `/phase-2/backend/src/mcp_tools/`
- **Chat API**: `/phase-2/backend/src/api/chat.py`
- **Agent Service**: `/phase-2/backend/src/services/agent_service.py`
- **Conversation Models**: `/phase-2/backend/src/models/conversation.py`

## Features

### MCP Tools (5 tools)
1. **add_task** - Create new tasks via natural language
2. **list_tasks** - List and filter tasks
3. **complete_task** - Mark tasks as complete
4. **delete_task** - Delete tasks
5. **update_task** - Update task details

### Chat Endpoints
- `POST /api/chat/conversations` - Create conversation
- `GET /api/chat/conversations` - List conversations
- `POST /api/chat/conversations/{id}/messages` - Send message
- `GET /api/chat/conversations/{id}/messages` - Get history

### Conversation State
- All conversations and messages persisted in PostgreSQL
- Stateless server design (no in-memory state)
- Full tool call and result history preserved

### Bonus Features
- Voice input via Web Speech API (`useSpeechRecognition.ts`)
- Voice output via Speech Synthesis (`useSpeechSynthesis.ts`)
- Multi-language support (English + Urdu)

## Stack
- OpenAI Agents SDK with Gemini model rotation
- Official MCP SDK with stdio transport
- FastAPI chat endpoints
- Vercel AI SDK for frontend chat UI
