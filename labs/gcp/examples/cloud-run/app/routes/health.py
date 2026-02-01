"""Health check endpoints."""

from datetime import datetime
from fastapi import APIRouter, status
from pydantic import BaseModel

router = APIRouter()


class HealthResponse(BaseModel):
    """Health check response model."""
    status: str
    timestamp: str


class ReadinessResponse(BaseModel):
    """Readiness check response model."""
    ready: bool
    checks: dict


@router.get("/health", response_model=HealthResponse, status_code=status.HTTP_200_OK)
async def health_check():
    """
    Health check endpoint.
    
    Returns 200 OK if the service is running.
    Used by Cloud Run to determine if the instance is alive.
    """
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }


@router.get("/ready", response_model=ReadinessResponse, status_code=status.HTTP_200_OK)
async def readiness_check():
    """
    Readiness check endpoint.
    
    Returns 200 OK if the service is ready to accept traffic.
    Used by Cloud Run to determine if the instance should receive requests.
    """
    # In production, check database, cache, and other dependencies
    checks = {
        "database": "ok",  # Replace with actual database check
        "cache": "ok",     # Replace with actual cache check
    }
    
    all_ready = all(status == "ok" for status in checks.values())
    
    return {
        "ready": all_ready,
        "checks": checks
    }


@router.get("/startup")
async def startup_check():
    """
    Startup probe endpoint.
    
    Returns 200 OK when the service has completed initialization.
    """
    return {"status": "started"}
