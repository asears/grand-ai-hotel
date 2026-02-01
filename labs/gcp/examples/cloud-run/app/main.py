"""
FastAPI Application for Cloud Run

Production-ready FastAPI application with:
- Health checks
- Secret Manager integration
- Structured logging
- Error handling
"""

import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from app.routes import health, api
from app.config import settings

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format='{"severity": "%(levelname)s", "message": "%(message)s", "timestamp": "%(asctime)s"}'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    logger.info("Starting FastAPI application")
    logger.info(f"Environment: {settings.environment}")
    logger.info(f"Debug mode: {settings.debug}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down FastAPI application")


# Create FastAPI application
app = FastAPI(
    title="Cloud Run FastAPI",
    description="Production-ready FastAPI on Cloud Run",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Include routers
app.include_router(health.router, tags=["health"])
app.include_router(api.router, prefix="/api/v1", tags=["api"])


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": "Cloud Run FastAPI",
        "version": "1.0.0",
        "environment": settings.environment,
    }
