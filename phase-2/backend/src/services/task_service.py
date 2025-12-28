"""
Task Service

Business logic for task CRUD operations.
Follows "fat services" pattern - all business logic lives here.
"""

import uuid
from datetime import datetime
from typing import List, Optional

from fastapi import Depends, HTTPException
from sqlmodel import Session, select

from src.db.session import get_session
from src.models.task import Task, TaskCreate, TaskUpdate


class TaskService:
    """
    Task service handling task CRUD operations.

    All business logic for task management lives here, keeping
    route handlers thin and focused on HTTP concerns.
    """

    def __init__(self, session: Session = Depends(get_session)):
        """
        Initialize TaskService with database session.

        Args:
            session: SQLModel database session (injected via FastAPI dependency)
        """
        self.session = session

    async def create_task(
        self, task_data: TaskCreate, user_id: str
    ) -> Task:
        """
        Create new task for user.

        Business logic:
        1. Validate title not empty
        2. Create task with user ownership
        3. Set timestamps
        4. Persist to database

        Args:
            task_data: Task creation data (title, description)
            user_id: Owner user ID

        Returns:
            Created Task object

        Raises:
            ValueError: If title is empty after stripping whitespace

        Example:
            service = TaskService(session)
            task = await service.create_task(
                TaskCreate(title="Buy groceries", description="Milk, eggs, bread"),
                user_id=uuid.UUID("...")
            )
        """
        # Validate title not empty
        if not task_data.title.strip():
            raise ValueError("Title cannot be empty or whitespace")

        # Create task
        task = Task(
            id=str(uuid.uuid4()),
            title=task_data.title.strip(),
            description=task_data.description.strip() if task_data.description else None,
            is_complete=False,
            user_id=user_id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

        # Persist to database
        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)

        return task

    async def get_user_tasks(
        self,
        user_id: str,
        is_complete: Optional[bool] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> List[Task]:
        """
        Get tasks for user with optional filtering and pagination.

        Args:
            user_id: User ID to get tasks for
            is_complete: Optional completion status filter
            limit: Maximum tasks to return (default: 50)
            offset: Number of tasks to skip (default: 0)

        Returns:
            List of Task objects sorted by creation date (newest first)

        Example:
            # Get all incomplete tasks
            tasks = await service.get_user_tasks(user_id, is_complete=False)
        """
        query = select(Task).where(Task.user_id == user_id)

        # Apply completion filter if specified
        if is_complete is not None:
            query = query.where(Task.is_complete == is_complete)

        # Apply pagination and sorting
        query = query.limit(limit).offset(offset).order_by(Task.created_at.desc())

        tasks = self.session.exec(query).all()
        return list(tasks)

    async def get_task(self, task_id: str, user_id: str) -> Task:
        """
        Get single task with ownership verification.

        Args:
            task_id: Task ID to retrieve
            user_id: User ID (for ownership check)

        Returns:
            Task object

        Raises:
            HTTPException 404: If task not found
            HTTPException 403: If task belongs to different user

        Example:
            task = await service.get_task(task_id, current_user.id)
        """
        task = self.session.get(Task, task_id)

        if not task:
            raise HTTPException(status_code=404, detail="Task not found")

        # Ownership check
        if task.user_id != user_id:
            raise HTTPException(
                status_code=403,
                detail="Not authorized to access this task",
            )

        return task

    async def update_task(
        self, task_id: str, task_data: TaskUpdate, user_id: str
    ) -> Task:
        """
        Update task fields.

        Args:
            task_id: Task ID to update
            task_data: Fields to update (only provided fields are updated)
            user_id: User ID (for ownership check)

        Returns:
            Updated Task object

        Raises:
            HTTPException 404: If task not found
            HTTPException 403: If task belongs to different user

        Example:
            task = await service.update_task(
                task_id,
                TaskUpdate(title="Updated title"),
                current_user.id
            )
        """
        # Get task with ownership check
        task = await self.get_task(task_id, user_id)

        # Update only provided fields
        if task_data.title is not None:
            if not task_data.title.strip():
                raise ValueError("Title cannot be empty")
            task.title = task_data.title.strip()

        if task_data.description is not None:
            task.description = task_data.description.strip() if task_data.description else None

        if task_data.is_complete is not None:
            task.is_complete = task_data.is_complete

        # Update timestamp
        task.updated_at = datetime.utcnow()

        # Persist changes
        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)

        return task

    async def toggle_complete(
        self, task_id: str, is_complete: bool, user_id: str
    ) -> Task:
        """
        Toggle task completion status.

        Args:
            task_id: Task ID to toggle
            is_complete: New completion status
            user_id: User ID (for ownership check)

        Returns:
            Updated Task object

        Raises:
            HTTPException 404: If task not found
            HTTPException 403: If task belongs to different user

        Example:
            task = await service.toggle_complete(task_id, True, current_user.id)
        """
        # Get task with ownership check
        task = await self.get_task(task_id, user_id)

        # Update completion status
        task.is_complete = is_complete
        task.updated_at = datetime.utcnow()

        # Persist changes
        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)

        return task

    async def delete_task(self, task_id: str, user_id: str) -> None:
        """
        Delete task.

        Args:
            task_id: Task ID to delete
            user_id: User ID (for ownership check)

        Raises:
            HTTPException 404: If task not found
            HTTPException 403: If task belongs to different user

        Example:
            await service.delete_task(task_id, current_user.id)
        """
        # Get task with ownership check
        task = await self.get_task(task_id, user_id)

        # Delete from database
        self.session.delete(task)
        self.session.commit()
