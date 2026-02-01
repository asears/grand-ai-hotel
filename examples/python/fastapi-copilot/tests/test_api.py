"""
Pytest tests for FastAPI application.

Modern testing patterns with fixtures, parametrization, and Given-When-Then structure.
"""

import pytest
from fastapi.testclient import TestClient

from main import app
from models import ChatRequest, CodeReviewRequest, Message


@pytest.fixture
def client() -> TestClient:
    """
    Test client fixture.
    
    Returns:
        FastAPI test client
    """
    return TestClient(app)


class TestHealthEndpoint:
    """Tests for health check endpoint."""
    
    def test_health_check_returns_200(self, client: TestClient) -> None:
        """
        Given: A running FastAPI application
        When: Health check endpoint is called
        Then: Returns 200 with healthy status
        """
        # When
        response = client.get("/health")
        
        # Then
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "service" in data
        assert "version" in data
        assert "environment" in data
    
    def test_health_check_response_structure(self, client: TestClient) -> None:
        """
        Given: A running FastAPI application
        When: Health check endpoint is called
        Then: Response has correct structure
        """
        # When
        response = client.get("/health")
        
        # Then
        assert response.status_code == 200
        data = response.json()
        required_fields = {"status", "service", "version", "environment"}
        assert set(data.keys()) == required_fields


class TestChatEndpoint:
    """Tests for chat completion endpoint."""
    
    @pytest.fixture
    def valid_chat_request(self) -> dict[str, str | list[dict[str, str]]]:
        """Valid chat request fixture."""
        return {
            "messages": [
                {"role": "user", "content": "Hello, how are you?"}
            ],
            "model": "gpt-4",
            "temperature": 0.7,
        }
    
    def test_chat_completion_success(
        self,
        client: TestClient,
        valid_chat_request: dict[str, str | list[dict[str, str]]],
    ) -> None:
        """
        Given: A valid chat request
        When: Chat endpoint is called
        Then: Returns 200 with assistant message
        """
        # When
        response = client.post("/api/v1/chat", json=valid_chat_request)
        
        # Then
        assert response.status_code == 200
        data = response.json()
        assert data["message"]["role"] == "assistant"
        assert "content" in data["message"]
        assert data["model"] == "gpt-4"
        assert "usage" in data
    
    def test_chat_completion_validates_messages(self, client: TestClient) -> None:
        """
        Given: A chat request with empty messages
        When: Chat endpoint is called
        Then: Returns 422 validation error
        """
        # Given
        invalid_request = {
            "messages": [],
            "model": "gpt-4",
        }
        
        # When
        response = client.post("/api/v1/chat", json=invalid_request)
        
        # Then
        assert response.status_code == 422
    
    @pytest.mark.parametrize(
        "role",
        ["user", "assistant", "system"],
    )
    def test_chat_accepts_valid_roles(
        self,
        client: TestClient,
        role: str,
    ) -> None:
        """
        Given: Messages with valid roles
        When: Chat endpoint is called
        Then: Request is accepted
        """
        # Given
        request_data = {
            "messages": [{"role": role, "content": "Test message"}],
            "model": "gpt-4",
        }
        
        # When
        response = client.post("/api/v1/chat", json=request_data)
        
        # Then
        assert response.status_code == 200
    
    def test_chat_rejects_invalid_role(self, client: TestClient) -> None:
        """
        Given: Message with invalid role
        When: Chat endpoint is called
        Then: Returns 422 validation error
        """
        # Given
        invalid_request = {
            "messages": [{"role": "invalid", "content": "Test"}],
            "model": "gpt-4",
        }
        
        # When
        response = client.post("/api/v1/chat", json=invalid_request)
        
        # Then
        assert response.status_code == 422


class TestCodeReviewEndpoint:
    """Tests for code review endpoint."""
    
    @pytest.fixture
    def valid_code_review_request(self) -> dict[str, str | list[str]]:
        """Valid code review request fixture."""
        return {
            "code": "def hello():\n    print('world')",
            "language": "python",
            "focus_areas": ["style", "performance"],
        }
    
    def test_code_review_success(
        self,
        client: TestClient,
        valid_code_review_request: dict[str, str | list[str]],
    ) -> None:
        """
        Given: A valid code review request
        When: Code review endpoint is called
        Then: Returns 200 with suggestions
        """
        # When
        response = client.post("/api/v1/code-review", json=valid_code_review_request)
        
        # Then
        assert response.status_code == 200
        data = response.json()
        assert "suggestions" in data
        assert isinstance(data["suggestions"], list)
        assert "severity_score" in data
        assert "issues_found" in data
        assert data["language"] == "python"
    
    @pytest.mark.parametrize(
        "language",
        ["python", "javascript", "typescript", "java", "go", "rust"],
    )
    def test_code_review_accepts_supported_languages(
        self,
        client: TestClient,
        language: str,
    ) -> None:
        """
        Given: Code in supported language
        When: Code review endpoint is called
        Then: Request is accepted
        """
        # Given
        request_data = {
            "code": "// test code",
            "language": language,
        }
        
        # When
        response = client.post("/api/v1/code-review", json=request_data)
        
        # Then
        assert response.status_code == 200
        assert response.json()["language"] == language
    
    def test_code_review_rejects_unsupported_language(
        self,
        client: TestClient,
    ) -> None:
        """
        Given: Code in unsupported language
        When: Code review endpoint is called
        Then: Returns 422 validation error
        """
        # Given
        invalid_request = {
            "code": "test code",
            "language": "brainfuck",
        }
        
        # When
        response = client.post("/api/v1/code-review", json=invalid_request)
        
        # Then
        assert response.status_code == 422


class TestModelsEndpoint:
    """Tests for models listing endpoint."""
    
    def test_list_models_returns_available_models(
        self,
        client: TestClient,
    ) -> None:
        """
        Given: A running FastAPI application
        When: Models endpoint is called
        Then: Returns list of available models
        """
        # When
        response = client.get("/api/v1/models")
        
        # Then
        assert response.status_code == 200
        data = response.json()
        assert "chat_models" in data
        assert "code_models" in data
        assert isinstance(data["chat_models"], list)
        assert isinstance(data["code_models"], list)
        assert len(data["chat_models"]) > 0


class TestPydanticModels:
    """Tests for Pydantic model validation."""
    
    def test_message_model_validates_role(self) -> None:
        """
        Given: Message with valid role
        When: Model is instantiated
        Then: Validation passes
        """
        # When/Then
        msg = Message(role="user", content="Hello")
        assert msg.role == "user"
    
    def test_message_model_rejects_invalid_role(self) -> None:
        """
        Given: Message with invalid role
        When: Model is instantiated
        Then: Validation error is raised
        """
        # When/Then
        with pytest.raises(ValueError):
            Message(role="invalid", content="Hello")
    
    def test_chat_request_model_validates_temperature(self) -> None:
        """
        Given: ChatRequest with temperature outside valid range
        When: Model is instantiated
        Then: Validation error is raised
        """
        # When/Then
        with pytest.raises(ValueError):
            ChatRequest(
                messages=[Message(role="user", content="Hi")],
                temperature=3.0,  # Invalid: > 2.0
            )
    
    @pytest.mark.parametrize(
        "temperature",
        [0.0, 0.5, 1.0, 1.5, 2.0],
    )
    def test_chat_request_accepts_valid_temperature(
        self,
        temperature: float,
    ) -> None:
        """
        Given: ChatRequest with valid temperature
        When: Model is instantiated
        Then: Validation passes
        """
        # When/Then
        req = ChatRequest(
            messages=[Message(role="user", content="Hi")],
            temperature=temperature,
        )
        assert req.temperature == temperature
