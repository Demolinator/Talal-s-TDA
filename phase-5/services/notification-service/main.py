"""
Notification Service

Microservice for processing reminder notifications.
Subscribes to 'reminders' Kafka topic via Dapr pub/sub and
delivers notifications via email, push, or in-app methods.
"""

import logging
import os
from datetime import datetime
from typing import Any, Dict

from fastapi import FastAPI, HTTPException, Request, Response
from pydantic import BaseModel

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Notification Service",
    description="Processes task reminder notifications",
    version="1.0.0",
)


# ================== MODELS ==================


class ReminderEvent(BaseModel):
    """Reminder event from Kafka"""

    reminder_id: str
    task_id: str
    task_title: str
    user_id: str
    remind_at: str  # ISO datetime
    notification_type: str  # email, push, in_app
    timestamp: str  # ISO datetime


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

    Dapr calls this endpoint to discover topic subscriptions.
    Returns list of topics this service subscribes to.
    """
    subscriptions = [
        DaprSubscription(
            pubsubname="kafka-pubsub",
            topic="reminders",
            route="/reminders",
        ).model_dump()
    ]
    logger.info(f"Returning subscriptions: {subscriptions}")
    return subscriptions


@app.post("/reminders")
async def handle_reminder(request: Request):
    """
    Handle reminder notification events from Kafka (via Dapr).

    Dapr publishes messages to this endpoint when events arrive on 'reminders' topic.
    """
    try:
        # Parse Dapr CloudEvent envelope
        body = await request.json()
        logger.info(f"Received reminder event: {body}")

        # Extract data from CloudEvent (Dapr wraps Kafka messages in CloudEvent format)
        if "data" in body:
            event_data = body["data"]
        else:
            event_data = body

        # Validate event
        reminder = ReminderEvent(**event_data)

        # Process notification
        await send_notification(reminder)

        # Return 200 OK to acknowledge message
        return {"status": "success", "reminder_id": reminder.reminder_id}

    except Exception as e:
        logger.error(f"Error processing reminder: {e}", exc_info=True)
        # Return 200 to acknowledge (don't retry invalid messages)
        # For transient errors, return 500 to trigger retry
        raise HTTPException(status_code=500, detail=str(e))


# ================== NOTIFICATION LOGIC ==================


async def send_notification(reminder: ReminderEvent):
    """
    Send notification based on notification type.

    Args:
        reminder: Reminder event data
    """
    logger.info(
        f"Sending {reminder.notification_type} notification for task "
        f"'{reminder.task_title}' (user={reminder.user_id})"
    )

    if reminder.notification_type == "email":
        await send_email_notification(reminder)
    elif reminder.notification_type == "push":
        await send_push_notification(reminder)
    elif reminder.notification_type == "in_app":
        await send_in_app_notification(reminder)
    else:
        logger.warning(f"Unknown notification type: {reminder.notification_type}")


async def send_email_notification(reminder: ReminderEvent):
    """
    Send email notification.

    In production, integrate with SendGrid, AWS SES, or similar service.
    """
    logger.info(f"[EMAIL] Reminder for task: {reminder.task_title}")

    # TODO: Integrate with email service
    # Example with SendGrid:
    # sendgrid_api_key = os.getenv("SENDGRID_API_KEY")
    # if sendgrid_api_key:
    #     sg = SendGridAPIClient(sendgrid_api_key)
    #     message = Mail(
    #         from_email="noreply@yourdomain.com",
    #         to_emails=get_user_email(reminder.user_id),
    #         subject=f"Reminder: {reminder.task_title}",
    #         html_content=f"<p>Your task '{reminder.task_title}' is due soon.</p>"
    #     )
    #     response = sg.send(message)
    #     logger.info(f"Email sent: {response.status_code}")

    # For now, just log
    logger.info(f"Email notification sent for reminder {reminder.reminder_id}")


async def send_push_notification(reminder: ReminderEvent):
    """
    Send push notification.

    In production, integrate with Firebase Cloud Messaging (FCM),
    Apple Push Notification service (APNs), or similar.
    """
    logger.info(f"[PUSH] Reminder for task: {reminder.task_title}")

    # TODO: Integrate with push service
    # Example with FCM:
    # fcm_server_key = os.getenv("FCM_SERVER_KEY")
    # user_device_token = get_user_device_token(reminder.user_id)
    # if fcm_server_key and user_device_token:
    #     message = messaging.Message(
    #         notification=messaging.Notification(
    #             title="Task Reminder",
    #             body=f"{reminder.task_title} is due soon"
    #         ),
    #         token=user_device_token
    #     )
    #     response = messaging.send(message)
    #     logger.info(f"Push sent: {response}")

    logger.info(f"Push notification sent for reminder {reminder.reminder_id}")


async def send_in_app_notification(reminder: ReminderEvent):
    """
    Send in-app notification.

    Store notification in database for user to see when they next visit the app.
    """
    logger.info(f"[IN-APP] Reminder for task: {reminder.task_title}")

    # TODO: Store in database or publish to WebSocket for real-time delivery
    # Example:
    # notification = {
    #     "id": str(uuid.uuid4()),
    #     "user_id": reminder.user_id,
    #     "type": "reminder",
    #     "title": "Task Reminder",
    #     "message": f"{reminder.task_title} is due soon",
    #     "task_id": reminder.task_id,
    #     "created_at": datetime.utcnow().isoformat(),
    #     "is_read": False,
    # }
    # await db.notifications.insert_one(notification)

    logger.info(f"In-app notification created for reminder {reminder.reminder_id}")


# ================== HEALTH ENDPOINTS ==================


@app.get("/health")
async def health():
    """Health check endpoint for Kubernetes liveness probe."""
    return {"status": "healthy", "service": "notification-service"}


@app.get("/health/ready")
async def readiness():
    """Readiness check endpoint for Kubernetes readiness probe."""
    # Check if service is ready to accept traffic
    # Example: verify Kafka connection, database connection, etc.
    return {"status": "ready", "service": "notification-service"}


# ================== JOB CALLBACK ENDPOINT (for Dapr Jobs) ==================


@app.post("/api/jobs/trigger")
async def job_trigger(request: Request):
    """
    Dapr job callback endpoint.

    Dapr can schedule jobs (cron-like tasks) that call this endpoint.
    Use this for periodic tasks like checking for due reminders.
    """
    try:
        body = await request.json()
        logger.info(f"Job triggered: {body}")

        # Example: Check for due reminders
        # await check_due_reminders()

        return {"status": "success"}
    except Exception as e:
        logger.error(f"Job execution error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


# ================== STARTUP/SHUTDOWN ==================


@app.on_event("startup")
async def startup_event():
    """Application startup tasks."""
    logger.info("Notification service starting up...")
    logger.info(f"Environment: {os.getenv('ENVIRONMENT', 'development')}")


@app.on_event("shutdown")
async def shutdown_event():
    """Application shutdown tasks."""
    logger.info("Notification service shutting down...")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8001)),
        log_level="info",
    )
