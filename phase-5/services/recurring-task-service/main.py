"""
Recurring Task Service

Microservice for processing recurring task events.
Subscribes to 'task-events' Kafka topic via Dapr pub/sub and
spawns next task instance when a recurring task is completed.
"""

import logging
import os
from datetime import datetime
from typing import Any, Dict

from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Recurring Task Service",
    description="Processes recurring task events and spawns next instances",
    version="1.0.0",
)


# ================== MODELS ==================


class TaskEvent(BaseModel):
    """Task event from Kafka"""

    event_type: str  # task.created, task.updated, task.completed, task.deleted
    task_id: str
    task_data: Dict[str, Any]
    user_id: str
    timestamp: str  # ISO datetime
    metadata: Dict[str, Any] = {}


class DaprSubscription(BaseModel):
    """Dapr subscription configuration"""

    pubsubname: str
    topic: str
    route: str


# ================== DAPR PUB/SUB ENDPOINTS ==================


@app.get("/dapr/subscribe")
async def subscribe():
    """
    Dapr subscription endpoint.

    Returns list of topics this service subscribes to.
    """
    subscriptions = [
        DaprSubscription(
            pubsubname="kafka-pubsub",
            topic="task-events",
            route="/task-events",
        ).model_dump()
    ]
    logger.info(f"Returning subscriptions: {subscriptions}")
    return subscriptions


@app.post("/task-events")
async def handle_task_event(request: Request):
    """
    Handle task events from Kafka (via Dapr).

    Processes task.completed events for recurring tasks.
    """
    try:
        # Parse Dapr CloudEvent envelope
        body = await request.json()
        logger.info(f"Received task event: {body.get('type', 'unknown')}")

        # Extract data from CloudEvent
        if "data" in body:
            event_data = body["data"]
        else:
            event_data = body

        # Validate event
        task_event = TaskEvent(**event_data)

        # Only process task.completed events
        if task_event.event_type == "task.completed":
            await process_completed_task(task_event)
        else:
            logger.debug(f"Ignoring event type: {task_event.event_type}")

        # Return 200 OK to acknowledge message
        return {"status": "success", "event_type": task_event.event_type}

    except Exception as e:
        logger.error(f"Error processing task event: {e}", exc_info=True)
        # Return 500 to trigger retry
        raise HTTPException(status_code=500, detail=str(e))


# ================== RECURRING TASK LOGIC ==================


async def process_completed_task(event: TaskEvent):
    """
    Process completed task and spawn next instance if recurring.

    Args:
        event: Task completion event
    """
    task_id = event.task_id
    task_data = event.task_data
    user_id = event.user_id

    logger.info(f"Processing completed task {task_id} for user {user_id}")

    # TODO: Check if task is recurring by querying database
    # This requires database connection (omitted for simplicity)
    # Example:
    # recurring_config = await get_recurring_config(task_id)
    # if not recurring_config or not recurring_config.is_active:
    #     logger.info(f"Task {task_id} is not recurring - skipping")
    #     return

    # For demo purposes, log that we would spawn next instance
    logger.info(
        f"[RECURRING] Task {task_id} is recurring - would spawn next instance here"
    )

    # TODO: Calculate next occurrence based on recurrence rules
    # next_due_at = calculate_next_occurrence(recurring_config)

    # TODO: Create new task instance
    # new_task = await create_task({
    #     "title": task_data.get("title"),
    #     "description": task_data.get("description"),
    #     "user_id": user_id,
    #     "is_complete": False,
    # })
    # logger.info(f"Spawned new task instance: {new_task.id}")

    # TODO: Update recurring config with next due date
    # await update_recurring_config(task_id, next_due_at=next_due_at)

    logger.info(f"Recurring task processing complete for {task_id}")


# ================== HELPER FUNCTIONS ==================


async def get_recurring_config(task_id: str):
    """
    Get recurring configuration for a task.

    In production, query database for RecurringTask model.
    """
    # TODO: Implement database query
    pass


async def calculate_next_occurrence(recurring_config):
    """
    Calculate next occurrence based on frequency rules.

    In production, use croniter for cron expressions or
    timedelta for simple intervals.
    """
    # TODO: Implement next occurrence calculation
    pass


async def create_task(task_data: Dict[str, Any]):
    """
    Create a new task instance.

    In production, insert into database and publish task.created event.
    """
    # TODO: Implement task creation
    pass


# ================== HEALTH ENDPOINTS ==================


@app.get("/health")
async def health():
    """Health check endpoint for Kubernetes liveness probe."""
    return {"status": "healthy", "service": "recurring-task-service"}


@app.get("/health/ready")
async def readiness():
    """Readiness check endpoint for Kubernetes readiness probe."""
    return {"status": "ready", "service": "recurring-task-service"}


# ================== STARTUP/SHUTDOWN ==================


@app.on_event("startup")
async def startup_event():
    """Application startup tasks."""
    logger.info("Recurring task service starting up...")
    logger.info(f"Environment: {os.getenv('ENVIRONMENT', 'development')}")
    # TODO: Initialize database connection
    # global db
    # db = await get_database_connection()


@app.on_event("shutdown")
async def shutdown_event():
    """Application shutdown tasks."""
    logger.info("Recurring task service shutting down...")
    # TODO: Close database connection
    # if db:
    #     await db.close()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8002)),
        log_level="info",
    )
