# Phase V: Cloud-Native Deployment & Advanced Features

**Status**: Implemented (scaffolded for cloud deployment)

---

## Overview

Phase V extends the Todo application with advanced features and cloud-native architecture using Dapr, Kafka, and event-driven patterns.

---

## Advanced Features Implemented

### Task Management
- **Recurring Tasks** - Frequency-based task repetition (daily, weekly, monthly, custom cron)
- **Due Dates & Reminders** - Schedule reminders with in-app, email, and push notification types
- **Priorities** - LOW, MEDIUM, HIGH priority levels with sorting
- **Categories/Tags** - User-defined categories with color coding
- **Search & Filter** - Full-text search by keyword, filter by priority/category/status/date range
- **Sorting** - Sort by due_date, priority, created_at, title (asc/desc)

### Event-Driven Architecture (Dapr + Kafka)
- **Dapr Pub/Sub** - Publish task lifecycle events to Kafka topics via Dapr sidecar
- **Topics**: `task-events`, `reminders`, `audit-logs`
- **Dapr State Store** - PostgreSQL-backed state store for caching and notifications
- **Dapr Subscriptions** - Push-based event delivery to FastAPI endpoints

### Microservices
- **Notification Service** - Processes reminder events, delivers in-app/email/push notifications
- **Audit Logging** - All task operations published to `audit-logs` topic for compliance

---

## Architecture

```
                    ┌─────────────┐
                    │   Frontend  │
                    │  (Next.js)  │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   Backend   │◄──── Dapr Sidecar
                    │  (FastAPI)  │         │
                    └──────┬──────┘         │
                           │          ┌─────▼─────┐
                    ┌──────▼──────┐   │   Kafka   │
                    │    Neon     │   │  Pub/Sub  │
                    │ PostgreSQL  │   └─────┬─────┘
                    └─────────────┘         │
                                     ┌─────▼──────────┐
                                     │  Notification   │
                                     │    Service      │
                                     └────────────────┘
```

---

## Directory Structure

```
phase-5/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   └── dapr_subscriptions.py   # Dapr event handlers
│   │   ├── events/
│   │   │   ├── event_schemas.py        # TaskEvent, ReminderEvent, AuditLogEvent
│   │   │   └── dapr_publisher.py       # Publish events via Dapr
│   │   ├── models/
│   │   │   └── advanced_task.py        # RecurringTask, TaskReminder, TaskCategory
│   │   └── services/
│   │       ├── dapr_client.py          # Dapr HTTP API wrapper
│   │       ├── reminder_service.py     # Reminder scheduling & notifications
│   │       └── search_service.py       # Search, filter, sort
│   └── migrations/
│       └── 002_advanced_features.py    # Schema migration for Phase V tables
├── dapr/
│   └── components/
│       ├── pubsub-kafka.yaml           # Kafka pub/sub component
│       ├── pubsub-redis.yaml           # Redis pub/sub (local dev)
│       └── statestore-postgres.yaml    # PostgreSQL state store
├── services/
│   └── notification-service/
│       └── main.py                     # Notification microservice (FastAPI)
└── README.md
```

---

## Running Locally

### Prerequisites
- Dapr CLI installed (`dapr init`)
- Kafka running (or use Redis pub/sub for local dev)
- Neon PostgreSQL database

### Start Backend with Dapr
```bash
cd phase-5/backend
dapr run --app-id todo-backend --app-port 8000 --dapr-http-port 3500 \
  --resources-path ../dapr/components -- uvicorn src.main:app --port 8000
```

### Start Notification Service
```bash
cd phase-5/services/notification-service
dapr run --app-id notification-service --app-port 8001 --dapr-http-port 3501 \
  --resources-path ../../dapr/components -- uvicorn main:app --port 8001
```

---

## Cloud Deployment

For production cloud deployment (AKS/GKE/Oracle Cloud):
- Use Helm charts from `phase-4/helm/` as base
- Add Dapr annotations to pod specs
- Configure external Kafka cluster (Confluent Cloud, Amazon MSK)
- Use managed PostgreSQL with connection pooling
- Set up monitoring with Prometheus + Grafana
