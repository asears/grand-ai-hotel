"""
FastAPI + GitHub Copilot SDK Integration Example.

Modern async FastAPI application demonstrating integration with GitHub Copilot SDK,
Azure Key Vault, and structured logging.

Example:
    Run the server:
    $ uvicorn main:app --reload --port 8000
    
    Test endpoint:
    $ curl http://localhost:8000/health
"""

import asyncio
from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from loguru import logger

from config import Settings, get_settings
from models import (
    ChatRequest,
    ChatResponse,
    CodeReviewRequest,
    CodeReviewResponse,
    HealthResponse,
    Message,
)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """
    Application lifespan manager for startup and shutdown events.
    
    Initializes connections and resources on startup, cleans up on shutdown.
    """
    settings = get_settings()
    logger.info(f"Starting {settings.app_name} v{settings.version}")
    logger.info(f"Environment: {settings.environment}")
    
    # Initialize Copilot client (would be actual initialization in production)
    logger.info("Initializing Copilot SDK client...")
    
    yield
    
    # Cleanup
    logger.info("Shutting down application...")


app = FastAPI(
    title="FastAPI Copilot Integration",
    description="Modern FastAPI app with GitHub Copilot SDK integration",
    version="1.0.0",
    lifespan=lifespan,
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Global exception handler for unhandled errors."""
    logger.exception(f"Unhandled exception on {request.url}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "type": type(exc).__name__},
    )


@app.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """
    Health check endpoint.
    
    Returns:
        Health status with service information
        
    Example:
        >>> response = await health_check()
        >>> response.status
        'healthy'
    """
    settings = get_settings()
    return HealthResponse(
        status="healthy",
        service=settings.app_name,
        version=settings.version,
        environment=settings.environment,
    )


@app.post("/api/v1/chat", response_model=ChatResponse)
async def chat_completion(request: ChatRequest) -> ChatResponse:
    """
    Generate chat completion using Copilot SDK.
    
    Args:
        request: Chat request with messages and optional parameters
        
    Returns:
        Chat response with generated message
        
    Raises:
        HTTPException: If API call fails
        
    Example:
        >>> req = ChatRequest(
        ...     messages=[Message(role="user", content="Hello!")],
        ...     model="gpt-4"
        ... )
        >>> response = await chat_completion(req)
    """
    settings = get_settings()
    
    logger.info(
        f"Chat request: model={request.model}, messages={len(request.messages)}"
    )
    
    try:
        # Simulate async API call to Copilot SDK
        await asyncio.sleep(0.1)
        
        # In production, this would be actual Copilot SDK call:
        # response = await copilot_client.chat.completions.create(
        #     model=request.model,
        #     messages=[m.model_dump() for m in request.messages],
        #     temperature=request.temperature,
        #     max_tokens=request.max_tokens,
        # )
        
        response_message = Message(
            role="assistant",
            content=f"This is a simulated response to: {request.messages[-1].content}",
        )
        
        logger.info("Chat completion successful")
        
        return ChatResponse(
            message=response_message,
            model=request.model,
            usage={"prompt_tokens": 10, "completion_tokens": 15, "total_tokens": 25},
        )
        
    except Exception as e:
        logger.error(f"Chat completion failed: {e}")
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.post("/api/v1/code-review", response_model=CodeReviewResponse)
async def code_review(request: CodeReviewRequest) -> CodeReviewResponse:
    """
    Perform AI-powered code review.
    
    Args:
        request: Code review request with code and language
        
    Returns:
        Code review with suggestions and analysis
        
    Example:
        >>> req = CodeReviewRequest(
        ...     code="def hello(): print('world')",
        ...     language="python",
        ...     focus_areas=["style", "performance"]
        ... )
        >>> response = await code_review(req)
    """
    logger.info(f"Code review request: language={request.language}")
    
    try:
        # Simulate async processing
        await asyncio.sleep(0.2)
        
        # Simulated code review results
        suggestions = [
            "Consider adding type hints to function parameters",
            "Add docstring describing function purpose",
            "Use f-string for better readability",
        ]
        
        issues_found = len(suggestions)
        severity_score = 5.0 if issues_found > 0 else 0.0
        
        logger.info(f"Code review complete: {issues_found} issues found")
        
        return CodeReviewResponse(
            suggestions=suggestions,
            severity_score=severity_score,
            language=request.language,
            issues_found=issues_found,
        )
        
    except Exception as e:
        logger.error(f"Code review failed: {e}")
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.get("/api/v1/models")
async def list_models() -> dict[str, list[str]]:
    """
    List available AI models.
    
    Returns:
        Dictionary with available models by category
    """
    return {
        "chat_models": [
            "gpt-4",
            "gpt-4-turbo",
            "gpt-3.5-turbo",
        ],
        "code_models": [
            "copilot-code",
            "codex",
        ],
    }


if __name__ == "__main__":
    import uvicorn
    
    settings = get_settings()
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.environment == "development",
        log_level="info",
    )
