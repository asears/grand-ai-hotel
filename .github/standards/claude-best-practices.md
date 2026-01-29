# Claude Best Practices
*Standards and Techniques for Effective Claude Usage*

**Maintained by**: M. Gustave (Architecture) and Ludwig (Validation)  
**Last Updated**: 2026-01-29

---

## 📚 Source Materials

This guide synthesizes best practices from:
- [Claude Code Documentation - Best Practices](https://code.claude.com/docs/en/best-practices)
- [Claude Plugin Hub - Learn Best Practices](https://www.claudepluginhub.com/learn/best-practices)
- Grand Budapest Terminal Agent experience
- Production usage patterns from our agent ensemble

---

## 🎯 Core Principles

### 1. **Clarity Over Cleverness**
- Write prompts that are explicit and unambiguous
- Avoid relying on implicit context
- State your requirements directly

### 2. **Context is King**
- Provide relevant background information
- Include examples of desired output
- Reference previous conversation when building on ideas

### 3. **Iterative Refinement**
- Start with a basic request, then refine
- Use follow-up prompts to adjust output
- Don't try to get everything perfect in one prompt

### 4. **Token Awareness**
- Monitor context window usage with `/context`
- Use `/compact` strategically (see "The Memory Palace" tutorial)
- Plan multi-session workflows for large tasks

---

## 💬 Prompt Engineering Techniques

### Ask for Step-by-Step Thinking

**Less Effective**:
```
Optimize this Python function for performance.
```

**More Effective**:
```
Analyze this Python function and:
1. Identify performance bottlenecks
2. Explain why each is problematic  
3. Suggest specific optimizations
4. Show the refactored code with comments explaining changes
```

### Provide Examples (Few-Shot Learning)

**Less Effective**:
```
Write unit tests for this function.
```

**More Effective**:
```
Write unit tests for this function following this pattern:

Example test:
def test_calculate_total_with_discount():
    # Given
    items = [10.00, 20.00, 15.00]
    discount = 0.1
    
    # When
    result = calculate_total(items, discount)
    
    # Then
    assert result == 40.50
    
Use this Given-When-Then structure for all tests.
```

### Specify Output Format

**Less Effective**:
```
Compare these two approaches.
```

**More Effective**:
```
Compare these two approaches in a markdown table with columns:
- Approach
- Pros
- Cons
- Performance
- Use Cases
```

### Use Role-Based Prompting

**Less Effective**:
```
Review this code.
```

**More Effective**:
```
Act as a senior security engineer reviewing this authentication code.
Focus on:
- Credential handling
- Token validation
- Session management
- OWASP Top 10 vulnerabilities
```

---

## 🔄 Multi-Turn Conversation Strategies

### 1. **Establish Context Early**

```
I'm working on a Python data pipeline that:
- Processes CSV files from Azure Blob Storage
- Validates data against a schema
- Loads into PostgreSQL
- Runs daily via Azure Functions

I'll be asking questions about error handling, testing, and monitoring.
```

### 2. **Use Checkpoints for Complex Tasks**

For multi-hour sessions:
1. Start with clear objectives
2. Break work into phases
3. Summarize what's complete at milestones
4. Reference prior decisions explicitly

### 3. **Maintain Session State**

Use the plan.md pattern (see our session workspace):
```
I'm following the plan in plan.md. I've completed Phase 1-3.
Now I need help with Phase 4: implementing the data validation layer.
```

### 4. **Reference Previous Outputs**

```
In your previous response, you suggested using Pydantic for validation.
Can you show how to integrate that with the SQLAlchemy models we discussed earlier?
```

---

## 🧠 Context Window Management

### Understanding Token Limits

- **Context Window**: ~200,000 tokens (input + output)
- **Token Estimation**: ~4 characters per token on average
- **Monitor Usage**: Use `/context` command regularly

### When to Compact

Compact when you notice:
- Slower response times
- "Context window approaching limit" warnings
- You've been in the same conversation for 100+ turns
- The conversation has shifted topics significantly

### What Survives Compaction

**Preserved**:
- Recent conversation (last ~20-30 turns)
- Files you've created/edited
- Important decisions and context
- Current task state

**Summarized**:
- Earlier conversation history
- Exploratory discussions
- Resolved issues
- Background information

### Strategic Compaction Timing

**Good Times to Compact**:
- ✅ After completing a major phase
- ✅ Before starting a new, unrelated task
- ✅ When switching between significantly different topics
- ✅ After extensive research/exploration

**Bad Times to Compact**:
- ❌ In the middle of iterating on code
- ❌ During active debugging
- ❌ When Claude needs to remember specific details you just discussed
- ❌ Before getting final confirmation on changes

---

## 🎛️ Model Selection Strategies

### Choose Model Based on Task Complexity

**Haiku** (Fast & Economical):
- Simple code formatting
- Basic documentation updates
- Routine refactoring
- Quick questions with clear answers
- Repetitive tasks

**Sonnet** (Balanced):
- Complex code generation
- Multi-file refactoring
- Architectural decisions
- Debugging tricky issues
- Most production work

**Opus** (Premium Intelligence):
- Novel algorithmic challenges
- Complex system design
- Security audits
- Performance optimization requiring deep analysis
- Creative problem-solving

### Model Switching Mid-Conversation

You can switch models mid-session:
```
/model claude-haiku-4.5
```

**When to Switch**:
- Upgrade to Opus for a particularly hard problem
- Downgrade to Haiku for simple follow-up tasks
- Use Sonnet as default balance

---

## 📝 Code Generation Best Practices

### 1. **Specify Language Version and Style**

```
Write a Python 3.12+ function using:
- Modern type hints (dict, list, str | None)
- Dataclasses for structured data
- Pathlib for file operations
- Follow PEP 8 with line length 100
```

### 2. **Request Type Safety**

```
Generate TypeScript code with:
- Strict mode enabled
- No 'any' types
- Proper interface definitions
- Exhaustive switch statements
```

### 3. **Ask for Error Handling**

```
Include complete error handling:
- Specific exception types
- Helpful error messages
- Logging at appropriate levels
- Graceful degradation where possible
```

### 4. **Request Tests Alongside Code**

```
Generate both the implementation and pytest tests.
Use Given-When-Then structure and aim for 80%+ coverage.
```

---

*For complete guide with additional sections on security, debugging, and agent collaboration, see the full file.*

**See Also**: 
- [Copilot Best Practices](./copilot-best-practices.md)
- [Agent Collaboration Guide](./agent-collaboration.md)
- [Token Budgeting Strategies](./token-budgeting.md)
