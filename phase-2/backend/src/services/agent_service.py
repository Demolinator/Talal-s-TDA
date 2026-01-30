"""
Agent Service for AI-Powered Todo Assistant

Implements the core AI agent using OpenAI Agents SDK with MCP tool integration.
Handles natural language understanding, intent parsing, multi-turn context management,
and confirmation flows for destructive operations.

Based on Phase III Agent Behavior Specification.
"""

import json
import logging
import re
import uuid
from datetime import datetime
from typing import Any, Optional

from openai import OpenAI
from sqlmodel import Session

from src.models.conversation import Message
from src.services.mcp_tools import MCPToolsService, MCP_TOOLS

# Configure logging
logger = logging.getLogger(__name__)


class IntentDetector:
    """
    Detect user intent from natural language input.

    Analyzes user messages to determine which operation they want to perform
    on their todo tasks (add, list, complete, delete, update).
    """

    # Keyword sets for intent detection
    ADD_TASK_KEYWORDS = {
        "add", "create", "new", "task", "remember", "todo",
        "need to", "should", "make", "set up", "schedule"
    }

    LIST_TASK_KEYWORDS = {
        "list", "show", "what", "all tasks", "pending",
        "completed", "today", "upcoming", "view", "get", "see"
    }

    COMPLETE_KEYWORDS = {
        "complete", "done", "finish", "mark", "check off",
        "finished", "accomplished", "closed", "resolved"
    }

    DELETE_KEYWORDS = {
        "delete", "remove", "drop", "erase", "discard",
        "destroy", "eliminate", "get rid", "no longer"
    }

    UPDATE_KEYWORDS = {
        "update", "change", "rename", "modify", "edit",
        "alter", "transform", "switch", "revise"
    }

    @classmethod
    def detect_intent(cls, user_input: str) -> str:
        """
        Detect primary intent from user input.

        Args:
            user_input: User's message text

        Returns:
            Intent name: 'add_task', 'list_tasks', 'complete_task',
            'delete_task', 'update_task', or 'unknown'
        """
        text_lower = user_input.lower()

        # Destructive operations take priority (delete before update)
        if any(kw in text_lower for kw in cls.DELETE_KEYWORDS):
            return "delete_task"

        # Update operations
        if any(kw in text_lower for kw in cls.UPDATE_KEYWORDS):
            return "update_task"

        # Complete operations
        if any(kw in text_lower for kw in cls.COMPLETE_KEYWORDS):
            return "complete_task"

        # List operations
        if any(kw in text_lower for kw in cls.LIST_TASK_KEYWORDS):
            return "list_tasks"

        # Add operations (default for unclear input)
        if any(kw in text_lower for kw in cls.ADD_TASK_KEYWORDS):
            return "add_task"

        return "unknown"


class ParameterExtractor:
    """
    Extract parameters from natural language input for tool execution.

    Uses regex patterns and LLM-based extraction to parse task titles,
    descriptions, status filters, and task references.
    """

    @staticmethod
    def extract_task_reference(user_input: str) -> Optional[str]:
        """
        Extract task reference from input (number, name, or ordinal).

        Args:
            user_input: User's message

        Returns:
            Task reference string or None
        """
        # Pattern 1: Task number (e.g., "task 1", "the first task")
        number_match = re.search(r'task\s+(\d+)', user_input.lower())
        if number_match:
            return f"task_{number_match.group(1)}"

        # Pattern 2: Task by name in quotes (e.g., "buy groceries")
        task_name_match = re.search(r'(?:the\s+)?"([^"]+)"', user_input)
        if task_name_match:
            return f"name:{task_name_match.group(1)}"

        # Pattern 3: Ordinal references (first, second, last)
        if "first" in user_input.lower():
            return "position:0"
        elif "second" in user_input.lower():
            return "position:1"
        elif "third" in user_input.lower():
            return "position:2"
        elif "last" in user_input.lower():
            return "position:last"

        return None

    @staticmethod
    def contains_pronoun(user_input: str) -> bool:
        """
        Check if input contains pronouns that need resolution.

        Args:
            user_input: User's message

        Returns:
            True if pronouns detected
        """
        pronouns = {"it", "that", "this", "one", "the one"}
        text_lower = user_input.lower()
        return any(p in text_lower for p in pronouns)

    @staticmethod
    def extract_ordinal_position(user_input: str) -> Optional[int]:
        """
        Extract ordinal position from input.

        Args:
            user_input: User's message

        Returns:
            Position index (0-based) or -1 for last, or None
        """
        ordinals = {
            "first": 0,
            "second": 1,
            "third": 2,
            "fourth": 3,
            "fifth": 4,
            "last": -1,
            "previous": -1
        }

        input_lower = user_input.lower()
        for ordinal_word, position in ordinals.items():
            if ordinal_word in input_lower:
                return position

        return None


class PronounResolver:
    """
    Resolve pronouns (it, that, this) to actual tasks from conversation context.

    Enables natural multi-turn conversations like:
    - User: "Create 'Buy milk'"
    - AI: "Task created"
    - User: "Mark it complete"  ← "it" refers to 'Buy milk' task
    """

    @staticmethod
    def resolve_pronoun(
        user_input: str,
        recent_tasks: list[dict],
        last_list_result: Optional[list] = None
    ) -> Optional[str]:
        """
        Resolve pronouns to tasks from context.

        Args:
            user_input: User's message
            recent_tasks: List of recently mentioned tasks
            last_list_result: Last task list result (for ordinal references)

        Returns:
            Task ID if resolved, None otherwise
        """
        input_lower = user_input.lower()

        # Check for explicit pronouns
        if any(p in input_lower for p in ["it", "that", "this"]):
            # Most recent task is the antecedent
            if recent_tasks:
                return recent_tasks[-1]["task_id"]

        # Check for ordinal references ("the first", "the second", "the last")
        ordinal = ParameterExtractor.extract_ordinal_position(user_input)
        if ordinal is not None and last_list_result:
            if ordinal == -1:  # "last"
                return last_list_result[-1]["task_id"] if last_list_result else None
            elif 0 <= ordinal < len(last_list_result):
                return last_list_result[ordinal]["task_id"]

        return None


class ConfirmationFlow:
    """
    Handle confirmation flows for destructive operations.

    For delete operations, requires explicit user confirmation before execution.
    """

    @staticmethod
    def requires_confirmation(intent: str) -> bool:
        """
        Check if intent requires user confirmation.

        Args:
            intent: Detected user intent

        Returns:
            True if confirmation required
        """
        return intent == "delete_task"

    @staticmethod
    def format_confirmation_message(task_title: str) -> str:
        """
        Generate confirmation message for delete operation.

        Args:
            task_title: Title of task to be deleted

        Returns:
            Confirmation message text
        """
        return (
            f"I want to make sure - do you want to delete '{task_title}'? "
            f"This action can't be undone. Please say 'yes' or 'no'."
        )

    @staticmethod
    def parse_confirmation(user_response: str) -> Optional[bool]:
        """
        Parse user's confirmation response.

        Args:
            user_response: User's yes/no response

        Returns:
            True if confirmed, False if declined, None if ambiguous
        """
        response_lower = user_response.lower().strip()

        # Explicit confirmation patterns
        if response_lower in ["yes", "y", "confirm", "confirmed", "go ahead", "delete", "proceed"]:
            return True

        # Explicit decline patterns
        if response_lower in ["no", "n", "cancel", "nevermind", "don't", "skip"]:
            return False

        # Ambiguous - requires clarification
        return None


class ErrorHandler:
    """
    Convert tool errors to user-friendly messages.

    Never exposes technical errors to users - always provides helpful,
    actionable guidance for recovery.
    """

    ERROR_MESSAGES = {
        "VALIDATION_ERROR": {
            "empty_title": (
                "I couldn't create that task because the title is empty. "
                "Please tell me what the task is."
            ),
            "title_too_long": (
                "The task title is too long (max 200 characters). "
                "Could you make it shorter?"
            ),
            "description_too_long": (
                "The description is too long (max 2000 characters). "
                "Could you shorten it?"
            ),
            "invalid_status": (
                "I didn't understand that status. "
                "Did you mean 'pending', 'completed', or 'all'?"
            ),
        },
        "NOT_FOUND": {
            "task_not_found": (
                "I couldn't find that task. "
                "Would you like to see all your tasks?"
            ),
            "conversation_not_found": (
                "I couldn't find that conversation. Starting a new one."
            ),
        },
        "AUTHORIZATION_ERROR": {
            "access_denied": (
                "I'm unable to access that task. "
                "Please make sure it's one of your tasks."
            ),
        },
        "INVALID_STATE": {
            "already_completed": "That task is already marked complete.",
        },
        "SERVER_ERROR": {
            "generic": "Sorry, I had trouble with that operation. Please try again.",
            "database_error": (
                "I'm experiencing technical difficulties. "
                "Please try again in a moment."
            ),
            "timeout": "That took too long. Please try again with a simpler request.",
        },
    }

    @classmethod
    def handle_tool_error(
        cls,
        tool_name: str,
        tool_result: dict[str, Any]
    ) -> str:
        """
        Convert tool error to user-friendly message.

        Args:
            tool_name: Name of tool that failed
            tool_result: Result dict from tool execution

        Returns:
            User-friendly error message
        """
        # Log full error for debugging
        logger.error(
            f"Tool error: {tool_name}",
            extra={
                "timestamp": datetime.utcnow().isoformat(),
                "tool": tool_name,
                "result": tool_result,
            },
        )

        # Extract error information
        error_msg = tool_result.get("error", "Unknown error")
        error_type = cls._classify_error(error_msg)

        # Get user-friendly message
        category_messages = cls.ERROR_MESSAGES.get(error_type, {})
        specific_key = cls._get_error_key(error_msg)
        user_message = category_messages.get(
            specific_key,
            cls.ERROR_MESSAGES["SERVER_ERROR"]["generic"]
        )

        return user_message

    @staticmethod
    def _classify_error(error_msg: str) -> str:
        """Classify error type from message."""
        error_lower = error_msg.lower()

        if "empty" in error_lower or "title" in error_lower:
            return "VALIDATION_ERROR"
        if "not found" in error_lower:
            return "NOT_FOUND"
        if "authorized" in error_lower or "access" in error_lower:
            return "AUTHORIZATION_ERROR"
        if "already" in error_lower:
            return "INVALID_STATE"
        if "database" in error_lower:
            return "SERVER_ERROR"

        return "SERVER_ERROR"

    @staticmethod
    def _get_error_key(error_msg: str) -> str:
        """Get specific error key from message."""
        error_lower = error_msg.lower()

        if "empty" in error_lower:
            return "empty_title"
        if "too long" in error_lower and "title" in error_lower:
            return "title_too_long"
        if "too long" in error_lower and "description" in error_lower:
            return "description_too_long"
        if "not found" in error_lower:
            return "task_not_found"
        if "authorized" in error_lower:
            return "access_denied"
        if "already complete" in error_lower:
            return "already_completed"

        return "generic"

    @classmethod
    def suggest_recovery(cls, error_type: str, context: dict) -> str:
        """
        Suggest next steps to user after error.

        Args:
            error_type: Type of error that occurred
            context: Conversation context

        Returns:
            Suggestion message
        """
        if error_type == "NOT_FOUND":
            return "Would you like to see all your pending tasks so you can choose one?"
        elif error_type == "VALIDATION_ERROR":
            return "Try again with a shorter title (under 200 characters)."
        elif error_type == "SERVER_ERROR":
            return "Please try again in a moment, or let me know how else I can help."

        return "Is there anything else I can help you with?"


class AgentService:
    """
    Service for managing OpenAI Agent interactions with MCP tools.

    Provides:
    - Intent detection from natural language
    - Parameter extraction for tool execution
    - Multi-turn conversation context management
    - Pronoun resolution
    - Confirmation flows for destructive operations
    - User-friendly error handling

    Based on Phase III Agent Behavior Specification.
    """

    # Agent configuration
    MODEL = "gpt-4-turbo"
    TEMPERATURE = 0.7
    MAX_TOKENS = 4096

    # System prompt for the agent
    SYSTEM_PROMPT = """You are a helpful AI assistant that helps users manage their todo tasks through natural conversation.

You can help users with the following operations:
1. Add tasks: When users want to create a new task
2. List tasks: Show users their pending, completed, or all tasks
3. Complete tasks: Mark tasks as done
4. Delete tasks: Remove tasks (requires user confirmation first)
5. Update tasks: Change task titles or descriptions

Guidelines:
- Be conversational and friendly
- Ask clarifying questions when intent is unclear
- For destructive operations (delete), always confirm with the user first
- Never expose technical errors - always provide helpful, user-friendly messages
- When a tool fails, offer alternative solutions
- Remember context from earlier in the conversation
- Resolve pronouns (it, that, this) based on recent conversation
- Suggest follow-up actions when helpful

Example interactions:
- User: "Add a task to buy groceries"
  → Recognize as add_task intent
  → Extract title: "Buy groceries"
  → Confirm task creation

- User: "Delete my oldest task"
  → First fetch the task to be deleted
  → Ask for explicit confirmation with task name
  → Only after confirmation, invoke delete_task tool

- User: "Mark it complete"
  → Remember context from earlier messages
  → Identify which task "it" refers to
  → Confirm completion
"""

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

        # Conversation context state
        self.recent_tasks: list[dict] = []  # Recently mentioned tasks
        self.last_list_result: Optional[list] = None  # Last task list
        self.pending_confirmation: Optional[dict] = None  # Pending destructive operation

    def initialize_agent(self) -> dict[str, Any]:
        """
        Initialize the agent with available tools.

        Returns:
            Dictionary with agent initialization status and available tools
        """
        return {
            "status": "initialized",
            "model": self.MODEL,
            "temperature": self.TEMPERATURE,
            "tools_count": len(MCP_TOOLS),
            "tools": [tool["function"]["name"] for tool in MCP_TOOLS],
        }

    def process_user_message(
        self,
        user_id: str,
        user_message: str,
        conversation_history: list[dict[str, str]],
    ) -> dict[str, Any]:
        """
        Process a user message through the AI agent with intent detection.

        Args:
            user_id: UUID of the user
            user_message: The user's message text
            conversation_history: List of previous messages with role and content

        Returns:
            Dictionary with agent response, tool calls, and result
        """
        try:
            # Update context from conversation history
            self._update_context_from_history(conversation_history)

            # Check for pending confirmation response
            if self.pending_confirmation:
                return self._handle_confirmation_response(user_id, user_message)

            # Detect intent
            intent = IntentDetector.detect_intent(user_message)

            # Check if confirmation required
            if ConfirmationFlow.requires_confirmation(intent):
                return await self._handle_destructive_operation(
                    user_id, user_message, intent
                )

            # Process normal intent
            return self._process_intent(
                user_id, user_message, conversation_history, intent
            )

        except Exception as e:
            logger.error(f"Agent processing failed: {e}", exc_info=True)
            return {
                "success": False,
                "error": ErrorHandler.ERROR_MESSAGES["SERVER_ERROR"]["generic"],
            }

    def _update_context_from_history(
        self,
        conversation_history: list[dict[str, str]]
    ) -> None:
        """
        Update agent context from conversation history.

        Args:
            conversation_history: List of previous messages
        """
        # Reset context
        self.recent_tasks = []
        self.last_list_result = None

        # Extract recent tasks from tool calls in history
        for msg in conversation_history[-5:]:  # Last 5 messages
            if msg.get("tool_calls"):
                for tool_call in msg["tool_calls"]:
                    if tool_call.get("result") and tool_call["result"].get("success"):
                        # Extract task info from successful tool calls
                        if "task" in tool_call["result"]:
                            task = tool_call["result"]["task"]
                            self.recent_tasks.append({
                                "task_id": task.get("id"),
                                "title": task.get("title"),
                            })

                        # Store list results for ordinal reference
                        if "tasks" in tool_call["result"]:
                            self.last_list_result = tool_call["result"]["tasks"]

    async def _handle_destructive_operation(
        self,
        user_id: str,
        user_message: str,
        intent: str
    ) -> dict[str, Any]:
        """
        Handle destructive operation with confirmation flow.

        Args:
            user_id: UUID of the user
            user_message: User's message
            intent: Detected intent (should be 'delete_task')

        Returns:
            Response requesting confirmation or executing deletion
        """
        # Try to identify task first
        task_ref = ParameterExtractor.extract_task_reference(user_message)

        if task_ref and task_ref.startswith("task_"):
            # Direct task reference - get task details
            try:
                # Extract task number
                task_num = int(task_ref.split("_")[1])
                # List tasks to find the one at that position
                list_result = self.mcp_service.list_tasks(
                    user_id=user_id,
                    limit=task_num,
                    offset=0
                )

                if list_result["success"] and len(list_result["tasks"]) >= task_num:
                    task = list_result["tasks"][task_num - 1]
                    task_id = task["id"]
                    task_title = task["title"]
                else:
                    return {
                        "success": True,
                        "assistant_message": (
                            f"I couldn't find task {task_num}. "
                            "Would you like to see all your tasks?"
                        ),
                        "tool_calls": [],
                    }
            except Exception:
                return {
                    "success": True,
                    "assistant_message": (
                        "I'm not sure which task you mean. "
                        "Would you like to see all your tasks?"
                    ),
                    "tool_calls": [],
                }
        else:
            # Use LLM to identify task
            response = self.client.chat.completions.create(
                model=self.MODEL,
                temperature=self.TEMPERATURE,
                messages=[
                    {"role": "system", "content": self.SYSTEM_PROMPT},
                    {
                        "role": "user",
                        "content": f"""User wants to delete a task. Their message: "{user_message}"

To help them, I need to:
1. Identify which task they want to delete
2. Ask for confirmation with the task name

Available context - recent tasks: {json.dumps(self.recent_tasks, indent=2)}
Last task list: {json.dumps(self.last_list_result, indent=2) if self.last_list_result else "None"}

Respond with JSON:
{{
    "task_id": "uuid or null",
    "task_title": "title or null",
    "clarification": "message if task cannot be identified"
}}"""
                    },
                ],
            )

            # Parse LLM response
            try:
                content = response.choices[0].message.content or "{}"
                llm_result = json.loads(content)

                if llm_result.get("clarification"):
                    return {
                        "success": True,
                        "assistant_message": llm_result["clarification"],
                        "tool_calls": [],
                    }

                task_id = llm_result.get("task_id")
                task_title = llm_result.get("task_title")

                if not task_id or not task_title:
                    return {
                        "success": True,
                        "assistant_message": (
                            "I'm not sure which task you mean. "
                            "Would you like to see all your tasks?"
                        ),
                        "tool_calls": [],
                    }
            except Exception:
                return {
                    "success": True,
                    "assistant_message": (
                        "I'm not sure which task you mean. "
                        "Could you be more specific?"
                    ),
                    "tool_calls": [],
                }

        # Store pending confirmation
        self.pending_confirmation = {
            "tool": "delete_task",
            "task_id": task_id,
            "task_title": task_title,
        }

        # Return confirmation message
        return {
            "success": True,
            "assistant_message": ConfirmationFlow.format_confirmation_message(task_title),
            "tool_calls": [],
            "requires_confirmation": True,
        }

    def _handle_confirmation_response(
        self,
        user_id: str,
        user_response: str
    ) -> dict[str, Any]:
        """
        Handle user's confirmation response for pending destructive operation.

        Args:
            user_id: UUID of the user
            user_response: User's yes/no response

        Returns:
            Response after executing or canceling pending operation
        """
        if not self.pending_confirmation:
            return {
                "success": False,
                "error": "No pending confirmation",
            }

        # Parse confirmation
        confirmed = ConfirmationFlow.parse_confirmation(user_response)

        if confirmed is None:
            return {
                "success": True,
                "assistant_message": "Please say 'yes' or 'no'.",
                "tool_calls": [],
                "requires_confirmation": True,
            }

        if not confirmed:
            # User declined - clear pending
            self.pending_confirmation = None
            return {
                "success": True,
                "assistant_message": (
                    "No problem! We'll keep that task. "
                    "Is there anything else I can help with?"
                ),
                "tool_calls": [],
            }

        # User confirmed - execute pending operation
        pending = self.pending_confirmation
        self.pending_confirmation = None

        # Execute the tool
        tool_result = self._execute_tool_call(
            user_id=user_id,
            tool_name=pending["tool"],
            tool_args={"task_id": pending["task_id"]},
        )

        # Generate response
        if tool_result["success"]:
            return {
                "success": True,
                "assistant_message": (
                    f"Task deleted. You have {self._count_pending_tasks(user_id)} "
                    "pending tasks left."
                ),
                "tool_calls": [
                    {
                        "id": str(uuid.uuid4()),
                        "name": pending["tool"],
                        "result": tool_result,
                    }
                ],
            }
        else:
            error_msg = ErrorHandler.handle_tool_error(pending["tool"], tool_result)
            return {
                "success": True,
                "assistant_message": error_msg,
                "tool_calls": [],
            }

    def _process_intent(
        self,
        user_id: str,
        user_message: str,
        conversation_history: list[dict[str, str]],
        intent: str
    ) -> dict[str, Any]:
        """
        Process intent and generate response.

        Args:
            user_id: UUID of the user
            user_message: User's message
            conversation_history: Previous messages
            intent: Detected intent

        Returns:
            Agent response with tool calls
        """
        # Build messages for OpenAI API
        messages = []

        # Add system prompt
        messages.append({"role": "system", "content": self.SYSTEM_PROMPT})

        # Add conversation history (last 10 messages for context)
        for msg in conversation_history[-10:]:
            messages.append(msg)

        # Add current user message
        messages.append({"role": "user", "content": user_message})

        # Add context hint for pronoun resolution
        if ParameterExtractor.contains_pronoun(user_message):
            context_hint = f"\n\nContext - Recent tasks: {json.dumps(self.recent_tasks, indent=2)}"
            messages[-1]["content"] += context_hint

        # Call OpenAI API with tools
        response = self.client.chat.completions.create(
            model=self.MODEL,
            temperature=self.TEMPERATURE,
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

                # Handle tool errors
                if not tool_result.get("success"):
                    error_msg = ErrorHandler.handle_tool_error(
                        tool_call.function.name,
                        tool_result
                    )
                    return {
                        "success": True,
                        "assistant_message": error_msg,
                        "tool_calls": [],
                    }

                # Update context with successful tool result
                if tool_result.get("success") and "task" in tool_result:
                    self.recent_tasks.append({
                        "task_id": tool_result["task"]["id"],
                        "title": tool_result["task"]["title"],
                    })
                elif tool_result.get("success") and "tasks" in tool_result:
                    self.last_list_result = tool_result["tasks"]

                tool_results.append({
                    "id": tool_call.id,
                    "name": tool_call.function.name,
                    "result": tool_result,
                })

        # Enhance response with context
        if not assistant_content and tool_results:
            assistant_content = self._generate_response_from_tool_results(tool_results)

        return {
            "success": True,
            "assistant_message": assistant_content,
            "tool_calls": tool_results,
            "finish_reason": response.choices[0].finish_reason,
        }

    def _execute_tool_call(
        self,
        user_id: str,
        tool_name: str,
        tool_args: dict[str, Any],
    ) -> dict[str, Any]:
        """
        Execute a tool call and return the result.

        Args:
            user_id: String user ID (Better Auth format)
            tool_name: Name of the tool to execute
            tool_args: Arguments for the tool

        Returns:
            Dictionary with tool execution result
        """
        # Add user_id to arguments if needed (already a string from Better Auth)
        if "user_id" not in tool_args:
            tool_args["user_id"] = user_id

        # Route to appropriate tool
        # Note: MCP tools expect UUID types, convert from string
        user_id_uuid = uuid.UUID(tool_args["user_id"]) if isinstance(tool_args.get("user_id"), str) else tool_args["user_id"]

        if tool_name == "add_task":
            return self.mcp_service.add_task(
                user_id=user_id_uuid,
                title=tool_args.get("title"),
                description=tool_args.get("description"),
            )

        elif tool_name == "list_tasks":
            return self.mcp_service.list_tasks(
                user_id=user_id_uuid,
                is_complete=tool_args.get("is_complete"),
                limit=tool_args.get("limit", 50),
                offset=tool_args.get("offset", 0),
            )

        elif tool_name == "complete_task":
            return self.mcp_service.complete_task(
                user_id=user_id_uuid,
                task_id=uuid.UUID(tool_args.get("task_id")),
            )

        elif tool_name == "delete_task":
            return self.mcp_service.delete_task(
                user_id=user_id_uuid,
                task_id=uuid.UUID(tool_args.get("task_id")),
            )

        elif tool_name == "update_task":
            return self.mcp_service.update_task(
                user_id=user_id_uuid,
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

    def _generate_response_from_tool_results(
        self,
        tool_results: list[dict]
    ) -> str:
        """
        Generate conversational response from tool results.

        Args:
            tool_results: List of tool execution results

        Returns:
            Conversational response message
        """
        if not tool_results:
            return "Is there anything else I can help with?"

        result = tool_results[0]
        tool_name = result["name"]
        tool_result = result["result"]

        if tool_name == "add_task" and tool_result.get("success"):
            task = tool_result["task"]
            return (
                f"I've created a task: '{task['title']}'. "
                "Would you like to add any details like a description?"
            )

        elif tool_name == "list_tasks" and tool_result.get("success"):
            tasks = tool_result["tasks"]
            if not tasks:
                return "You don't have any tasks yet. Would you like to create one?"

            task_list = "\n".join([
                f"{i+1}. {task['title']}"
                for i, task in enumerate(tasks[:10])
            ])
            total = tool_result["total"]
            return (
                f"You have {total} task{'s' if total != 1 else ''}:\n{task_list}\n"
                "Would you like to complete, update, or delete any of these?"
            )

        elif tool_name == "complete_task" and tool_result.get("success"):
            task = tool_result["task"]
            pending = self._count_pending_tasks(uuid.UUID(task["id"].replace("'", "")))
            return (
                f"Done! '{task['title']}' is now marked complete. "
                f"You have {pending} pending task{'s' if pending != 1 else ''} left."
            )

        elif tool_name == "update_task" and tool_result.get("success"):
            task = tool_result["task"]
            return f"Updated! Task '{task['title']}' has been modified."

        return "Operation completed. Is there anything else I can help with?"

    def _count_pending_tasks(self, user_id: str) -> int:
        """
        Count pending tasks for user.

        Args:
            user_id: String user ID (Better Auth format)

        Returns:
            Number of pending tasks
        """
        # Convert to UUID for MCP tools
        user_id_uuid = uuid.UUID(user_id) if isinstance(user_id, str) else user_id
        result = self.mcp_service.list_tasks(
            user_id=user_id_uuid,
            is_complete=False,
            limit=1000,
        )
        return result.get("total", 0) if result.get("success") else 0

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
    """
    Factory function to create AgentService instance.

    Args:
        session: SQLModel database session

    Returns:
        Initialized AgentService instance
    """
    return AgentService(session)
