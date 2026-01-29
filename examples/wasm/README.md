# Python AST Parser Playground (WebAssembly)

> **Interactive Python code analysis powered by Pyodide and GitHub Copilot Agents**  
> **Live Demo:** [GitHub Pages URL - TBD]

---

## Overview

A browser-based Python AST (Abstract Syntax Tree) parser and analyzer that runs entirely in WebAssembly using Pyodide. Features AI-powered code analysis using GitHub Copilot agent patterns for security scanning, complexity analysis, and code quality suggestions.

**Tech Stack:**
- 🐍 **Pyodide** - Python runtime in WebAssembly
- 🧠 **Python AST** - Abstract Syntax Tree parsing
- 🤖 **Agent Patterns** - M. Gustave (quality), Dmitri (security), Agatha (testing)
- 🎨 **Wes Anderson Theme** - Burgundy and pink color scheme
- ⚡ **Zero Server Required** - Pure client-side execution

---

## Features

### Core Functionality
- ✅ Parse Python code into AST in real-time
- ✅ Visual AST tree representation
- ✅ Syntax highlighting with Monaco Editor
- ✅ Security vulnerability detection (Dmitri agent)
- ✅ Code complexity analysis (Serge X. agent)
- ✅ Code quality suggestions (M. Gustave agent)
- ✅ Test generation hints (Agatha agent)

### NLP & Analysis
- ✅ Function/class extraction
- ✅ Import dependency mapping
- ✅ Cyclomatic complexity calculation
- ✅ Security pattern detection (SQL injection, eval(), etc.)
- ✅ Code smell identification
- ✅ Documentation completeness check

### AI Agent Simulation
- ✅ **M. Gustave** - Code quality and style recommendations
- ✅ **Dmitri** - Security vulnerability scanning
- ✅ **Agatha** - Test coverage suggestions
- ✅ **Serge X.** - Performance and complexity metrics
- ✅ **Ludwig** - Type safety analysis

---

## Project Structure

```
examples/wasm/
├── README.md                 # This file
├── package.json              # npm dependencies (build tools)
├── pyproject.toml            # Python dependencies (for testing)
├── .gitignore                # Git ignore patterns
│
├── src/
│   ├── index.html            # Main HTML entry point
│   ├── styles/
│   │   ├── main.css          # Main stylesheet (Wes Anderson theme)
│   │   └── monaco.css        # Monaco editor customization
│   ├── js/
│   │   ├── main.js           # Main application logic
│   │   ├── pyodide-loader.js # Pyodide initialization
│   │   ├── ast-parser.js     # AST parsing interface
│   │   ├── agents/
│   │   │   ├── base-agent.js       # Base agent class
│   │   │   ├── gustave.js          # M. Gustave (quality)
│   │   │   ├── dmitri.js           # Dmitri (security)
│   │   │   ├── agatha.js           # Agatha (testing)
│   │   │   ├── serge.js            # Serge X. (performance)
│   │   │   └── ludwig.js           # Ludwig (types)
│   │   ├── ui/
│   │   │   ├── editor.js           # Monaco editor setup
│   │   │   ├── ast-visualizer.js   # AST tree display
│   │   │   ├── results-panel.js    # Analysis results
│   │   │   └── agent-cards.js      # Agent UI components
│   │   └── utils/
│   │       ├── python-runner.js    # Python execution wrapper
│   │       └── examples.js         # Example code snippets
│   └── python/
│       ├── ast_analyzer.py         # Main AST analysis module
│       ├── security_scanner.py     # Security pattern detection
│       ├── complexity_analyzer.py  # Code complexity metrics
│       ├── quality_checker.py      # Code quality rules
│       └── test_hints.py           # Test generation suggestions
│
├── dist/                     # Built files (GitHub Pages)
│   └── (generated on build)
│
├── tests/
│   ├── python/
│   │   ├── test_ast_analyzer.py
│   │   ├── test_security_scanner.py
│   │   └── test_complexity_analyzer.py
│   └── js/
│       └── test_agents.spec.js
│
└── docs/
    ├── architecture.md       # System architecture
    ├── agent-patterns.md     # Agent implementation guide
    └── deployment.md         # GitHub Pages deployment
```

---

## Quick Start

### Prerequisites

- Node.js 18+ (for build tools)
- Python 3.11+ (for local testing)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
cd examples/wasm

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

### Usage

1. Open `http://localhost:8080` in browser
2. Type or paste Python code in the editor
3. Click "Analyze Code" to parse AST
4. View results from each AI agent:
   - **M. Gustave:** Code quality suggestions
   - **Dmitri:** Security vulnerabilities
   - **Agatha:** Test coverage hints
   - **Serge X.:** Complexity metrics
   - **Ludwig:** Type annotations needed

---

## Architecture

### WebAssembly Sandbox

```
┌─────────────────────────────────────────┐
│         Browser Environment              │
├─────────────────────────────────────────┤
│  Monaco Editor (User Input)             │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│         Pyodide WASM Runtime            │
├─────────────────────────────────────────┤
│  • Python 3.11 interpreter              │
│  • AST module (built-in)                │
│  • Custom analyzers (ast_analyzer.py)   │
│  • No network access (sandbox)          │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│         Agent Analysis Layer            │
├─────────────────────────────────────────┤
│  Dmitri    │ M. Gustave │ Agatha        │
│  Security  │ Quality    │ Testing       │
│  Scanner   │ Checker    │ Hints         │
├────────────┴────────────┴───────────────┤
│  Serge X.  │ Ludwig                     │
│  Metrics   │ Types                      │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│         UI Results Panel                │
│  • AST Tree Visualization               │
│  • Agent Cards with Recommendations     │
│  • Metrics Dashboard                    │
└─────────────────────────────────────────┘
```

### Data Flow

```
User Code → Monaco Editor → Pyodide → AST Parser
                                          ↓
                                    ast_analyzer.py
                                          ↓
                           ┌──────────────┴──────────────┐
                           ↓                             ↓
                    Security Patterns              Quality Rules
                    (dmitri.js)                    (gustave.js)
                           ↓                             ↓
                    Vulnerability List             Style Issues
                           │                             │
                           └──────────┬──────────────────┘
                                      ↓
                              Results Aggregation
                                      ↓
                              UI Rendering
```

---

## Agent Patterns

### M. Gustave (Code Quality)
**Role:** Architect and Quality Guardian

**Checks:**
- PEP 8 compliance
- Function length (max 50 lines)
- Docstring presence
- Variable naming conventions
- Code organization

**Example Output:**
```
🎩 M. Gustave suggests:
- Add docstring to function 'calculate_total'
- Function 'process_data' is 73 lines (recommend <50)
- Variable 'x' has unclear name (suggest 'user_count')
```

### Dmitri (Security Scanner)
**Role:** Security Auditor

**Checks:**
- `eval()` and `exec()` usage
- SQL injection patterns
- Path traversal vulnerabilities
- Unsafe deserialization (pickle)
- Hardcoded credentials

**Example Output:**
```
🔒 Dmitri found 2 security issues:
⚠️ HIGH: Use of eval() at line 42 - execute arbitrary code
⚠️ MEDIUM: SQL query concatenation at line 67 - injection risk
```

### Agatha (Testing Suggestions)
**Role:** Test Engineer

**Checks:**
- Untested functions
- Edge case scenarios
- Missing assertions
- Test coverage gaps

**Example Output:**
```
🧪 Agatha recommends tests for:
- Function 'validate_email': test empty string, invalid format
- Function 'calculate_discount': test negative values, zero
- Missing integration tests for API calls
```

### Serge X. (Performance & Complexity)
**Role:** Performance Analyst

**Checks:**
- Cyclomatic complexity
- Nesting depth
- Time complexity estimates
- Memory usage patterns

**Example Output:**
```
📊 Serge X. analysis:
- Cyclomatic complexity: 12 (recommend <10)
- Max nesting depth: 5 (recommend <4)
- Potential O(n²) loop at line 34
```

### Ludwig (Type Safety)
**Role:** Type Guardian

**Checks:**
- Missing type hints
- Inconsistent return types
- Untyped function parameters

**Example Output:**
```
📐 Ludwig type suggestions:
- Add return type hint to 'get_user' (returns Optional[User])
- Parameter 'data' needs type annotation
- Consider using TypedDict for config
```

---

## Technology Stack

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| **Pyodide** | 0.25.0+ | Python in WebAssembly |
| **Monaco Editor** | 0.45.0+ | Code editor (VS Code) |
| **Vite** | 5.0+ | Build tool and dev server |

### Python Modules (Pyodide)
- `ast` - AST parsing (built-in)
- `inspect` - Code introspection
- `re` - Regex for pattern matching
- `json` - Data serialization

### JavaScript Libraries
- None required (vanilla JS for performance)
- Optional: D3.js for AST visualization

---

## Security Model

### Sandbox Constraints
✅ **Isolated execution** - Pyodide runs in WASM sandbox  
✅ **No network access** - Cannot make HTTP requests  
✅ **No file system** - No access to local files  
✅ **No eval() in browser** - Code runs in WASM only  
✅ **CSP headers** - Content Security Policy enforced  

### Safe Operations
- AST parsing (read-only analysis)
- Syntax checking
- Pattern matching
- Static analysis only

### Unsafe Operations (Blocked)
- File I/O operations
- Network requests (fetch, XHR)
- System calls
- Process spawning

---

## Examples

### Example 1: Basic Function Analysis

**Input:**
```python
def calculate_total(items):
    total = 0
    for item in items:
        total += item['price']
    return total
```

**Output:**
- **M. Gustave:** Add docstring, type hints missing
- **Dmitri:** No security issues found
- **Agatha:** Test with empty list, test with invalid item structure
- **Serge X.:** Complexity: 2 (good), Time: O(n)
- **Ludwig:** Add type hints: `items: list[dict]`, return `-> float`

### Example 2: Security Issue Detection

**Input:**
```python
def search_user(username):
    query = f"SELECT * FROM users WHERE name = '{username}'"
    return db.execute(query)
```

**Output:**
- **Dmitri:** ⚠️ HIGH - SQL injection vulnerability at line 2
  - Recommendation: Use parameterized queries
  - Fix: `db.execute("SELECT * FROM users WHERE name = ?", [username])`

---

## Build & Deployment

### Development Build

```bash
npm run dev
# Starts Vite dev server at http://localhost:8080
# Hot module reloading enabled
```

### Production Build

```bash
npm run build
# Output: dist/
# Optimized, minified, tree-shaken
# Ready for GitHub Pages deployment
```

### GitHub Pages Deployment

See `.github/workflows/deploy-wasm-playground.yml` (commented out)

```bash
# Manual deployment
npm run build
npm run deploy
```

---

## Testing

### Python Tests (Local)

```bash
# Install test dependencies
uv pip install pytest pytest-cov

# Run Python tests
pytest tests/python/ -v --cov=src/python

# Type checking
mypy src/python/
```

### JavaScript Tests

```bash
# Run JS tests (Vitest)
npm test

# Coverage report
npm run test:coverage
```

### Integration Tests

```bash
# Test in real browser (Playwright)
npm run test:e2e
```

---

## Performance

### Load Time
- **First Load:** ~3-5 seconds (Pyodide download)
- **Cached:** <1 second
- **Pyodide Size:** ~8 MB (gzipped)

### Analysis Speed
- **Small files (<100 lines):** <100ms
- **Medium files (100-500 lines):** 100-300ms
- **Large files (500+ lines):** 300-1000ms

### Optimization Strategies
- Lazy load Pyodide on user interaction
- Cache Pyodide in Service Worker
- Web Worker for AST parsing (non-blocking)
- Debounce analysis (500ms after typing stops)

---

## Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Opera | 76+ | ✅ Full |

**Requirements:**
- WebAssembly support
- ES2020+ JavaScript
- 2GB+ RAM recommended

---

## Roadmap

### Phase 1: Core Functionality (Current)
- ✅ Pyodide integration
- ✅ AST parsing
- ✅ Basic agent analysis
- ✅ Monaco editor

### Phase 2: Enhanced Analysis (Q1 2026)
- 🎯 Advanced security patterns
- 🎯 Import dependency graph
- 🎯 Control flow visualization
- 🎯 Interactive AST editor

### Phase 3: Collaboration Features (Q2 2026)
- 🎯 Share analysis results (URL encoding)
- 🎯 Export reports (PDF, JSON)
- 🎯 Custom agent rules
- 🎯 Plugin system

### Phase 4: AI Integration (Q3 2026)
- 🎯 GitHub Copilot API integration
- 🎯 LLM-powered suggestions
- 🎯 Natural language queries
- 🎯 Auto-fix suggestions

---

## Contributing

See [CONTRIBUTING.md](../../.github/CONTRIBUTING.md)

**Development Workflow:**
1. Create feature branch
2. Implement changes
3. Add tests (Python + JS)
4. Update documentation
5. Submit PR with agent review

---

## License

CC0-1.0 (Public Domain)

See [LICENSE](../../LICENSE)

---

## Related Documentation

- [Tutorial: Building WASM Playgrounds](../../tutorials/wasm-python-playground.md)
- [Agent Patterns Guide](./docs/agent-patterns.md)
- [Architecture Deep Dive](./docs/architecture.md)
- [Deployment Guide](./docs/deployment.md)
- [DEPENDENCIES.md](../../DEPENDENCIES.md)

---

**Created By:** M. Gustave (Architect) & Zero (Implementer)  
**Security Review:** Dmitri (Security Auditor)  
**Testing:** Agatha (Test Engineer)  
**Last Updated:** January 29, 2026  
**Version:** 1.0.0
