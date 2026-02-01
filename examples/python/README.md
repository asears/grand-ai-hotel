# Modern Python 3.12+ Examples

Production-ready Python examples demonstrating modern best practices, type safety, and Azure integration.

## Examples Overview

### 1. [FastAPI + Copilot SDK](./fastapi-copilot/)
Modern async FastAPI application with GitHub Copilot SDK integration.

**Features:**
- ✅ FastAPI with async/await
- ✅ Pydantic v2 models with lowercase type hints
- ✅ Azure Key Vault integration via DefaultAzureCredential
- ✅ Structured logging with loguru
- ✅ Comprehensive pytest tests

**Tech Stack:** FastAPI, Pydantic v2, Azure SDK, loguru

### 2. [Data Processing with Polars](./data-processing/)
High-performance data processing using Polars instead of pandas.

**Features:**
- ✅ Polars for 10-100x faster processing
- ✅ Streaming for large files (> RAM)
- ✅ Lazy evaluation for memory efficiency
- ✅ Type-safe transformations
- ✅ Modern Python patterns

**Tech Stack:** Polars, Python 3.12+

### 3. [Azure Services Integration](./azure-integration/)
Azure Key Vault and Blob Storage with DefaultAzureCredential.

**Features:**
- ✅ DefaultAzureCredential chain demo
- ✅ Azure Key Vault secret management
- ✅ Azure Blob Storage operations
- ✅ Works across dev/prod environments
- ✅ Comprehensive mocked tests

**Tech Stack:** Azure SDK, azure-identity

## Common Standards

All examples follow these modern Python standards:

### Type Hints (Python 3.12+)

```python
# ✅ Modern lowercase type hints
def process_data(items: list[str]) -> dict[str, int]:
    pass

# ✅ Union types with |
def get_value(key: str) -> str | None:
    pass

# ❌ Avoid old typing module for basic types
from typing import Dict, List, Optional  # Don't use these
```

### Pydantic v2

```python
from pydantic import BaseModel, Field

class User(BaseModel):
    name: str
    age: int
    email: str | None = None
    tags: list[str] = Field(default_factory=list)
```

### Async/Await

```python
async def fetch_data(url: str) -> dict[str, str]:
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        return response.json()
```

### Pattern Matching (Python 3.10+)

```python
match response:
    case {"status": "success", "data": data}:
        return data
    case {"status": "error", "message": msg}:
        raise APIError(msg)
```

### Given-When-Then Tests

```python
def test_user_creation():
    """
    Given: Valid user data
    When: Creating a user
    Then: User is created successfully
    """
    # Given
    data = {"name": "Alice", "age": 30}
    
    # When
    user = create_user(data)
    
    # Then
    assert user.name == "Alice"
    assert user.age == 30
```

## Quick Start

### Prerequisites

- Python 3.12+
- pip or uv

### Installation

Each example has its own `requirements.txt`:

```bash
# Navigate to an example
cd fastapi-copilot

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run tests
pytest
```

### Using uv (faster alternative to pip)

```bash
# Install uv
pip install uv

# Install dependencies (much faster)
uv pip install -r requirements.txt
```

## Code Quality Tools

All examples use modern tooling:

### Ruff (All-in-one linter and formatter)

```bash
# Format code
ruff format .

# Lint code
ruff check .

# Auto-fix issues
ruff check --fix .
```

### Type Checking (optional)

```bash
# Using mypy
mypy src/

# Or ty (faster, Rust-based)
ty check src/
```

### Running Tests

```bash
# Run all tests
pytest

# With coverage
pytest --cov=. --cov-report=html

# Verbose output
pytest -v

# Run specific test
pytest tests/test_api.py::TestChatEndpoint::test_chat_completion_success
```

## Example Feature Matrix

| Feature | FastAPI | Data Processing | Azure Integration |
|---------|---------|-----------------|-------------------|
| Async/await | ✅ | ❌ | ✅ |
| Type hints | ✅ | ✅ | ✅ |
| Pydantic v2 | ✅ | ❌ | ❌ |
| Azure SDK | ✅ | ❌ | ✅ |
| Pytest tests | ✅ | ✅ | ✅ |
| Docstrings | ✅ | ✅ | ✅ |
| Modern syntax | ✅ | ✅ | ✅ |

## Learning Path

**New to modern Python?** Follow this order:

1. **Start with Data Processing** - Learn Polars and modern Python syntax
2. **Then FastAPI** - Learn async/await and Pydantic
3. **Finally Azure Integration** - Learn cloud integration patterns

**Already experienced?** Jump to any example based on your needs.

## Common Patterns

### Error Handling

```python
# ✅ Good: Specific exceptions
try:
    result = process_data(data)
except ValueError as e:
    logger.error(f"Invalid data: {e}")
    raise
except KeyError as e:
    logger.error(f"Missing key: {e}")
    raise

# ❌ Avoid: Bare except
try:
    result = process_data(data)
except:  # Never do this!
    pass
```

### Logging with loguru

```python
from loguru import logger

# Configure
logger.remove()
logger.add(
    "app.log",
    rotation="1 day",
    retention="30 days",
    level="INFO"
)

# Use
logger.info("Processing started")
logger.debug(f"Data: {data}")
logger.error(f"Failed: {error}")
```

### Configuration

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "myapp"
    debug: bool = False
    database_url: str
    
    class Config:
        env_file = ".env"

settings = Settings()
```

## Dependencies Version Reference

All examples use these modern package versions:

- **Python**: 3.12+
- **FastAPI**: 0.109+
- **Pydantic**: 2.5+
- **Polars**: 0.20+
- **Azure SDK**: Latest
- **Pytest**: 7.4+
- **Ruff**: 0.1+
- **loguru**: 0.7+

## Style Guide

Follow the [Python Coding Standards](../../../PYTHON-CODING-STANDARDS.md) document for:

- Modern type hints (lowercase built-ins, `|` for unions)
- Ruff for formatting and linting
- Type checking with ty or mypy
- Comprehensive docstrings
- Given-When-Then test pattern

## Contributing

When adding new examples:

1. Use Python 3.12+ syntax
2. Include comprehensive type hints
3. Add docstrings with examples
4. Write pytest tests (>80% coverage)
5. Include detailed README
6. Use modern tooling (ruff, pytest)

## License

MIT
