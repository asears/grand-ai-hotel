# GitHub Copilot Best Practices
*Mastering AI-Assisted Development with Copilot Chat, CLI, and Edits*

**Maintained by**: M. Gustave (Elegance & Efficiency) and Zero (Practical Implementation)  
**Last Updated**: 2026-01-29

---

## 📚 Source Materials

This guide synthesizes best practices from:
- [GitHub Copilot Official Documentation](https://docs.github.com/en/copilot/get-started/best-practices)
- [Copilot Chat Best Practices](https://docs.github.com/en/copilot/using-github-copilot/best-practices-for-using-github-copilot-chat)
- [Copilot CLI Documentation](https://docs.github.com/en/copilot/using-github-copilot/asking-github-copilot-questions-in-your-cli)
- Grand Budapest Terminal agent ensemble experience
- Production workflows from M. Gustave's concierge desk

---

## 🎯 Core Principles

### 1. **Context is Currency**
- Provide maximum relevant context to minimize ambiguity
- Open related files before asking questions
- Include error messages, stack traces, and logs
- Reference specific lines, functions, or modules

### 2. **Precision in Prompting**
- Be specific about languages, frameworks, and versions
- State constraints explicitly (performance, security, style)
- Specify desired output format (code, explanation, commands)
- Use technical terminology correctly

### 3. **Iterative Collaboration**
- Start broad, then refine with follow-ups
- Ask for explanations when code isn't clear
- Request alternatives when first solution doesn't fit
- Build on previous responses progressively

### 4. **Tool Selection**
- **Copilot Chat**: Explanations, design, complex generation
- **Copilot CLI**: Shell commands, system operations, Git workflows  
- **Copilot Edits**: Multi-file refactoring, systematic changes
- **Inline Completions**: Quick autocomplete, boilerplate

---

## 💬 Copilot Chat Best Practices

### Effective Prompting Patterns

#### Pattern 1: Context + Task + Constraints

**Less Effective**:
```
Create a REST API endpoint.
```

**More Effective**:
```
Create a REST API endpoint in Python FastAPI 0.110+ for user registration:
- Accept POST requests to /api/v1/users/register
- Validate email format and password strength
- Hash passwords with bcrypt
- Return JWT token on success
- Use Pydantic models for validation
- Include proper HTTP status codes (201, 400, 409)
- Add OpenAPI documentation
```

#### Pattern 2: Ask for Explanation First

**Effective Workflow**:
```
1. "Explain how OAuth 2.0 authorization code flow works"
2. Review explanation, ask clarifying questions
3. "Now show me how to implement this in Express.js with Passport"
4. Get code with context you understand
```

#### Pattern 3: Reference Open Files

Copilot Chat sees your open tabs:
```
Looking at UserService.java (currently open), how should I modify the 
authenticate() method to support MFA tokens in addition to passwords?
```

#### Pattern 4: Incremental Complexity

```
# Round 1
"Create a basic TypeScript function to fetch user data from an API"

# Round 2  
"Add error handling with retry logic using exponential backoff"

# Round 3
"Add TypeScript generics so this works with any resource type"

# Round 4
"Now add request cancellation support with AbortController"
```

### IDE Integration Strategies

#### VS Code / Visual Studio

**Chat Participants**:
```
@workspace - Query entire codebase context
@vscode - Ask about editor features, settings, shortcuts
@terminal - Get CLI commands and terminal help
@github - Search GitHub, create issues/PRs
```

**Example Usage**:
```
@workspace Where is the authentication logic implemented?

@workspace How do I add a new API endpoint following existing patterns?

@vscode How do I set up a custom keyboard shortcut for running tests?

@terminal Show me how to find all TODO comments in git-tracked files
```

**Slash Commands**:
```
/explain - Explain selected code
/fix - Suggest fixes for problems
/tests - Generate unit tests
/doc - Add documentation
/new - Scaffold new file/project
/simplify - Reduce complexity
/help - Show available commands
```

#### IntelliJ IDEA / JetBrains IDEs

**Chat Features**:
- Right-click code → Ask Copilot
- Select code → `/explain` for inline documentation
- Highlight error → `/fix` for suggested corrections
- Use context menu for common operations

**Example Workflow**:
```
1. Select complex algorithm
2. Right-click → Ask Copilot → "Explain this code"
3. Review explanation
4. Ask follow-up: "How can this be optimized for large datasets?"
5. Request: "/simplify this while maintaining functionality"
```

### Multi-Language Development

#### Python Best Practices

```
Generate a Python 3.11+ async function to:
- Fetch data from a REST API with aiohttp
- Retry failed requests with exponential backoff
- Parse JSON responses with Pydantic models
- Log errors with structlog
- Include type hints using modern syntax (str | None, not Optional)
- Handle rate limiting (429 responses)
- Use context managers for cleanup

Follow PEP 8, use ruff-compatible style, line length 100.
```

#### TypeScript/JavaScript

```
Create a React component in TypeScript with:
- Functional component using hooks (useState, useEffect, useCallback)
- Props interface with strict typing (no 'any')
- Error boundary for graceful failure
- Loading and error states
- Accessibility attributes (ARIA)
- Responsive design with CSS modules
- Unit tests with React Testing Library

Use React 18+ features, follow Airbnb style guide.
```

#### Go Best Practices

```
Write a Go 1.22+ HTTP middleware for:
- Request authentication via JWT
- Token validation and expiry checking  
- Context injection of user claims
- Structured logging with slog
- Error responses in JSON
- Metrics collection (request count, duration)

Follow effective Go patterns, use standard library where possible.
No external dependencies except jwt-go.
```

#### Rust Development

```
Implement a Rust async function using tokio that:
- Reads a large file in chunks
- Processes each chunk concurrently (up to 8 workers)
- Aggregates results into a thread-safe HashMap
- Handles IO errors gracefully with Result<T, E>
- Uses channels for worker communication
- Includes complete error types with thiserror

Follow Rust 2021 edition idioms, use clippy-approved patterns.
```

---

## 🖥️ Copilot CLI Best Practices

### Installation & Setup

```bash
# Install Copilot CLI
gh extension install github/gh-copilot

# Verify installation
gh copilot --version

# Get help
gh copilot --help
```

### Usage Modes

#### Generic Shell Commands (`gh copilot suggest`)

**Pattern**: Describe what you want to accomplish

```bash
# File operations
gh copilot suggest "find all Python files modified in the last 7 days"
# Output: find . -name "*.py" -mtime -7

# System monitoring
gh copilot suggest "show top 10 processes by memory usage"
# Output: ps aux --sort=-%mem | head -n 11

# Network operations
gh copilot suggest "test if port 8080 is listening"
# Output: netstat -tuln | grep :8080 (Linux) or netstat -an | findstr :8080 (Windows)

# Complex pipelines
gh copilot suggest "find duplicate files by MD5 hash in current directory"
# Output: find . -type f -exec md5sum {} + | sort | uniq -w32 -dD
```

#### Git Workflows (`gh copilot suggest -t git`)

```bash
# Branch management
gh copilot suggest -t git "create a new branch from main and push it"

# Commit operations
gh copilot suggest -t git "amend last commit and force push"

# History inspection  
gh copilot suggest -t git "show all commits by author Alice in last month"

# Advanced operations
gh copilot suggest -t git "interactively rebase last 5 commits"

# Cleanup
gh copilot suggest -t git "delete all local branches that are merged to main"
```

#### GitHub Operations (`gh copilot suggest -t gh`)

```bash
# Issues
gh copilot suggest -t gh "create an issue labeled 'bug' and 'high-priority'"

# Pull Requests
gh copilot suggest -t gh "create PR from current branch with auto-merge"

# Repository management
gh copilot suggest -t gh "list all open PRs assigned to me"

# Actions
gh copilot suggest -t gh "view logs for failed workflow run"
```

### Copilot CLI Advanced Patterns

#### Explain Commands

```bash
# Understand complex commands
gh copilot explain "kubectl get pods -n production -o json | jq '.items[] | select(.status.phase!=\"Running\")'"

# Learn what scripts do
gh copilot explain "awk '{sum+=$1} END {print sum/NR}' data.txt"

# Understand pipelines
gh copilot explain "docker ps -aq | xargs docker inspect -f '{{.State.Pid}}'"
```

#### Workflow Integration

**Example: Daily Development Routine**

```bash
# 1. Check what changed
gh copilot suggest -t git "show summary of changes since yesterday"

# 2. Run tests on changed files
gh copilot suggest "run pytest only on Python files changed in last commit"

# 3. Commit with conventional commits
gh copilot suggest -t git "commit staged files with message following conventional commits"

# 4. Create PR with template
gh copilot suggest -t gh "create PR with description from .github/PULL_REQUEST_TEMPLATE.md"
```

**Example: System Maintenance**

```bash
# Clean up disk space
gh copilot suggest "find and delete log files older than 30 days larger than 100MB"

# Monitor resources
gh copilot suggest "check disk usage and show largest directories"

# Process management
gh copilot suggest "find and kill all python processes matching 'django'"
```

#### Platform-Specific Commands

Copilot CLI adapts to your OS:

```bash
# Windows (PowerShell)
gh copilot suggest "recursively search for TODO comments in C# files"
# Output: Get-ChildItem -Recurse -Filter *.cs | Select-String "TODO"

# macOS/Linux (Bash)
gh copilot suggest "recursively search for TODO comments in C# files"  
# Output: grep -r "TODO" --include="*.cs" .
```

---

## ✏️ Copilot Edits (Multi-File Editing)

### When to Use Edits

**Ideal Use Cases**:
- Renaming variables/functions across multiple files
- Updating API calls after interface changes
- Migrating from deprecated APIs to new ones
- Applying consistent formatting changes
- Refactoring architectural patterns

**Not Ideal For**:
- Single file changes (use Chat or inline)
- Exploratory code generation
- One-off quick fixes

### Effective Edit Requests

#### Pattern 1: Systematic Refactoring

```
Rename the function `getUserData` to `fetchUserProfile` across the entire 
codebase. Update:
- Function definitions
- All call sites
- Comments and JSDoc
- Test files
Maintain backward compatibility by adding a deprecated alias.
```

#### Pattern 2: API Migration

```
Update all fetch() calls to use our new apiClient wrapper:

Before: fetch('/api/users')
After: apiClient.get('/api/users')

Changes needed:
- Import apiClient from '@/lib/api-client'
- Convert fetch options to apiClient method calls
- Update error handling to use apiClient.handleError()
- Preserve request/response types
```

#### Pattern 3: Consistency Enforcement

```
Standardize error handling across all service files in src/services/:
- Replace try/catch blocks with our ErrorBoundary wrapper
- Use logger.error() instead of console.error()
- Return Result<T, E> types instead of throwing
- Add error codes from ErrorCodes enum
```

### Edit Workflow Best Practices

**1. Start with Clear Scope**
```
Limit changes to files in src/components/auth/ only.
Update React class components to functional components with hooks.
```

**2. Review Before Accepting**
- Check each modified file
- Verify test files are updated
- Ensure imports are correct
- Look for unintended side effects

**3. Incremental Acceptance**
- Accept changes file-by-file if unsure
- Reject changes that seem incorrect
- Request refinements for specific files

**4. Test After Edits**
```bash
# Run tests immediately after accepting edits
npm test

# Run linter
npm run lint

# Type check
npm run type-check
```

---

## 🔒 Security Considerations

### Code Review with Copilot

**Security Review Checklist Prompt**:
```
Review this authentication code for security issues:

Check for:
1. SQL injection vulnerabilities
2. XSS attack vectors  
3. CSRF protection
4. Secure password handling (hashing, salting)
5. JWT token security (expiry, signing, storage)
6. Input validation and sanitization
7. Error messages leaking sensitive info
8. Proper use of HTTPS
9. Rate limiting on sensitive endpoints
10. OWASP Top 10 compliance

Provide specific line numbers and remediation suggestions.
```

### Sensitive Data Handling

**Always Specify**:
```
Generate a user authentication function with these security requirements:
- NEVER log passwords or tokens
- Use bcrypt with cost factor 12 for password hashing
- Store JWT tokens in httpOnly cookies (not localStorage)
- Validate all inputs with a whitelist approach
- Use prepared statements for all database queries
- Implement constant-time comparison for secrets
- Add security headers (CSP, HSTS, X-Frame-Options)
```

### Dependency Security

```
Suggest secure alternatives to these dependencies, considering:
- Known CVEs
- Maintenance status
- Security audit history
- Community trust score

Provide migration guide if replacement is recommended.
```

### Secret Management

**Pattern for Copilot**:
```
Show me how to:
1. Load secrets from environment variables
2. Validate required secrets at startup
3. Use secret management service (Azure Key Vault / AWS Secrets Manager)
4. Rotate secrets without downtime
5. Avoid hardcoding secrets in code or config files

Include code examples with proper error handling.
```

---

## 🧪 Testing Strategies with Copilot

### Test Generation Patterns

#### Unit Tests

```
Generate pytest unit tests for the calculate_discount() function:

Requirements:
- Test all edge cases (0%, 100%, negative, > 100%)
- Test different input types (int, float, Decimal)
- Test invalid inputs (None, string, negative price)
- Use parametrize for multiple test cases
- Include docstrings explaining what each test validates
- Use Given-When-Then structure
- Aim for 100% code coverage
- Use fixtures for test data

Follow pytest best practices and Python 3.11+ type hints.
```

#### Integration Tests

```
Create integration tests for the UserService that:
- Set up a test database before each test
- Test user registration flow end-to-end
- Verify email sending (mock external service)
- Test database transactions and rollbacks
- Clean up test data after each test
- Use factory pattern for test data creation
- Include both happy path and error scenarios

Use pytest-asyncio for async tests, provide fixtures for common setup.
```

#### End-to-End Tests

```
Generate Playwright e2e tests for the login workflow:

Test scenarios:
1. Successful login with valid credentials
2. Failed login with invalid password (verify error message)
3. Failed login with non-existent user
4. Session persistence after page reload
5. Logout functionality
6. Login rate limiting after 5 failed attempts

Use Page Object Model pattern, include accessibility checks with axe-core.
```

### Test-Driven Development (TDD)

**TDD Workflow with Copilot**:

```
Step 1: "Generate unit tests for a function that parses and validates ISO 8601 dates"
Step 2: Review tests, ensure they cover requirements
Step 3: "Now implement the function that passes these tests"
Step 4: Run tests, iterate on failures
Step 5: "Refactor this implementation to be more readable while keeping tests green"
```

### Coverage Analysis

```
Analyze test coverage for UserController and suggest additional tests for:
- Uncovered branches
- Edge cases not currently tested  
- Error conditions
- Boundary values

Provide specific test cases to add with reasoning for each.
```

---

## 🎨 Code Generation Anti-Patterns

### ❌ What NOT to Do

#### Anti-Pattern 1: Vague Requests

**Bad**:
```
Create a function to process data.
```

**Why**: No context about language, data type, processing logic, or requirements.

**Good**:
```
Create a Python 3.11+ function that:
- Accepts a list of dictionaries (user records)
- Filters out inactive users (status != 'active')
- Sorts by registration date (newest first)
- Returns list of User dataclass instances
- Includes type hints and docstring
```

#### Anti-Pattern 2: Accepting Without Understanding

**Bad Workflow**:
```
1. Ask Copilot for code
2. Copy-paste immediately
3. Move on without reading
```

**Good Workflow**:
```
1. Ask Copilot for code
2. Ask: "Explain how this works and why you chose this approach"
3. Review for security, performance, maintainability
4. Ask for alternatives if concerns arise
5. Request tests
6. Integrate thoughtfully
```

#### Anti-Pattern 3: Over-Reliance on Completions

**Balanced Approach**:
- Use completions for boilerplate ✅
- Use Chat for complex logic ✅  
- Use Edits for refactoring ✅
- Use CLI for commands ✅
- Think critically about all suggestions ✅
- Verify generated code ✅
- Write your own code when learning ✅

#### Anti-Pattern 4: Ignoring Style Guides

**Bad**:
```
Generate a Python function.
```
*Result*: May not match your project's style

**Good**:
```
Generate a Python function following our project conventions:
- ruff-formatted (line length 100)
- Modern type hints (str | None, not Optional[str])
- Docstrings in Google style
- Error handling with custom exceptions from src/exceptions.py
- Logging with structlog
```

#### Anti-Pattern 5: Security Blind Spots

**Bad**:
```
Create a login function.
```
*Result*: May have security vulnerabilities

**Good**:
```
Create a secure login function with:
- Rate limiting (max 5 attempts per 15 minutes)
- Password hashing with bcrypt
- Timing attack protection
- SQL injection prevention
- No password logging
- Secure session token generation
Include security comments explaining each measure.
```

---

## 🚀 Advanced Copilot Techniques

### Context Optimization

#### Workspace Context

Copilot Chat uses your workspace for context:

**Maximize Context**:
1. Open relevant files in tabs
2. Have important files visible in sidebar
3. Keep related code in same workspace folder
4. Use descriptive file and variable names
5. Maintain consistent project structure

**Context Priority** (most to least):
1. Currently active file
2. Open editor tabs
3. Files in same directory
4. Files referenced by imports
5. Workspace-wide search results

#### Conversation Threading

**Build Context Over Multiple Turns**:

```
Turn 1: "I'm refactoring our payment processing system to support multiple 
        payment providers (Stripe, PayPal, Square)"
        
Turn 2: "Show me a Strategy pattern implementation for this"

Turn 3: "Now add a provider for Stripe with subscription support"

Turn 4: "How should I handle webhook verification for each provider?"

Turn 5: "Generate integration tests for the Stripe provider"
```

### Code Explanation Strategies

#### Pattern 1: Incremental Understanding

```
# Start broad
"What does this file do at a high level?"

# Zoom in
"Explain the processPayment() function in detail"

# Understand specifics
"Why do we use a transaction here at line 47?"

# Explore alternatives
"Could this be implemented differently? What are tradeoffs?"
```

#### Pattern 2: Learning from Legacy Code

```
Looking at this legacy Java code (DateUtils.java), explain:
1. What problem it solves
2. Why it was implemented this way
3. What modern alternatives exist (Java 17+)
4. How to migrate to java.time API
5. Potential breaking changes in migration

Provide migration guide with code examples.
```

### Performance Optimization

```
Analyze this function for performance bottlenecks:

[paste code]

Provide:
1. Time complexity analysis (Big O)
2. Space complexity analysis
3. Specific bottlenecks with line numbers
4. Optimized version with explanations
5. Benchmark code to measure improvement
6. When optimization is worth the complexity tradeoff
```

### Debugging with Copilot

#### Pattern 1: Error Explanation

```
I'm getting this error:

[paste full error message and stack trace]

Context:
- Python 3.11, FastAPI 0.110, SQLAlchemy 2.0
- Occurs when calling /api/users/{id} endpoint
- Works in development, fails in production

Explain:
1. What this error means
2. Likely root causes
3. How to debug further
4. Suggested fixes

Provide debugging steps and fixed code.
```

#### Pattern 2: Unexpected Behavior

```
This function should return unique users but returns duplicates:

[paste function code]

Test case that fails:
[paste test code]

Help me:
1. Understand why duplicates occur
2. Add debug logging to trace execution
3. Fix the logic
4. Add tests to prevent regression
```

---

## 🎭 Grand Budapest Agent Integration

### When to Use Copilot vs Claude Agents

**Use Copilot Chat for**:
- Quick code generation in your IDE
- Inline explanations and documentation
- Multi-file refactoring with Edits
- Learning about open source libraries
- Standard web development patterns

**Use M. Gustave (Claude Sonnet) for**:
- Complex architectural decisions
- Novel algorithm design
- Multi-hour development sessions
- Advanced debugging
- Custom framework development

**Use Copilot CLI for**:
- Git workflows and commands
- System administration tasks
- Shell scripting
- GitHub operations

**Use Zero (Claude Haiku) for**:
- Fast iterations on simple tasks
- Formatting and style fixes
- Quick questions with clear answers
- Routine refactoring

### Seamless Workflow

**Example: Adding a New Feature**

```
1. [Copilot Chat] "Explain the existing authentication system"
   → Quick understanding of current implementation
   
2. [M. Gustave] "Design an OAuth 2.0 integration strategy for our auth system"
   → Architectural planning and design decisions
   
3. [Copilot Chat] "Generate OAuth client class based on this design"
   → Implementation in IDE
   
4. [Copilot Edits] "Update all auth imports to support new OAuth provider"
   → Multi-file refactoring
   
5. [Copilot CLI] "gh copilot suggest 'create PR with OAuth feature'"
   → Pull request creation
```

### Complementary Strengths

| Task | Best Tool | Why |
|------|-----------|-----|
| Understand unfamiliar codebase | Copilot Chat (@workspace) | Workspace-aware, IDE-integrated |
| Design system architecture | M. Gustave (Claude) | Deep reasoning, long context |
| Generate boilerplate | Copilot Completions | Fast, inline, context-aware |
| Debug complex issue | M. Gustave + Copilot | Reasoning + IDE integration |
| Refactor across files | Copilot Edits | Multi-file editing specialized |
| Run git commands | Copilot CLI | Command generation expert |
| Learn new framework | Copilot Chat | Up-to-date training data |
| Optimize algorithm | M. Gustave (Opus) | Advanced reasoning |

---

## 💡 Quick Tips

### Copilot Chat
- Use `@workspace` to query your entire codebase context
- Open relevant files before asking questions for better context
- Use slash commands (`/explain`, `/fix`, `/tests`) for quick actions
- Ask for explanations before accepting complex code
- Request multiple approaches: "Show me 3 ways to implement this"

### Copilot CLI
- Use `-t` flag for specialized contexts: `-t git`, `-t gh`
- Always review generated commands before executing
- Use `gh copilot explain` to understand complex commands
- Create aliases for frequent workflows
- Copilot CLI adapts to your OS (Windows/macOS/Linux)

### Copilot Edits
- Start with a clear, specific edit request
- Review changes file-by-file before accepting
- Test immediately after accepting changes
- Use for systematic changes across multiple files
- Reject and refine if changes seem incorrect

### Security
- Never accept code without reviewing for security issues
- Always specify security requirements in prompts
- Use Copilot to review code for vulnerabilities
- Validate all generated input handling code
- Request security-focused explanations for auth code

### Testing
- Generate tests alongside implementation code
- Use TDD: tests first, then implementation
- Request specific coverage of edge cases
- Ask for different test types (unit, integration, e2e)
- Verify generated tests actually test the right behavior

### Performance
- Request Big O analysis for algorithms
- Ask for optimization suggestions with tradeoffs
- Generate benchmark code to measure improvements
- Consider maintainability vs performance tradeoffs
- Profile before optimizing based on suggestions

---

## 🔗 Related Documentation

- [Claude Best Practices](./claude-best-practices.md) - Advanced prompting with Claude agents
- [Agent Collaboration Guide](./agent-collaboration.md) - Multi-agent workflows
- [Token Budgeting Strategies](./token-budgeting.md) - Context management
- [Python Coding Standards](./python-standards.md) - Language-specific patterns

---

## 📚 Tutorials Referenced

- **The Lobby Boy's First Day** - Getting started with CLI
- **The Concierge's Methodology** - Effective prompting patterns
- **The Memory Palace** - Context window management
- **The Author's Workflow** - Documentation generation
- **The Patissier's Precision** - Code quality and testing

---

**The art of effective AI collaboration is not in avoiding the assistant's help, but in knowing precisely when and how to request it.** — M. Gustave H.

*For questions or suggestions, consult M. Gustave at the concierge desk.*
