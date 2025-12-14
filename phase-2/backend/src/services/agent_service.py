"""
Agent Service for OpenAI Agents SDK Integration

Manages AI agent initialization, tool registration, and task execution.
Provides a high-level interface for the chat endpoint to interact with the OpenAI agent.
"""

import json
import uuid
from typing import Any, Optional

from openai import OpenAI
from sqlmodel import Session

from src.models.conversation import Message
from src.services.mcp_tools import MCPToolsService, MCP_TOOLS


class AgentService:
    """Service for managing OpenAI Agent interactions."""

    def __init__(self, session: Session, openai_api_key: Optional[str] = None):
        """
        Initialize Agent Service.

        Args:
            session: SQLModel database session
            openai_api_key: OpenAI API key (reads from OPENAI_API_KEY env var if not provided)
        """
        self.session = session
        self.client = OpenAI(api_key=openai_api_key)
        self.mcp_service = MCPToolsService(session)

        # System prompt for the agent
        self.system_prompt = """You are a helpful AI assistant that helps users manage their todo tasks.
You can help users:
- Add new tasks
- List existing tasks (completed or incomplete)
- Mark tasks as complete
- Delete tasks
- Update task details (title, description)

Be conversational and helpful. Always confirm actions the user asks you to take.
Use the available tools to help the user manage their tasks."""

    def initialize_agent(self) -> dict[str, Any]:
        """
        Initialize the agent with available tools.

        Returns:
            Dictionary with agent initialization status and available tools
        """
        return {
            "status": "initialized",
            "model": "gpt-4-turbo",
            "temperature": 0.7,
            "tools_count": len(MCP_TOOLS),
            "tools": [tool["function"]["name"] for tool in MCP_TOOLS],
        }

    def process_user_message(
        self,
        user_id: uuid.UUID,
        user_message: str,
        conversation_history: list[dict[str, str]],
    ) -> dict[str, Any]:
        """
        Process a user message through the OpenAI Agent.

        Args:
            user_id: UUID of the user
            user_message: The user's message text
            conversation_history: List of previous messages in [{"role": "user/assistant", "content": "..."}, ...]

        Returns:
            Dictionary with agent response, tool calls, and result
        """
        try:
            # Build messages for API call
            messages = []

            # Add conversation history
            for msg in conversation_history:
                messages.append(msg)

            # Add current user message
            messages.append({"role": "user", "content": user_message})

            # Call OpenAI API with tools
            response = self.client.chat.completions.create(
                model="gpt-4-turbo",
                temperature=0.7,
                messages=messages,
                tools=MCP_TOOLS,
                tool_choice="auto",
            )

            # Extract response content and tool calls
            assistant_message = response.choices[0].message
            tool_calls = assistant_message.tool_calls
            assistant_content = assistant_message.content or ""

            # Process tool calls if any
            tool_results = []
            if tool_calls:
                for tool_call in tool_calls:
                    tool_result = self._execute_tool_call(
                        user_id=user_id,
                        tool_name=tool_call.function.name,
                        tool_args=json.loads(tool_call.function.arguments),
                    )
                    tool_results.append(
                        {
                            "tool_call_id": tool_call.id,
                            "tool_name": tool_call.function.name,
                            "tool_result": tool_result,
                        }
                    )

            return {
                "success": True,
                "assistant_message": assistant_content,
                "tool_calls": [
                    {
                        "id": tc["tool_call_id"],
                        "name": tc["tool_name"],
                        "result": tc["tool_result"],
                    }
                    for tc in tool_results
                ],
                "finish_reason": response.choices[0].finish_reason,
            }

        except Exception as e:
            return {
                "success": False,
                "error": f"Agent processing failed: {str(e)}",
            }

    def _execute_tool_call(
        self,
        user_id: uuid.UUID,
        tool_name: str,
        tool_args: dict[str, Any],
    ) -> dict[str, Any]:
        """
        Execute a tool call and return the result.

        Args:
            user_id: UUID of the user making the request
            tool_name: Name of the tool to execute
            tool_args: Arguments for the tool

        Returns:
            Dictionary with tool execution result
        """
        # Add user_id to arguments if needed
        if "user_id" not in tool_args:
            tool_args["user_id"] = str(user_id)

        # Route to appropriate tool
        if tool_name == "add_task":
            return self.mcp_service.add_task(
                user_id=uuid.UUID(tool_args["user_id"]),
                title=tool_args.get("title"),
                description=tool_args.get("description"),
            )

        elif tool_name == "list_tasks":
            return self.mcp_service.list_tasks(
                user_id=uuid.UUID(tool_args["user_id"]),
                is_complete=tool_args.get("is_complete"),
                limit=tool_args.get("limit", 50),
                offset=tool_args.get("offset", 0),
            )

        elif tool_name == "complete_task":
            return self.mcp_service.complete_task(
                user_id=uuid.UUID(tool_args["user_id"]),
                task_id=uuid.UUID(tool_args.get("task_id")),
            )

        elif tool_name == "delete_task":
            return self.mcp_service.delete_task(
                user_id=uuid.UUID(tool_args["user_id"]),
                task_id=uuid.UUID(tool_args.get("task_id")),
            )

        elif tool_name == "update_task":
            return self.mcp_service.update_task(
                user_id=uuid.UUID(tool_args["user_id"]),
                task_id=uuid.UUID(tool_args.get("task_id")),
                title=tool_args.get("title"),
                description=tool_args.get("description"),
                is_complete=tool_args.get("is_complete"),
            )

        else:
            return {
                "success": False,
                "error": f"Unknown tool: {tool_name}",
            }

    def format_tool_calls_for_storage(
        self,
        tool_calls: list[dict[str, Any]],
    ) -> Optional[dict[str, Any]]:
        """
        Format tool calls for storage in database (Message.tool_calls).

        Args:
            tool_calls: List of tool call results

        Returns:
            Dictionary suitable for JSON storage, or None if no tool calls
        """
        if not tool_calls:
            return None

        return {
            "tool_calls": [
                {
                    "id": tc["id"],
                    "type": "function",
                    "function": {
                        "name": tc["name"],
                        "result": json.dumps(tc["result"]),
                    },
                }
                for tc in tool_calls
            ]
        }


def create_agent_service(session: Session) -> AgentService:
    """Factory function to create AgentService instance."""
    return AgentService(session)
