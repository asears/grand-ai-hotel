# FastAPI + GitHub Copilot SDK Integration

Modern async FastAPI application demonstrating integration with GitHub Copilot SDK, Azure Key Vault, and structured logging.

## Features

- ✅ **FastAPI** with modern async/await patterns
- ✅ **Pydantic v2** models with lowercase type hints (`dict`, `list`, `str | None`)
- ✅ **Azure Key Vault** integration using `DefaultAzureCredential`
- ✅ **Structured logging** with loguru
- ✅ **Type-safe** with type hints
- ✅ **Production-ready** with health checks and error handling
- ✅ **Tests** with pytest and Given-When-Then pattern

## Requirements

- Python 3.12+
- Azure subscription (for Key Vault integration)
- GitHub Copilot API access (for production use)

## Installation

### 1. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Create `.env` file:

```env
APP_NAME=fastapi-copilot
VERSION=1.0.0
ENVIRONMENT=development
LOG_LEVEL=INFO

# Azure Key Vault (optional)
AZURE_KEYVAULT_URL=https://your-vault.vault.azure.net

# Local development (if not using Key Vault)
COPILOT_API_KEY=your-api-key-here
DATABASE_URL=sqlite:///./app.db
```

### 4. Azure Authentication Setup

#### For Local Development (Azure CLI)

```bash
az login
```

#### For Production (Managed Identity)

Deploy to Azure App Service or Container Apps with Managed Identity enabled.

#### For CI/CD (Service Principal)

```bash
export AZURE_CLIENT_ID=<client-id>
export AZURE_TENANT_ID=<tenant-id>
export AZURE_CLIENT_SECRET=<client-secret>
```

### 5. Create Azure Key Vault Secrets (Optional)

```bash
# Create Key Vault
az keyvault create --name your-vault --resource-group your-rg --location eastus

# Set secrets
az keyvault secret set --vault-name your-vault --name copilot-api-key --value "your-key"
az keyvault secret set --vault-name your-vault --name database-url --value "postgresql://..."

# Grant access to your identity
az keyvault set-policy --name your-vault --upn user@domain.com \
  --secret-permissions get list
```

## Running the Application

### Development Mode

```bash
uvicorn main:app --reload --port 8000
```

### Production Mode

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Using Docker

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
docker build -t fastapi-copilot .
docker run -p 8000:8000 --env-file .env fastapi-copilot
```

## API Endpoints

### Health Check

```bash
curl http://localhost:8000/health
```

Response:
```json
{
  "status": "healthy",
  "service": "fastapi-copilot",
  "version": "1.0.0",
  "environment": "development"
}
```

### Chat Completion

```bash
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Explain FastAPI in one sentence"}
    ],
    "model": "gpt-4",
    "temperature": 0.7
  }'
```

Response:
```json
{
  "message": {
    "role": "assistant",
    "content": "FastAPI is a modern, fast web framework..."
  },
  "model": "gpt-4",
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 15,
    "total_tokens": 25
  }
}
```

### Code Review

```bash
curl -X POST http://localhost:8000/api/v1/code-review \
  -H "Content-Type: application/json" \
  -d '{
    "code": "def hello():\n    print(\"world\")",
    "language": "python",
    "focus_areas": ["style", "performance"]
  }'
```

Response:
```json
{
  "suggestions": [
    "Consider adding type hints to function parameters",
    "Add docstring describing function purpose"
  ],
  "severity_score": 5.0,
  "language": "python",
  "issues_found": 2
}
```

### List Models

```bash
curl http://localhost:8000/api/v1/models
```

## Running Tests

### Run All Tests

```bash
pytest
```

### Run with Coverage

```bash
pytest --cov=. --cov-report=html
```

### Run Specific Test Class

```bash
pytest tests/test_api.py::TestChatEndpoint
```

### Run with Verbose Output

```bash
pytest -v
```

## Code Quality

### Format Code

```bash
ruff format .
```

### Lint Code

```bash
ruff check .
```

### Fix Auto-fixable Issues

```bash
ruff check --fix .
```

## Project Structure

```
fastapi-copilot/
├── main.py              # FastAPI application with endpoints
├── models.py            # Pydantic v2 models
├── config.py            # Settings and Azure Key Vault integration
├── requirements.txt     # Python dependencies
├── README.md           # This file
├── .env                # Environment variables (not in git)
└── tests/
    └── test_api.py     # Pytest tests
```

## Modern Python Features Used

### Type Hints (Python 3.12+)

```python
# Modern lowercase type hints
def process_data(items: list[str]) -> dict[str, int]:
    pass

# Union types with |
def get_value(key: str) -> str | None:
    pass

# Complex nested types
def analyze(data: dict[str, list[tuple[int, str]]]) -> list[dict[str, str | int]]:
    pass
```

### Async/Await

```python
@app.post("/api/v1/chat")
async def chat_completion(request: ChatRequest) -> ChatResponse:
    response = await copilot_client.generate(request)
    return response
```

### Context Managers

```python
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    # Startup
    logger.info("Starting application...")
    yield
    # Shutdown
    logger.info("Shutting down...")
```

### Pydantic v2 Features

```python
class ChatRequest(BaseModel):
    messages: list[Message] = Field(..., min_length=1)
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    
    @field_validator("messages")
    @classmethod
    def validate_messages(cls, v: list[Message]) -> list[Message]:
        # Custom validation logic
        return v
```

## Azure DefaultAzureCredential Chain

The application uses `DefaultAzureCredential` which tries authentication methods in order:

1. **Environment Variables** - `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_CLIENT_SECRET`
2. **Managed Identity** - For Azure-hosted apps (App Service, Container Apps, AKS)
3. **Azure CLI** - For local development (`az login`)
4. **Azure PowerShell** - Alternative local development
5. **Interactive Browser** - Fallback for user authentication

This works seamlessly across development and production environments without code changes.

## Best Practices Demonstrated

- ✅ Modern Python 3.12+ syntax with lowercase type hints
- ✅ Async/await for I/O operations
- ✅ Pydantic v2 for data validation
- ✅ Structured logging with context
- ✅ Environment-based configuration
- ✅ Secure secret management with Azure Key Vault
- ✅ Error handling
- ✅ Health checks for monitoring
- ✅ Type hints on all functions
- ✅ Docstrings with examples
- ✅ Given-When-Then test pattern
- ✅ Parametrized tests for multiple scenarios

## License

MIT
