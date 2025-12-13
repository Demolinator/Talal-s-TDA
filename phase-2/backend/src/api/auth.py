"""
Authentication API Endpoints

Thin controllers for user authentication (signup, login, logout).
Delegates business logic to AuthService.
"""

from fastapi import APIRouter, Depends, Response, Request
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.util import get_remote_address

from src.auth.dependencies import get_current_user
from src.auth.jwt import create_access_token
from src.models.user import User, UserCreate, UserLogin, UserResponse
from src.services.auth_service import AuthService

router = APIRouter(prefix="/api/auth", tags=["authentication"])

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)


@router.post(
    "/signup",
    response_model=UserResponse,
    status_code=201,
    responses={
        201: {
            "description": "User created successfully",
            "content": {
                "application/json": {
                    "example": {
                        "id": "550e8400-e29b-41d4-a716-446655440000",
                        "email": "alice@example.com",
                        "name": "Alice Smith",
                        "created_at": "2025-12-07T15:30:00Z",
                        "updated_at": "2025-12-07T15:30:00Z",
                    }
                }
            },
        },
        400: {
            "description": "Email already registered",
            "content": {
                "application/json": {
                    "example": {"detail": "Email already registered"}
                }
            },
        },
        422: {
            "description": "Validation error",
            "content": {
                "application/json": {
                    "example": {
                        "detail": [
                            {
                                "loc": ["body", "email"],
                                "msg": "value is not a valid email address",
                                "type": "value_error.email",
                            }
                        ]
                    }
                }
            },
        },
    },
)
async def signup(
    user_data: UserCreate,
    response: Response,
    auth_service: AuthService = Depends(),
) -> UserResponse:
    """
    Register a new user account.

    Creates user with hashed password, generates JWT token,
    and sets HttpOnly cookie for authentication.

    **Request Body:**
    - email: Valid email address (unique)
    - name: User's display name (1-100 characters)
    - password: Password (min 8 characters)

    **Response:**
    - 201: User created successfully (with auth cookie set)
    - 400: Email already registered
    - 422: Validation error (invalid email, password too short, etc.)

    **Side Effects:**
    - Sets "auth_token" HttpOnly cookie (15 minutes expiry)

    **Example:**
    ```json
    POST /api/auth/signup
    {
        "email": "alice@example.com",
        "name": "Alice Smith",
        "password": "SecurePass123!"
    }

    Response 201:
    {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "email": "alice@example.com",
        "name": "Alice Smith",
        "created_at": "2025-12-07T15:30:00Z",
        "updated_at": "2025-12-07T15:30:00Z"
    }
    ```
    """
    # Delegate business logic to service
    user = await auth_service.signup(user_data)

    # Create JWT access token
    access_token = create_access_token(user.id, user.email)

    # Set HttpOnly cookie (prevents XSS attacks)
    response.set_cookie(
        key="auth_token",
        value=access_token,
        httponly=True,  # Not accessible via JavaScript
        secure=True,  # HTTPS only (set False for local development)
        samesite="strict",  # CSRF protection
        max_age=15 * 60,  # 15 minutes (matches ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    # Return user data (excludes hashed_password)
    return UserResponse.model_validate(user)


@router.post(
    "/login",
    response_model=UserResponse,
    status_code=200,
    responses={
        200: {
            "description": "Login successful",
            "content": {
                "application/json": {
                    "example": {
                        "id": "550e8400-e29b-41d4-a716-446655440000",
                        "email": "alice@example.com",
                        "name": "Alice Smith",
                        "created_at": "2025-12-07T15:30:00Z",
                        "updated_at": "2025-12-07T15:30:00Z",
                    }
                }
            },
        },
        401: {
            "description": "Invalid credentials",
            "content": {
                "application/json": {
                    "example": {"detail": "Invalid email or password"}
                }
            },
        },
        429: {
            "description": "Rate limit exceeded",
            "content": {
                "application/json": {
                    "example": {"detail": "Rate limit exceeded: 5 per 1 minute"}
                }
            },
        },
    },
)
@limiter.limit("5/minute")
async def login(
    request: Request,
    credentials: UserLogin,
    response: Response,
    auth_service: AuthService = Depends(),
) -> UserResponse:
    """
    Login with email and password.

    Authenticates user and sets JWT token in HttpOnly cookie.

    **Request Body:**
    - email: User's email address
    - password: User's password

    **Response:**
    - 200: Login successful (with auth cookie set)
    - 401: Invalid email or password

    **Side Effects:**
    - Sets "auth_token" HttpOnly cookie (15 minutes expiry)

    **Security:**
    - Passwords are never stored in plaintext
    - Bcrypt hashing with salt
    - Error messages don't reveal whether email exists

    **Example:**
    ```json
    POST /api/auth/login
    {
        "email": "alice@example.com",
        "password": "SecurePass123!"
    }

    Response 200:
    {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "email": "alice@example.com",
        "name": "Alice Smith",
        "created_at": "2025-12-07T15:30:00Z",
        "updated_at": "2025-12-07T15:30:00Z"
    }
    ```
    """
    # Delegate authentication to service
    user = await auth_service.login(credentials.email, credentials.password)

    # Create JWT access token
    access_token = create_access_token(user.id, user.email)

    # Set HttpOnly cookie
    response.set_cookie(
        key="auth_token",
        value=access_token,
        httponly=True,
        secure=True,  # HTTPS only (set False for local development)
        samesite="strict",
        max_age=15 * 60,  # 15 minutes
    )

    # Return user data
    return UserResponse.model_validate(user)


@router.post(
    "/logout",
    status_code=204,
    responses={
        204: {
            "description": "Logout successful (no content)",
        },
        401: {
            "description": "Not authenticated",
            "content": {
                "application/json": {
                    "example": {"detail": "Not authenticated"}
                }
            },
        },
    },
)
async def logout(
    response: Response,
    current_user: User = Depends(get_current_user),
) -> None:
    """
    Logout current user.

    Clears authentication cookie. Requires authentication.

    **Response:**
    - 204: Logout successful (no content)
    - 401: Not authenticated

    **Side Effects:**
    - Deletes "auth_token" cookie

    **Note:**
    - JWT is stateless, so logout only clears client-side cookie
    - Token remains valid until expiry (15 minutes)
    - For immediate invalidation, implement token blacklist

    **Example:**
    ```
    POST /api/auth/logout
    Cookie: auth_token=eyJhbGc...

    Response 204: (no content)
    ```
    """
    # Clear auth cookie by setting max_age=0
    response.delete_cookie(
        key="auth_token",
        httponly=True,
        secure=True,
        samesite="strict",
    )

    # 204 No Content (response body is None)
    return None


@router.get(
    "/me",
    response_model=UserResponse,
    status_code=200,
    responses={
        200: {
            "description": "Current user data",
            "content": {
                "application/json": {
                    "example": {
                        "id": "550e8400-e29b-41d4-a716-446655440000",
                        "email": "alice@example.com",
                        "name": "Alice Smith",
                        "created_at": "2025-12-07T15:30:00Z",
                        "updated_at": "2025-12-07T15:30:00Z",
                    }
                }
            },
        },
        401: {
            "description": "Not authenticated",
            "content": {
                "application/json": {
                    "example": {"detail": "Not authenticated"}
                }
            },
        },
    },
)
async def get_current_user_info(
    current_user: User = Depends(get_current_user),
) -> UserResponse:
    """
    Get current authenticated user's information.

    Useful for frontend to fetch user data after page refresh.

    **Response:**
    - 200: User data
    - 401: Not authenticated

    **Example:**
    ```
    GET /api/auth/me
    Cookie: auth_token=eyJhbGc...

    Response 200:
    {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "email": "alice@example.com",
        "name": "Alice Smith",
        "created_at": "2025-12-07T15:30:00Z",
        "updated_at": "2025-12-07T15:30:00Z"
    }
    ```
    """
    return UserResponse.model_validate(current_user)
