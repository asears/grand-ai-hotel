# Python Coding Standards for Grand Budapest Terminal
## Modern Python 3.11+ Best Practices

*Maintained by M. Gustave and Ludwig*

---

## Type Hints - Modern Syntax (Python 3.11+)

### ✅ DO: Use Built-in Generic Types

**Modern syntax (Python 3.11+):**
```python
# Use lowercase built-in types
def process_data(items: list[str]) -> dict[str, int]:
    """Process items and return counts."""
    return {item: len(item) for item in items}

# Use | for unions instead of Union
def get_value(key: str) -> str | None:
    """Get value or None if not found."""
    return cache.get(key)

# Complex nested types
def analyze_results(
    data: dict[str, list[tuple[int, str]]]
) -> list[dict[str, str | int]]:
    """Analyze and transform data."""
    pass
```

### ❌ DON'T: Use typing module for basic types

**Old syntax (Python 3.9 and earlier) - AVOID:**
```python
from typing import Dict, List, Optional, Union, Tuple

# Don't use uppercase typing generics
def process_data(items: List[str]) -> Dict[str, int]:  # ❌ Old style
    pass

# Don't use Union
def get_value(key: str) -> Optional[str]:  # ❌ Old style
    pass
```

---

## Type Hint Reference

### Built-in Generic Types (Python 3.11+)

| Type | Modern Syntax | Old Syntax (Avoid) |
|------|---------------|-------------------|
| List | `list[str]` | `List[str]` |
| Dictionary | `dict[str, int]` | `Dict[str, int]` |
| Set | `set[int]` | `Set[int]` |
| Tuple | `tuple[int, str]` | `Tuple[int, str]` |
| Optional | `str \| None` | `Optional[str]` |
| Union | `int \| str` | `Union[int, str]` |

### When to Import from `typing`

**Only import when needed for advanced types:**

```python
from typing import Protocol, TypeVar, Generic, Literal, TypedDict, Callable

# TypeVar for generics
# Typevar is used to create generic classes/functions.
# They are commonly used in libraries and frameworks to allow for flexible and reusable components.
# T example originates from PEP 484.
# https://peps.python.org/pep-0484/
# This statement "It should also be emphasized that Python will remain a dynamically typed language, and the authors 
# have no desire to ever make type hints mandatory, even by convention."
# Seems to have changed a bit with recent trends towards stricter typing in many codebases and agent backpressure
# checks.
# For more advanced type libraries and runtime type checking, consider using `typing_extensions` package or
# beartype or panderas or pydantic for data validation.
T = TypeVar('T')

# Protocol for structural subtyping
# Protocols define expected methods/attributes and
# are used for duck typing which allows more flexible interfaces.
# They are commonly used in libraries and frameworks to define contracts.
# In this example, any class that implements a `draw` method
# with the correct signature can be considered a Drawable.
# Protocol originates from PEP 544.
# https://peps.python.org/pep-0544/
class Drawable(Protocol):
    def draw(self) -> None: ...

# TypedDict for structured dictionaries
class UserDict(TypedDict):
    name: str
    age: int
    email: str | None

# Literal for specific values
# We indicate literal keyword so that only those specific string values are allowed.
# This is checked at type-checking time and helps catch errors early.
# This can be checked at runtime with libraries like `beartype` or `pydantic`.
# pydantic ai library provides additional functionality for data validation and settings management.
# Literal originates from PEP 586.
# https://peps.python.org/pep-0586/
def set_mode(mode: Literal["fast", "slow", "medium"]) -> None:
    pass

# Callable for function types
# Callables are used to specify function signatures.
# They are commonly used in libraries and frameworks to define callbacks or higher-order functions.
# Callable originates from PEP 484.
# https://peps.python.org/pep-0484/
# Recent peps and discussions mentioning callable types:
# https://peps.python.org/pep-0695/
# https://peps.python.org/pep-0701/
def apply(func: Callable[[int], str], value: int) -> str:
    return func(value)
```

---

## Code Formatting & Linting

### Ruff - The Rust-Powered Python Linter

Listing rules with ruff:

```pwsh
ruff rules
```

**Configuration in `pyproject.toml`:**

```toml
[tool.ruff]
line-length = 100
target-version = "py311"

[tool.ruff.lint]
select = [
    "E",      # pycodestyle errors
    "F",      # pyflakes
    "I",      # isort
    "N",      # pep8-naming
    "W",      # pycodestyle warnings
    "UP",     # pyupgrade (enforces modern Python syntax)
    "ANN",    # flake8-annotations (enforce type hints)
    "ASYNC",  # flake8-async
    "S",      # flake8-bandit (security)
    "B",      # flake8-bugbear
    "C4",     # flake8-comprehensions
    "DTZ",    # flake8-datetimez
    "T10",    # flake8-debugger
    "ERA",    # eradicate (commented-out code)
    "PL",     # pylint
    "RUF",    # ruff-specific rules
]
ignore = [
    "ANN101",  # Missing type annotation for self
    "ANN102",  # Missing type annotation for cls
    "PLR0913", # Too many arguments
]
```

**Running Ruff:**

```bash
# Check code
ruff check .

# Fix auto-fixable issues
ruff check --fix .

# Format code
ruff format .

# Format and lint in one go
ruff format . && ruff check --fix .
```

---

## Type Checking with ty

**ty** is a fast type checker (alternative to mypy) written in Rust.

**Running ty:**

```bash
# Type check entire project
ty check src/

# Type check specific file
ty check src/examples/powerpoint_automation.py

# Watch mode for development
ty check --watch src/
```

**Configuration:**

ty uses pyproject.toml for configuration similar to mypy. The tool respects standard type checking settings.

Alternatives are pyright, pylance, pyrefly.
---

## Style Guidelines

### Function Signatures

async link: https://peps.python.org/pep-0492/

```python
# ✅ Good: Clear types, proper formatting
async def generate_slide_content(
    self,
    instructions: str,
    slide_number: int,
    model: str = "claude-sonnet-4.5",
) -> dict[str, str]:
    """
    Generate slide content using AI.
    
    Args:
        instructions: Full presentation instructions
        slide_number: Slide number (1-indexed)
        model: AI model identifier
        
    Returns:
        Dictionary with 'title' and 'content' keys
    """
    pass

# ❌ Bad: No types, unclear return
async def generate_slide_content(self, instructions, slide_number, model="claude-sonnet-4.5"):
    pass
```

### Class Definitions

Link for self type hints: https://peps.python.org/pep-0673/

Link: https://docs.python.org/3/library/typing.html#typing.Self

```python
# ✅ Good: Modern type hints
class PresentationAutomator:
    """Automates PowerPoint generation."""
    
    def __init__(self, copilot_token: str) -> None:
        self.copilot_token: str = copilot_token
        self.client: CopilotClient | None = None
        self._cache: dict[str, str] = {}
    
    async def process_batch(
        self,
        items: list[str],
    ) -> list[dict[str, str]]:
        """Process multiple items."""
        results: list[dict[str, str]] = []
        for item in items:
            result = await self.process_item(item)
            results.append(result)
        return results
```

### Error Handling

Link: https://peps.python.org/pep-0408/

Bare Exceptions: Avoid using bare except clauses as they catch all exceptions, including system-exiting exceptions like KeyboardInterrupt and SystemExit. This can make debugging difficult and may hide critical errors.

Link: https://docs.python.org/3/tutorial/errors.html#handling-exceptions

```python
# ✅ Good: Specific exception types
def read_config(path: str) -> dict[str, str]:
    """Read configuration file."""
    try:
        with open(path) as f:
            return json.load(f)
    except FileNotFoundError as e:
        raise ConfigError(f"Config not found: {path}") from e
    except json.JSONDecodeError as e:
        raise ConfigError(f"Invalid JSON in {path}") from e

# ❌ Bad: Bare except
def read_config(path):
    try:
        with open(path) as f:
            return json.load(f)
    except:  # Never do this!
        return {}
```

---

## Modern Python Features to Use

### Structural Pattern Matching (Python 3.10+)

Link: https://peps.python.org/pep-0634/

```python
def process_response(response: dict[str, str]) -> str:
    """Process API response."""
    match response:
        case {"status": "success", "data": data}:
            return data
        case {"status": "error", "message": msg}:
            raise APIError(msg)
        case _:
            raise ValueError("Unknown response format")
```

### Walrus Operator (:=)

The Walrus Operator comes from PEP 572 and allows assignment within expressions.
Link: https://peps.python.org/pep-0572/

```python
# ✅ Good: Avoid repeated computation
if (result := expensive_computation()) is not None:
    process(result)

# ✅ Good: In list comprehensions
filtered = [y for x in items if (y := transform(x)) is not None]
```

### F-strings with = for debugging

F-strings support the `=` specifier for quick debugging output (Python 3.8+).
Link: https://peps.python.org/pep-0572/
F-strings may need to be avoided in performance-critical code due to their runtime overhead compared to other formatting methods.

```python
# Quick debug output
name = "M. Gustave"
role = "Concierge"
print(f"{name=}, {role=}")
# Output: name='M. Gustave', role='Concierge'
```

### Dataclasses for Data Structures

Link: https://peps.python.org/pep-0557/
```python
from dataclasses import dataclass

@dataclass
class SlideContent:
    """Represents slide content."""
    title: str
    content: str
    number: int
    metadata: dict[str, str] | None = None
    
    def to_dict(self) -> dict[str, str | int]:
        """Convert to dictionary."""
        return {
            "title": self.title,
            "content": self.content,
            "number": self.number,
        }
```

---

## Import Organization

**Use Ruff's isort integration:**

```python
# Standard library imports
import asyncio
import json
from pathlib import Path

# Third-party imports
from pptx import Presentation
from docx import Document

# Local imports
from copilot import CopilotClient
from src.utils import validate_input
```

---

## Pre-commit Hooks with prek

**prek** is a fast pre-commit hook tool written in Rust.

Create `prek.toml`:

```toml
[[hooks]]
name = "ruff-format"
command = "ruff format ."
pass_filenames = false

[[hooks]]
name = "ruff-check"
command = "ruff check --fix ."
pass_filenames = false

[[hooks]]
name = "ty-check"
command = "ty check src/"
pass_filenames = false

[[hooks]]
name = "pytest"
command = "pytest tests/ -v"
pass_filenames = false
stages = ["pre-push"]
```

**Install:**
```bash
pip install prek
prek install
```

---

## Quick Reference Commands

```bash
# Format code
ruff format .

# Lint and auto-fix
ruff check --fix .

# Type check
ty check src/

# Run all checks
ruff format . && ruff check --fix . && ty check src/

# Run tests with coverage
pytest --cov=src tests/

# Install pre-commit hooks
prek install
```

---

## Common Patterns

### Async Context Managers

```python
from types import TracebackType

class CopilotSession:
    """Async context manager for Copilot sessions."""
    
    async def __aenter__(self) -> 'CopilotSession':
        await self.start()
        return self
    
    async def __aexit__(
        self,
        exc_type: type[BaseException] | None,
        exc_val: BaseException | None,
        exc_tb: TracebackType | None,
    ) -> None:
        await self.close()

# Usage
async with CopilotSession() as session:
    result = await session.generate_content("prompt")
```

### Generator Type Hints

```python
from collections.abc import Iterator, AsyncIterator

def read_lines(path: Path) -> Iterator[str]:
    """Read file line by line."""
    with open(path) as f:
        for line in f:
            yield line.strip()

async def stream_results() -> AsyncIterator[dict[str, str]]:
    """Stream results asynchronously."""
    async for item in async_source:
        yield process(item)
```

---

## Standards Enforcement

All code contributed to The Grand Budapest Terminal must:

1. ✅ Use modern Python 3.11+ type hints (lowercase built-ins, | for unions)
2. ✅ Pass `ruff check` with no errors
3. ✅ Be formatted with `ruff format`
4. ✅ Pass `ty check` type checking
5. ✅ Include docstrings and type annotations
6. ✅ Have test coverage ≥ 80%
7. ✅ Use `prek` for pre-commit hooks
8. ✅ Be non-destructive to filesystem and user data
9. ✅ Avoid security vulnerabilities (no eval, safe handling of inputs)
10. ✅ Use maintained and common dependencies

---

**Maintained by:**
- **M. Gustave** - Style and elegance standards
- **Ludwig** - Type safety and validation
- **Henckels** - Enforcement and CI/CD integration

*"Precision in types, as in all things, is the mark of a civilized codebase."* — M. Gustave H.

