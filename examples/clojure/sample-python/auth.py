"""
User authentication module for The Grand Budapest Terminal.

This module provides secure user authentication with bcrypt password hashing.
"""
from typing import Optional
import bcrypt
from datetime import datetime, timedelta


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt with secure salt.
    
    Args:
        password: Plain text password to hash
        
    Returns:
        Hashed password string
    """
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode(), salt).decode()


def verify_password(password: str, password_hash: str) -> bool:
    """
    Verify a password against its hash.
    
    Args:
        password: Plain text password to check
        password_hash: Previously hashed password
        
    Returns:
        True if password matches, False otherwise
    """
    return bcrypt.checkpw(password.encode(), password_hash.encode())


def create_session(user_id: int, duration_hours: int = 24) -> dict:
    """
    Create a new session for authenticated user.
    
    Args:
        user_id: ID of the authenticated user
        duration_hours: How long session should last
        
    Returns:
        Dictionary with session details
    """
    expires_at = datetime.utcnow() + timedelta(hours=duration_hours)
    return {
        "user_id": user_id,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.utcnow().isoformat()
    }


def validate_email(email: str) -> bool:
    """
    Validate email format.
    
    Args:
        email: Email address to validate
        
    Returns:
        True if valid format
    """
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


class AuthenticationError(Exception):
    """Raised when authentication fails."""
    pass
