"""
FastAPI Backend - Main Application Entry Point

Phase II Full-Stack Todo Application
"""

import logging
import os
import uuid

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware import Middleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from src.api import auth, chat, health, tasks

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Middleware to add OWASP-recommended security headers.

    Headers added:
    - Strict-Transport-Security: Force HTTPS (HSTS)
    - X-Content-Type-Options: Prevent MIME-type sniffing
    - X-Frame-Options: Prevent clickjacking
    - Content-Security-Policy: Mitigate XSS attacks
    - X-XSS-Protection: Enable browser XSS protection
    - Referrer-Policy: Control referrer information
    """

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        # HSTS: Force HTTPS for 1 year (31536000 seconds)
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"

        # Prevent MIME-type sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"

        # Prevent clickjacking (deny iframe embedding)
        response.headers["X-Frame-Options"] = "DENY"

        # Content Security Policy - strict policy for API
        response.headers["Content-Security-Policy"] = "default-src 'self'; frame-ancestors 'none'"

        # Enable browser XSS protection (legacy, but still useful)
        response.headers["X-XSS-Protection"] = "1; mode=block"

        # Referrer policy - strict for security
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        return response


# Initialize limiter
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Phase II Todo API",
    description="""
## Full-Stack Todo Application Backend

RESTful API for managing personal todo tasks with user authentication and authorization.

### Features

- **User Authentication**: Secure signup, login, and logout with JWT tokens
- **Task Management**: Complete CRUD operations for todo tasks
- **Authorization**: User-specific task ownership and access control
- **Security**: HttpOnly cookies, rate limiting, CORS protection
- **Pagination**: Efficient data retrieval with limit/offset pagination
- **Filtering**: Filter tasks by completion status

### Authentication

All protected endpoints require a valid JWT token in the `auth_token` HttpOnly cookie.
Tokens expire after 15 minutes and must be refreshed by re-authenticating.

### Rate Limiting

The login endpoint is rate-limited to 5 attempts per minute per IP address to prevent brute-force attacks.

### Error Handling

Standard HTTP status codes are used throughout:
- **200 OK**: Successful request
- **201 Created**: Resource created successfully
- **204 No Content**: Successful deletion
- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Insufficient permissions (e.g., accessing another user's task)
- **404 Not Found**: Resource does not exist
- **422 Unprocessable Entity**: Request validation error
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Unexpected server error

### API Versioning

Current version: **v0.1.0**

All endpoints are prefixed with `/api/`.
    """,
    version="0.1.0",
    contact={
        "name": "Phase II Todo API Support",
        "email": "support@example.com",
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT",
    },
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_tags=[
        {
            "name": "authentication",
            "description": "User authentication endpoints (signup, login, logout, user info)",
        },
        {
            "name": "tasks",
            "description": "Task management endpoints (CRUD operations, filtering, pagination)",
        },
        {
            "name": "chat",
            "description": "Chat and conversation endpoints with AI agent integration",
        },
        {
            "name": "health",
            "description": "Health check and monitoring endpoints",
        },
    ],
)

# CORS Configuration from environment variables
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

# Add security headers middleware (should be first for all responses)
app.add_middleware(SecurityHeadersMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1", "testserver"]
)

# Add rate limiting handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# Global exception handler for unhandled errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Global exception handler for catching all unhandled exceptions.

    This handler:
    1. Logs the error details (method, URL, exception type, traceback)
    2. Generates a unique error ID (UUID) for correlation and debugging
    3. Returns a generic error response to the client (no internal details exposed)

    Args:
        request: The FastAPI request object
        exc: The unhandled exception

    Returns:
        JSONResponse with 500 status code and safe error details
    """
    # Generate unique error ID for tracking
    error_id = str(uuid.uuid4())

    # Log comprehensive error details for debugging
    logger.error(
        f"Unhandled exception [error_id={error_id}] | "
        f"Method: {request.method} | "
        f"URL: {request.url.path} | "
        f"Exception: {type(exc).__name__}: {str(exc)}",
        exc_info=True,  # Include full traceback
    )

    # Return safe error response to client (no sensitive information)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "error_id": error_id,
        },
    )


# Include routers
app.include_router(health.router)
app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(chat.router)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Phase II Todo API",
        "version": "0.1.0",
        "status": "running",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)
