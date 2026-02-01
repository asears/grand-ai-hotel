"""
Pydantic v2 models for FastAPI application.

Modern type-safe data models using Pydantic v2 with lowercase type hints.
"""

from pydantic import BaseModel, Field, field_validator


class Message(BaseModel):
    """
    Chat message model.
    
    Attributes:
        role: Message role (user, assistant, system)
        content: Message content text
        
    Example:
        >>> msg = Message(role="user", content="Hello!")
        >>> msg.role
        'user'
    """
    
    role: str = Field(..., description="Message role (user, assistant, system)")
    content: str = Field(..., description="Message content")
    
    @field_validator("role")
    @classmethod
    def validate_role(cls, v: str) -> str:
        """Validate message role is one of allowed values."""
        allowed_roles = {"user", "assistant", "system"}
        if v not in allowed_roles:
            raise ValueError(f"Role must be one of {allowed_roles}")
        return v
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "role": "user",
                    "content": "What is FastAPI?",
                }
            ]
        }
    }


class ChatRequest(BaseModel):
    """
    Chat completion request model.
    
    Attributes:
        messages: List of chat messages
        model: AI model to use
        temperature: Sampling temperature (0-2)
        max_tokens: Maximum tokens to generate
        
    Example:
        >>> req = ChatRequest(
        ...     messages=[Message(role="user", content="Hello!")],
        ...     model="gpt-4"
        ... )
    """
    
    messages: list[Message] = Field(..., min_length=1)
    model: str = Field(default="gpt-4", description="Model identifier")
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    max_tokens: int | None = Field(default=None, ge=1, le=4000)
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "messages": [
                        {"role": "user", "content": "Explain FastAPI"}
                    ],
                    "model": "gpt-4",
                    "temperature": 0.7,
                }
            ]
        }
    }


class ChatResponse(BaseModel):
    """
    Chat completion response model.
    
    Attributes:
        message: Generated assistant message
        model: Model used for generation
        usage: Token usage statistics
    """
    
    message: Message
    model: str
    usage: dict[str, int] = Field(
        default_factory=dict,
        description="Token usage statistics",
    )


class CodeReviewRequest(BaseModel):
    """
    Code review request model.
    
    Attributes:
        code: Source code to review
        language: Programming language
        focus_areas: Optional areas to focus on
        
    Example:
        >>> req = CodeReviewRequest(
        ...     code="def hello(): pass",
        ...     language="python",
        ...     focus_areas=["style", "performance"]
        ... )
    """
    
    code: str = Field(..., min_length=1, description="Source code to review")
    language: str = Field(..., description="Programming language")
    focus_areas: list[str] | None = Field(
        default=None,
        description="Specific areas to focus on",
    )
    
    @field_validator("language")
    @classmethod
    def validate_language(cls, v: str) -> str:
        """Validate programming language is supported."""
        supported = {
            "python",
            "javascript",
            "typescript",
            "java",
            "go",
            "rust",
            "csharp",
        }
        if v.lower() not in supported:
            raise ValueError(f"Language must be one of {supported}")
        return v.lower()


class CodeReviewResponse(BaseModel):
    """
    Code review response model.
    
    Attributes:
        suggestions: List of improvement suggestions
        severity_score: Overall severity score (0-10)
        language: Programming language
        issues_found: Number of issues found
    """
    
    suggestions: list[str]
    severity_score: float = Field(ge=0.0, le=10.0)
    language: str
    issues_found: int = Field(ge=0)


class HealthResponse(BaseModel):
    """
    Health check response model.
    
    Attributes:
        status: Service health status
        service: Service name
        version: Service version
        environment: Deployment environment
    """
    
    status: str = Field(..., description="Health status")
    service: str
    version: str
    environment: str
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "status": "healthy",
                    "service": "fastapi-copilot",
                    "version": "1.0.0",
                    "environment": "production",
                }
            ]
        }
    }
