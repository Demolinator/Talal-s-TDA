"""
FastAPI Authentication Dependencies

Provides dependency injection for extracting and validating authenticated users.
"""

import os
from uuid import UUID

import httpx
from fastapi import Depends, HTTPException, Request
from sqlmodel import Session

from src.auth.jwt import verify_token
from src.db.session import get_session
from src.models.user import User

# Auth server URL for session validation
AUTH_SERVER_URL = os.getenv("AUTH_SERVER_URL", "http://localhost:3001")


async def get_current_user(
    request: Request,
    session: Session = Depends(get_session),
) -> User:
    """
    FastAPI dependency to extract authenticated user from Better Auth session token.

    Validates session token by calling Better Auth server and fetches
    the corresponding user from the shared database.

    Token Sources (checked in order):
    1. Authorization header: "Bearer <token>"
    2. Cookie: "auth_token"

    Args:
        request: FastAPI Request object (contains headers and cookies)
        session: Database session (injected via dependency)

    Returns:
        User object for the authenticated user

    Raises:
        HTTPException 401: If token is missing, invalid, or user not found

    Usage:
        @router.get("/api/tasks")
        async def list_tasks(current_user: User = Depends(get_current_user)):
            # current_user is automatically extracted and validated
            tasks = get_tasks_for_user(current_user.id)
            return tasks

    Example Flow:
        1. User logs in via Better Auth (returns session token)
        2. Frontend stores token and sends in Authorization header
        3. Dependency extracts token from header (or cookie fallback)
        4. Token is validated by calling Better Auth /api/auth/get-session
        5. User is fetched from database by userId from session
        6. User object is returned to route handler
    """
    # Try Authorization header first (for cross-domain requests)
    token = None
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header[7:]  # Remove "Bearer " prefix

    # Fallback to cookie (for same-domain requests)
    if not token:
        token = request.cookies.get("auth_token")

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated - missing auth token",
        )

    # Validate session token with Better Auth server
    try:
        print(f"🔍 Validating token with Better Auth server: {AUTH_SERVER_URL}")
        print(f"🔑 Token: {token[:20]}...")
        async with httpx.AsyncClient() as client:
            # Call Better Auth to validate session
            auth_response = await client.get(
                f"{AUTH_SERVER_URL}/api/auth/get-session",
                headers={"Cookie": f"better-auth.session_token={token}"},
                timeout=10.0,
            )
            print(f"📡 Auth server response status: {auth_response.status_code}")

            if auth_response.status_code != 200:
                raise HTTPException(
                    status_code=401,
                    detail="Invalid or expired session token",
                )

            session_data = auth_response.json()

            # Extract user ID from session
            if not session_data or "user" not in session_data:
                raise HTTPException(
                    status_code=401,
                    detail="Invalid session - no user data",
                )

            user_id_str = session_data["user"].get("id")
            if not user_id_str:
                raise HTTPException(
                    status_code=401,
                    detail="Invalid session - missing user ID",
                )

            user_id = UUID(user_id_str)

    except httpx.RequestError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Auth server unavailable: {str(e)}",
        )
    except ValueError:
        # Invalid UUID format
        raise HTTPException(
            status_code=401,
            detail="Invalid session - malformed user ID",
        )

    # Fetch user from database
    user = session.get(User, user_id)

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found - session may be for deleted account",
        )

    return user


def get_optional_user(
    request: Request,
    session: Session = Depends(get_session),
) -> User | None:
    """
    FastAPI dependency to optionally extract authenticated user from Better Auth token.

    Similar to get_current_user but returns None instead of raising
    HTTPException when user is not authenticated. Useful for endpoints
    that work for both authenticated and anonymous users.

    Args:
        request: FastAPI Request object
        session: Database session (injected via dependency)

    Returns:
        User object if authenticated, None otherwise

    Usage:
        @router.get("/api/public/tasks")
        async def list_public_tasks(user: User | None = Depends(get_optional_user)):
            if user:
                # Show user's private tasks + public tasks
                tasks = get_all_tasks(user.id)
            else:
                # Show only public tasks
                tasks = get_public_tasks()
            return tasks
    """
    # Extract token from HttpOnly cookie
    token = request.cookies.get("auth_token")

    if not token:
        return None

    # Verify and decode JWT token
    try:
        payload = verify_token(token)

        # Better Auth uses 'userId' (camelCase) in JWT payload
        user_id_str = (
            payload.get("userId")  # Better Auth format
            or payload.get("user_id")  # Legacy format
            or payload.get("sub")  # Standard JWT 'subject' claim
        )

        if not user_id_str:
            return None

        user_id = UUID(user_id_str)

    except (ValueError, HTTPException):
        # Invalid token format or verification failed
        return None

    # Fetch user from database
    user = session.get(User, user_id)
    return user  # Returns None if user not found
