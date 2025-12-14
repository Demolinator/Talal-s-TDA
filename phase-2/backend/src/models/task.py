"""
Task Model

Represents a todo task owned by a user.
"""

import uuid
from datetime import datetime
from typing import Optional

from pydantic import field_validator
from sqlmodel import Field, SQLModel


class TaskBase(SQLModel):
    """Base task fields shared across schemas"""

    title: str = Field(
        min_length=1,
        max_length=200,
        description="Task title (required)",
    )
    description: Optional[str] = Field(
        default=None,
        max_length=2000,
        description="Optional task description",
    )

    @field_validator("title", mode="before")
    @classmethod
    def sanitize_title(cls, v: str) -> str:
        """Sanitize title: strip whitespace and prevent XSS."""
        if v is None:
            return v
        # Strip leading/trailing whitespace
        sanitized = v.strip()
        if not sanitized:
            raise ValueError("Title cannot be empty or only whitespace")
        # Basic XSS prevention: remove < and > characters
        sanitized = sanitized.replace("<", "").replace(">", "")
        return sanitized

    @field_validator("description", mode="before")
    @classmethod
    def sanitize_description(cls, v: Optional[str]) -> Optional[str]:
        """Sanitize description: strip whitespace and prevent XSS."""
        if v is None or v == "":
            return None
        # Strip leading/trailing whitespace
        sanitized = v.strip()
        if not sanitized:
            return None
        # Basic XSS prevention: remove < and > characters
        sanitized = sanitized.replace("<", "").replace(">", "")
        return sanitized


class Task(TaskBase, table=True):
    """
    Task database model.

    Stores user's todo tasks with ownership and completion tracking.
    """

    __tablename__ = "tasks"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        description="Unique task identifier (UUID v4)",
    )
    is_complete: bool = Field(
        default=False,
        index=True,  # Index for filtering by completion status
        description="Task completion status",
    )
    user_id: uuid.UUID = Field(
        foreign_key="user.id",
        index=True,  # Index for fast user task queries
        description="Owner user ID (foreign key to user table)",
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Task creation timestamp (UTC)",
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Last update timestamp (UTC)",
    )

    class Config:
        """SQLModel configuration"""

        json_schema_extra = {
            "example": {
                "id": "650e8400-e29b-41d4-a716-446655440001",
                "title": "Complete project documentation",
                "description": "Write comprehensive README and API docs",
                "is_complete": False,
                "user_id": "550e8400-e29b-41d4-a716-446655440000",
                "created_at": "2025-12-07T16:00:00Z",
                "updated_at": "2025-12-07T16:00:00Z",
            }
        }


class TaskCreate(TaskBase):
    """Schema for task creation request"""

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Complete project documentation",
                "description": "Write comprehensive README and API docs",
            }
        }


class TaskUpdate(SQLModel):
    """Schema for task update request (all fields optional)"""

    title: Optional[str] = Field(
        None,
        min_length=1,
        max_length=200,
        description="Updated task title",
    )
    description: Optional[str] = Field(
        None,
        max_length=2000,
        description="Updated task description",
    )

    @field_validator("title", mode="before")
    @classmethod
    def sanitize_title(cls, v: Optional[str]) -> Optional[str]:
        """Sanitize title: strip whitespace and prevent XSS."""
        if v is None:
            return v
        # Strip leading/trailing whitespace
        sanitized = v.strip()
        if not sanitized:
            raise ValueError("Title cannot be empty or only whitespace")
        # Basic XSS prevention: remove < and > characters
        sanitized = sanitized.replace("<", "").replace(">", "")
        return sanitized

    @field_validator("description", mode="before")
    @classmethod
    def sanitize_description(cls, v: Optional[str]) -> Optional[str]:
        """Sanitize description: strip whitespace and prevent XSS."""
        if v is None or v == "":
            return None
        # Strip leading/trailing whitespace
        sanitized = v.strip()
        if not sanitized:
            return None
        # Basic XSS prevention: remove < and > characters
        sanitized = sanitized.replace("<", "").replace(">", "")
        return sanitized

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Complete project documentation (updated)",
                "description": "Write README, API docs, and deployment guide",
            }
        }


class TaskToggleComplete(SQLModel):
    """Schema for toggling task completion status"""

    is_complete: bool = Field(description="New completion status")

    class Config:
        json_schema_extra = {
            "example": {
                "is_complete": True,
            }
        }


class TaskResponse(TaskBase):
    """
    Schema for task data in API responses.

    Includes all task fields for client display.
    """

    id: uuid.UUID
    is_complete: bool
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # Allow ORM model conversion
        json_schema_extra = {
            "example": {
                "id": "650e8400-e29b-41d4-a716-446655440001",
                "title": "Complete project documentation",
                "description": "Write comprehensive README and API docs",
                "is_complete": False,
                "user_id": "550e8400-e29b-41d4-a716-446655440000",
                "created_at": "2025-12-07T16:00:00Z",
                "updated_at": "2025-12-07T16:00:00Z",
            }
        }
